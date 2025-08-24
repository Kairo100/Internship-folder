import React , { useEffect, useState }from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const LocationModal = ({ isOpen, onClose, location,longitude, latitude, title }) => {
  const [coordinates, setCoordinates] = useState(null);
   
 
  
useEffect(()=>{
  if(!isOpen) return;
  if(typeof location === 'object'  && latitude && longitude){
    setCoordinates(location)
  }
  else if(typeof location === 'string'){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyDHWxSF9jr3slziO8KaeaFk4AHlJ4SuOyc`)
      .then(res=>res.json())
      .then(data =>{
        const loc = data?.results?.[0]?.geometry?.location;

        if(loc){
          setCoordinates(loc)
        }
      })
  }
}, [isOpen, location]);

  if (!isOpen || !coordinates) return null;

   let mapUrl = '';
   if( typeof location === 'string'){
    const encodedLocation = encodeURIComponent(location);
    mapUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
   }
   else if(typeof location === 'object' && latitude && longitude) {
    mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
   }

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalStyle = {
    width: '90%',
    maxWidth: '800px',
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #ddd',
    background: '#f7f7f7',
    fontSize: '18px',
  };

  const titleStyle = {
    fontWeight: 'bold',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };


  const center = {
    lat: 0, 
    lng: 0,
  };
  
  const containerStyle = {
    width: '100%',
    height: '400px',
  };



  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <span style={titleStyle}> <i className="fas fa-map-marker-alt mr-2 p-2 font-color"></i> {title || 'Project Location'}</span>
          <button style={closeButtonStyle} onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={mapContainerStyle}>
          <LoadScript  googleMapsApiKey='AIzaSyDHWxSF9jr3slziO8KaeaFk4AHlJ4SuOyc'>
        
          <GoogleMap 
          mapContainerStyle={mapContainerStyle}
          center={coordinates}
          zoom={14}>
            <Marker position={coordinates}></Marker>
          </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;



















































































































































// with api






























































// "use client";
// import {
//   APIProvider,
//   InfoWindow,
//   Map,
//   Marker,
// } from "@vis.gl/react-google-maps";
// import Link from "next/link";
// import { use, useEffect, useRef, useState } from "react";
// import "./index.css";
// import useApi from "@/hooks/useApi";
// import { fetchProjectMaps } from "@/apis/projects";
// import ProjectImage from "@/components/views/ProjectImage/ProjectImage";
 
// type Props = {};
 
// const ProjectMaps = (props: Props) => {
//   // ** Vars
//   const center = {
//     lat: 5.1521,
//     lng: 46.1996,
//   };
 
//   const [activeMarker, setActiveMarker] = useState<any>(null);
 
//   // ** Hooks
//   const hasCalledApi = useRef(false);
//   const {
//     isLoading: fetchProjectMapsLoadingApi,
//     error: fetchProjectMapsErrorApi,
//     data: fetchProjectMapsApiData,
//     apiCall: fetchProjectMapsApicall,
//     clearStates: fetchProjectMapsClearStates,
//   } = useApi();
 
//   const isValidCoordinate = (latitude: any, longitude: any) => {
//     const isLatValid =
//       typeof latitude === "number" && latitude >= -90 && latitude <= 90;
//     const isLngValid =
//       typeof longitude === "number" && longitude >= -180 && longitude <= 180;
//     return isLatValid && isLngValid;
//   };
 
//   const handleMarkerClick = (marker: any) => {
//     setActiveMarker(marker);
//   };
 
//   const handleInfoWindowClose = () => {
//     setActiveMarker(null);
//   };
 
//   // Calling Api
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!hasCalledApi.current) {
//         hasCalledApi.current = true;
//         await fetchProjectMapsApicall(
//           fetchProjectMaps({
//             // skip: pageNumber,
//             // take: 8,
//             //   search: textSearch,
//             // filters: filterData,
//           })
//         );
//       }
//     };
//     fetchData();
//   }, []);
 
//   // Api Success Handling
//   useEffect(() => {
//     if (fetchProjectMapsApiData) {
//     }
//   }, [fetchProjectMapsApiData]);
 
//   // Api Error handling
//   useEffect(() => {
//     const timer = setTimeout(() => {}, 3000);
 
//     return () => clearTimeout(timer);
//   }, [fetchProjectMapsErrorApi]);
 
//   return (
//     <div style={{ margin: "5rem 0 0" }}>
//       <APIProvider apiKey={"AIzaSyDHWxSF9jr3slziO8KaeaFk4AHlJ4SuOyc"}>
//         <Map defaultCenter={center} defaultZoom={5} className="map-container">
//           {fetchProjectMapsApiData &&
//             fetchProjectMapsApiData.map((project: any, index: any) => (
//               <Marker
//                 key={index}
//                 position={{
//                   lat: Number(project.latitude),
//                   lng: Number(project.longitude),
//                 }}
//                 onClick={() => handleMarkerClick(project)}
//               />
//             ))}
 
//           {activeMarker && (
//             <InfoWindow
//               position={{
//                 lat: Number(activeMarker.latitude),
//                 lng: Number(activeMarker.longitude),
//               }}
//               onCloseClick={handleInfoWindowClose}
//             >
//               <div style={{ width: "20rem", margin: "0 0.3rem" }}>
//                 <div style={{ position: "relative" }}>
//                   <ProjectImage
//                     project={{ id: activeMarker.project_id }}
//                     height={"13rem"}
//                   />
//                   <p
//                     className="project-card-category-1"
//                     style={{ backgroundColor: "#fdc513", color: "#302c51" }}
//                     //   style={{ position: "absolute", top: "0", right: "2rem" }}
//                   >
//                     {activeMarker.category}
//                   </p>
 
//                   <p
//                     className="project-card-status-1"
//                     style={{
//                       // backgroundColor: "#0a58ca",
//                       // backgroundColor: "rgb(57, 153, 249)",
//                       background:
//                         new Date() >= new Date(activeMarker?.end_date)
//                           ? "#f71f56"
//                           : "#23765e",
 
//                       color: "#fff",
//                     }}
//                     //   style={{ position: "absolute", top: "0", right: "2rem" }}
//                   >
//                     {new Date() >= new Date(activeMarker?.end_date)
//                       ? "Closed"
//                       : "Active"}
//                   </p>
//                 </div>
//                 <h5 style={{ margin: "1rem 0 2rem" }}>{activeMarker.title}</h5>
 
//                 <a
//                   className="common-btn banner-btn"
//                   style={{
//                     padding: "1rem",
//                     borderRadius: "0.6rem",
//                     backgroundColor: "#3999f9",
//                     fontSize: "1.1rem",
//                     fontWeight: "bold",
//                     width: "100%",
//                     textAlign: "center",
//                   }}
//                   href={`/projects/${activeMarker.project_id}`}
//                 >
//                   Veiw
//                 </a>
//               </div>
//             </InfoWindow>
//           )}
//         </Map>
//       </APIProvider>
//     </div>
//   );
// };
 
// export default ProjectMaps;