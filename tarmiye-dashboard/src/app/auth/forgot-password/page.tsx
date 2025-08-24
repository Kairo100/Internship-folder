// src/app/auth/forgot-password/page.tsx
'use client'; // This is a Client Component

import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import Link from 'next/link';
import * as authService from '@/api/auth'; // Your API service for auth

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);
      setMessage(response.message || 'If an account with that email exists, a password reset link has been sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2 }}>
        Forgot Your Password?
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Enter your email address below and we will send you a link to reset your password.
      </Typography>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      <Link href="/auth/login" passHref>
        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
          Back to Login
        </Typography>
      </Link>
    </Box>
  );
}
