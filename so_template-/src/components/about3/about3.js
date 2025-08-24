import { Link } from "react-router-dom";
// import abut3 from "../../images/about/img-3.jpg"
import abut3 from "../../images/about/img-3 (2).jpg";
import abutShape3 from "../../images/about/shape-2.png";
import VideoModal from "../ModalVideo/VideoModal";

const ClickHandler = () => {
  window.scrollTo(10, 0);
};

const AboutSection3 = () => {
  return (
    <section className="wpo-about-section-s3 ">
      <div className="container ">
        <div className="wpo-about-wrap">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <div className="wpo-about-img-s3 p-lg-5">
                <VideoModal />
                <div className="image ">
                  <img src={abut3} alt="" />

                  <div className="shape">
                    <img src={abutShape3} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-12">
              <div className="wpo-about-text">
                <div className="wpo-section-title">
                  <span>Welcome to Sokaab</span>
                  <h2>Be the Hope</h2>
                </div>
                {/* <p>Sokaab is the first Somali crowdfunding platform, dedicated to enabling communities and organizations to raise funds for meaningful projects. Our platform connects donors with changemakers, helping dreams become reality and communities to thrive.</p> */}
                <p>
                  Sokaab is a purpose-driven crowdfunding platform dedicated to
                  empowering communities and organizations to raise funds for
                  impactful projects. We connect donors with changemakers,
                  turning bold ideas into reality and helping communities
                  thrive.
                </p>
                <div className="about-btn">
                  <Link
                    to="/about"
                    className="theme-btn"
                    onClick={ClickHandler}
                  >
                    Discover More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection3;
