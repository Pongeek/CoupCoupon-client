import { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppStore';
import { useThemeMode } from '../theme/ThemeContext';

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Layout for public pages (home, landing).
 * Shows a simple top bar with logo, login/register buttons.
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn, userType, id } = useAppSelector(state => state.auth);
  const { mode, toggleTheme } = useThemeMode();

  const handleDashboard = () => {
    switch (userType) {
      case 'ADMIN':
        navigate(`/admin/${id}`);
        break;
      case 'COMPANY':
        navigate(`/company/${id}`);
        break;
      case 'CUSTOMER':
        navigate(`/customer/${id}`);
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              onClick={() => navigate('/')}
            >
              CoupCoupon
            </Typography>

            {/* Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleTheme} size="small" aria-label="toggle theme">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              {isLoggedIn ? (
                <Button variant="contained" size="small" onClick={handleDashboard}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outlined" size="small" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button variant="contained" size="small" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main content */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} CoupCoupon. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
