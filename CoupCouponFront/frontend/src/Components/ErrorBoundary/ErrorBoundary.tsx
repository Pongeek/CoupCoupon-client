import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback UI to render instead of the default error screen */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary that catches unhandled React rendering errors.
 * Prevents the entire app from crashing — shows a friendly error screen
 * with a retry button instead.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
            <Typography variant="h3" component="h1" color="error" fontWeight="bold">
              Oops!
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              An unexpected error occurred. Please try again.
            </Typography>
            {import.meta.env.DEV && this.state.error && (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  maxWidth: '100%',
                  overflow: 'auto',
                  fontSize: '0.8rem',
                  textAlign: 'left',
                }}
              >
                {this.state.error.message}
              </Box>
            )}
            <Box display="flex" gap={2}>
              <Button variant="contained" onClick={this.handleRetry}>
                Try Again
              </Button>
              <Button variant="outlined" onClick={this.handleGoHome}>
                Go Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
