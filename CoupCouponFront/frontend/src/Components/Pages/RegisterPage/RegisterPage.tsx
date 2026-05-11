import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { PageTransition } from '../../shared/PageTransition';
import { authService } from '../../../api/authService';

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

/**
 * Calculate password strength (0-100).
 */
function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 5) score += 20;
  if (password.length >= 8) score += 20;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  return Math.min(100, score);
}

function getStrengthColor(strength: number): 'error' | 'warning' | 'info' | 'success' {
  if (strength < 30) return 'error';
  if (strength < 60) return 'warning';
  if (strength < 80) return 'info';
  return 'success';
}

function getStrengthLabel(strength: number): string {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
}

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password', '');
  const passwordStrength = getPasswordStrength(password);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setServerError(null);
    setLoading(true);

    try {
      // Check if email already exists
      const emailExists = await authService.checkEmail(data.email);
      if (emailExists) {
        setServerError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      // Register the customer
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      // Navigate to login with success message
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      setServerError(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthLayout title="Create an account" subtitle="Start saving with exclusive coupons today">
        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setServerError(null)}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            margin="normal"
            error={!!errors.email}
            helperText={
              errors.email?.type === 'required'
                ? 'Email is required'
                : errors.email?.type === 'pattern'
                ? 'Invalid email format'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            {...register('email', {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              placeholder="John"
              margin="normal"
              error={!!errors.firstName}
              helperText={
                errors.firstName?.type === 'required'
                  ? 'Required'
                  : errors.firstName?.type === 'pattern'
                  ? 'Letters only'
                  : ''
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              {...register('firstName', {
                required: true,
                pattern: /^[a-zA-Z]+$/,
              })}
            />

            <TextField
              fullWidth
              label="Last Name"
              placeholder="Doe"
              margin="normal"
              error={!!errors.lastName}
              helperText={
                errors.lastName?.type === 'required'
                  ? 'Required'
                  : errors.lastName?.type === 'pattern'
                  ? 'Letters only'
                  : ''
              }
              {...register('lastName', {
                required: true,
                pattern: /^[a-zA-Z]+$/,
              })}
            />
          </Box>

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            margin="normal"
            error={!!errors.password}
            helperText={
              errors.password?.type === 'required'
                ? 'Password is required'
                : errors.password?.type === 'minLength'
                ? 'At least 5 characters'
                : errors.password?.type === 'pattern'
                ? 'Must contain a letter and a number'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? 'hide password' : 'show password'}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: true,
              minLength: 5,
              maxLength: 14,
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/,
            })}
          />

          {/* Password strength indicator */}
          {password && (
            <Box sx={{ mt: 0.5, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                color={getStrengthColor(passwordStrength)}
                sx={{ height: 4, borderRadius: 2 }}
              />
              <Typography variant="caption" color={`${getStrengthColor(passwordStrength)}.main`} sx={{ mt: 0.5 }}>
                Password strength: {getStrengthLabel(passwordStrength)}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword?.type === 'required'
                ? 'Please confirm your password'
                : errors.confirmPassword?.type === 'validate'
                ? 'Passwords do not match'
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            {...register('confirmPassword', {
              required: true,
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" color="text.secondary">
          Already have an account?{' '}
          <Typography
            component={Link}
            to="/login"
            variant="body2"
            color="primary"
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Sign in
          </Typography>
        </Typography>
      </AuthLayout>
    </PageTransition>
  );
}
