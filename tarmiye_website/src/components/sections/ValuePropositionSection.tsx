'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SectionTitle from '@/components/SectionTitle';

const SmallCircleIcon = () => (
  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 mt-1"></div>
);



// CheckmarkIcon 
const CheckmarkIcon = ({className = "w-[44px] h-[44px] text-primary", fill = "currentColor" }) => (

<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960" 
      fill={fill} 
      className={className} 
    
    >
      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/>
    </svg>


);

// ValuePropositionItem 

interface ValuePropositionItemProps {
  title: string;
  description: string;
  highlightWord: string;
  delay: string; 
}

const ValuePropositionItem: React.FC<ValuePropositionItemProps> = ({
  title,
  description,
  highlightWord,
  delay,
}) => {
  const titleParts = title.split(new RegExp(`(${highlightWord})`, 'gi'));

  return (
    <div className={`flex items-start space-x-4 mb-8 last:mb-0 animate-fade-in-up ${delay}`}>
      <CheckmarkIcon />
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-snug">
          {titleParts.map((part, index) =>
            part.toLowerCase() === highlightWord.toLowerCase() ? (
              <span key={index} className="text-primary">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </h3>
        <p className="text-base md:text-lg text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};


const ValuePropositionSection = () => {
    const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  type AccessOptionType = 'mobile' | 'ussd' | 'dashboard';

interface AccessOption {
  icon: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}


const [activeAccessOption, setActiveAccessOption] = useState<AccessOptionType>('mobile');


const accessOptions = {
  mobile: {
    title: 'Mobile',
    description: 'Manage your savings, loans, and group activities directly from your smartphone with our intuitive mobile application.',
    image: '/images/value4.png',
    buttonText: 'Get the App', 
    buttonLink: '/download-app', 
  },
  ussd: {
    icon: 'mobile_check',
    title: 'USSD',
    description: 'Even without a smartphone, perform essential transactions and check balances using simple USSD codes on any feature phone.',
    image: '/images/tarmiye-ussd-screenshot.png',
    buttonText: 'Learn USSD Codes',
    buttonLink: '/ussd-info', 
  },
 
  dashboard: {
    icon: 'desktop_windows',
    title: 'Dashboard',
    description: 'Organizations and group leaders get a comprehensive overview of all activities, reports, and member data from a powerful web dashboard.',
    image: '/images/tarmiye-admin-dashboard.png',
    buttonText: 'Access Dashboard', 
    buttonLink: '/dashboard-login', 
  },
};
  const currentOption = accessOptions[activeAccessOption];
  

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-6 md:px-8">

        {/* SECTION 1 */}
        <div className="py-20 md:py-24 lg:py-32">
          <SectionTitle mainText="Empower Your Savings," highlightText="Effortlessly" />

          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-20 align-center">
            {/* Left Column */}
          
            
            <div className="lg:w-1/2 flex justify-center items-center animate-fade-in-left">
  <div className="relative w-full max-w-sm md:max-w-md lg:max-w-xs xl:max-w-sm h-[590px] w-[300px] p-2 bg-white rounded-3xl shadow-2xl overflow-hidden
              transform rotate-x-6 rotate-y-6 translate-z-10 perspective-1000 group
              transition-all duration-500 ease-in-out
              hover:rotate-x-0 hover:rotate-y-0 hover:scale-105 hover:shadow-3xl">
    <div className="w-full h-full rounded-2xl overflow-hidden  flex items-center justify-center">
      <Image
        src="/images/value1.png" 
        alt="Tarmiye Savings Illustration"
        width={600} 
        height={1200} 
        priority
        className="w-full h-full " 
      />
    </div>
    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
         style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.1) 0%, transparent 50%)' }}></div>
  </div>
</div>

            {/* Right Column*/}
            <div className="lg:w-3/5 text-center lg:text-left just">
              <ValuePropositionItem
                title="Manage Your Group Easily Together"
                description="Streamline administration, track contributions, and oversee loans with an intuitive platform designed for collective success."
                highlightWord="Together"
                delay="delay-100"
              />
              <ValuePropositionItem
                title="Ensure Full Transparency Always"
                description="Every transaction and record is visible to all members, fostering trust and accountability within your VSLA."
                highlightWord="Always"
                delay="delay-200"
              />
              <ValuePropositionItem
                title="Achieve Collective Goals Faster"
                description="Set shared financial objectives and track progress in real-time, accelerating your community's journey to prosperity."
                highlightWord="Faster"
                delay="delay-300"
              />
            </div>

            
          </div>
        </div>

      

{/* SECTION 2*/}

<div className="py-20 md:py-24 lg:py-32 mb-16 md:mb-20 lg:mb-24">
  <SectionTitle mainText="Accessible Anywhere," highlightText="Always" />

  <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
    {/* Left Column*/}
    <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
        Seamless Access: USSD & Dashboard.
      </h3>
      <p className="text-lg md:text-xl text-gray-700 mb-6">
        Tarmiye ensures universal access through a simple USSD mobile interface and a powerful web dashboard, putting financial control directly in your hands.
      </p>

      <ul className="space-y-4 text-lg md:text-xl text-gray-700 lg:pr-12">
        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 0 24 24"
              width="40px"
              fill="currentColor"
            >
              <path d="M17 1H7C5.9 1 5 1.9 5 3v18c0 1.1 0.9 2 2 2h10c1.1 0 2-0.9 2-2V3c0-1.1-0.9-2-2-2zm0 18H7V5h10v14z" />
            </svg>
          </div>
          <span>Convenient USSD access for basic transactions, anytime, anywhere.</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 0 24 24"
              width="40px"
              fill="currentColor"
            >
              <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
            </svg>
          </div>
          <span>Comprehensive web dashboard for detailed oversight and management.</span>
        </li>
        <li className="flex items-start gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 0 24 24"
              width="40px"
              fill="currentColor"
            >
              <path d="M13 2v8h5l-6 9v-8H7l6-9z" />
            </svg>
          </div>
          <span>Real-time updates across all platforms for informed decisions.</span>
        </li>
      </ul>
    </div>

    {/* Right Column */}
    <div className="lg:w-1/2 flex justify-center items-center animate-fade-in-right delay-200">

      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md aspect-[9/16] h-auto hidden lg:block">
     
        {[
          { src: '/images/value2.png', alt: 'Tarmiye App Screen 1 (Savings)', objectFit: 'cover' }, 
          { src: '/images/value1.png', alt: 'Tarmiye App Screen 2 (Overview)', objectFit: 'cover' },
          { src: '/images/value3.png', alt: 'Tarmiye App Screen 3 (Modal Overlay)', objectFit: 'contain' }, 
        ].map((image, index) => {
          const isHovered = hoveredImageIndex === index;
          const zIndex = isHovered ? 100 : (index + 1); 

          // --- Define responsive static transforms ---
          // These are the transforms for non-hovered state.
          // These classes only apply on md and lg screens,
          // on small screens, these specific transforms are hidden by `hidden lg:block` on the parent div.
          let transformClasses = '';
          let scaleClasses = '';
          let opacityClasses = '';

          // Hover transforms (applied ONLY on large screens and up)
          let hoverTransformClasses = '';
          let hoverScaleClasses = '';
          let hoverOpacityClasses = '';
          let hoverShadowClasses = '';

          // Customize positions, scales, and opacities for each image based on its index
          if (index === 0) { 
            transformClasses = 'md:translate-x-[-10%] md:translate-y-[10%] md:rotate-[-6deg]';
            scaleClasses = 'md:scale-[0.8]';
            opacityClasses = 'md:opacity-80';

            hoverTransformClasses = 'lg:translate-x-0 lg:translate-y-0 lg:rotate-0';
            hoverScaleClasses = 'lg:scale-[1]';
            hoverOpacityClasses = 'lg:opacity-100';
            hoverShadowClasses = 'lg:shadow-2xl';

          } else if (index === 1) { 
            transformClasses = 'md:translate-x-[0%] md:translate-y-[-5%] md:rotate-[2deg]';
            scaleClasses = 'md:scale-[0.9]';
            opacityClasses = 'md:opacity-90';

            hoverTransformClasses = 'lg:translate-x-0 lg:translate-y-0 lg:rotate-0';
            hoverScaleClasses = 'lg:scale-[1]';
            hoverOpacityClasses = 'lg:opacity-100';
            hoverShadowClasses = 'lg:shadow-2xl';

          } else if (index === 2) { 
            transformClasses = 'md:translate-x-[15%] md:translate-y-[10%] md:rotate-[-2deg]';
            scaleClasses = 'md:scale-[0.75]';
            opacityClasses = 'md:opacity-100';

            hoverTransformClasses = 'lg:translate-x-0 lg:translate-y-0 lg:rotate-0';
            hoverScaleClasses = 'lg:scale-[0.8]'; 
            hoverOpacityClasses = 'lg:opacity-100';
            hoverShadowClasses = 'lg:shadow-2xl';
          }

          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-gray-100 rounded-3xl shadow-lg overflow-hidden
                transition-all duration-500 ease-in-out
                ${transformClasses} ${scaleClasses} ${opacityClasses}
                ${isHovered ? `${hoverTransformClasses} ${hoverScaleClasses} ${hoverOpacityClasses} ${hoverShadowClasses}` : ''}
                ${image.objectFit === 'contain' ? 'bg-white border-2 border-gray-100' : ''}
                `}
              style={{ zIndex: zIndex }}
              onMouseEnter={() => setHoveredImageIndex(index)}
              onMouseLeave={() => setHoveredImageIndex(null)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={400}
                height={710}
                className={`w-full h-full ${image.objectFit} rounded-3xl`}
              />
            </div>
          );
        })}
      </div>

    
      <div className="block lg:hidden w-full max-w-sm md:max-w-md"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
         
              <div className="w-full max-w-xs md:max-w-sm rounded-3xl shadow-xl overflow-hidden">
                  <Image
                      src="/images/value3.png"
                      alt="Tarmiye App Mobile Screenshot 1"
                      width={400}
                      height={710}
                      className="w-full h-full object-cover rounded-3xl"
                  />
              </div>
              
          </div>
      </div>

    </div>
  </div>
</div>
        {/* SECTION 3 */}
        
        <div className="py-20 md:py-24 lg:py-32">
          <SectionTitle mainText="Building Resilient Communities," highlightText="Everywhere" />

          {/* Block 1 */}
          <div className="text-center mb-16 md:mb-20 max-w-4xl mx-auto animate-fade-in-up">
           
            <p className="text-lg md:text-xl text-gray-700">
              Tarmiye VSLA goes beyond technology, fostering a culture of financial literacy and collective responsibility. We believe in empowering local leaders and members to build self-sustaining economies that uplift their entire community. Our platform is a tool, but the true strength lies in the hands of the people.
            </p>
          </div>

          {/* Block 2*/}
          <div className="flex justify-center items-center animate-fade-in-up delay-200">
            <div className="w-full max-w-2xl lg:max-w-3xl lg:p-10  h-auto aspect-video bg-gray-200 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/images/value4.png"
                alt="Community Impact"
                width={900}
                height={500}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4*/}
        <div className="py-20 md:py-24 md:py-32 bg-white p-10  rounded-lg">
          <SectionTitle mainText="Choose Your Access," highlightText="Your Way" />
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ">
            {/* Left Column */}
            <div className="lg:w-3/5 flex flex-col items-left justify-center gap-2  lg:text-left animate-fade-in-left">
              <div className="w-full max-w-md md:max-w-lg lg:max-w-full h-auto lg:h-[350px] lg:w-[600px] rounded-xl shadow-lg flex items-center justify-center overflow-hidden mb-8 transform transition-transform duration-500 ease-in-out hover:scale-105">
                <Image
                  key={currentOption.image}
                  src={currentOption.image}
                  alt={currentOption.title}
                  width={600}
                  height={350}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl text-start md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
                {currentOption.title}
              </h3>
              <p className="text-lg md:text-xl text-gray-700 max-w-xl">
                {currentOption.description}
              </p>
               {currentOption.buttonText && currentOption.buttonLink && (
    <a
      href={currentOption.buttonLink}
      className="inline-block px-6 py-3 w-[200px] bg-secondary hover:bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300"
    >
      {currentOption.buttonText}
    </a>
  )}
            </div>

            {/* Right Column  */}
     
<div className="md:w-2/5 flex flex-row md:flex-col justify-center  lg:border-l-2  border-l-0  gap-1 md:gap-4 md:flex-col lg:space-y-6 order-first md:order-none lg:order-none">
 

  {(Object.entries(accessOptions) as [AccessOptionType, AccessOption][]).map(
  ([key, option], index) => (
    <button
      key={key}
      onClick={() => setActiveAccessOption(key)}
      className={`group flex flex-col lg:flex-row items-center py-3 px-4 transition-all duration-300 
        ${activeAccessOption === key
          ? 'bg-white lg:border-l-4 lg:border-b-0 border-b-4 border-secondary'
          : 'bg-white'}
        animate-fade-in-right delay-${index * 100}`}
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center hover:text-white justify-center transition-colors duration-300 mr-4
          ${activeAccessOption === key
            ? 'bg-secondary text-white'
            : 'bg-white border border-gray-200 text-secondary group-hover:bg-primary hover:text-white'}`}
      >
        <span className="material-symbols-outlined text-2xl">
          {option.icon}
        </span>
      </div>
      <h4
        className={`text-xl font-bold 
          ${activeAccessOption === key
            ? 'text-secondary'
            : 'text-gray-500 group-hover:text-primary transition-colors duration-300'}`}
      >
        {option.title}
      </h4>
    </button>
  )
)}

  
</div>
          </div>
        </div>
      </div>
    </section>



  );
};

export default ValuePropositionSection;