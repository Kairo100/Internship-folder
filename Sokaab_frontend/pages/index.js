
import styles from '../styles/Home.module.css';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const pathname = usePathname();
   const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  const projects = [
    { id: 1, img: '/images/E1.png', title: 'FENCING OF PRIMARY SCHOOL', by: 'By Community', value: 45000, goal: 15000, raised: 20840, matching: 30000, matchingUsed: 10000, spent: 15454 },
    { id: 2, img: '/images/E2.png', title: 'PROJECT TITLE 2', by: 'By Another Community', value: 30000, goal: 10000, raised: 15000, matching: 15000, matchingUsed: 5000, spent: 8000 },
    { id: 3, img: '/images/E3.png', title: 'PROJECT TITLE 3', by: 'By Some Organization', value: 25000, goal: 8000, raised: 10000, matching: 15000, matchingUsed: 8000, spent: 5000 },
    { id: 4, img: '/images/E4.png', title: 'FENCING OF PRIMARY SCHOOL', by: 'By Community', value: 4500, goal: 1500, raised: 2840, matching: 3000, matchingUsed: 1000, spent: 1454 },
    { id: 5, img: '/images/E5.png', title: 'PROJECT TITLE 2', by: 'By Another Community', value: 3000, goal: 1000, raised: 1500, matching: 1000, matchingUsed: 600, spent: 800 },
    { id: 6, img: '/images/E6.png', title: 'PROJECT TITLE 3', by: 'By Some Organization', value: 25000, goal: 8000, raised: 10000, matching: 15000, matchingUsed: 8000, spent: 5000 },
     ];
  

  const itemsPerPage = 6;
  const displayedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  return (
    <div className='hero mt-5 '>
      
      <div className='hero_img text-white w-100 position-relative'>
        <img
          src="/images/hero_img.jpg" 
          alt="hero image"
          className='w-100 h-100  object-cover'
        />
      </div>

      {/* Using flexbox to center content */}
     <div className='container pt-5 '>
     <div className='row     position-absolute top-50 '>
      <div className=" col-lg-8 col-12 ">
        <div className=" text-white">
          <h5>Give it a chance</h5>
          <h1
          className="fs-1 fs-md-2 fs-lg-1 text-white"
           
          >Let’s build bridges between Somali communities</h1>
          <p>Support a project now and contribute to building a better tomorrow.</p>
          
          <div className='ctaBtn '>
            <Link 
              href="/Explore" 
              className="btn" 
              style={ { color: "white" }  }
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
      </div>
      
     </div>


     <div className='container  '>
    <div className='row d-flex justify-content-center '>
      <div className='col-12 col-md-6 col-lg-3 d-lg-flex d-block text-center align-items-center gap-1 '>
         <h1 className=''>101</h1>
         <p>Funded Projects</p>
      </div>
      <div className='col-12 col-md-6 col-lg-3 d-lg-flex d-block text-center  align-items-center gap-1'>
         <h1 className=''>8.9K</h1>
         <p>Total Backers</p>
      </div>
      <div className='col-12 col-md-6 col-lg-3 d-lg-flex d-block text-center align-items-center gap-1'>
         <h1 className=''>$2M</h1>
         <p> Funds Raised </p>
      </div>
     
      
      </div>
     </div>

     {/* ==explore section== */}
   

     <div className='container pt-5 py-5'>
      <h5 className='text-center' style={{ color: "var(--accent-color)" }}>The latest projects</h5>
      <h2 className='text-center'>Explore Projects</h2>
      <div className='row g-4 pt-3'>
        {displayedProjects.map((project) => (
          <div key={project.id} className='col-12 col-md-6 col-lg-4'>
            <div className='card h-100 shadow-sm'>
            <div className='imgDiv'>
                 <img
                  src={project.img}
                  className='card-img-top card-img'
                  style={{ height: "250px", objectFit: "cover" }}
                  alt={project.title}
                />
               <div
                  className="view-more-overlay d-flex justify-content-center align-items-center">
                  <a
                    className='text-decoration-none text-white border p-2'
                    href={`/${project.id}`}
                  > View More</a>
                </div> 
                  </div>
             
              <div className="card-body">
              <a href={`/${project.id}`} className='text-decoration-none text-dark title-link'>
                   <h5 className="card-title">{project.title}</h5>
                  </a>
                <p className="text-muted">{project.by}</p>
                
                <div style={{ backgroundColor: "#f8f9fa", borderRadius: "10px", padding: "10px" }}>
                  <p><strong>Project Value:</strong> ${project.value.toLocaleString()}</p>
                  <p><strong>${project.raised.toLocaleString()} </strong> ({((project.raised / project.goal) * 100).toFixed(1)}%) raised of <strong>${project.goal.toLocaleString()}</strong> goal</p>
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-color"
                      role="progressbar"
                      style={{ width: `${(project.raised / project.goal) * 100}%` }}
                    ></div>
                  </div>
                  
                  <p><strong>Matching Fund:</strong> ${project.matching.toLocaleString()}</p>
                  {/* <p><strong>${project.matchingUsed.toLocaleString()} </strong> ({((project.matchingUsed / project.matching) * 100).toFixed(1)}%) used from matching fund</p> */}
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${(project.matchingUsed / project.matching) * 100}%` }}
                    ></div>
                  </div>
                  
                  <p><strong>Spent:</strong> ${project.spent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
    </div>
  );
}


