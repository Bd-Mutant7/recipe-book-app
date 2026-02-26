import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Warm coral
      light: '#FF8E8E',
      dark: '#C94A4A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4ECDC4', // Fresh mint
      light: '#7FDAD3',
      dark: '#2F9E95',
    },
    background: {
      default: '#FAF9F8',
      paper: '#FFFFFF',
    },
    error: {
      main: '#FF6B6B',
    },
    warning: {
      main: '#FFB347',
    },
    success: {
      main: '#4ECDC4',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #4ECDC4 0%, #7FDAD3 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
