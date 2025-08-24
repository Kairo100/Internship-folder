import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import axios from "axios";
import SectionTitle from "../SectionTitle/SectionTitle";
import OrganizationModal from "../../main-component/CauseSinglePage/OrganizationModal";
import zIndex from "@mui/material/styles/zIndex";
import { useProjects } from "../../api/ProjectsContext";

const ClickHandler = () => {
    window.scrollTo(10, 0);
};

const CausesSectionS3 = (props) => {
 
const {causesData, totalCount,setCurrentPage, filters,setFilters,handleClickProjects,loading, currentPage, causesPerPage,projectsData,selectedId, setSelectedId } = useProjects();

    const navigate = useNavigate();
    const location = useLocation();
    const { category } = useParams();
   
  
    const isHeroPage = location.pathname === "/";
    

 useEffect(() => {
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: decodeURIComponent(category),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: "",
      }));
    }
      setCurrentPage(1);  
  }, [category]);
    
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    };
    
    const causesList = Array.isArray(causesData) ? causesData : [];
     const availableYearMonths = [...new Set(
      causesList
        .filter(cause => cause.start_date && !isNaN(new Date(cause.start_date))) 
        .map(cause => new Date(cause.start_date).toISOString().slice(0, 7))
    )].sort((a, b) => b.localeCompare(a));
const sortedCauses = causesList.sort((a, b) => b.raised - a.raised);
    const [showOrgModal, setShowOrgModal] = useState(false);
    const [selectedCause, setSelectedCause] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("");
  
 
    const currentCauses = causesData;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPage =  Math.ceil(totalCount/causesPerPage);
   

    // const filteredCauses = causesData.filter((cause) => {
    //   const matchesLocation =
    //     !filters.country_region || cause.country_region === filters.country_region;
    
    //   const matchesStatus =
    //     !filters.status ||
    //     (filters.status === "Completed"
    //       ? new Date(cause.end_date) < new Date()
    //       : new Date(cause.end_date) >= new Date());
    
    //   const matchesCategory =
    //     !filters.category || cause.category === filters.category;
    
    //   // const matchesDate =
    //   //   !filters.date || new Date(cause.start_date).toISOString().slice(0, 7) === filters.date;
    //   const matchesDate =
    //   !filters.date ||
    //   new Date(cause.start_date).toISOString().slice(0, 7) === filters.date.slice(0, 7); // Compare year-month for consistency

    //   const matchesSearch =
    //     !filters.search ||
    //     cause.title.toLowerCase().includes(filters.search.toLowerCase());
    
    //   return (
    //     matchesLocation &&
    //     matchesStatus &&
    //     matchesCategory &&
    //     matchesDate &&
    //     matchesSearch
    //   );
    // });
 


const regionFilter = [
  { value: "Puntland", display: "Puntland" },
  { value: "Galmudug", display: "Galmudug" },
  { value: "Republic of Somaliland", display: "Somaliland" }, // Already clear
  { value: "Hirshabelle", display: "Hirshabelle" },
  { value: "Jubaland", display: "Jubaland" },
  { value: "South West State", display: "South West State" }
];


  // for titles
  const formatTitle = (title) => {
  if (!title) return ''; // Handle empty or null titles
  const firstChar = title.charAt(0).toUpperCase();
  const restOfString = title.slice(1).toLowerCase();
  return firstChar + restOfString;
};
    return (
        <section className={"" + props.hclass}>
            <div className="causes-wrap mt-5">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-12 col-12 mt-0">
                            <SectionTitle subtitle="Explore" title="Our Latest Projects" />
                        </div>
                    </div>

                  
                       

                   
<div className="row justify-content-center mb-4"> {/* This is now the ONLY row for filters */}
  <div className="col-12 col-md-10 col-lg-10"> {/* This single column controls the overall width */}
    <div className="d-flex flex-wrap gap-2 gap-lg-0 justify-content-between align-items-center"> {/* Aligns items vertically in the middle */}

        {/* First Filter Row */}
        <div className="d-flex flex-wrap gap-1 col-lg-6  col-md-12"> {/* Distribute first set of filters across 6 columns */}

            <div className="flex-grow-1"> {/* Use flex-grow-1 to allow select to take available space */}
                <select
                    name="country_region"
                    className="form-select p-2 border rounded-md text-red-700 bg-white focus:ring-2 focus:ring-red-900 focus:border-purple-500 hover:bg-red-200"
                    onChange={handleFilterChange}
                    style={{ appearance: "none", cursor: "pointer" }}
                >
                    {/* <option value="">Regions</option> */}
                    <option value="">Location</option>
                    {[...new Set(regionFilter.map((c)=>c || ''))]
                        .filter((n)=>n)
                        .map((region, i) => (
                            <option key={i} value={region.value} style={{ backgroundColor: "#f0f0f0" }}>
                                {region.display}
                            </option>
                        ))}
                </select>
            </div>

            <div className="flex-grow-1">
                <select
                    name="status"
                    className="form-select p-2 border rounded-md text-gray-700 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleFilterChange}
                    style={{ appearance: "none", cursor: "pointer" }}
                >
                    <option value="">Status</option>
                    <option value="active" style={{ backgroundColor: "#f0f0f0" }}>Active</option>
                    <option value="Completed" style={{ backgroundColor: "#f0f0f0" }}>Ended</option>
                </select>
            </div>

            <div className="flex-grow-1">
                <select
                    name="category"
                    value={filters.category || ""}
                    className="form-select p-2 border rounded-md text-red-700 bg-white focus:ring-2 focus:ring-red-900 focus:border-purple-500 hover:bg-red-200"
                    onChange={handleFilterChange}
                    style={{ appearance: "none", cursor: "pointer" }}
                >
                    <option value="">Categories</option>
                    {[
                        "Agriculture", "Community Building", "Education", "Food", "Health",
                        "Human Rights", "ICT", "Media & Journalism", "Water",
                        "Health and Environmental Security"
                    ].map((cat, i) => (
                        <option key={i} value={cat} style={{ backgroundColor: "#f0f0f0" }}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Second Filter Row */}
        <div className="d-flex flex-wrap gap-4 gap-lg-2 col-lg-6 col-md-12 justify-content-lg-end"> {/* Distribute second set of filters across 6 columns */}

            <div className="col-lg-5 col-md-5 col-12 position-relative"> {/* Use col-12 for full width on small screens */}
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="form-control p-2 ps-4 border rounded-md text-gray-700 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    onChange={handleFilterChange}
                />
                <i className="fa fa-search position-absolute text-muted"
                   style={{ top: "50%", right: "15px", transform: "translateY(-50%)", fontSize: "16px" }}></i>
            </div>

            <div className="col-lg-6 col-md-6 col-12 d-flex position-relative"> {/* Use col-12 for full width on small screens */}
                <div className="position-relative flex-fill w-100">
                    {/* <span className="placeholder-overlay">Select Date</span> */}
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="form-control p-2 border rounded-md text-gray-700 bg-white"
                        id="single-date"
                    />
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>

                    {/* Causes Section */}
                    
                    {loading ? (
  <div className="text-center w-100 py-5">
    <span className="spinner-border " role="status" style={{color:"#00CC99"}} />
    <p className="mt-2">Loading projects...</p>
  </div>
) : causesData.length === 0 ? (
  <div className="text-center w-100 py-5">
    <i className="fas fa-folder-open fa-2x text-muted mb-2"></i>
    <p>No projects found for the selected filters.</p>
  </div>
) : (
  <div className="row justify-content-center"> {/* Added justify-content-center here */}
    <div className="col-12 col-md-12 col-lg-10">
      
                    <div className="row ">
                      {/* causesData.map((cause, cky) */}
                        {(isHeroPage ? causesData.slice(0, 6) : causesData).map((cause, cky) => 

                      {
                        //  const fundraised = cause.fundraised;
                        //  const matching = cause.available_grant ;
                        //  const matchingUsed = Math.min(fundraised, matching);
   const fundraised = cause.fundraised || 0;
const communityGoal = cause.funding_goal || cause.goal || 0;
const availableMatchingGrant = cause.available_grant || 0;

// Calculate the matching ratio. Handle division by zero for communityGoal.
const matchingRatio = communityGoal > 0 ? availableMatchingGrant / communityGoal : 0;

// Calculate the amount of matching fund that should be activated based on the fundraised amount.
// This is fundraised * matchingRatio
const theoreticallyActivatedMatching = fundraised * matchingRatio;

// The actual matching used should be capped at the availableMatchingGrant.
const matchingUsed = Math.min(theoreticallyActivatedMatching, availableMatchingGrant);

const communityProgressPercentage = communityGoal > 0 ? (fundraised / communityGoal) * 100 : 0;
const matchingGrantUtilizationPercentage = availableMatchingGrant > 0 ? (matchingUsed / availableMatchingGrant) * 100 : 0;
                        return(    <div className="col col-lg-4 col-md-6 col-12" key={cky}>
                              
                                <div className="causes-item position-relative">
                                    <div className={`status-badge ${new Date(cause.end_date) < new Date() ? 'completed' : 'active'}`}>
                                    {new Date(cause.end_date) < new Date() ? 'Ended' : 'Active'}
                                    </div>
                                    <Link onClick={ClickHandler} to={`/projects/${cause.id}`} style={{ fontSize: "20px" }}>
                                    <div className="image">
                                         <img src={Object.values(cause.images)[0]} alt="" style={{ height: "220px" }} />

                                    </div>
  </Link> 
                                    
                                  
                                    <div className="content">
                                                  <h2>
  <Link
    onClick={ClickHandler}
    to={`/projects/${cause.id}`}
    className="text-decoration-none link-underline-hover"
    style={{
      fontSize: "20px",
      fontWeight: "normal",
      lineHeight: "1.2px",
      // textTransform: 'lowercase'
    }}
  >
    {/* {cause.title.length > 35 ? cause.title.substring(0, 35) + '...' : cause.title} */}
     {/* Apply the formatting here */}
    {formatTitle(
      cause.title.length > 30 ? cause.title.substring(0, 30) + '...' : cause.title
    )}

    
 </Link>
</h2>


                                      {/* <h6><Link onClick={ClickHandler} to={`/projects/${cause.id}`} style={{ color: "grey" }}><b>By:</b>{projectsData[cause.id]?.communityName  }</Link></h6> */}
                                        <p></p>
                                        {/* Progress */}
                                        
                                        <div>
                                        <p style={{ fontSize: "16px" }}>
  <strong>Project Value:</strong>  $
  {(cause.available_grant !== undefined && cause.funding_goal !== undefined)
    ? (availableMatchingGrant + communityGoal).toLocaleString()
    : "0"}
</p>

                                            <p style={{ fontSize: "16px" }}><strong> ${cause.fundraised !== undefined ? Math.round(fundraised ).toLocaleString() : "0"} </strong>
                                             (
  {cause.fundraised !== undefined && cause.funding_goal !== undefined && cause.funding_goal !== 0
    ? (communityProgressPercentage).toFixed(0)
    : "0"}
  %), 
                                              raised of  <strong>
  ${cause.goal !== undefined 
    ? communityGoal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) 
    : "0"}
</strong> goal
</p>
                                               {/* <strong> ${cause.goal !== undefined ? communityGoal.toLocaleString() : "0"}</strong> goal</p> */}
                                            <div className="progress" style={{ height: "4px" }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{ width: `${cause.fundraised !== undefined && cause.funding_goal !== undefined && cause.funding_goal !== 0 ? (cause.fundraised / cause.funding_goal) * 100
          : 0
      }%`, background: "#00CC99" }}  //2C3E50
                                                ></div>
                                            </div>
                                            
                                          
                                            
                                          {availableMatchingGrant > 0 && (
                    <>
                        <p style={{ fontSize: "16px", marginTop: "10px" }} >
                            <strong>Matching Fund:</strong> ${availableMatchingGrant.toLocaleString()}
                            {/* Show 'activated' amount if community fundraised */}
                            {/* {fundraised > 0 && ` (${Math.round(matchingUsed).toLocaleString()} activated)`} */}
                        </p>
                        <div className="progress" style={{ height: "4px" }}>
                            <div
                                className="progress-bar "
                                role="progressbar"
                                style={{
                                    width: `${matchingGrantUtilizationPercentage}%`, // <-- THIS IS THE CRITICAL FIX
                                    background: "#2C3E50"
                                }}
                                aria-valuenow={matchingGrantUtilizationPercentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </>
                )}

                                            {/* <p className="text-danger" style={{ fontSize: "12px" }}> ${cause.expenditure}{" "} <small className="text-dark">spent</small></p> */}
                                        </div>
                                       
                                        <div className="mt-3">
      <div onClick={() => {setShowOrgModal(true); 
      handleClickProjects(cause.id)
         setSelectedCause(cause);
         }} className="text-decoration-none">
          <span style={{ color:"#00CC99", cursor:"pointer"}}>{cause.orgnanizationInfo?.organisation_name}</span>
    
        
        </div>
      </div>
     
                                    </div>
                                     
                                </div>
                              
                                
                                
                            </div>
                        
                        
                        )
                            
                            
})}

                    </div>
                    </div>
                    </div>
                    
)}
                    {/* Pagination */}
                    {!isHeroPage && (
                      
                    <div className="pagination-wrapper pagination-wrapper-left justify-content-center">
                        <ul className="pg-pagination">
                            <li>
                                <Link to="#" aria-label="Previous" onClick={() => currentPage > 1 && paginate(currentPage - 1)}>
                                 <i className="fa-solid fa-angle-left"></i>
                                </Link>
                            </li>
                            {(()=>{
                                const range = 4;
                                let startPage = Math.max(currentPage - Math.floor(range / 2), 1);
                                let endPage = Math.min(startPage+ range- 1, totalPage);
                                if(startPage - endPage < range){
                                  startPage = Math.max(endPage-range +1, 1)

                                }
                                const page =[]
                                for (let i = startPage; i<=endPage; i++){
                                  page.push(i)
                                }

                                const renderPages = []
                                if(startPage>1){}
                                return page.map((page)=>{
                                  return (
                                    <li key={page} className={currentPage === page ? "active" : ""}>
                                      <Link to="#" onClick={() => paginate(page)}>
                                        {page}
                                      </Link>
                                    </li>
                                  );
                                })
                            })()}
                            <li>
                                <Link to="#" aria-label="Next" onClick={() => currentPage < Math.ceil(totalPage) && paginate(currentPage + 1)}>
                                   <i className="fa-solid fa-angle-right"></i>
                                </Link>
                            </li>
                        </ul>
                        
                    </div>
                     )}

                     
                </div>
                         
            </div>
            {/* organization model pop up */}
    {selectedCause && (
  <OrganizationModal
    isOpen={showOrgModal}
    onClose={() => setShowOrgModal(false)}
    organization={projectsData[selectedCause.id]?.organizationDetails}
    loading={loading}
    style={{ zIndex: "1000" }}
  />
)}
       
       {/* for data filters  */}
          <style>
{`
  .placeholder-overlay {
    position: absolute;
    top: -20%;
    left: 5px;
    transform: translateY(-50%);
    color: #888;
    pointer-events: none;
    font-size: 0.9rem;
  }
      .link-underline-hover:hover {
    text-decoration: underline !important;
    color:blue !important
  }

`}
</style>
 

          </section>
    );
};

export default CausesSectionS3;












