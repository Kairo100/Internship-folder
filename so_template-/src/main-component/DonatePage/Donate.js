import { useParams } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import Scrollbar from "../../components/scrollbar/scrollbar";
import Footer from "../../components/footer/Footer";
import Logo from "../../images/logo2.png";
import axios from "axios";
import DonationForm from "../../components/DonationForm/DonationForm";
import DonationStatusModal from "./DonationStatusModal";

// Main Donate Component
const Donate = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [donationStatus, setDonationStatus] = useState(null);

  // Fetch project details when component mounts or id changes
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`https://api.caprover.sokaab.com/api/public/projects/${id}`)
        // .get(`http://localhost:3000/api/public/projects/${id}`)
        .then((response) => {
          setProject(response.data);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching project:", error);
          setError("Failed to load project details. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Close the donation status modal
  const handleCloseModal = () => {
    setShowModal(false);
    setDonationStatus(null);
  };

  // Handle completion of donation
  const handleDonationComplete = (status) => {
    setDonationStatus(status);
    setShowModal(true);
  };
  // Show loading spinner
  if (loading) {
    return (
      <Fragment>
        <Navbar Logo={Logo} hclass={"wpo-site-header-s3"} />
        <PageTitle pageTitle={"Donate"} pagesub={"Donate"} />
        <div
          className="d-flex justify-content-center align-items-center text-center"
          style={{ minHeight: "60vh", padding: "2rem" }}
        >
          <div>
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#00CC99", width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 fs-5">Loading project details...</p>
          </div>
        </div>
        <Scrollbar />
        <Footer />
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        <Navbar Logo={Logo} hclass={"wpo-site-header-s3"} />
        <PageTitle pageTitle={"Donate"} pagesub={"Donate"} />
        <div
          className="d-flex justify-content-center align-items-center text-center"
          style={{ minHeight: "60vh", padding: "2rem" }}
        >
          <div
            className="alert alert-danger"
            role="alert"
            style={{ maxWidth: "500px" }}
          >
            <h4 className="alert-heading">Error Loading Project</h4>
            <p>{error}</p>
            <button
              className="btn btn-outline-danger"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
        <Scrollbar />
        <Footer />
      </Fragment>
    );
  }

  if (!project) {
    return (
      <Fragment>
        <Navbar Logo={Logo} hclass={"wpo-site-header-s3"} />
        <PageTitle pageTitle={"Donate"} pagesub={"Donate"} />
        <div
          className="d-flex justify-content-center align-items-center text-center"
          style={{ minHeight: "60vh", padding: "2rem" }}
        >
          <div
            className="alert alert-warning"
            role="alert"
            style={{ maxWidth: "500px" }}
          >
            <h4 className="alert-heading">Project Not Found</h4>
            <p>The requested project could not be found.</p>
            <button
              className="btn btn-outline-warning"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
        <Scrollbar />
        <Footer />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Navbar Logo={Logo} hclass={"wpo-site-header-s3"} />
      <PageTitle pageTitle={"Donate"} pagesub={"Donate"} />

      <div
        style={{
          background: "#F4F8F7",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12">
              <DonationForm
                project={project}
                onDonationComplete={handleDonationComplete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Donation Status Modal */}
      {showModal && (
        <DonationStatusModal
          show={showModal}
          onHide={handleCloseModal}
          status={donationStatus}
          project={project}
        />
      )}

      <Scrollbar />
      <Footer />
    </Fragment>
  );
};

export default Donate;
