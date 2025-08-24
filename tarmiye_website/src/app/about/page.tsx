'use client';

import React from 'react';
import SectionTitle from '@/components/SectionTitle';

const About = () => {
  return (
    <div className="mt-5 lg:mt-0 min-h-screen bg-gray-50">
      {/* Custom Keyframe Animations */}
      <style jsx>{`
        @keyframes pulse-custom {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.9; }
        }
        .animate-pulse-custom {
          animation: pulse-custom 2.5s ease-in-out infinite;
        }
        /* Removed .animate-float, .circle-container, .circle-item CSS */
      `}</style>

      {/* Section 1 */}
      <section className="py-16 md:py-24 bg-white text-center">
        <div className="container mx-auto px-6 md:px-8">
        
          <SectionTitle mainText="About" highlightText="Tarmiye" />
          <div className="mb-12 flex justify-center">
           
            <img
              src="images/imageCard.png" 
              alt="Tarmiye Vsla"
              className="rounded-lg shadow-xl lg:max-w-full w-[90%] h-auto object-cover animate-pulse-custom"
              style={{ maxWidth: '800px' }}
            />
          </div>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            At Tarmiye, we believe in the power of community and collective effort. Our platform is designed to empower Village Savings and Loan Associations (VSLAs) by providing robust, easy-to-use digital tools that streamline financial management, enhance transparency, and foster sustainable growth within local communities. We are committed to bridging the gap between traditional savings groups and modern technology, ensuring financial inclusion for all.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center md:justify-between gap-12">
       
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <img
              src="images/value4.png"
              alt="tarmiye Vsla"
              className="rounded-lg shadow-xl max-w-full h-auto object-cover"
            />
          </div>
         
          <div className="w-full md:w-1/2 text-center md:text-left">
            
            <SectionTitle mainText="Our" highlightText="Mission" alignment="left" />
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Our mission is to democratize financial tools, making them accessible and understandable for every VSLA member. We strive to enhance operational efficiency, reduce manual errors, and provide real-time financial insights, enabling groups to make informed decisions that drive their economic empowerment and community development. We envision a future where every community has the tools to achieve financial independence.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3*/}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8 flex flex-col md:flex-row-reverse items-center md:justify-between gap-12">
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end flex-wrap gap-6">
    
            {[
              { src: "images/value1.png", alt: "Image 1", size: "w-48 h-48" },
              { src: "images/value2.png", alt: "Image 2", size: "w-36 h-36" }, 
              { src: "images/value3.png", alt: "Image 3", size: "w-64 h-48" }, 
              ].map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className={`${image.size} rounded-lg shadow-xl object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl`}
              />
            ))}
          </div>
        
          <div className="w-full md:w-1/2 text-center md:text-left">
            <SectionTitle mainText="Our" highlightText="Values" alignment="left" />
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Our core values guide every aspect of Tarmiye. We prioritize **transparency** in all financial dealings, ensuring trust among members. **Inclusivity** drives us to reach every community, regardless of their technological proficiency. We are committed to **innovation**, continuously improving our platform to meet evolving needs. Above all, we value **empowerment**, equipping VSLAs with the tools to take control of their financial futures and thrive independently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
