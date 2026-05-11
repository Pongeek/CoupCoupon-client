import { Box, Container, Typography, useTheme } from '@mui/material';
import { useThemeMode } from '../theme/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * Centered card layout for login/register pages.
 * Shows a gradient background with a centered white card.
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, #1a1a2e 100%)`
          : `linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #C7D2FE 100%)`,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: theme.palette.mode === 'dark'
              ? '0 25px 50px rgba(0,0,0,0.5)'
              : '0 25px 50px rgba(0,0,0,0.1)',
          }}
        >
          {/* Brand */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CoupCoupon
          </Typography>

          {/* Title */}
          <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 0.5 }}>
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>
          )}

          {children}
        </Box>
      </Container>
    </Box>
  );
}
