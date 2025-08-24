'use client'; 

import React from 'react';
import Image from 'next/image'; 
import Link from 'next/link';
import HeroSvg from '../ui/HeroSvg'; 

const Hero = () => {
  return (
    <section className="mt-5 lg:mt-0  relative w-full min-h-[100vh] flex items-center overflow-hidden py-16 md:py-20 lg:py-24 bg-gradient-to-br from-purple-50 via-white to-white">
   
      <div className="container mx-auto px-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-24 z-10">

        {/* Left Div*/}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-3/5 xl:w-3/5 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6 tracking-tight animate-fade-in-up">
        
             Smart Savings for Thriving Communities.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg md:max-w-xl animate-fade-in-up delay-200">
            Tarmiye VSLA provides a robust and intuitive platform for managing Village Savings and Loan Associations, fostering financial inclusion, transparency, and sustainable community development in Somalia.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
            <Link href="/about" passHref>
              <button className="w-64 py-3 rounded-lg bg-secondary text-white font-bold text-lg hover:bg-primary transition-all duration-300 shadow-lg transform hover:scale-105">
                Join Us
              </button>
            </Link>
          
          </div>
        </div>

        {/* Right Div */}
        <div className="relative lg:w-2/5 xl:w-2/5 flex justify-center items-center z-0 animate-fade-in-right">
         
          <HeroSvg /> 
        </div>
      </div>
    </section>
  );
};

export default Hero;