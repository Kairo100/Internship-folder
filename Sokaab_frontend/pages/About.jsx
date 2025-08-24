export default function About() {
  return (
    
      <div className="About ">
      <div className='hero_img text-white  position-relative'>
      <img
        src="/images/about.jpeg" 
        alt="hero image"
        className='w-100 h-100 object-cover'
      />
    </div>

    {/* Using flexbox to center content */}
   <div className='container pt-5 d-flex justify-content-center fadeInRight '>
   <div className='row  position-absolute top-50 '>
    <div className="text-center ">
      <div className=" text-white " >
        <h1>About</h1>
      </div>
    </div>
    </div>
    
   </div>

   

   
    <div className="container mb-0  ">
      <div className="row d-flex justify-content-between ">
        <div className="col-lg-6 col-12 wow ">
          <h2>Empowering Communities Through Crowdfunding</h2>
          <p>
          At Sokaab, we envision a world where communities lead 
          their own future. As the first Somali-based crowdfunding 
          platform, we empower organizations and individuals to support 
          initiatives across the Somali regions. Our platform enables collective efforts to 
          realize projects that matter to Somalis, from building schools 
          to providing clean water access.
          Join us in creating positive change. Whether it's constructing a new water point, establishing a school, or building a road to enhance trade and security, together, we can make a difference.
          </p>
        </div>
        <div className="col-lg-6 col-12 mb-3">
        <img src='/images/explore.jpeg'  className="w-100 "
        style={{
        borderRadius:"20px",

        }}/>
     
         
        </div>
      </div>
    </div>
      </div>
   
  );
}

// style={{
//   clipPath:"circle(50%)",
//   width:"200px",
//   height:"200px",
//   overflow:"hidden"
// }}


{/* <div 
style={{
  content: '',
  position: "absolute",
  top: "-5px",
  left:" -5px",
  right: "-5px",
  bottom: "-5px",
  border: "5px solid #000",
  borderRadius: "15px",
  pointerEvents: "none",
}}></div> */}
