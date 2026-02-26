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
      main: '#2196F3', // Vibrant blue
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFC107', // Warm yellow
      light: '#FFD54F',
      dark: '#FFA000',
      contrastText: '#000000',
    },
    background: {
      default: '#FAF9F8',
      paper: '#FFFFFF',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#FFC107',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#2196F3',
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
            boxShadow: '0 6px 12px rgba(33, 150, 243, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFA000 0%, #FFC107 100%)',
          },
        },
        outlined: {
          borderColor: alpha('#2196F3', 0.5),
          '&:hover': {
            borderColor: '#2196F3',
            backgroundColor: alpha('#2196F3', 0.05),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        filledPrimary: {
          background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
        },
        filledSecondary: {
          background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
          color: '#000000',
        },
        outlined: {
          borderColor: alpha('#2196F3', 0.3),
          '&:hover': {
            borderColor: '#2196F3',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(33, 150, 243, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2196F3',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2196F3',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha('#2196F3', 0.1),
            color: '#2196F3',
            '&:hover': {
              backgroundColor: alpha('#2196F3', 0.2),
            },
          },
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          background: 'linear-gradient(135deg, #2196F3 0%, #FFC107 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1976D2 0%, #FFA000 100%)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#FFC107',
          color: '#000000',
        },
      },
    },
  },
});