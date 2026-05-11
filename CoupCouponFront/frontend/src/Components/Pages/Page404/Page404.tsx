import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SentimentDissatisfied } from '@mui/icons-material';
import { PageTransition } from '../../shared/PageTransition';

export function Page404(): JSX.Element {
  const navigate = useNavigate();

  return (
    <PageTransition>
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
          <SentimentDissatisfied sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5 }} />
          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              fontSize: { xs: '4rem', sm: '6rem' },
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </Typography>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Page not found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" size="large" onClick={() => navigate('/')}>
              Go Home
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Box>
        </Box>
      </Container>
    </PageTransition>
  );
}
