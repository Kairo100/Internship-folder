import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { Box, Typography, Button, CircularProgress, Alert, Chip, Card, CardMedia } from '@mui/material';
import { useRouter } from 'next/router';

interface IProject {
  project_id: number;
  title: string;
  status: string;
  category: string;
  latitude: number;
  longitude: number;
  images?: {
    url_1: string | null;
    url_2: string | null;
    url_3: string | null;
  };
  // Add the end_date property
  end_date?: string; 
}

interface ProjectsMapProps {
  projects: IProject[];
  googleMapsApiKey: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Define the default center and zoom level for Somalia
const SOMALIA_CENTER = { lat: 2.040, lng: 45.343 };
const SOMALIA_ZOOM = 5; // A zoom level of 5 is good for a country view

const ProjectsMap: React.FC<ProjectsMapProps> = ({ projects, googleMapsApiKey }) => {
  const router = useRouter();
  const libraries = useMemo(() => ['places'], []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const setMapBounds = useCallback(() => {
    if (map) {
      // Always set the map center and zoom to Somalia's location
      map.setCenter(SOMALIA_CENTER);
      map.setZoom(SOMALIA_ZOOM);
    }
  }, [map]);

  useEffect(() => {
    setMapBounds();
  }, [setMapBounds]);

  const onMarkerClick = useCallback((projectId: number) => {
    setActiveMarker(projectId);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setActiveMarker(null);
  }, []);

  const onMapClick = useCallback(() => {
    setActiveMarker(null);
  }, []);
const getProjectStatus = (project: IProject) => {
    // Check if end_date exists and is in the past
    if (project.end_date) {
      const endDate = new Date(project.end_date);
      const today = new Date();
      if (endDate < today) {
        return 'Completed';
      }
    }
    // Otherwise, use the status from the backend or default to 'Active'
    return project.status || 'Active';
  };

  const getStatusColor = (status: string) => {
    return status === 'Completed' ? 'error' : 'success';
  };
  if (loadError) return <Alert severity="error">Error loading maps: {loadError.message}</Alert>;
  if (!isLoaded) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      onClick={onMapClick}
      options={{
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {projects.map((project) => (
        project.latitude && project.longitude ? (
          <Marker
            key={project.project_id}
            position={{ lat: project.latitude, lng: project.longitude }}
            onClick={() => onMarkerClick(project.project_id)}
          >
            {activeMarker === project.project_id ? (
              <InfoWindow onCloseClick={onInfoWindowClose}>
                <Card sx={{ maxWidth: 250, border: 'none', boxShadow: 'none' }}>
                 {/* {project.images?.url_1 || project.images?.url_2 || project.images?.url_3 ? (
    <CardMedia
      component="img"
      height="100"
      // Update this line to use the first available URL
      image={project.images.url_1 || project.images.url_2 || project.images.url_3}
      alt={project.title}
      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/A0B2C7/FFFFFF?text=No+Image'; }}
    />
  ) : (
    <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0' }}>
      <Typography variant="caption" color="text.secondary">No Image</Typography>
    </Box>
  )} */}
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                       {project.title.length > 40 ? `${project.title.substring(0, 40)}...` : project.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                      {/* <Chip
                        label={project.status}
                        color={project.status === 'Inactive' ? 'error' : 'success'}
                        size="small"
                      /> */}
                      <Chip
                        label={getProjectStatus(project)}
                        color={getStatusColor(getProjectStatus(project))}
                        size="small"
                      />
                      <Chip
                         label={project.category.length > 20 ? `${project.category.substring(0, 20)}...` : project.category}
                        color="info"
                        size="small"
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={() => router.push(`/projects/${project.project_id}/detail`)}
                    >
                      View
                    </Button>
                  </Box>
                </Card>
              </InfoWindow>
            ) : null}
          </Marker>
        ) : null
      ))} 
    </GoogleMap>
  );
};


export default ProjectsMap;