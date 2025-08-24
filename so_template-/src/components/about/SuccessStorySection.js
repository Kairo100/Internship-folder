import React from "react";
// import storyImg1 from '../../images/about/img-1.jpg';
import storyImg1 from "../../images/about/1.jpg";
// import storyImg2 from '../../images/about/img-2.jpg';
import storyImg2 from "../../images/about/2.jpg";

const SuccessStorySection = () => {
  return (
    <section style={{ backgroundColor: "#fff", padding: "60px 0" }}>
      <div className="container">
        <div className="text-center ">
          <div className="wpo-section-title mb-1">
            <span style={{ fontSize: "40px" }}>
              Empowering Somali Communities
            </span>
          </div>
          <p>
            Real change starts with people. These are the stories of how
            Somali-led projects are transforming communities from within.
          </p>
        </div>

        <div className="row align-items-center mb-5 mt-5">
          <div className="col-md-6">
            <img
              src={storyImg1}
              alt="Impact Image 1"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <div style={{ padding: "0 20px" }}>
              <div className="wpo-about-text">
                <div className="wpo-section-title">
                  <h1>A Platform built by and for the community</h1>
                </div>
              </div>
              <p>
                <strong>SOKAAB</strong> is the first Somali-based crowdfunding
                platform dedicated to supporting local initiatives that uplift
                communities and empower youth across Somali regions.
              </p>
              <p>
                With support from the{" "}
                <strong>Danish Refugee Council (DRC)</strong> and funding from
                the <strong>Somali Stability Fund</strong>, we’ve created a
                transparent and empowering space for change.
              </p>
            </div>
          </div>
        </div>

        <div className="row align-items-center flex-md-row-reverse mt-5">
          <div className="col-md-6">
            <img
              src={storyImg2}
              alt="Impact Image 2"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <div style={{ padding: "0 20px" }}>
              <div className="wpo-about-text">
                <div className="wpo-section-title">
                  <h1>Driven by Communities, Powered by Trust</h1>
                </div>
              </div>
              <p>
                Communities choose what matters: clean water, education, roads.
                Through <strong>DIALOGUE</strong>, we match their efforts and
                provide essential training to ensure sustainability.
              </p>
              <p>
                An appraisal panel ensures each project is impactful and
                accountable. Together, we’re reshaping governance, one
                successful initiative at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStorySection;
