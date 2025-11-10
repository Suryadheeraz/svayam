// src/components/Header.js
import React from 'react';
import {
  // Removed AppBar and Toolbar from here as they are now in App.js
  Typography,
  Box,
  Avatar,
  Stack,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
// Icons needed for Header content
//import SettingsIcon from '@mui/icons-material/Settings'; // Example
//import LogoutIcon from '@mui/icons-material/Logout'; // Example
import customLogo from '../images/searching.png'; // Corrected SVG import

// Header component now just provides the content for the AppBar's Toolbar
const Header = ({ currentUserRole, onRoleChange }) => {
  return (
    // <AppBar position="static" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: 'grey.200' }}>
    //   <Toolbar sx={{ justifyContent: 'space-between', padding: '16px 24px' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Left section: Logo and App Name */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src={customLogo}
              alt="SVAYAM-AMS Logo"
              sx={{
                height: 32,
                width: 'auto',
                color: 'primary.main',
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              SVAYAM-AMS: Intelligent Support Specialist {/* Updated name for branding consistency with the image */}
            </Typography>
            {/* The role indicator can either be here or in UserSidebar */}
            {/* The image shows a different layout for the header for the user, with avatar/name/role outside main appbar.
                We'll stick to a more generic top appbar for now, and the role indicator will be from the main App.js state.
                Let's move the user info part out of the header to match the image better where the header is just branding.
            */}
          </Stack>

          {/* Right section: User Info & Role Switcher (from previous designs, can be simplified) */}
          {/* For the user view, the image shows a header *above* the main content that's specific to the chat partner.
              The overall App Header in MUI would typically span the whole width.
              Let's keep the role switcher here for now, as it's a global app function.
          */}
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* This part of the image shows "Hrishikesh Kumar" and role buttons *not* in the top-most header.
                For now, let's keep the global role switcher in the App.js header, as it's a core app function.
                If you want to match the image *exactly*, the global role switcher would need to be outside the user's view,
                and the user view's header would be dynamically rendered based on the selected conversation.
                For simplicity of `Header.js` as an AppBar component, let's keep it clean.
            */}
            <Avatar sx={{ bgcolor: 'grey.300', color: 'text.primary', fontWeight: 'bold', width: 40, height: 40 }}>
              JD
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>John Doe</Typography>
              <Typography variant="body2" color="text.secondary">johndoe@it.com</Typography>
            </Box>

            <ToggleButtonGroup
              value={currentUserRole}
              exclusive
              onChange={onRoleChange}
              aria-label="user role"
              sx={{
                  bgcolor: 'background.paper', // This might be a slightly different color from the overall AppBar
                  borderRadius: '8px',
                  '& .MuiToggleButton-root': {
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' }
                      }
                  }
              }}
            >
              <ToggleButton value="user" aria-label="user role">
                User
              </ToggleButton>
              <ToggleButton value="admin" aria-label="admin role">
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
    //   </Toolbar>
    // </AppBar>
  );
};

export default Header;