// src/components/AdminSidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: 'users' },
  { text: 'Knowledge Base', icon: <LibraryBooksIcon />, path: 'knowledge-base' },
  { text: 'Conversations', icon: <ConfirmationNumberIcon />, path: 'conversations' },
];

const AdminSidebar = ({ selectedTab, onTabChange, appBarHeight }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#2c3e50',
          color: '#ffffff',
          borderRight: 'none',
          top: `${appBarHeight}px`,
          height: `calc(100vh - ${appBarHeight}px)`,
          borderRadius: 0,
        },
      }}
    >
      {/* Logo/Brand Section */}
      {/* <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#34495e',
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
          Support
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: '#34495e', opacity: 0.3 }} /> */}

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selectedTab === item.path}
              onClick={() => onTabChange(item.path)}
              sx={{
                borderRadius: 1,
                color: selectedTab === item.path ? '#ffffff' : '#94a3b8',
                bgcolor: selectedTab === item.path ? '#3b82f6' : 'transparent',
                '&:hover': {
                  bgcolor: selectedTab === item.path ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
                },
                '&.Mui-selected': {
                  bgcolor: '#3b82f6',
                  '&:hover': {
                    bgcolor: '#3b82f6',
                  },
                },
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedTab === item.path ? '#ffffff' : '#94a3b8',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: selectedTab === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;