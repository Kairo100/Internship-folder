'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import SectionTitle from '../SectionTitle';

const HowItWorksSection = () => {
  const router = useRouter();
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number | null>(null);
  const [activeClickIndex, setActiveClickIndex] = useState<number | null>(null);

  const [isSmallScreen, setIsSmallScreen] = useState(false); 
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); 
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const howItWorksSteps = [
    {
      title: "Register Your Group",
      details: "Easily set up your VSLA group, add members, and define roles. Our platform guides you through every step of the registration process.",
      link: "/how-it-works#register",
      pinPosition: { x: 100, y: 230 },
      pinPositionSmall: { x: 150, y: 80 },
      color: 'bg-secondary',
      icon: 'group_add'
    },
    {
      title: "Track Savings & Loans",
      details: "Record all financial transactions, including member savings contributions and loan disbursements, with real-time updates and clear records.",
      link: "/how-it-works#track",
      pinPosition: { x: 300, y: 265 },
      pinPositionSmall: { x: 250, y: 200 },
      color: 'bg-secondary',
      icon: 'currency_exchange'
    },
    {
      title: "Manage Meetings & Decisions",
      details: "Facilitate group meetings, record attendance, and document collective decisions, ensuring full transparency and accountability.",
      link: "/how-it-works#manage",
      pinPosition: { x: 500, y: 250 },
      pinPositionSmall: { x: 150, y: 340 },
      color: 'bg-secondary',
      icon: 'meeting_room'
    },
    {
      title: "Generate Reports & Insights",
      details: "Access comprehensive financial reports, analyze group performance, and gain insights to make informed decisions for collective growth.",
      link: "/how-it-works#reports",
      pinPosition: { x: 700, y: 280 },
      pinPositionSmall: { x: 250, y: 480 },
      color: 'bg-secondary',
      icon: 'analytics'
    },
    {
      title: "Expand & Grow",
      details: "Utilize insights to expand your group's reach and impact, fostering sustainable community development.",
      link: "/how-it-works#expand",
      pinPosition: { x: 980, y: 250 },
      pinPositionSmall: { x: 150, y: 620 },
      color: 'bg-secondary',
      icon: 'trending_up'
    }
  ];
  const handleStepClick = (index: number) => {
    if (isSmallScreen) {
      setActiveClickIndex(activeClickIndex === index ? null : index); 
    } else {
      // For larger screens, navigate directly on click
      router.push(howItWorksSteps[index].link);
    }
  };

  return (
    <section className="w-full py-20 md:py-24 lg:py-32 overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-8">
        <SectionTitle mainText="How Tarmiye" highlightText="Works" />
        <p className="text-center text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
          Follow our streamlined process to empower your VSLA group with efficiency and transparency.
        </p>

        {/* Conditional rendering for Roadmap vs. Step Divs */}
        {isSmallScreen ? (
          <div className="flex flex-col items-center gap-8 mt-10 md:hidden"> 
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="w-full max-w-sm rounded-lg shadow-md overflow-hidden bg-white cursor-pointer"
                onClick={() => handleStepClick(index)} 
              >
                <div className="p-4 flex items-center gap-4">
                
                  <div className={`flex-shrink-0 w-12 h-12 ${step.color} rounded-full flex flex-col items-center justify-center text-white font-bold shadow-md`}>
                    <span className="material-symbols-outlined text-xl mb-1">{step.icon}</span>
                  
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                  
                </div>

                {/* Step Details Card */}
                <div
                  className={`px-4 pb-4 transition-all duration-300 ease-in-out ${
                    activeClickIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-sm text-gray-600 mb-4    flex flex-col  text-center items-center   gab-3   mb-2">
                      <span className="text-xs font-semibold text-sm  w-[20px] h-[20px] font-semibold text-secondary ">{index + 1}</span>
                    {step.details}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      router.push(step.link); 
                    }}
                    className={`w-full py-2 rounded-md text-white font-semibold transition-colors duration-200 bg-secondary  hover:bg-primary  `}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Large Screen: Display Roadmap
          <div className="relative mt-[-15%] w-full aspect-[3/4] max-w-full mx-auto my-20 md:aspect-[3/1] lg:aspect-[3.5/1] min-h-[300px] md:min-h-[900px] hidden md:block mb-[-20%]"> {/* hidden md:block ensures this is hidden on small screens */}
            {/* The "Road" SVG */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7E297F" />
                  <stop offset="100%" stopColor="#7E297F" />
                </linearGradient>
              </defs>
              <path
                d={"M 50 250 C 120 280, 200 150, 280 200 S 450 350, 550 250 C 650 150, 700 300, 780 200 S 900 100, 950 250"}
                fill="none"
                stroke="url(#roadGradient)"
                strokeWidth="40"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dashed line markings */}
              <path
                d={"M 50 250 C 120 280, 200 150, 280 200 S 450 350, 550 250 C 650 150, 700 300, 780 200 S 900 100, 950 250"}
                fill="none"
                stroke="#fff"
                strokeWidth="9"
                strokeDasharray="15 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Roadmap Pins for Large Screens */}
            {howItWorksSteps.map((step, index:number) => (
              <div
                key={index}
                className="absolute cursor-pointer transition-transform duration-300 ease-in-out z-10"
                style={{
                  left: `${(step.pinPosition.x / 1000) * 100}%`,
                  top: `${(step.pinPosition.y / 700) * 100}%`, 
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setHoveredStepIndex(index)}
                onMouseLeave={() => setHoveredStepIndex(null)}
                onClick={() => handleStepClick(index)} 
              >
                {/* Pin Icon  */}
                <div className={`relative w-16 h-16 ${step.color} rounded-full flex flex-col items-center justify-center text-white font-bold shadow-md
                                 transform transition-all duration-300
                                 ${hoveredStepIndex === index ? 'scale-110 shadow-lg' : ''}`}>
                  <span className="material-symbols-outlined text-2xl mb-1">{step.icon}</span>
                 
                </div>

                {/* Step Details Card for LARGE SCREENS  */}
                <div
                  className={`absolute p-4 rounded-lg shadow-xl border border-gray-200 bg-white w-56 text-center transform -translate-x-1/2 mt-4
                                   transition-all duration-300 ease-in-out origin-top
                                   ${hoveredStepIndex === index ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
                                   `}
                  style={{ left: '50%', top: '100%' }}
                >
                  <h4 className="text-lg flex flex-col  text-center items-center   gab-3  font-bold text-secondary  mb-2">
                     <span className="text-sm  w-[20px] h-[20px] font-semibold text-white rounded-full   bg-secondary ">{index + 1}</span>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorksSection;