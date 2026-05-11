import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/useAppStore';

export function Unauthorized(): JSX.Element {
  const navigate = useNavigate();
  const { isLoggedIn, userType, id } = useAppSelector(state => state.auth);

  const handleGoHome = () => {
    if (isLoggedIn) {
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
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h1" component="h1" color="error" fontWeight="bold">
          403
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Button variant="contained" size="large" onClick={handleGoHome}>
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
