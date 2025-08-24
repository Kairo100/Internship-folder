// src/app/dashboard/page.tsx
'use client'; // This is a Client Component

import React from 'react';
import { Grid, Typography, Box, Paper, Button } from '@mui/material';
import { useAuth } from '@/app/contexts/AuthContext'; // Import useAuth to display user info

export default function DashboardOverviewPage() {
  const { user } = useAuth(); // Get user data from context

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Welcome back, {user?.name || 'Guest'}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" color="primary">Total Users</Typography>
            <Typography variant="h3">1,234</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" color="secondary">Active Groups</Typography>
            <Typography variant="h3">56</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" color="info">Pending Loans</Typography>
            <Typography variant="h3">12</Typography>
          </Paper>
        </Grid> */}
        {/* Add more dashboard widgets here */}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {/* <Grid item>
            <Button variant="contained" color="primary" href="/dashboard/members/create">Add New Member</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" href="/dashboard/loans/create">Record New Loan</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" href="/dashboard/groups/create">Create New Group</Button>
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
}
