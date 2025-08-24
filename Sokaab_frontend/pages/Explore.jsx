import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Explore() {
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
    { id: 7, img: '/images/E7.png', title: 'COMMUNITY WATER SUPPLY', by: 'By Local Group', value: 50000, goal: 20000, raised: 25000, matching: 20000, matchingUsed: 12000, spent: 18000 },
    { id: 8, img: '/images/E8.png', title: 'VILLAGE ROAD REPAIR', by: 'By Municipality', value: 60000, goal: 25000, raised: 27000, matching: 20000, matchingUsed: 15000, spent: 23000 },
    { id: 9, img: '/images/E9.png', title: 'SOLAR PANEL INSTALLATION', by: 'By Environmental Group', value: 55000, goal: 18000, raised: 19000, matching: 25000, matchingUsed: 14000, spent: 17000 },
    { id: 10, img: '/images/E10.png', title: 'COMMUNITY LIBRARY', by: 'By Education Initiative', value: 40000, goal: 15000, raised: 16000, matching: 15000, matchingUsed: 8000, spent: 12000 },
    { id: 11, img: '/images/E11.png', title: 'PUBLIC PARK RENOVATION', by: 'By Local Residents', value: 45000, goal: 20000, raised: 19000, matching: 20000, matchingUsed: 9000, spent: 16000 },
    { id: 12, img: '/images/E12.png', title: 'FLOOD RELIEF SUPPORT', by: 'By Humanitarian Aid', value: 70000, goal: 30000, raised: 32000, matching: 35000, matchingUsed: 20000, spent: 25000 },
  ];
  

  const itemsPerPage = 6;
  const displayedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  return (
    <div className='hero mt-5 '>
       <div className='hero_img text-white position-relative'>
       <img
        src="/images/explore.jpeg"
         alt="hero image"
          className='w-100 h-100 object-cover'
        />
      </div>

      <div className='container pt-5 d-flex justify-content-center'>
        <div className='row position-absolute top-50'>
          <div className="text-center">
            <div className="text-white">
              <h1>Explore</h1>
            </div>
          </div>
        </div>
      </div>
    <div className='container pt-5 py-5'>
      <h5 className='text-center' style={{ color: "var(--accent-color)" }}>The latest projects</h5>
      <h2 className='text-center'>Explore Projects</h2>
      <div className='row g-4 pt-3'>
        {displayedProjects.map((project) => (
          <div key={project.id} className='col-12 col-md-6 col-lg-4'>
            <div className='card h-100 shadow-md'>
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

    
       {/* Pagination */}
      <nav className='d-flex justify-content-center pt-4'>
        <ul className="pagination ">
          {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item  ${currentPage === index + 1 ? 'active  ' : ''}`}  >
                <button className="page-link text-white "
                 onClick={() => handlePageChange(index + 1)}
                 style={{
                
                 }}
                 onMouseEnter={(e) => (e.target.style.color = 'black')}
                 >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
    </div>
    </div>
  );
}
