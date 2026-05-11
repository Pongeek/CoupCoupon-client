import { createTheme, alpha } from '@mui/material/styles';

// ── Design tokens ─────────────────────────────────────────────────────
const palette = {
  primary: {
    main: '#2563EB',      // Vibrant blue
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#7C3AED',      // Purple accent
    light: '#A78BFA',
    dark: '#5B21B6',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#FCA5A5',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
  },
  success: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#059669',
  },
  info: {
    main: '#3B82F6',
    light: '#93C5FD',
    dark: '#2563EB',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const shape = {
  borderRadius: 12,
};

const shadows = {
  card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  cardHover: '0 10px 25px rgba(0,0,0,0.1), 0 6px 10px rgba(0,0,0,0.08)',
  dropdown: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  modal: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
};

// ── Light theme ───────────────────────────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette,
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: palette.grey[900],
      secondary: palette.grey[600],
    },
    divider: palette.grey[200],
  },
  shape,
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: palette.grey[500],
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: palette.grey[300],
            borderRadius: 4,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: shadows.card,
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: shadows.card,
          border: `1px solid ${palette.grey[100]}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadows.cardHover,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: shadows.modal,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: palette.grey[50],
            color: palette.grey[700],
            borderBottom: `2px solid ${palette.grey[200]}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
          '&:hover': {
            backgroundColor: alpha(palette.primary.main, 0.04),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${palette.grey[200]}`,
        },
      },
      defaultProps: {
        color: 'inherit',
        elevation: 0,
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${palette.grey[200]}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

// ── Dark theme ────────────────────────────────────────────────────────
export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: palette.primary,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning,
    success: palette.success,
    info: palette.info,
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
  },
  components: {
    ...lightTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(148, 163, 184, 0.3)',
            borderRadius: 4,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            color: '#CBD5E1',
            borderBottom: '2px solid rgba(148, 163, 184, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
          backgroundColor: '#1E293B',
        },
      },
      defaultProps: {
        color: 'inherit',
        elevation: 0,
      },
    },
  },
});

// Custom shadow tokens for use in sx props
export const customShadows = shadows;
