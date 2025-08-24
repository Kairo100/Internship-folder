'use client';

import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';

const HowItWorksPage = () => {
  const steps = [
    {
      title: "Register Your Group",
      description:
        "Easily set up your VSLA group, add members, and define their roles. Our interface guides you step-by-step for accurate registration.",
      image: "https://placehold.co/1000x600/F0F4F8/3B82F6?text=Register",
    },
    {
      title: "Track Savings & Loans",
      description:
        "Record financial transactions, including savings contributions, loan disbursements, and repayments with real-time updates.",
      image: "https://placehold.co/1000x600/E0F2F7/06B6D4?text=Track",
    },
    {
      title: "Manage Meetings",
      description:
        "Facilitate group meetings, track attendance, and document decisions for full transparency and historical record-keeping.",
      image: "https://placehold.co/1000x600/FFF7ED/F97316?text=Manage",
    },
    {
      title: "Generate Insights",
      description:
        "Access detailed financial reports and analytics to make informed decisions about your group’s future.",
      image: "https://placehold.co/1000x600/F5F3FF/8B5CF6?text=Insights",
    },
    {
      title: "Expand & Grow",
      description:
        "Leverage insights to expand your VSLA’s impact, visualize growth trends, and plan sustainable community initiatives.",
      image: "https://placehold.co/1000x600/ECFDF5/10B981?text=Expand",
    },
  ];


  const [activeIndex, setActiveIndex] = useState(0);
const sectionRefs = useRef<(HTMLElement | null)[]>([]);



  // Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
       entries.forEach((entry) => {
  if (entry.isIntersecting) {
      const target = entry.target as HTMLElement;
        const index = Number(target.dataset.index);

    setActiveIndex(index);
  }
});

      },
      { threshold: 0.5 } // Adjust sensitivity
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  

  const scrollToSection = (index: number) => {
  const section = sectionRefs.current[index];
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};


  return (
    <div className="mt-5 lg:mt-0 bg-white min-h-screen mb-20">
      {/* Hero Section */}
      <section className="py-20 bg-white ">
        <div className="container mx-auto px-6 lg:px-16 ">
          
           <SectionTitle mainText="How Tarmiye" highlightText="Works" />
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-[-3%]">
            Discover the simple yet powerful steps to manage your VSLA group efficiently.
            Our process is designed for clarity and effectiveness.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 lg:sticky top-24 self-start ">
          <nav>
            <ol className="space-y-6 border-l-2 border-gray-200">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`cursor-pointer pl-6 relative ${
                    activeIndex === index ? 'text-primary font-semibold' : 'text-gray-600'
                  }`}
                  onClick={() => scrollToSection(index)}
                >
                  <span
                    className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${activeIndex === index ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {index + 1}
                  </span>
                  {step.title}
                </li>
              ))}
            </ol>
          </nav>
        </aside>


        
        


        {/* Steps Content */}
        <div className="lg:w-3/4 space-y-32">
          {steps.map((step, index) => (
            <section
              key={index}
              data-index={index}
            ref={(el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  }}
              className="scroll-mt-32"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{step.title}</h2>
              <p className="text-lg text-gray-700 mb-6">{step.description}</p>
              <img
                src={step.image}
                alt={step.title}
                className="rounded-xl shadow-md w-full"
              />
            </section>
          ))}


          
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
