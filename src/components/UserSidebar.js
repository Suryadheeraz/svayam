// src/components/UserSidebar.js
import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
//import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
//import SupportIcon from '@mui/icons-material/Support';
import InfoIcon from '@mui/icons-material/Info';
//import WorkIcon from '@mui/icons-material/Work'; // For Explore catalog
//import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Icon for conversation

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


const drawerWidth = 280;
const collapsedDrawerWidth = 60; // Must match the one in App.js

const UserSidebar = ({
  conversations,
  onNewChat,
  onSelectConversation,
  currentConversationId,
  userDisplayName,
  userEmail,
  sidebarOpen, // NEW: Receive sidebar state
  appBarHeight
}) => {
  const [openHistory, setOpenHistory] = useState(true);

  const handleToggleHistory = () => {
    setOpenHistory(!openHistory);
  };

  const currentDrawerWidth = sidebarOpen ? drawerWidth : collapsedDrawerWidth;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: currentDrawerWidth, // Use dynamic width
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: currentDrawerWidth, // Use dynamic width
          boxSizing: 'border-box',
          bgcolor: 'grey.900', // Dark background for sidebar
          color: 'white',
          transition: (theme) => theme.transitions.create('width', { // Smooth width transition
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden', // Hide horizontal scrollbar when collapsing
          // THESE ARE THE CRITICAL LINES FOR DRAWER POSITIONING
          mt: `${appBarHeight}px`, // Push down by appBarHeight
          height: `calc(100vh - ${appBarHeight}px)`, // Occupy remaining vertical space
          borderRadius: 0
        },
      }}
    >
      {/* Top Section */}
      {/*
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', height: appBarHeight, minHeight: appBarHeight }}>
        {sidebarOpen && (
            <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            AskTicketAI
            </Typography>
        )}
        <IconButton color="inherit" size="small" sx={{ ml: sidebarOpen ? 0 : 'auto' }}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Box>
      */}
      {/*}
      <Divider sx={{ borderColor: 'grey.700' }} /> */}

      {/* Main Navigation List */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onNewChat} sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', px: sidebarOpen ? 2 : 0 }}>
            <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
              <AddIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="New chat" sx={{ whiteSpace: 'nowrap' }} />}
          </ListItemButton>
        </ListItem>
        {/*
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', px: sidebarOpen ? 2 : 0 }}>
            <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
              <WorkIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Explore catalog" sx={{ whiteSpace: 'nowrap' }} />}
          </ListItemButton>
        </ListItem>
        */}
        <ListItemButton onClick={handleToggleHistory} sx={{ mt: 2, justifyContent: sidebarOpen ? 'flex-start' : 'center', px: sidebarOpen ? 2 : 0 }}>
          <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
            <HistoryIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          {sidebarOpen && (
            <>
              <ListItemText primary="Recent Conversations" sx={{ whiteSpace: 'nowrap' }} />
              {openHistory ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
            </>
          )}
        </ListItemButton>
        <Collapse in={openHistory && sidebarOpen} timeout="auto" unmountOnExit> {/* Only show collapse if sidebar is open */}
          <List component="div" disablePadding sx={{ pl: sidebarOpen ? 2 : 0 }}>
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <ListItemButton
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  sx={{
                    bgcolor: currentConversationId === conv.id ? 'primary.dark' : 'transparent',
                    '&:hover': { bgcolor: currentConversationId === conv.id ? 'primary.dark' : 'grey.800' },
                    borderRadius: '8px',
                    mb: 0.5,
                    justifyContent: sidebarOpen ? 'flex-start' : 'center', // Center content when collapsed
                    px: sidebarOpen ? 2 : 0, // No extra padding when collapsed
                  }}
                >
                  <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
                    {/* <ChatBubbleOutlineIcon sx={{ color: 'white', fontSize: 18 }} /> */}
                    {/* CONDITIONAL ICON RENDERING */}
                    {conv.isResolved ? (
                      <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 18 }} />
                    ) : (
                      <HelpOutlineIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                    )}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText
                      primary={conv.ticketTitle || `Conversation ${conv.id}`}
                      secondary={
                        <Typography variant="caption" sx={{ color: 'grey.400' }}>
                          {conv.startDate}
                        </Typography>
                      }
                      primaryTypographyProps={{ noWrap: true, sx: { color: 'white' } }}
                    />
                  )}
                </ListItemButton>
              ))
            ) : (
              sidebarOpen && ( // Only show "No recent conversations" text when sidebar is open
                <Typography variant="body2" sx={{ color: 'grey.400', p: 2 }}>
                  No recent conversations.
                </Typography>
              )
            )}
          </List>
        </Collapse>
      </List>
      <Divider sx={{ borderColor: 'grey.700', mt: 2 }} />

      {/* Additional Navigation Items at the bottom */}
      <List sx={{ mt: 'auto' }}>
        {/*
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', px: sidebarOpen ? 2 : 0 }}>
            <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
              <SupportIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Support" sx={{ whiteSpace: 'nowrap' }} />}
          </ListItemButton>
        </ListItem>
        */}
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', px: sidebarOpen ? 2 : 0 }}>
            <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
              <InfoIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="About" sx={{ whiteSpace: 'nowrap' }} />}
          </ListItemButton>
        </ListItem>

        {/* NEW: Logout Button */}
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', px: sidebarOpen ? 2 : 0 }}>
            <ListItemIcon sx={{ minWidth: sidebarOpen ? 40 : 'auto', justifyContent: 'center' }}>
              <LogoutIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Logout" sx={{ whiteSpace: 'nowrap' }} />}
          </ListItemButton>
        </ListItem>
      </List>

      {/* User Info and Logout at the very bottom */}
      {/* <Box sx={{ p: sidebarOpen ? 2 : 1, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', bgcolor: 'grey.800', borderTop: '1px solid', borderColor: 'grey.700' }}>
        <Avatar sx={{ bgcolor: 'grey.600', mr: sidebarOpen ? 1 : 0 }}>{userDisplayName?.charAt(0) || 'JD'}</Avatar>
        {sidebarOpen && (
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{userDisplayName || 'John Doe'}</Typography>
            <Typography variant="caption" sx={{ color: 'grey.400', whiteSpace: 'nowrap' }}>{userEmail || 'john.doe@company.com'}</Typography>
          </Box>
        )}
        {/* <Tooltip title={sidebarOpen ? "Logout" : "Logout"} placement="top">
            <IconButton color="inherit" size="small" sx={{ ml: sidebarOpen ? 0 : 'auto' }}>
                <LogoutIcon fontSize="small" />
            </IconButton>
        </Tooltip> 
        
      </Box> */}
      {/* User Info and Logout at the very bottom */}
      {/* <Box sx={{ p: sidebarOpen ? 2 : 1, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', bgcolor: 'grey.800', borderTop: '1px solid', borderColor: 'grey.700' }}>
        <Avatar sx={{ bgcolor: 'grey.600', mr: sidebarOpen ? 1 : 0 }}>{userDisplayName?.charAt(0) || 'JD'}</Avatar>
        {sidebarOpen && (
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{userDisplayName || 'Hrishikesh Kumar'}</Typography>
            <Typography variant="caption" sx={{ color: 'grey.400', whiteSpace: 'nowrap' }}>{userEmail || 'hrishikeshkumar@it.com'}</Typography>
          </Box>
        )} */}
        {/* Only show the Logout IconButton if sidebar is open */}
        {/* {sidebarOpen && (
          <Tooltip title="Logout" placement="top">
              <IconButton color="inherit" size="small" sx={{ ml: sidebarOpen ? 0 : 'auto' }}>
                  <LogoutIcon fontSize="small" />
              </IconButton>
          </Tooltip>
        )}
      </Box> */}
      
    </Drawer>
  );
};

export default UserSidebar;