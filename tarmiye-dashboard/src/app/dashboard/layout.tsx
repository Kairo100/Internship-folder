// src/app/dashboard/layout.tsx
'use client'; // This is a Client Component

import React , { useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, CssBaseline, Button } from '@mui/material';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COLORS } from '@/styles/constants';

const drawerWidth = 240;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: COLORS.primary, // Use primary color for app bar
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Tarmiye Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name || 'User'} ({user?.role})
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: COLORS.paper, // Use paper color for drawer
          },
        }}
      >
        <Toolbar /> {/* Spacer for app bar */}
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {/* Sidebar Navigation */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: COLORS.textSecondary }}>
            Main Navigation
          </Typography>
          <Button component={Link} href="/dashboard" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Dashboard Overview
          </Button>
          <Button component={Link} href="/dashboard/users" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Users
          </Button>
          <Button component={Link} href="/dashboard/members" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Members
          </Button>
          <Button component={Link} href="/dashboard/groups" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Groups
          </Button>
          <Button component={Link} href="/dashboard/loans" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Loans
          </Button>
          <Button component={Link} href="/dashboard/repayments" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Repayments
          </Button>
          <Button component={Link} href="/dashboard/savings" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Savings
          </Button>
          <Button component={Link} href="/dashboard/cycles" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Cycles
          </Button>
          <Button component={Link} href="/dashboard/meetings" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Meetings
          </Button>
          <Button component={Link} href="/dashboard/notifications" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Notifications
          </Button>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: COLORS.textSecondary }}>
            Account
          </Typography>
          <Button component={Link} href="/dashboard/profile" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            My Profile
          </Button>
          <Button component={Link} href="/dashboard/profile/update-password" fullWidth sx={{ justifyContent: 'flex-start', mb: 1 }}>
            Update Password
          </Button>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* Another spacer for app bar */}
        {children}
      </Box>
    </Box>
  );
}




























