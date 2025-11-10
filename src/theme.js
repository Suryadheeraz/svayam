// src/theme.js
import { createTheme } from '@mui/material/styles';
import { amber, grey, red, green, purple, orange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0056b3', // A shade of blue
    },
    secondary: {
      main: '#6c757d', // A shade of grey
    },
    background: {
      default: grey[50], // Light grey background
      paper: '#ffffff', // White for cards/panels
    },
    // Custom colors for status/priority
    status: {
      open: red[500],
      inProgress: amber[700],
      resolved: green[500],
      aiAssisted: purple[500],
      aiCosts: green[600],
    },
    priority: {
      high: red[400],
      medium: orange[400],
      low: green[400],
      critical: red[700],
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.75rem' },
    h4: { fontSize: '1.5rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase buttons by default
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // More rounded corners for cards
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px', // Slightly rounded chips
          height: '24px', // Smaller chip height
        },
        label: {
          paddingLeft: '8px',
          paddingRight: '8px',
        }
      }
    }
  },
});

export default theme;