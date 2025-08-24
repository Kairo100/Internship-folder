'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="relative text-black text-lg font-medium transition-all duration-300 group text-primary text-bolder
             hover:text-secondary after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300
             hover:after:w-full isolate"
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="text-white text-xl font-medium py-2 w-full hover:text-secondary transition-colors duration-300"
    onClick={() => { /* Add logic to close mobile menu if needed */ }}
  >
    {children}
  </Link>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => {
    document.body.style.overflow = '';
  };
}, [mobileMenuOpen]);


  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 md:py-6
        ${scrolled
          ? 'bg-white bg-opacity-100  shadow-lg' 
          : 'bg-transparent'
        }`}

    
    >
      <nav className="container mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Left side: Logo */}
        <div className="flex-shrink-0">
         <Link href="/" className="inline-block"> 
          <Image
            src="/images/logo2.png" 
            alt="Tarmiye Logo"     
            width={200}             
            height={100}          
             priority               
             />
         </Link>
        </div>

        {/* Right side*/}
        <div className="hidden md:flex items-center space-x-10"> 
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/how-it-works">How it Works</NavLink>
          <NavLink href="/contact">Contact</NavLink>
         <Link href={`${baseUrl}/auth/login`} > <button className="px-7 py-2.5 rounded-md bg-secondary  text-white font-bold text-lg hover:from-primary hover:to-secondary transition-all duration-300 shadow-md hover:bg-primary">
            Login
          </button></Link>
        </div>

        {/* Mobile menu button  */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary hover:text-secondary focus:outline-none p-2 rounded-md transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <span className="material-symbols-outlined text-4xl">close</span> 
            ) : (
              <span className="material-symbols-outlined text-4xl">menu</span>

            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu content */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-primary text-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100]
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-8 pt-16 flex flex-col items-start space-y-6"> 
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-secondary focus:outline-none p-2 rounded-md transition-colors duration-300"
            aria-label="Close mobile menu"
          >
            <span className="material-symbols-outlined text-4xl">close</span> 
          </button>
          <MobileNavLink href="/">Home</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/how-it-works">How it Works</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
          <MobileNavLink  href="/">
            Login
          </MobileNavLink>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;