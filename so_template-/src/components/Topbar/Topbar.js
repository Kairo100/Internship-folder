import React from 'react'
import { Link } from 'react-router-dom'

const Topbar  = () => {
    return(
        <div className="topbar">
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-md-7 col-sm-12 col-12">
                        <div className="contact-intro">
                            <ul>
                                <li><i className="fa-solid fa-phone"></i> + 252 2 515777</li>
                                <li><i className="fas fa-envelope"></i>    info@sokaab.com</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col col-md-5 col-sm-12 col-12">
                        <div className="contact-info">
                            <ul>
                                <li><a href='https://www.facebook.com/people/Sokaab/100079496871498/#' target='_blank'> <i class="fa-brands fa-square-facebook"></i></a></li>
                                <li><a href='https://x.com/SOKAAB2' target='_blank'><i className="fab fa-x-twitter" target="_blank"></i></a></li>
                                <li><a href='https://www.youtube.com/channel/UCaYsgDii78pi54BMpD5Sevg' target='_blank'><i class="fa-brands fa-youtube"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Topbar;