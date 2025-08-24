import React from "react";
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from "swiper";
// import HeroSlide1 from "../../images/slider/1.png"
// import HeroSlide1 from "../../images/slider/4.jpg"
import HeroSlide1 from "../../images/slider/7.jpg"
// import HeroSlide2 from "../../images/slider/2.png"
import HeroSlide3 from "../../images/slider/9.jpg"
// import HeroSlide3 from "../../images/slider/3.png"
// import HeroSlide3 from "../../images/slider/6.jpg"
import HeroSlide2 from "../../images/slider/8.jpg"


const Hero3 = () => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }
   
  
    return (
        <section className="static-hero-s3  mb-5">
              <Swiper
                modules={[Autoplay,Navigation, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={2500}
                parallax={true}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 10000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                }}
                className=""
            >
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide1})`,height:"80vh" }}></div>
                </SwiperSlide>
            
                <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide2})`,height:"80vh" }}></div>
                </SwiperSlide>
             <SwiperSlide>
                    <div className="slide-inner slide-bg-image" style={{ backgroundImage: `url(${HeroSlide3})`,height:"80vh" }}></div>
                </SwiperSlide>
                ...
            </Swiper>
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            
                            <div className="slide-title">
                                <h2>Let’s build bridges between Somali communities</h2>
                            </div>
                            <div className="slide-text">
                                <p>Support a project now and contribute to a better tomorrow.</p>
                            </div>
                            <div className="hero-btn">
                                <Link onClick={ClickHandler} to="/projects" className="theme-btn">Explore Our Projects</Link>
                                         
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </section>


    )
}

export default Hero3;



