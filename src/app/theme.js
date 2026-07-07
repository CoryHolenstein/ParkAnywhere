import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
      dark: '#115e59',
    },
    secondary: {
      main: '#1d4ed8',
    },
    background: {
      default: '#f4f7f8',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Poppins, "Segoe UI", sans-serif',
    h1: {
      fontFamily: 'Space Grotesk, "Segoe UI", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: 'Space Grotesk, "Segoe UI", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: 'Space Grotesk, "Segoe UI", sans-serif',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e6eef0',
          boxShadow: '0 16px 40px rgba(15, 118, 110, 0.07)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e6eef0',
          boxShadow: '0 16px 40px rgba(15, 118, 110, 0.07)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
})
