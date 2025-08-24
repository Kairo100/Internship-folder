import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../api/ProjectsContext";
import { color, lineHeight } from "@mui/system";
const GallerySection = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const openModal = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };


    
    const {galleryData ,loading} = useProjects();
    

    const today = new Date();

    const eligibleCauses = galleryData.filter(cause => {
        const isEnded = new Date(cause.end_date) < today;
        const isFunded = cause.fundraised >= cause.funding_goal;
        return isEnded || isFunded;
    });

   
  

    const galleryItems = eligibleCauses
    .filter(cause => cause.images && Object.values(cause.images).some(Boolean)) // keep if any image is valid
    .slice(0, 6)
    .flatMap((cause, index) => {
        const imageUrls = Object.values(cause.images).filter(Boolean); // grab valid image URLs
        return imageUrls.length ? [{
            id: cause.id || `cause-${index}`,
            image: imageUrls[0], // take first available image
            title: cause.title,
            organization: cause.organization?.name || "Unknown Organization"
        }] : [];
    });

        console.log("Gallery Images", galleryItems);
        console.log("All causesData:", galleryData);
        console.log("All causesData:", galleryData);
        console.log("Eligible causes:", eligibleCauses);
        

    return (
        <section className="wpo-instagram-section s2 section-padding " style={{padding:"20px"}}>
            <div className="container">
                <div className="instagram-wrap">
                <div className="wpo-section-title">
    <span style={{fontSize:"30px"}}>Successfully Crowdfunding and Completed Community Projects by our partners </span>
 
</div>
{loading ? (
  <div className="text-center w-100 py-5">
    <span className="spinner-border " role="status" style={{color:"#00CC99"}} />
    <p className="mt-2">Loading projects...</p>
  </div>
) :  (

                    <div className="row">
                        {galleryItems.map((item) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={item.id}>
                                <div className="instagram-card">
                                    <div className="image" style={{ position: 'relative' }}>
                                        <Link
                                            to={`/projects/${item.id}`} 
                                         

                                            onClick={() => {
                                                window.scrollTo(10, 0);
                                            }}
                                        >
                                            <img
                                                src={item.image}
                                                alt={`Gallery ${item.id}`}
                                                className="img img-responsive"
                                                style={{
                                                    width: "100%",
                                                    height: "250px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
                                                }}
                                                
                                            />
                                            <div className="popup-icon" style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: '24px',
                                                color: '#fff'
                                            }}>
                                                <i className="fa fa-plus"></i>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="text" >
                                      
                                        <h3 style={{
                                            fontSize: "10px",
                                            fontWeight: "600",
                                            marginTop: "5px",
                                            color:"white"
                                           
                                        }}>
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
 )}
                </div>
            </div>

            {modalOpen && (
                <div className="modal" onClick={closeModal} style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <div className="modal-wrap" onClick={(e) => e.stopPropagation()} style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "10px",
                        maxWidth: "90%",
                        maxHeight: "80%",
                        overflow: "auto",
                        position: "relative"
                    }}>
                        <span className="close" onClick={closeModal} style={{
                            position: "absolute",
                            top: "10px",
                            right: "20px",
                            fontSize: "30px",
                            color: "#000",
                            cursor: "pointer"
                        }}>
                            &times;
                        </span>
                        <img src={selectedImage} alt="Modal View" style={{
                            width: "100%",
                            maxHeight: "80vh",
                            objectFit: "contain"
                        }} />
                    </div>
                </div>
            )}
        </section>
    );
};

export default GallerySection;
