import React from 'react';
import SectionTitle from '../SectionTitle/SectionTitle';

const featuresData = [
    {
        
        iconClass: 'fa-users',
        title: 'Community-Led Development',
        description: 'Sokaab empowers Somali communities to identify and fund their own development projects, ensuring that decisions are made by those most affected. This approach fosters ownership and sustainable impact.'
    },
    {
      
        iconClass: 'fa-hand-holding-heart',
        title: 'Transparent  Crowdfunding',
        description: 'Support campaigns that address community needs like education, healthcare, and infrastructurThe platform emphasizes transparency by providing regular updates on how funds are spent, allowing donors to track the progress and impact of their contributions.'
    },
    {
        iconClass: 'fa-hands-helping',
        title: 'Partnerships for Matching Funds',
        description: 'Through collaborations with organizations like the Danish Refugee Council and the Somali Stability Fund, Sokaab offers matching funds to community projects, amplifying the impact of local initiatives.'
    }
];

const FeatureSection = () => {
    return (
        <section className="wpo-features-area">
            <div className="container">
                
                <div className="features-wrap">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-12 col-12">
                    <SectionTitle subtitle="" title="Your Support Creates Lasting Change." />

                    </div>
                    </div>
                    <div className="row">
                   
                        {featuresData.map((feature, index) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={index}>
                                <div className="feature-item-wrap">
                                    <div className="feature-item">
                                        
                                        <div className="feature-text">
                                        <div className="feature-icon">
                                            <div className="icon">
                                                <i className={`fi fa-solid ${feature.iconClass}`}></i>
                                            </div>
                                        </div>
                                            <h2>{feature.title}</h2>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeatureSection;
