'use client';

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const socialMediaLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Twitter', href: 'https://twitter.com', icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.417-4.20 4.107 4.107 0 001.27 5.477A4.072 4.072 0 012 10.77a4.058 4.058 0 003.3 4.018 4.206 4.206 0 01-1.885.072 4.108 4.108 0 003.831 2.85 8.203 8.203 0 01-4.999 1.72 8.237 8.237 0 01-1.564-.092 11.655 11.655 0 006.304 1.84" />
      </svg>
    )},
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
      </svg>
    )},
    { name: 'Instagram', href: 'https://instagram.com', icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 0C8.74 0 8.333.01 7.035.07c-1.31.06-2.115.24-2.82.51-.71.27-1.34.63-1.95.99-.61.36-1.1.78-1.51 1.22-.41.44-.73.91-1.01 1.45-.28.54-.45 1.1-.51 1.72-.06 1.3-.07 1.71-.07 5.01s.01 3.71.07 5.01c.06.62.23 1.18.51 1.72.28.54.6 1.01 1.01 1.45.41.44.9.83 1.51 1.22.71.37 1.41.63 2.12.91.7.28 1.5.45 2.8.51 1.3.06 1.71.07 5.01.07s3.71-.01 5.01-.07c1.3-.06 2.1-.23 2.8-.51.7-.28 1.3-.63 1.9-.99.6-.36 1.1-.78 1.5-1.22.4-.44.7-.91 1-1.45.28-.54.45-1.1.51-1.72.06-1.3.07-1.71.07-5.01s-.01-3.71-.07-5.01c-.06-1.3-.23-2.1-.51-2.82-.28-.71-.63-1.34-.99-1.95-.36-.61-.78-1.1-1.22-1.51-.44-.41-.91-.73-1.45-1.01-.54-.28-1.1-.45-1.72-.51-1.3-.06-1.71-.07-5.01-.07zm0 1.8c3.2 0 3.58.01 4.85.07 1.1.05 1.75.24 2.1.37.36.13.62.3.85.53.23.23.4.49.53.85.13.35.32 1 .37 2.1.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.1-.24 1.75-.37 2.1-.13.36-.3.62-.53.85-.23.23-.49.4-.85.53-.35.13-1 .32-2.1.37-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.1-.05-1.75-.24-2.1-.37-.36-.13-.62-.3-.85-.53-.23-.23-.4-.49-.53-.85-.13-.35-.32-1-.37-2.1-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.1.24-1.75.37-2.1.13-.36.3-.62.53-.85.23-.23.49-.4.85-.53.35-.13 1-.32 2.1-.37 1.27-.06 1.65-.07 4.85-.07zm0 3.6c-3.45 0-6.25 2.8-6.25 6.25s2.8 6.25 6.25 6.25 6.25-2.8 6.25-6.25-2.8-6.25-6.25-6.25zm0 10.25c-2.23 0-4.05-1.82-4.05-4.05s1.82-4.05 4.05-4.05 4.05 1.82 4.05 4.05-1.82 4.05-4.05 4.05zm6.4-11.8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" clipRule="evenodd" />
      </svg>
    )},
  ];

  return (
    <footer className="bg-primary text-white py-12 md:py-16">
      
      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

        {/* Part 1 */}
        <div className="flex flex-col items-left md:items-start text-left md:text-left md:col-span-2">
     
          <div className="text-3xl font-bold text-white mb-4">Tarmiye</div>
          <p className="text-sm leading-relaxed max-w-md">
            Tarmiye is dedicated to empowering VSLA groups by providing intuitive tools for managing savings, loans, meetings, and insights, fostering financial growth and transparency in communities.
          </p>
        </div>

        {/* Part 2*/}
        <div className="flex flex-col items-left md:items-start text-left md:text-left md:col-span-1">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-secondary transition-colors duration-200 text-base"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Part 3 */}
        <div className="flex flex-col lg:items-center  md:items-start text-left md:text-left md:col-span-1">
          <h3 className="text-xl font-semibold text-white mb-6">Connect With Us</h3>
          <div className="flex  flex-row  space-x-6 mb-8">
            {socialMediaLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-secondary  ml-0   hover:text-white transition-colors duration-200"
                aria-label={social.name}
              >
                {social.icon}
              
              </a>
            ))}
          </div>
         
        </div>
       
      </div>

       <div className='container mx-auto mt-[20px] '>
        <hr/>
         <p className="text-sm text-secondary  mt-[20px] text-center ">
            &copy; {currentYear} Tarmiye. All rights reserved.
          </p>
      </div>
      
    </footer>
  );
};

export default Footer;










