import React from 'react';
import SectionTitle from '@/components/SectionTitle';
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
const ContactPage = () => {
  return (
    <div className="mt-5 lg:mt-0 min-h-screen bg-gray-50 font-sans">
      <div className="relative py-16 md:py-24 bg-gradient-to-br from-white to-blue-50/50 overflow-hidden">
       
        <div className="absolute inset-0 z-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a0aec0\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34.225V42h-4V34.225zM42 36v4h-4v-4zM54 0v6h-6V0zM42 24v6h-6v-6zM36 0v6h-6V0zM24 42v6h-6v-6zM12 24v6H6v-6zM0 36v6h-6v-6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px',
        }}></div>

        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* First Div */}
            <div className="flex flex-col justify-start lg:pr-12">
   
              <div className="mb-12">
                
            
                <SectionTitle mainText="Get in" highlightText="touch" alignment="left" />
                <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed mt-4">
                  we are just a call/email away. Feel free to call or send in your queries. Our customer support team will assist you anytime, any day.
                </p>
              </div>

         
              <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact us at</h2>
                <div className="flex flex-col sm:flex-row gap-4">
               
                  <a
                    href="tel:7777"
                    className="flex items-center justify-center bg-secondary text-white px-6 py-3 rounded font-semibold text-lg
                               transition-all duration-300 hover:bg-opacity-80 shadow-md hover:shadow-lg focus:outline-none focus:ring-2  focus:ring-opacity-75"
                  >
                    <span className="material-symbols-outlined mr-2">call</span>
                    7777
                  </a>
              
                  <a
                    href="mailto:INFO@GETSAVE.IO"
                    className="flex items-center justify-center bg-secondary bg-opacity-20 text-secondary px-6 py-3 rounded font-semibold text-lg
                               transition-all duration-300  shadow-md hover:shadow-lg focus:outline-none focus:ring-2   focus:ring-opacity-75"
                  >
                    <span className="material-symbols-outlined mr-2">info</span>
                    INFO@GETSAVE.IO
                  </a>
                </div>
                <div className='mt-10'>
                     <h2 className="text-2xl font-bold text-gray-900 ">Our social media</h2>
               <div className="flex flex-col   ">
          <h3 className="text-xl font-semibold text-white">Connect With Us</h3>
          <div className="flex  flex-row  space-x-6 mb-8">
            {socialMediaLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-secondary  ml-0   hover:text-primary  transition-colors duration-200"
                aria-label={social.name}
              >
                {social.icon}
              
              </a>
            ))}
          </div>
         
        </div>
                </div>
              </div>

          
        
            </div>

            {/* Second Div */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 lg:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
              <p className="text-gray-700 mb-8 leading-relaxed">
                You can fill out this customer query form below and our customer support will get back to you after submission.
              </p>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Ahmed Cabdi"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="ahmed.doe@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Inquiry about..."
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary  text-white px-6 py-3 rounded-lg font-semibold text-lg
                             transition-all duration-300 hover:bg-primary  shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
