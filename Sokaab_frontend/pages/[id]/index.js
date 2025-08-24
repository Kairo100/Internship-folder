import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from "next/link";

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("story");

  useEffect(() => {
    if (id) {
      
      const projectData = [
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

      const selectedProject = projectData.find((project) => project.id === parseInt(id));
      setProject(selectedProject);
    }
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mt-5 pt-3">
   


    <div className=" py-5">
      <div className="row ">
      
        <div className="col-lg-8 col-md-12 col-12 mb-1">
          <img
            src={project.img}
            alt={project.title}
            className="rounded-lg "
            style={{ objectFit: 'cover', height: '100%', width:"100%" }} 
          />
        </div>

    
        <div className="col-lg-4 col-12 col-md-12 mb-4">
          <div className="card shadow-sm border-light">
           
            <div className="card-body ">
  <h3 className="text-uppercase text-dark font-weight-bold mb-4">{project.title}</h3>
  <p><strong>Project Value:</strong> ${project.value.toLocaleString()}</p>
                  <p><strong>${project.raised.toLocaleString()} </strong> ({((project.raised / project.goal) * 100).toFixed(1)}%) raised of <strong>${project.goal.toLocaleString()}</strong> goal</p>
                 
  <div className="progress mb-3" style={{ height: '12px' }}>
    <div
      className="progress-bar bg-success"
      role="progressbar"
      style={{ width: `${(project.raised / project.goal) * 100}%` }}
    ></div>
  </div>
  <p><strong>Matching Fund:</strong> ${project.matching.toLocaleString()}</p>
                  
  <div className="progress mb-4" style={{ height: '12px' }}>
    <div
      className="progress-bar bg-primary"
      role="progressbar"
      style={{ width: `${(project.matchingUsed / project.matching) * 100}%` }}
    ></div>
  </div>

   
   <div className="d-block justify-content-between align-items-center buttons">
   <Link href={`/${project.id}/Donate`} passHref  className='text-decoration-none'>
  <button className="btnActions d-block w-100 px-4 py-2 mt-2 text-white fw-bold">
    Donate Now
  </button>
</Link>
    <Link href="/Explore" className='text-decoration-none'>
      <button className="btnActions2 d-block w-100 px-4 py-2 mt-2 mb-3 text-white fw-bold ">
        Back to Projects
      </button>
    </Link>
  </div>
  <p className="mb-2">
    <strong>
      <i className="fas fa-user mr-2 p-2 font-color"></i>  
   
    {" "+project.by}
    </strong> 
  </p>
  
  <p className="mb-2">
    <strong>
      <i className="fas fa-dollar-sign mr-2 p-2 font-color"></i> Value: 
    </strong> 
    ${project.value.toLocaleString()}
  </p>
  
  <p className="mb-2">
    <strong>
      <i className="fas fa-bullseye mr-2 p-2 font-color"></i>Goal:
    </strong> 
    ${project.goal.toLocaleString()}
  </p>
  
  <p className="mb-2">
    <strong>
      <i className="fas fa-chart-line mr-2 p-2 font-color"></i>Raised:
    </strong> 
    ${project.raised.toLocaleString()}
  </p>
  
  <p className="mb-2">
    <strong>
      <i className="fas fa-box mr-2 font-color p-2 font-color"></i>Matching Fund:
    </strong> 
    ${project.matching.toLocaleString()}
  </p>
  
  <p className="mb-4">
    <strong>
      <i className="fas fa-wallet mr-2 p-2 font-color"></i>Spent:
    </strong> 
    ${project.spent.toLocaleString()}
  </p>

  

 
</div>

          </div>
        </div>
      </div>
    </div>



    {/* tabs */}
    <div className="mt-1 col-lg-8 col-md-12 col-12">
          <ul className="nav"
          style={{
            backgroundColor:"#e7e7e7",
            borderRadius:"5px",
            padding:" 8px 10px",

          }}
          >
            <li className={`nav-item  fs-6 fs-lg-3 ${activeTab === "story" ? "item-active" : ""}`}>
              <button 
                className="nav-link" 
                onClick={() => setActiveTab("story")}>
                Project Story
              </button>
            </li>
            <li className={`nav-item ${activeTab === "updates" ? "item-active" : ""}`}>
              <button 
                className="nav-link" 
                onClick={() => setActiveTab("updates")}>
                Updates
              </button>
            </li>
            <li className={`nav-item ${activeTab === "list" ? "item-active" : ""}`}>
              <button 
                className="nav-link" 
                onClick={() => setActiveTab("list")}>
                Back List 
              </button>
            </li>
            <li className={`nav-item  fs-6 fs-lg-3 ${activeTab === "expenditure" ? "item-active" : ""}`}>
              <button 
                className="nav-link" 
                onClick={() => setActiveTab("expenditure")}>
                Expenditure
              </button>
            </li>
            <li className={`nav-item  fs-6 fs-lg-3 ${activeTab === "review" ? "item-active" : ""}`}>
              <button 
                className="nav-link"
                onClick={() => setActiveTab("review")}>
                Reviews
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-3">
            {activeTab === "story" && (
              <div className="tab-pane fade show active">
                <h4 className="fw-bold">Project Overview</h4>
                <p>
                  This project aims to {project.title.toLowerCase()}, supporting local efforts to improve infrastructure and enhance community well-being.
                </p>
             
<p>Using a participatory community consultation process, Hurshe community prioritized the fencing of a primary school, and the upgrading of a police post. This will address the education and security needs of the community.</p>

<p>Hurshe is a community under Xerale District with a large population size of approximately eight hundred households. It is 80 kilometers northeast of Xerale town and 18 kilometers south side of Abudwaq town. Most public infrastructure services in Hurshe have not been upgraded for a long time due to the drought and previous internal conflict between the communities in Hurshe and Xerale town. In addition to the degrading conditions of public infrastructures, these services are increasingly strained due to the increase in population with the arrival of displaced persons originating primarily from Baadweyne. This has increased the need for additional schools, boreholes and other services.</p>

<p>Hurshe community has shown great interest in participating in the Daryeel matching grant project, which supplements the funds raised by the community at a set ratio.The community has previous experience in initiating, co-financing and financing small to medium size projects including construction of the administration block, police post, and school among others. For the matching grant with Daryeel project, Hurshe community proposed additional rooms to the police post, and fencing the primary school for the protection of the children from vehicles, as well as protecting the school compound from expansion and encroachment of houses being built towards the school premises. As fencing of the primary school and upgrading of the police station will benefit all those residing in Hurshe and communities in the outskirts, which requires collaboration across different groups within the village and surrounding rural area, the matching grant ratio will be 1 to 3. The community contribution expected is $20,000 with the project matching $60,000. Hence the total cost of the community project will be $80,000.</p>

<p>The fencing of the primary school and upgrading of the police station was identified as a priority project through inclusive Community Based Planning (CBP) conducted in Hurshe in November 2021. This process was government-led, and community-owned bringing together representatives from different socioeconomic groups in the community to jointly assess their location including mapping resources, understanding the strengths, weaknesses, opportunities, and threats to the community, and to identify the priorities of the community.</p>

 

<p>Thank you for contributing towards improving the education and security in Hurshe through fencing of the primary school and upgrading of the police station. This will benefit the whole Hurshe community! </p>


            
              </div>
            )}
            {activeTab === "updates" && (
              <div className="tab-pane fade show active">
                <h5 className="fw-bold">Add updates to this project by completing the form below. Required fields are marked *</h5>
               <div className="mb-3">
                <label htmlFor="name" className="form-label">
                 Update Title
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
                <label htmlFor="name" className="form-label">
                 Update Description
                </label>
                <textarea
                  type="text"
                  className="form-control "
                  id="description"
                  placeholder="Enter Description"
                  required
                  style={{width:"100%", height:"200px"}}
                />
              </div>
               <div className="mb-3">
                <label htmlFor="name" className="form-label">
                 Add Picture
                </label>
                <input
                  type="file"
                  className="form-control "
                  id="picture"
                  placeholder="Enter your name"
                  required
                  
                />
              </div>
              <div className="text-center">
              <button className="btnActions2 d-block w-100 px-4 py-2 mt-2 mb-3 text-white fw-bold ">
               Submit
             </button>
             </div>
              </div>
            )}
            {activeTab === "list" && (
              <div className="tab-pane fade show active">
                

<div className="mt-4">
  <div className="table-responsive"> 
    <table className="table table-bordered">
      <thead className="table-light">
        <tr>
          <th className="bg-color text-white">Donated By</th>
          <th className="bg-color text-white">Amount Donated</th>
          <th className="bg-color text-white">Method</th>
          <th className="bg-color text-white">Date Donated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Anonymous</td>
          <td>$1,304.00</td>
          <td>Direct Deposit</td>
          <td>04/21/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$652.00</td>
          <td>Direct Deposit</td>
          <td>04/21/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1.00</td>
          <td>Direct Deposit</td>
          <td>04/21/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,329.00</td>
          <td>Direct Deposit</td>
          <td>04/21/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,280.00</td>
          <td>Direct Deposit</td>
          <td>04/22/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,300.00</td>
          <td>Direct Deposit</td>
          <td>05/23/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$2,100.00</td>
          <td>Direct Deposit</td>
          <td>04/30/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,000.00</td>
          <td>Direct Deposit</td>
          <td>05/01/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,250.00</td>
          <td>Direct Deposit</td>
          <td>05/03/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,250.00</td>
          <td>Direct Deposit</td>
          <td>05/03/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,250.00</td>
          <td>Direct Deposit</td>
          <td>05/03/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$6,250.00</td>
          <td>Direct Deposit</td>
          <td>05/03/2022</td>
        </tr>
        <tr>
          <td>Anonymous</td>
          <td>$1,034.00</td>
          <td>Direct Deposit</td>
          <td>05/04/2022</td>
        </tr>
      </tbody>
      <tfoot>
        <tr className="table-primary">
          <td colSpan="1" className="fw-bold text-white bg-primary">
            Total funds raised
          </td>
          <td className="fw-bold text-white bg-primary">$20,000.00</td>
          <td className="bg-primary"></td>
          <td className="bg-primary"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

              </div>
            )}
            {activeTab === "expenditure" && (
              <div className="tab-pane fade show active">
                
                <div className="container mt-4">
      
      <div className="d-flex justify-content-end">
        <div className='w-auto'>
     
        <table className="table table-bordered w-auto">
          <tbody>
            <tr>
              <td><strong>Opening Balance:</strong></td>
              <td>$20,000</td>
            </tr>
            <tr>
              <td><strong>Total Expenditure:</strong></td>
              <td>$20,000.00</td>
            </tr>
            <tr>
              <td><strong>Remaining Balance:</strong></td>
              <td>$0</td>
            </tr>
          </tbody>
        </table>
      </div>
     
      </div>

      {/* Transactions Table */}
      <div className='table-responsive'>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th className='bg-color text-white'>Date</th>
            <th className='bg-color text-white'>Description</th>
            <th className='bg-color text-white'>Paid Out</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>10/10/2022</td>
            <td>Cawil Cade general construction company</td>
            <td>$20,000.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="text-white fw-bold" style={{ backgroundColor: "blue" }}>
            <td>Total</td>
            <td></td>
            <td>$20,000.00</td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
              </div>
            )}
            {activeTab === "review" && (
              <div className="tab-pane fade show active">
                <h4 className="fw-bold">Be the first to review {project.title}</h4>
                <p>Your email address will not be published. Required fields are marked *.</p>
                <div className="mb-3">
                <label htmlFor="name" className="form-label">
                 Your View:
                </label>
               
                 <textarea
                  type="text"
                  className="form-control "
                  id="view"
                  placeholder="Enter your View"
                  required
                  style={{width:"100%", height:"200px"}}
                />
              </div>
               <div className="mb-3">
                <label htmlFor="name" className="form-label">
                Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your Name"
                  required
                />
              </div>
               <div className="mb-3">
                <label htmlFor="name" className="form-label">
                Email:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter your Email"
                  required
                />
              </div>
              
              <div className="text-center">
              <button className="btnActions2 d-block w-100 px-4 py-2 mt-2 mb-3 text-white fw-bold ">
               Submit
             </button>
             </div>
              </div>
            )}
          </div>
          </div>
  </div>
  );
};

export default ProjectDetails;



