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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { PageTransition } from '../../shared/PageTransition';
import { useAppDispatch } from '../../../hooks/useAppStore';
import { login } from '../../../store/authSlice';
import { authService } from '../../../api/authService';
import type { AuthState } from '../../../types';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setServerError(null);
    setLoading(true);

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      const authState: AuthState = {
        id: response.userId,
        email: data.email,
        name: response.name,
        userType: response.userType,
        token: response.accessToken,
        isLoggedIn: true,
      };

      dispatch(login(authState));

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // Navigate to role-based dashboard
      switch (response.userType) {
        case 'ADMIN':
          navigate(`/admin/${response.userId}`);
          break;
        case 'COMPANY':
          navigate(`/company/${response.userId}`);
          break;
        case 'CUSTOMER':
          navigate(`/customer/${response.userId}`);
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          setServerError('Invalid email or password.');
        } else {
          setServerError('An unexpected error occurred. Please try again.');
        }
      } else {
        setServerError('Server not responding. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
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
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
            })}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            margin="normal"
            error={!!errors.password}
            helperText={
              errors.password?.type === 'required'
                ? 'Password is required'
                : errors.password?.type === 'minLength'
                ? 'Password must be at least 5 characters'
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" color="text.secondary">
          Don't have an account?{' '}
          <Typography
            component={Link}
            to="/register"
            variant="body2"
            color="primary"
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Sign up
          </Typography>
        </Typography>
      </AuthLayout>
    </PageTransition>
  );
}
