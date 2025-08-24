export default function Contact() {
  return (
    <div className="About">
     
      <div className="hero_img text-white position-relative">
        <img
          src="/images/about.jpeg"
          alt="hero image"
          className="w-100 h-100 object-cover"
        />
      </div>

      
      <div className="container pt-5 d-flex justify-content-center">
        <div className="row position-absolute top-50">
          <div className="text-center">
            <div className="text-white">
              <h1>Contact Us</h1>
            </div>
          </div>
        </div>
      </div>

     
      <div className="container py-5">
        <h2 className="text-center mb-4">We'd love to hear from you</h2>
        
        
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <form>
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

             
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

            
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="Enter your phone number"
                />
              </div>

            
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>

             
              <div className="text-center">
                <button type="submit" className="btn  text-white px-5">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
