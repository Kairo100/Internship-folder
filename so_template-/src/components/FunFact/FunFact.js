import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useProjects } from '../../api/ProjectsContext';



const FunFact = (props) => {
const {DataSta } = useProjects();
const totalProjects = DataSta.totalProjects;
const totalFundRaised = DataSta.fundRaised;
const totalMatchingFund = DataSta.matchingFunds;
const totalBackers = DataSta.backers;
const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num;
};
if ( !DataSta || Object.keys(DataSta).length === 0) {
    return (
      <section className="section-padding text-center">
    
    <div className="text-center w-100 py-5">
    <span className="spinner-border " role="status" style={{color:"#00CC99"}} />
    <p className="mt-2">Loading stat...</p>
  </div>
        
      </section>
    );
  }
  

    return (
        <section className={"section-padding " + props.hclass}>
            <div className="container">
                <div className="fun-fact-wrap">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3>
                                    <span>
                                        <CountUp end={totalProjects} enableScrollSpy formattingFn={formatNumber} />
                                    </span>
                                </h3>
                                <div><p>Projects</p></div>
                            </div>
                            
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3>
                                    <span>
                                        <CountUp
                                            end={totalFundRaised}
                                            enableScrollSpy
                                            formattingFn={formatNumber}
                                        />
                                    </span>
                                </h3>
                                <div><p>Fund Raised</p></div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3>
                                    <span>
                                        <CountUp
                                            end={totalMatchingFund}
                                            enableScrollSpy
                                            formattingFn={formatNumber}
                                        />
                                    </span>
                                </h3>
                                <div><p>Matching Fund</p></div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                            <div className="info">
                                <h3>
                                    <span>
                                        <CountUp end={totalBackers} enableScrollSpy  formattingFn={formatNumber}/>
                                    </span>
                                </h3>
                               <div> <p>Backers</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FunFact;
