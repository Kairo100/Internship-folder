import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import ProjectsMap from 'src/views/pages/projects/ProjectsMap';
import useAllProjectsApi from 'src/hooks/useAllProjectsApi';

const GOOGLE_MAPS_API_KEY = "AIzaSyDHWxSF9jr3slziO8KaeaFk4AHlJ4SuOyc"; // Make sure to use your actual key

const ProjectMapsPage = () => {
  const { projects, isLoading, error } = useAllProjectsApi();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load project locations: {error.message}
      </Alert>
    );
  }

  return (
       <Box sx={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <ProjectsMap
        projects={projects}
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      />
    </Box>
  );
};

export default ProjectMapsPage;