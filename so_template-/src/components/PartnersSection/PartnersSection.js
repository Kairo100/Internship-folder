import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import pImg1 from "../../images/partners/IOM.jpg";
import pImg2 from "../../images/partners/DRC.webp";
import pImg3 from "../../images/partners/care.png";

const PartnersSection = () => {

    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <section className="wpo-partners-section" style={{  padding: '10px 0 0 0 ', marginBottom:"0"  }}>
            <div className="container text-center mb-0">
               
                          <div className="wpo-section-title">
    <span style={{ fontSize: '32px', marginBottom: '10px', display:"block" }}>Our Partners</span>
 
</div>
                <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                    These are the trusted organizations and institutions SOKAAB collaborates with to support grassroots initiatives and community-led projects across Somalia.
                </p>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="partner-grids partners-slider" >
                            <Slider {...settings}>
                                <div className="grid">
                                    <img src={pImg1} alt="IOM" style={{weight:"189px", height:"60px"}}/>
                                </div>
                                <div className="grid" >
                                    <img src={pImg2} alt="DRC" style={{weight:"189px", height:"60px"}} />
                                </div>
                                <div className="grid" >
                                    <img src={pImg3} alt="CARE" style={{weight:"189px", height:"60px"}} />
                                </div>
                              
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
