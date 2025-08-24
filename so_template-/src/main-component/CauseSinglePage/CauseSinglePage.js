import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import Footer from "../../components/footer/Footer";
import BackersModal from "./BackersPopup";
import LocationModal from "./LocationModal";
import ShareModal from "./ShareModal";
import CommunityModal from "./CommunityModal";
import OrganizationModal from "./OrganizationModal";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet-async"; //  Helmet
import Logo from "../../images/logo2.png";
import axios from "axios";
import { useProjects } from "../../api/ProjectsContext";

import { useLocation } from "react-router-dom";

const CauseSinglePage = () => {
  const { projectDetails: causesData, setProjectDetails: setCauses } =
    useProjects();

  const CauseSingle = causesData;

  const [activeTab, setActiveTab] = useState("story");
  const [mainImage, setMainImage] = useState(null);
  console.log(process.env.REACT_APP_RECAPTCHA_SITE_KEY);

  useEffect(() => {
    if (CauseSingle?.images) {
      const imageList = Object.values(CauseSingle.images).filter(Boolean);
      if (imageList.length > 0) {
        setMainImage(imageList[0]);
      }
    }
  }, [CauseSingle]);

  const [showBackersModal, setShowBackersModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);

  const [showAllUpdates, setShowAllUpdates] = useState(false);
  useEffect(() => {
    const card = document.getElementById("donation-card");
    const wrapper = document.getElementById("donation-card-wrapper");
    const tabs = document.getElementById("tabs-section");

    const onScroll = () => {
      if (!card || !wrapper || !tabs) return;

      if (window.innerWidth < 992) {
        card.classList.remove("fixed-card", "stop-card");
        card.style.top = "0";
        card.style.width = "100%";
        return;
      }
      //  desired bottom spacing here
      const desiredBottomSpacing = 30;

      const scrollTop = window.scrollY;
      const cardTop = wrapper.offsetTop;
      const cardHeight = card.offsetHeight;
      const tabsBottom = tabs.offsetTop + tabs.offsetHeight;

      // This effectively sets a "bottom" constraint.
      const maxTopBeforeStop = tabsBottom - cardHeight - desiredBottomSpacing;

      if (
        scrollTop + 100 > cardTop &&
        scrollTop + cardHeight + 100 < tabsBottom
      ) {
        card.classList.add("fixed-card");
        card.classList.remove("stop-card");
        card.style.top = "20px";
      } else if (scrollTop + cardHeight + 100 >= tabsBottom) {
        card.classList.remove("fixed-card");
        card.classList.add("stop-card");
        // card.style.top = `${tabsBottom - cardHeight - cardTop}px`;
        card.style.top = `${
          tabsBottom - cardHeight - wrapper.offsetTop - desiredBottomSpacing
        }px`;
      } else {
        card.classList.remove("fixed-card");
        card.classList.remove("stop-card");
        card.style.top = "0";
      }

      card.style.width = `${wrapper.offsetWidth}px`;
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pictureFile, setPicture] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaRef, setRecaptchaRef] = useState(null);
  const location = useLocation();
  const match = location.pathname.match(/^\/projects\/(\d+)/);
  const id = match ? match[1] : null;

  // Handle reCAPTCHA
  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if reCAPTCHA is verified
    if (!recaptchaToken) {
      alert(
        "Please verify that you are not a robot by completing the reCAPTCHA."
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("picture", pictureFile);
    formData.append("recaptcha", recaptchaToken);

    try {
      const response = await axios.put(
        `https://api.caprover.sokaab.com/api/public/projects/${id}/update-activity`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("updated successfully", response.data);

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setPicture("");
      setRecaptchaToken(null);

      // Reset reCAPTCHA
      if (recaptchaRef) {
        recaptchaRef.reset();
      }
    } catch (error) {
      console.log("Failed to update", error);
    }
  };

  // review section code
  const [reviewForm, setReviewForm] = useState({
    name: "",
    message: "",
    reaction: "",
  });

  const [reactionCounts, setReactionCounts] = useState({
    heart: 0,
    clap: 0,
    highfive: 0,
    pray: 0,
    fire: 0,
  });

  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const reactionIconMap = {
    heart: "fa-heart",
    clap: "fa-hands-clapping",
    highfive: "fa-hands",
    pray: "fa-praying-hands",
    fire: "fa-fire",
  };

  const reactionEmojiMap = {
    heart: "❤️",
    clap: "👏",
    highfive: "🖐️",
    pray: "🙏",
    fire: "🔥",
  };

  const handleQuickReaction = (key) => {
    setReactionCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
    setShowReactionPicker(false);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReview = {
      ...reviewForm,
      date: new Date().toISOString(),
    };

    CauseSingle.reviews = [newReview, ...CauseSingle.reviews];
    setReviewForm({ name: "", message: "", reaction: "" });
  };

  const isLargeScreen = window.innerWidth >= 992;
  const fontSize = isLargeScreen ? "55px" : "20px";

  //LOGIC FOR DONATE BUTTON ---

  // Assuming CauseSingle object is available with an end_date property

  // LOGIC FOR DONATE BUTTON (End Date Only)
  const getDonateButtonText = () => {
    const now = new Date();
    const endDate = new Date(CauseSingle.end_date);

    if (endDate < now) {
      return "Campaign Ended"; // Or "Past Deadline"
    }
    return "Donate Now";
  };

  const isDonateButtonDisabled = () => {
    const now = new Date();
    const endDate = new Date(CauseSingle.end_date);

    // Disable if end date has passed
    return endDate < now;
  };
  // Helper for rendering project story as paragraphs (from previous answer)
  const renderStoryAsParagraphs = (storyText) => {
    if (!storyText) {
      return null;
    }
    const normalizedStory = storyText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    const paragraphs = normalizedStory.split("\n");
    return paragraphs
      .filter((paragraph) => paragraph.trim() !== "")
      .map((paragraph, index) => <p key={index}>{paragraph}</p>);
  };
  // sharing model variables

  const currentProject = CauseSingle;
  // Construct the share URL
  const projectShareUrl = currentProject
    ? `${window.location.origin}/projects/${currentProject.id}`
    : "";

  // Construct the donate URL
  const projectDonateUrl = currentProject ? `/donate/${currentProject.id}` : "";

  return (
    <Fragment>
      <Navbar Logo={Logo} hclass={"wpo-site-header-s3"} />
      <PageTitle
        pageTitle={CauseSingle.title}
        pagesub={"Projects"}
        style={{ fontSize }}
      />
      <div className="wpo-case-details-area section-padding">
        <div className="container">
          <div className="row">
            <div className=" col-lg-8 col-md-12 col-12 mb-1 ">
              <div className="row">
                <div
                  className="col-2 d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  {CauseSingle.images &&
                    Object.values(CauseSingle.images)
                      .filter(Boolean)
                      .map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`thumbnail ${idx}`}
                          onClick={() => {
                            setMainImage(img);
                          }}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            cursor: "pointer",
                            border:
                              mainImage === img
                                ? "3px solid #00CC99"
                                : "2px solid transparent",
                            borderRadius: "8px",
                            transition: "border 0.3s",
                          }}
                        />
                      ))}
                </div>
                <div className="col-10">
                  <div className="imgRow">
                    <img
                      src={mainImage}
                      alt={CauseSingle.title}
                      className="rounded-lg"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DONATION CARD */}

            <div
              id="donation-card-wrapper"
              className="cardRow col-lg-4 col-12 col-md-12  position-relative"
            >
              <div id="donation-card" className="card shadow-sm border-light">
                <div className="card-body">
                  <h3 className="text-uppercase text-dark font-weight-bold mb-4">
                    {CauseSingle.title}
                  </h3>

                  {/* --- Start of ONLY calculation changes --- */}
                  {(() => {
                    const fundraised = CauseSingle.fundraised || 0;
                    // Use CauseSingle.funding_goal if available, otherwise fall back to CauseSingle.goal
                    const communityGoal =
                      CauseSingle.funding_goal || CauseSingle.goal || 0;
                    const availableMatchingGrant =
                      CauseSingle.available_grant || 0;

                    // Calculate the matching ratio based on community goal
                    const matchingRatio =
                      communityGoal > 0
                        ? availableMatchingGrant / communityGoal
                        : 0;

                    // Calculate the amount of matching fund theoretically activated by community fundraising
                    const theoreticallyActivatedMatching =
                      fundraised * matchingRatio;

                    // The actual matching used is capped at the available grant amount
                    const matchingUsed = Math.min(
                      theoreticallyActivatedMatching,
                      availableMatchingGrant
                    );

                    // Community progress bar percentage
                    const communityProgressPercentage =
                      communityGoal > 0
                        ? (fundraised / communityGoal) * 100
                        : 0;

                    // Matching grant utilization percentage
                    const matchingGrantUtilizationPercentage =
                      availableMatchingGrant > 0
                        ? (matchingUsed / availableMatchingGrant) * 100
                        : 0;

                    return (
                      <>
                        {/* Project Value */}
                        <p>
                          <strong>Project Value:</strong> $
                          {(
                            communityGoal + availableMatchingGrant
                          ).toLocaleString()}
                        </p>

                        <div style={{ marginBottom: "15px" }}>
                          <p style={{ fontSize: "14px" }}>
                            <strong>
                              {" "}
                              ${Math.round(fundraised).toLocaleString()}
                            </strong>{" "}
                            raised of
                            <strong>
                              {" "}
                              ${communityGoal.toLocaleString()}
                            </strong>{" "}
                            goal
                          </p>

                          <div className="progress" style={{ height: "4px" }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${communityProgressPercentage}%`,
                                background: "#2C3E50",
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <p style={{ fontSize: "14px" }}>
                            <strong>Matching Fund:</strong>$
                            {availableMatchingGrant.toLocaleString()}
                          </p>

                          <div className="progress" style={{ height: "4px" }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${matchingGrantUtilizationPercentage}%`, // Corrected calculation
                                background: "#00CC99",
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                  {/* --- End of ONLY calculation changes --- */}

                  {/* Dynamic Info Block Style */}
                  <div className="mb-3 mt-3">
                    {/* Remaining Days */}
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-hourglass-half mr-2 p-2 font-color"></i>
                      <small style={{ color: "#010038" }}>
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(CauseSingle.end_date) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}{" "}
                        days left
                      </small>
                    </div>

                    {/* Backers */}
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-users mr-2 p-2 font-color"></i>
                      <div
                        onClick={() => setShowBackersModal(true)}
                        className="text-decoration-none"
                        style={{ color: "#010038", cursor: "pointer" }}
                      >
                        <small>
                          {CauseSingle.backers}{" "}
                          <span style={{ textDecoration: "underline" }}>
                            Supporters
                          </span>
                        </small>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="d-flex align-items-center  mb-2">
                      <i className="fas fa-map-marker-alt mr-2 p-2 font-color"></i>
                      <div
                        onClick={() => setShowLocationModal(true)}
                        className="text-decoration-none"
                        style={{ color: "#010038", cursor: "pointer" }}
                      >
                        <small>
                          <span style={{ textDecoration: "underline" }}>
                            {typeof CauseSingle.location_district === "object"
                              ? CauseSingle.location_district
                              : CauseSingle.location_district}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="d-block justify-content-between align-items-center buttons">
                    <button
                      className="btnActions2 d-block w-100 px-4 py-2 mt-2 mb-3 text-white fw-bold"
                      onClick={() => setShowShareModal(true)}
                    >
                      Share
                    </button>
                    {/* <Link to={`/donate/${CauseSingle.id}`} className='text-decoration-none'>
          <button className="btnActions d-block w-100 px-4 py-2 mt-2 text-white fw-bold">
            Donate Now
          </button>
        </Link> */}
                    <Link
                      to={
                        isDonateButtonDisabled()
                          ? "#"
                          : `/donate/${CauseSingle.id}`
                      }
                      className={`text-decoration-none ${
                        isDonateButtonDisabled() ? "disabled-link" : ""
                      }`} // Add a class for disabled state if needed for styling
                    >
                      <button
                        className="btnActions d-block w-100 px-4 py-2 mt-2 text-white fw-bold"
                        disabled={isDonateButtonDisabled()}
                        style={{
                          backgroundColor: isDonateButtonDisabled()
                            ? "#cccccc"
                            : "#00CC99", // Gray out when disabled
                          cursor: isDonateButtonDisabled()
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        {getDonateButtonText()}
                      </button>
                    </Link>
                  </div>
                  {/* Community Info */}
                  <div className="mt-2 mb-2">
                    <div
                      onClick={() => setCommunityOpen(true)}
                      className="text-decoration-none d-flex align-items-center mb-2"
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fas fa-users-cog mr-2 p-2 font-color"></i>
                      <small>
                        Community:{" "}
                        <span
                          style={{
                            textDecoration: "underline",
                            color: "#00CC99",
                          }}
                        >
                          {" "}
                          {CauseSingle.community_name}
                        </span>
                      </small>{" "}
                    </div>
                  </div>

                  {/* Organization Info */}
                  <div className="mt-3">
                    <div
                      onClick={() => setShowOrgModal(true)}
                      className="text-decoration-none d-flex align-items-center mb-2"
                    >
                      <i className="fas fa-building mr-2 p-2 font-color"></i>
                      Supported By:{" "}
                      <span
                        style={{
                          textDecoration: "underline",
                          color: "#00CC99",
                        }}
                      >
                        {CauseSingle?.org?.organisation_name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END CARD */}
          </div>

          {/* TABS SECTION */}

          <div
            id="tabs-section"
            className="nabTab mt-1 col-lg-8 col-md-12 col-12"
          >
            {/* Tab Navigation */}
            <ul
              className="nav"
              style={{
                backgroundColor: "#e7e7e7",
                borderRadius: "5px",
                padding: "8px 10px",
              }}
            >
              <li
                className={`nav-item fs-6 fs-lg-3 ${
                  activeTab === "story" ? "item-active" : ""
                }`}
              >
                <button
                  className="nav-link"
                  onClick={() => setActiveTab("story")}
                >
                  Project Story
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "updates" ? "item-active" : ""
                }`}
              >
                <button
                  className="nav-link"
                  onClick={() => setActiveTab("updates")}
                >
                  Updates
                </button>
              </li>
              <li
                className={`nav-item ${
                  activeTab === "list" ? "item-active" : ""
                }`}
              >
                <button
                  className="nav-link"
                  onClick={() => setActiveTab("list")}
                >
                  Back List
                </button>
              </li>
              {/* hidding rn the expenditure tab */}
              {/* <li className={`nav-item fs-6 fs-lg-3 ${activeTab === "expenditureTransactions" ? "item-active" : ""}`}>
          <button className="nav-link" onClick={() => setActiveTab("expenditureTransactions")}>expenditure</button>
        </li> */}
              {CauseSingle.expenditureTransactions &&
                CauseSingle.expenditureTransactions.length > 0 && (
                  <li
                    className={`nav-item fs-6 fs-lg-3 ${
                      activeTab === "expenditureTransactions"
                        ? "item-active"
                        : ""
                    }`}
                  >
                    <button
                      className="nav-link"
                      onClick={() => setActiveTab("expenditureTransactions")}
                    >
                      expenditure
                    </button>
                  </li>
                )}

              {/* <li
                className={`nav-item fs-6 fs-lg-3 ${
                  activeTab === "review" ? "item-active" : ""
                }`}
              >
                <button
                  className="nav-link"
                  onClick={() => setActiveTab("review")}
                >
                  Reviews
                </button>
              </li> */}
            </ul>

            {/* Tab Content */}
            <div className="tab-content mt-3">
              {activeTab === "story" && (
                <div className="tab-pane fade show active">
                  <h4 className="fw-bold">Project Overview</h4>
                  <p> {renderStoryAsParagraphs(CauseSingle.story)}</p>
                </div>
              )}

              {activeTab === "updates" && (
                <div className="tab-pane fade show active">
                  <h5 className="fw-bold">Updates</h5>

                  <form onSubmit={handleSubmit}>
                    <h6 className="fw-bold mb-3">Post an Update</h6>

                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                        style={{ color: "#00CC99" }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter update title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ borderRadius: "8px", padding: "10px" }}
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                        style={{ color: "#00CC99" }}
                      >
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Write update details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ borderRadius: "8px", padding: "10px" }}
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label fw-semibold"
                        style={{ color: "#00CC99" }}
                      >
                        Image URL
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        placeholder="Paste image URL "
                        // value={pictureFile}
                        onChange={(e) => setPicture(e.target.files[0])}
                        style={{ borderRadius: "8px", padding: "10px" }}
                      />
                    </div>

                    {pictureFile && (
                      <div className="mb-3">
                        <img
                          src={URL.createObjectURL(pictureFile)}
                          alt="Preview"
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <ReCAPTCHA
                        ref={setRecaptchaRef}
                        sitekey={
                          process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                          "YOUR_RECAPTCHA_SITE_KEY"
                        }
                        onChange={handleRecaptchaChange}
                        onExpired={handleRecaptchaExpired}
                      />
                    </div>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn"
                        disabled={!recaptchaToken}
                        style={{
                          backgroundColor: recaptchaToken
                            ? "#00CC99"
                            : "#cccccc",
                          color: "#fff",
                          fontWeight: "600",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: recaptchaToken ? "pointer" : "not-allowed",
                        }}
                      >
                        Post Update
                      </button>
                    </div>
                  </form>

                  {CauseSingle.Project_updates &&
                    CauseSingle.Project_updates.sort(
                      (a, b) => new Date(b.date) - new Date(a.date)
                    ) // latest first
                      .slice(
                        0,
                        showAllUpdates ? CauseSingle.Project_updates.length : 3
                      ) // only show 3 if not expanded
                      .map((update, index) => (
                        <div key={index} className=" my-3 ">
                          <div className="d-block d-md-flex  gap-5">
                            {update.picture_url && (
                              // <div  style={{width:"200px", height:"100px", borderRadius:"50px"}}>
                              //   <img
                              //   src={update.image}
                              //   alt={`Update ${index + 1}`}
                              //   style={{ Width:"200px", Height: "100px", objectFit: "fill", borderRadius:"50px" }}
                              //   className=" w-full w-lg-0 rounded h-100 w-100"
                              // />
                              //   </div>
                              <div
                                className="w-100 w-md-auto mb-3 mb-md-0"
                                style={{
                                  width: "100%",
                                  maxWidth: "300px",
                                  height: "100px",

                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={update.picture_url}
                                  alt={`Update ${index + 1}`}
                                  className="w-100 h-100 rounded"
                                  style={{
                                    objectFit: "fill",
                                  }}
                                />
                              </div>
                            )}
                            <div style={{ width: "100%" }}>
                              <div className="d-block d-md-flex   justify-content-between  mb-2">
                                <h6 className="fw-bold mb-0">
                                  {update.update_title}
                                </h6>
                                <small style={{ color: "#00CC99" }}>
                                  {new Date(
                                    update.date_time_added
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                              {update.description && (
                                <p className="mb-2">{update.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                  {CauseSingle.Project_updates.length > 3 && (
                    <div className="text-center mt-3">
                      <div
                        className="btn "
                        onClick={() => setShowAllUpdates(!showAllUpdates)}
                        style={{
                          textDecoration: "underline",
                          color: "#00CC99",
                        }}
                      >
                        {showAllUpdates ? "Show Less" : "See More Updates"}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* {activeTab === "list" && (
  <div className="tab-pane fade show active">
    <h5 className="fw-bold">List Backers</h5>
    <div className="mt-4">
      <div className="table-responsive">
        <table className="table align-middle shadow-sm rounded">
          <thead>
            <tr style={{ backgroundColor: "#2C3E50", color: "white", borderRadius: "8px" }}>
              <th className="text-white">#</th>
              <th className="text-white">Backer</th>
              <th className="text-white">Amount</th>
              <th className="text-white">Source</th>
              <th className="text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {CauseSingle.transactions.map((transaction, index) => {
              const tranAmt = parseFloat(transaction.TranAmt);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>
                      {transaction.Category?.toLowerCase() === "card" ||
                      transaction.Category?.toLowerCase() === "dahabshiil bank"
                        ? transaction.CustomerName
                        : transaction.Narration}
                    </strong>
                  </td>
                  <td className="text-success fw-bold">${tranAmt.toFixed(2)}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {transaction.Category?.toLowerCase() === "card" ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#666"
                          style={{ marginRight: "4px" }}
                        >
                          <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                          <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000"
                          style={{ marginRight: "4px" }}
                        >
                          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" strokeWidth="2" />
                          <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3V5z" strokeWidth="2" />
                        </svg>
                      )}
                      {transaction.Category || "Salaam Somali Bank"}
                    </span>
                  </td>
                  <td>
                    <i className="far fa-calendar-alt me-1"></i>
                    {new Date(transaction.TranDate).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2">
        {(() => {
          const totalAmount = CauseSingle.transactions.reduce(
            (acc, transaction) => acc + parseFloat(transaction.TranAmt || 0),
            0
          );
          const formattedTotal = totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          return (
            <h6 className="fw-bold">
              Total Amount: <span className="text-success">${formattedTotal}</span>
            </h6>
          );
        })()}
      </div>
    </div>
  </div>
)} */}
              {activeTab === "list" && (
                <div style={{ margin: 0, padding: 0 }}>
                  <h5 style={{ marginBottom: "1.5rem", fontWeight: "bold" }}>
                    List Backers
                  </h5>
                  <div
                    className="table-container"
                    style={{ overflowX: "auto" }}
                  >
                    <table
                      className="styled-table"
                      style={{
                        fontSize: "1.1rem",
                        width: "95%",
                        borderCollapse: "collapse",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#2C3E50", color: "white" }}>
                          <th
                            style={{ padding: "0.6rem", textAlign: "center" }}
                          >
                            #
                          </th>
                          <th style={{ padding: "0.6rem" }}>Backer</th>
                          <th style={{ padding: "0.6rem", textAlign: "left" }}>
                            Amount
                          </th>
                          <th style={{ padding: "0.6rem" }}>Source</th>
                          <th style={{ padding: "0.6rem" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CauseSingle.transactions &&
                          CauseSingle.transactions.map((transaction, index) => {
                            const tranAmt = parseFloat(transaction.TranAmt);

                            const rowStyle =
                              index % 2 === 0
                                ? { background: "white" }
                                : { background: "rgba(240, 247, 255, 0.5)" };

                            return (
                              <tr key={index} style={rowStyle}>
                                <td
                                  style={{
                                    padding: "0.5rem",
                                    textAlign: "center",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    padding: "0.5rem",
                                    color: "black",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  <strong>
                                    {transaction.Category?.toLowerCase() ===
                                      "card" ||
                                    transaction.Category?.toLowerCase() ===
                                      "dahabshiil bank"
                                      ? transaction.CustomerName
                                      : transaction.Narration}
                                  </strong>
                                </td>
                                <td
                                  style={{
                                    padding: "0.8rem",
                                    textAlign: "left",
                                    color: "#2b9348",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      style={{ marginRight: "4px" }}
                                    >
                                      <path
                                        d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    {tranAmt.toFixed(2)}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "0.5rem",
                                    fontSize: "1rem",
                                    color: "black",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {transaction.Category?.toLowerCase() ===
                                    "card" ? (
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#666"
                                        style={{ marginRight: "4px" }}
                                      >
                                        <rect
                                          x="2"
                                          y="5"
                                          width="20"
                                          height="14"
                                          rx="2"
                                          strokeWidth="2"
                                        />
                                        <line
                                          x1="2"
                                          y1="10"
                                          x2="22"
                                          y2="10"
                                          strokeWidth="2"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#666"
                                        style={{ marginRight: "4px" }}
                                      >
                                        <path
                                          d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
                                          strokeWidth="2"
                                        />
                                        <path
                                          d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3V5z"
                                          strokeWidth="2"
                                        />
                                      </svg>
                                    )}
                                    {transaction.Category ||
                                      "Salaam Somali Bank"}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: "0.5rem",
                                    fontSize: "1rem",
                                    color: "#000",
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#666"
                                      style={{ marginRight: "4px" }}
                                    >
                                      <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        strokeWidth="2"
                                      />
                                      <line
                                        x1="16"
                                        y1="2"
                                        x2="16"
                                        y2="6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                      <line
                                        x1="8"
                                        y1="2"
                                        x2="8"
                                        y2="6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                      <line
                                        x1="3"
                                        y1="10"
                                        x2="21"
                                        y2="10"
                                        strokeWidth="2"
                                      />
                                    </svg>
                                    {new Date(
                                      transaction.TranDate
                                    ).toLocaleDateString()}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {CauseSingle.transactions.length > 0 && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        textAlign: "left",
                        paddingRight: "2.5%",
                      }}
                    >
                      {(() => {
                        const totalAmount = CauseSingle.transactions.reduce(
                          (acc, transaction) =>
                            acc + parseFloat(transaction.TranAmt || 0),
                          0
                        );
                        const formattedTotal = totalAmount.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        );
                        return (
                          <h5 style={{ fontWeight: "bold" }}>
                            Total Amount:{" "}
                            <span
                              style={{ color: "#2b9348", marginLeft: "30px" }}
                            >
                              ${formattedTotal}
                            </span>{" "}
                          </h5>
                        );
                      })()}
                    </div>
                  )}

                  {CauseSingle.transactions.length <= 0 && (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        marginTop: "1.5rem",
                      }}
                    >
                      No data found
                    </p>
                  )}
                </div>
              )}

              {/*    
   {activeTab === "expenditureTransactions" && (
  <div className="tab-pane fade show active">
    <div className="container mt-4">

     
      {(() => {
       
     
const goal = CauseSingle.goal; 
const spent = CauseSingle.expenditureTransactions.reduce((sum, item) => sum + parseFloat(item.TranAmt), 0);
const remaining = goal - spent;

const spentPercent = (spent / goal) * 100;
const remainingPercent = (remaining / goal) * 100;


        return (
          <>
           
            <div className="row mb-4 g-4 justify-content-center">
              
              <div className="col-md-4 d-flex justify-content-center">
    <div
      className="position-relative shadow rounded-circle"
      style={{
        width: "180px",
        height: "180px",
        background: `conic-gradient(
          #4F5D73 0% ${spentPercent}%,
          #66D1B2 ${spentPercent}% 100%
        )`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14px",
          background: "#fff",
          borderRadius: "50%",
          width: "100px",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <div>Goal</div>
        ${goal.toFixed(2)}
      </div>
    </div>
  </div>

  <div className="col-md-4 d-flex justify-content-center align-items-center">
  <table
    className="table table-sm mb-0"
    style={{ width: "auto", fontSize: "14px", border: "1px solid #ddd", borderRadius: "5px" }}
  >
    <tbody>
      <tr>
        <td style={{ color: "#28a745", fontWeight: "bold", border: "1px solid #ddd" }}>●</td>
        <td style={{ border: "1px solid #ddd" }}>Goal</td>
        <td className="text-end" style={{ border: "1px solid #ddd" }}>${goal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style={{ color: "#4F5D73", fontWeight: "bold", border: "1px solid #ddd" }}>●</td>
        <td style={{ border: "1px solid #ddd" }}>Total Expenditure</td>
        <td className="text-end" style={{ border: "1px solid #ddd" }}>${spent.toFixed(2)}</td>
      </tr>
      <tr>
        <td style={{ color: "#66D1B2", fontWeight: "bold", border: "1px solid #ddd" }}>●</td>
        <td style={{ border: "1px solid #ddd" }}>Remaining</td>
        <td className="text-end" style={{ border: "1px solid #ddd" }}>${remaining.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
</div>

            </div>

         
            <div className="mt-4">
              <div className="table-responsive">
                <table className="table align-middle shadow-sm rounded">
                  <thead>
                    <tr style={{ backgroundColor: "#2C3E50", color: "white", borderRadius: "8px" }}>
                      
                      <th className="text-white">Date</th>
                      <th className="text-white">Narration</th>
                      <th className="text-white">Category</th>
                      <th className="text-white">Customer</th>
                     
                      <th className="text-white">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CauseSingle.expenditureTransactions.map((item, index) => (
                      <tr key={index}>
                       
                        <td><i className="far fa-calendar-alt me-1 text-muted"></i>{item.TranDate}</td>
                        <td>{item.Narration}</td>
                        <td>{item.Category}</td>
                        <td>{item.CustomerName}</td>
                        <td className="text-danger fw-semibold">${parseFloat(item.TranAmt).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
  <td colSpan="5" className="text-end">Total:</td>
  <td className="text-danger fw-semibold">
    ${CauseSingle.expenditureTransactions
      .reduce((sum, item) => sum + parseFloat(item.TranAmt), 0)
      .toFixed(2)}
  </td>
</tr>

                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  </div>





)} */}

              {/* this is the expenditure transaction i hidde it can be come back when we done working on it I'm gonna commit this rn */}

              {CauseSingle.expenditureTransactions &&
                CauseSingle.expenditureTransactions.length > 0 &&
                activeTab === "expenditureTransactions" && (
                  <div style={{ margin: 0, padding: 0 }}>
                    <div style={{ margin: 0, padding: 0 }}>
                      {(() => {
                        const goal = CauseSingle.goal;
                        const spent =
                          CauseSingle.expenditureTransactions.reduce(
                            (sum, item) => sum + parseFloat(item.TranAmt || 0),
                            0
                          );
                        const remaining = goal - spent;

                        const spentPercent = (spent / goal) * 100;
                        const remainingPercent = (remaining / goal) * 100;

                        return (
                          <>
                            {/* <div
              style={{
                display: "flex", 
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "2rem",
                marginBottom: "2rem", 
              }}
            >
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "180px",
                    height: "180px",
                    background: `conic-gradient(
                      #4F5D73 0% ${spentPercent}%,
                      #66D1B2 ${spentPercent}% 100%
                    )`,
                    borderRadius: "50%", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)", 
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "14px",
                      background: "#fff",
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "inset 0 0 8px rgba(0,0,0,0.1)", 
                    }}
                  >
                    <div style={{ color: "#4F5D73" }}>Goal</div>{" "}
                    <span style={{ color: "#2b9348", fontSize: "16px" }}>
                      ${goal.toFixed(2)}
                    </span>{" "}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <table
                  style={{
                    width: "auto",
                    fontSize: "14px",
                    borderCollapse: "separate", 
                    borderSpacing: "0 8px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", 
                  }}
                >
                  <tbody>
                    <tr style={{ background: "white" }}>
                      <td
                        style={{
                          color: "#66D1B2", 
                          fontWeight: "bold",
                          padding: "8px 12px",
                          borderBottom: "none", 
                        }}
                      >
                        ●
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "none",
                          color: "#333",
                        }}
                      >
                        Goal
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: "8px 12px",
                          borderBottom: "none",
                          fontWeight: "bold",
                          color: "#2b9348", 
                        }}
                      >
                        ${goal.toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ background: "white" }}>
                      <td
                        style={{
                          color: "#4F5D73",
                          fontWeight: "bold",
                          padding: "8px 12px",
                          borderBottom: "none",
                        }}
                      >
                        ●
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "none",
                          color: "#333",
                        }}
                      >
                        Total Expenditure
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: "8px 12px",
                          borderBottom: "none",
                          fontWeight: "bold",
                          color: "#d62828", 
                        }}
                      >
                        ${spent.toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ background: "white" }}>
                      <td
                        style={{
                          color: "#66D1B2", 
                          fontWeight: "bold",
                          padding: "8px 12px",
                          borderBottom: "none",
                        }}
                      >
                        ●
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          borderBottom: "none",
                          color: "#333",
                        }}
                      >
                        Remaining
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          padding: "8px 12px",
                          borderBottom: "none",
                          fontWeight: "bold",
                          color: remaining >= 0 ? "#2b9348" : "#d62828", 
                        }}
                      >
                        ${remaining.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
                            <div style={{ marginTop: "2rem" }}>
                              {" "}
                              <div
                                className="table-container"
                                style={{ overflowX: "auto" }}
                              >
                                <table
                                  className="styled-table"
                                  style={{
                                    fontSize: "1.1rem",
                                    width: "95%",
                                    borderCollapse: "collapse",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  <thead>
                                    <tr
                                      style={{
                                        background: "#2C3E50",
                                        color: "white",
                                      }}
                                    >
                                      {" "}
                                      <th style={{ padding: "0.6rem" }}>
                                        Date
                                      </th>
                                      <th style={{ padding: "0.6rem" }}>
                                        Narration
                                      </th>
                                      <th style={{ padding: "0.6rem" }}>
                                        Category
                                      </th>
                                      <th style={{ padding: "0.6rem" }}>
                                        Customer
                                      </th>
                                      <th
                                        style={{
                                          padding: "0.6rem",
                                          textAlign: "right",
                                        }}
                                      >
                                        Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {CauseSingle.expenditureTransactions.map(
                                      (item, index) => {
                                        const rowStyle =
                                          index % 2 === 0
                                            ? { background: "white" }
                                            : {
                                                background:
                                                  "rgba(240, 247, 255, 0.5)",
                                              };

                                        return (
                                          <tr key={index} style={rowStyle}>
                                            <td
                                              style={{
                                                padding: "0.5rem",
                                                borderBottom: "1px solid #eee",
                                                fontSize: "1rem",
                                                color: "black",
                                              }}
                                            >
                                              <span
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {new Date(
                                                  item.TranDate
                                                ).toLocaleDateString()}
                                              </span>
                                            </td>
                                            <td
                                              style={{
                                                padding: "0.5rem",
                                                fontSize: "1rem",
                                                color: "black",
                                                borderBottom: "1px solid #eee",
                                              }}
                                            >
                                              {item.Narration}
                                            </td>
                                            <td
                                              style={{
                                                padding: "0.5rem",
                                                fontSize: "1rem",
                                                borderBottom: "1px solid #eee",
                                                color: "black",
                                              }}
                                            >
                                              {item.Category}
                                            </td>
                                            <td
                                              style={{
                                                padding: "0.5rem",
                                                fontSize: "1rem",
                                                color: "black",
                                                borderBottom: "1px solid #eee",
                                              }}
                                            >
                                              {item.CustomerName}
                                            </td>

                                            <td style={{ textAlign: "right" }}>
                                              <span
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "flex-end",
                                                }}
                                              >
                                                <svg
                                                  width="14"
                                                  height="14"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  style={{ marginRight: "4px" }}
                                                >
                                                  <path
                                                    d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  />
                                                </svg>
                                                {parseFloat(
                                                  item.TranAmt
                                                ).toFixed(2)}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                    {CauseSingle.expenditureTransactions
                                      .length === 0 && (
                                      <tr>
                                        <td colSpan="5">
                                          <p
                                            style={{
                                              textAlign: "center",
                                              color: "#000",
                                              marginTop: "1rem",
                                              padding: "0.5rem",
                                            }}
                                          >
                                            No expenditure transactions found.
                                          </p>
                                        </td>
                                      </tr>
                                    )}

                                    {CauseSingle.expenditureTransactions
                                      .length > 0 && (
                                      <tr
                                        style={{
                                          backgroundColor: "#f8f9fa",
                                        }}
                                      >
                                        <td
                                          colSpan="4"
                                          style={{
                                            textAlign: "right",
                                            padding: "0.6rem",
                                          }}
                                        >
                                          Total:
                                        </td>
                                        <td
                                          style={{
                                            color: "#000",
                                            padding: "0.6rem",
                                            textAlign: "right",
                                          }}
                                        >
                                          <span
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "flex-end",
                                            }}
                                          >
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              style={{ marginRight: "4px" }}
                                            >
                                              <path
                                                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                            {CauseSingle.expenditureTransactions
                                              .reduce(
                                                (sum, item) =>
                                                  sum +
                                                  parseFloat(item.TranAmt || 0),
                                                0
                                              )
                                              .toFixed(2)}
                                          </span>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

              {activeTab === "review" && (
                <div className="tab-pane fade show active">
                  {/*  Reactions Bar */}

                  <div className="mb-4 position-relative">
                    <strong className="me-2">Reactions:</strong>
                    <div className="d-inline-flex align-items-center gap-2">
                      <button
                        className="btn border rounded-circle p-2"
                        onClick={() =>
                          setShowReactionPicker(!showReactionPicker)
                        }
                        title="React"
                      >
                        <span style={{ fontSize: "1.3rem" }}>➕</span>
                      </button>

                      {/* Display selected emoji reactions with counts */}
                      {Object.entries(reactionCounts).map(([key, count]) =>
                        count > 0 ? (
                          <div
                            key={key}
                            className="d-flex align-items-center justify-content-center border rounded-pill px-3 py-1 bg-light shadow-sm"
                          >
                            <span
                              style={{ fontSize: "1.2rem", marginRight: "6px" }}
                            >
                              {reactionEmojiMap[key]}
                            </span>
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.9rem" }}
                            >
                              {count}
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>

                    {/* Floating emoji picker */}
                    {showReactionPicker && (
                      <div
                        className="position-absolute bg-white shadow-sm p-2 rounded-pill"
                        style={{
                          top: "-60px",
                          left: "0",
                          zIndex: 10,
                          display: "flex",
                          gap: "10px",
                          border: "1px solid #ccc",
                        }}
                      >
                        {Object.entries(reactionEmojiMap).map(
                          ([key, emoji]) => (
                            <button
                              key={key}
                              className="btn btn-light border-0"
                              style={{ fontSize: "1.4rem" }}
                              onClick={() => handleQuickReaction(key)}
                              title={key}
                            >
                              {emoji}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* 📝 Reviews */}

                  <h4 className="fw-bold mb-4">
                    Reviews for {CauseSingle.title}
                  </h4>

                  {CauseSingle.reviews && CauseSingle.reviews.length > 0 ? (
                    CauseSingle.reviews
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((review, index) => (
                        <div
                          key={index}
                          className="card mb-3 border-0 shadow-sm animate__animated animate__fadeIn"
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="fw-semibold text-dark">
                                {review.name}
                              </div>
                              <small className="text-muted">
                                {new Date(review.date)}
                              </small>
                            </div>
                            <p className="mb-2">{review.message}</p>
                            {review.reaction && (
                              <div className="d-flex align-items-center mt-2">
                                <span
                                  style={{
                                    fontSize: "1.2rem",
                                    marginRight: "6px",
                                  }}
                                >
                                  {reactionEmojiMap[review.reaction]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>No reviews yet. Be the first to share your thoughts!</p>
                  )}

                  {/* ✍️ Review Form */}
                  <div className="card mt-4 shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="fw-bold mb-3">Leave a Review</h5>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Your Name"
                            value={reviewForm.name}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            placeholder="Write your message..."
                            rows="3"
                            maxLength={250}
                            value={reviewForm.message}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                message: e.target.value,
                              })
                            }
                            required
                          ></textarea>
                          <small className="text-muted d-block text-end">
                            {reviewForm.message.length}/250
                          </small>
                        </div>
                        <div className="mb-3">
                          <label className="me-2">Reaction:</label>
                          {Object.entries(reactionEmojiMap).map(
                            ([key, emoji]) => (
                              <button
                                key={key}
                                className="btn btn-light border-0"
                                style={{ fontSize: "1.4rem" }}
                                title={key}
                                onClick={() => {
                                  handleQuickReaction(key);
                                  setReviewForm({
                                    ...reviewForm,
                                    reaction: key,
                                  });
                                }}
                              >
                                {emoji}
                              </button>
                            )
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btnActions d-block w-100 px-4 py-2 mt-2 text-white fw-bold"
                          disabled={!reviewForm.name || !reviewForm.message}
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* popups  */}
      {/* backers pop up */}
      <BackersModal
        show={showBackersModal}
        handleClose={() => setShowBackersModal(false)}
        causeId={CauseSingle.id}
      />

      {/* location map model */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        location={CauseSingle.location_district}
        latitude={CauseSingle.latitude}
        longitude={CauseSingle.longitude}
        title={CauseSingle.title}
      />

      {/* share model */}
      {/* <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={window.location.href}
        title={CauseSingle.title}
      /> */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={projectShareUrl}
        projectImage={mainImage} // Use the main image you're already setting
        projectTitle={currentProject?.title}
        projectDescription={currentProject?.description} // Assuming 'description' is a field in your project data
        donateUrl={projectDonateUrl}
      />
      {/* community model pop up */}
      <CommunityModal
        isOpen={communityOpen}
        onClose={() => setCommunityOpen(false)}
        communityData={CauseSingle.Project_committee}
      />
      {/* organization model pop up */}
      <OrganizationModal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        organization={CauseSingle}
      />

      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default CauseSinglePage;
