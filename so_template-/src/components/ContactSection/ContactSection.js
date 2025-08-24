import React, { useState } from 'react';
import ContactForm from '../ContactFrom/ContactForm';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'



const ContactSection = () => {

    const containerStyle = {
        width: '100%',
        height: '450px',
        borderRadius: '10px',
        overflow: 'hidden',
      };
      
      const center = {
        // lat: 9.5587586,
        lat: 9.5525625,
        // lng: 44.0371955,
        lng: 44.0468125,
      };
      
     
    return (
        <section className="wpo-contact-pg-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col col-lg-10 offset-lg-1">
                        {/* <div className="office-info">
                            <div className="row">
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                              <i className="fa-solid fa-location-dot"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Our Office</h2>
                                          
                                            <p>Hargeisa, Somaliland</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                                <i className="fa-solid fa-envelope"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Contact Us</h2>
                                            <p>info@sokaab.com</p>
                                         
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-xl-4 col-lg-6 col-md-6 col-12">
                                    <div className="office-info-item">
                                        <div className="office-info-icon">
                                            <div className="icon">
                                               <i className="fa-solid fa-phone"></i>
                                            </div>
                                        </div>
                                        <div className="office-info-text">
                                            <h2>Call Us</h2>
                                            <p>+ 252 2 515777</p>
                                          
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="wpo-contact-title">
                            <h2>Have Any Questions?</h2>
                            <p>If you're interested in supporting a project, becoming a partner, or just want to learn more about Sokaab, feel free to reach out. We’re here to help.</p>
                        </div>
                        <div className="wpo-contact-form-area">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
           
            <section className="wpo-contact-map-section">
    <div className="wpo-contact-map">
    
    <LoadScript googleMapsApiKey='AIzaSyDHWxSF9jr3slziO8KaeaFk4AHlJ4SuOyc'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
    </div>
</section>

        </section>
    );
}

export default ContactSection;
