import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, LinearProgress } from '@mui/material';
import { CheckCircleOutline, ShoppingBag, Home as HomeIcon } from '@mui/icons-material';
import { PageTransition } from '../../../shared/PageTransition';
import { useAppSelector } from '../../../../hooks/useAppStore';

export function ThankYouPage(): JSX.Element {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { id: userId } = useAppSelector(state => state.auth);
  const [progress, setProgress] = useState(0);

  // Auto-redirect progress bar (visual only — user can navigate manually)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          navigate(`/customer/${userId}/coupons`);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [navigate, userId]);

  return (
    <PageTransition>
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="80vh"
          textAlign="center"
          gap={2}
        >
          <CheckCircleOutline
            sx={{
              fontSize: 96,
              color: 'success.main',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              },
            }}
          />

          <Typography variant="h3" fontWeight={700}>
            Thank You{name ? `, ${name}` : ''}!
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Your coupon has been purchased successfully.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            The coupon has been added to your account.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingBag />}
              onClick={() => navigate(`/customer/${userId}/coupons`)}
            >
              View My Coupons
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate(`/customer/${userId}`)}
            >
              Continue Browsing
            </Button>
          </Box>

          {/* Auto-redirect progress */}
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Redirecting to your coupons...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 4, borderRadius: 2 }}
            />
          </Box>
        </Box>
      </Container>
    </PageTransition>
  );
}
