// import React from "react";
// import { Link } from "react-router-dom";
// import Cta1 from "../../images/cta/shape-1.png";
// import Cta3 from "../../images/cta/shape-2.png";
// import Cta4 from "../../images/footer-bg.jpg";
// import { useProjects } from "../../api/ProjectsContext";

// const CtaSection = () => {
//   const ClickHandler = () => {
//     window.scrollTo(10, 0);
//   };

//   const { randomProject } = useProjects();
  
//   const defaultImage = Cta4;

//   return (
  
  
//     randomProject && (
//       <section
//         className="wpo-cta-section"
//         style={{
//           background: `url(${randomProject.images?.[0] || defaultImage})`,
//           backgroundSize: "cover",
//           backgroundRepeat:"no-repeat"
//         }}
//       >
//         <div className="shape-1">
//           <img src={Cta1} alt="" />
//         </div>
//         <div className="bg-overlay">
//           <div className="container">
//             <div className="row justify-content-center">
//               <div className="col-lg-8">
//                 <div className="cta-wrap">
//                   <div className="icon">
//                     <img src={Cta1} alt="" style={{ width: "70px" }} />
//                   </div>
//                   <span>Help us raise them up.</span>
//                   <h2>
//                     <strong>{randomProject.title}</strong>
//                   </h2>
//                   <Link
//                     to={`/donate/${randomProject.id}`}
//                     className="theme-btn-cta"
//                     onClick={ClickHandler}
//                   >
//                     Start Donating Them
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="shape-2">
//           <img src={Cta3} alt="" />
//         </div>
//       </section>
//     )
//   );
// };

// export default CtaSection;
import React from "react";
import { Link } from "react-router-dom";
import Cta1 from "../../images/cta/shape-1.png";
import Cta3 from "../../images/cta/shape-2.png";
import Cta4 from "../../images/footer-bg.jpg";
import { useProjects } from "../../api/ProjectsContext";

const CtaSection = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const { randomProject } = useProjects();
  const defaultImage = Cta4;
  // ✅ Prevent crash if not loaded yet
if (!randomProject || !randomProject.images) return null;
const firstImage = Object.values(randomProject.images || {})[0] || defaultImage;

  if (!randomProject) {
    return null;
  }

  const fundraised = randomProject.fundraised || 0;
  const fundingGoal = randomProject.funding_goal || 1; // avoid division by zero
  const matching = randomProject.available_grant || 0;
  const matchingUsed = Math.min(fundraised, matching);

  const progressPercentage = (fundraised / fundingGoal) * 100;
  const matchingPercentage = matching ? (matchingUsed / matching) * 100 : 0;

  return (
    <section
      className="wpo-cta-section"
      style={{
        // background: `url(${randomProject.images?.[0] || defaultImage})`,
        background: `url(${firstImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="shape-1">
        <img src={Cta1} alt="" />
      </div>
      <div className="bg-overlay">
        <div className="container">
          <div className="row justify-content-center ">
            <div className="col-lg-8">
              <div className="cta-wrap p-3">
                <div className="icon mb-3">
                  <img src={Cta1} alt="" style={{ width: "70px" }} />
                </div>
                <span style={{color:"#00CC99", fontWeight:"lighter"}}>Help us raise them up.</span>
                <h3
                style={{color:"white", fontSize:"30px"}}>
                  <strong>{randomProject.title}</strong>
                </h3>

                {/* Progress and Quick Donation */}
                <div className="mt-3 ">
                  <div className=" d-lg-flex d-block justify-content-between" style={{lineHeight:"0"}}>
                    <p style={{ fontSize: "30px", color:"#00CC99", fontWeight:"bold", display:"flex", flexDirection:"column", columnGap:"0" }}>
                    
                   
                    <p style={{ fontSize: "12px", color:"white" , marginBottom:"0px"}} > <strong>Project Value</strong> </p>
                     ${(matching + fundingGoal).toLocaleString()} 
                    
                  </p>
                  
                  <p style={{   fontSize: "30px", color:"#00CC99", fontWeight:"bold", }}>
                    
                    {/* <strong>${fundingGoal.toLocaleString()}</strong> goal */}
                    {/* <p style={{ fontSize: "12px", color:"white" }} > <strong>raised of{" "}  ${fundingGoal.toLocaleString()} goal</strong> </p> */}
                    <p style={{ fontSize: "12px", color:"white", marginBottom:"0px" }} > <strong>Raised Of{" "}   Goal</strong> </p>
                    <strong>${Math.round(fundraised).toLocaleString()}</strong> (
                    {progressPercentage.toFixed(1)}%) 
                  </p>
                  </div>

                  {/* Fundraised Progress Bar */}
                  <div className="progress" style={{ height: "4px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${progressPercentage}%`,
                        background: "#00CC99",
                      }}
                    ></div>
                  </div>

                 
                </div>

                {/* Quick Donation Button */}
                <div className="mt-4">
                  <Link
                    to={`/donate/${randomProject.id}`}
                    className="theme-btn-cta"
                    onClick={ClickHandler}
                   
                  >
                    Start Donating Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shape-2">
        <img src={Cta3} alt="" />
      </div>
    </section>
  );
};

export default CtaSection;
