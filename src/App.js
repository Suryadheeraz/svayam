// src/App.js - Updated with Azure Backend Integration

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  Stack,
  Menu,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { alpha } from '@mui/material/styles';

// Components
import EngineerTicketDetail from './components/EngineerTicketDetail';
import Chatbot from './components/Chatbot/Chatbot';
import UserSidebar from './components/UserSidebar';
import AdminManagementPanel from './components/Admin/AdminManagementPanel';
import KnowledgeBaseManagement from './components/Admin/KnowledgeBaseManagement';
import RecentConversationList from './components/Admin/RecentConversationList';
import AdminSidebar from './components/AdminSidebar';
import LoginPage from './components/LoginPage';

// Services
import { authService } from './services/authService';
import { chatService } from './services/chatService';
import { adminService } from './services/adminService';

// Assets
import customLogo from './images/searching.png';

const appBarHeight = 64;

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('user');

  // Data State
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // UI State
  const [selectedConversationForAdmin, setSelectedConversationForAdmin] = useState(null);
  const [selectedAdminTab, setSelectedAdminTab] = useState('dashboard');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const openRoleMenu = Boolean(anchorEl);

  // Notification State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Define global user information for the header
  const globalUserDisplayName = currentUser?.name || 'User';
  const globalUserEmail = currentUser?.email || 'user@company.com';

  // Stats calculation
  const stats = useMemo(() => {
    const totalConversations = conversations.length;
    const openConversations = conversations.filter(c => !c.isResolved).length;
    const resolvedConversations = conversations.filter(c => c.isResolved).length;
    const aiAssistedConversations = conversations.filter(c => 
      c.messages?.some(m => m.sender === 'assistant')
    ).length;
    const aiCosts = conversations.reduce((sum, c) => {
      const aiMessagesCount = c.messages?.filter(m => m.sender === 'assistant').length || 0;
      return sum + (aiMessagesCount * 0.005);
    }, 0);

    return {
      open: openConversations,
      inProgress: 0,
      resolved: resolvedConversations,
      total: totalConversations,
      aiAssisted: aiAssistedConversations,
      aiCosts: aiCosts
    };
  }, [conversations]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchInitialData();
    }
  }, [isAuthenticated, currentUser]);

  // Update conversation selection when switching roles
  useEffect(() => {
    if (currentUserRole === 'user' && !currentConversationId && conversations.length > 0) {
      const firstUnresolved = conversations.find(conv => !conv.isResolved);
      setCurrentConversationId(firstUnresolved ? firstUnresolved.id : conversations[0].id);
    }
    if (currentUserRole !== 'admin' && selectedConversationForAdmin) {
      setSelectedConversationForAdmin(null);
    }
    if (currentUserRole !== 'user' && currentConversationId) {
      setCurrentConversationId(null);
    }
  }, [currentUserRole, currentConversationId, conversations, selectedConversationForAdmin]);

  // Authentication Functions
  const checkAuth = () => {
    setLoading(true);
    const user = authService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setCurrentUserRole(user.role || 'user');
    }
    setLoading(false);
  };

  const handleLogin = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      setCurrentUserRole(data.user.role || 'user');
      showSnackbar('Login successful!', 'success');
    } catch (error) {
      console.error('Login error:', error);
      showSnackbar('Login failed. Please check your credentials.', 'error');
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setConversations([]);
    setUsers([]);
    showSnackbar('Logged out successfully', 'info');
  };

  // Data Fetching Functions
  const fetchInitialData = async () => {
    setDataLoading(true);
    try {
      if (currentUserRole === 'admin') {
        // Fetch admin data
        const [conversationsData, usersData] = await Promise.all([
          adminService.getAllConversations(),
          adminService.getUsers()
        ]);
        
        setConversations(conversationsData.conversations || []);
        setUsers(usersData.users || []);
      } else {
        // Fetch user conversations
        const conversationsData = await chatService.getConversations();
        setConversations(conversationsData.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to load data. Please refresh the page.', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  // Conversation Management Functions
  const handleNewChat = async () => {
    try {
      const newConversation = await chatService.createConversation('New Chat');
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      showSnackbar('New conversation created', 'success');
    } catch (error) {
      console.error('Error creating conversation:', error);
      showSnackbar('Failed to create new conversation', 'error');
    }
  };

  const handleSendMessageToChatbot = async (message) => {
    if (message.trim() === '' || !currentConversationId) return;

    setChatLoading(true);
    const userMessage = message.trim();

    // Optimistically add user message to UI
    setConversations(prev => prev.map(conv =>
      conv.id === currentConversationId
        ? { 
            ...conv, 
            messages: [...(conv.messages || []), { sender: 'user', text: userMessage }] 
          }
        : conv
    ));

    setChatInput('');

    try {
      // Call real API
      const response = await chatService.sendMessage(currentConversationId, userMessage);
      
      // Add AI response to UI
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { 
              ...conv, 
              messages: [...(conv.messages || []), { 
                sender: 'assistant', 
                text: response.message,
                confidence: response.confidence,
                sources: response.sources,
                timestamp: new Date().toISOString()
              }] 
            }
          : conv
      ));
      
      // Show warning for low confidence responses
      if (response.confidence < 0.7) {
        showSnackbar(
          'This response may not be accurate. A support agent has been notified.',
          'warning'
        );
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { 
              ...conv, 
              messages: [...(conv.messages || []), { 
                sender: 'assistant', 
                text: 'Sorry, I encountered an error processing your request. Please try again.',
                isError: true
              }] 
            }
          : conv
      ));
      
      showSnackbar('Failed to send message. Please try again.', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  const handleMarkConversationResolved = async (conversationId, solutionText) => {
    try {
      await chatService.resolveConversation(conversationId, solutionText);
      
      setConversations(prevConversations =>
        prevConversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              isResolved: true,
              resolvedDate: new Date().toLocaleDateString(),
              resolutionNotes: solutionText,
              messages: [
                ...(conv.messages || []), 
                {
                  sender: 'assistant', 
                  text: 'This conversation has been marked as resolved.'
                }
              ],
              feedbackGiven: false,
            };
          }
          return conv;
        })
      );
      
      showSnackbar(`Conversation ${conversationId} marked as resolved!`, 'success');
    } catch (error) {
      console.error('Error resolving conversation:', error);
      showSnackbar('Failed to resolve conversation', 'error');
    }
  };

  const handleResolveConversationForAdmin = async (conversationId, resolutionNotes) => {
    try {
      await adminService.resolveConversation(conversationId, resolutionNotes);
      
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId && !conv.isResolved
            ? {
                ...conv,
                isResolved: true,
                resolvedDate: new Date().toLocaleDateString(),
                messages: [
                  ...(conv.messages || []), 
                  {
                    sender: 'assistant', 
                    text: `This conversation was marked as resolved by Admin with notes: "${resolutionNotes}"`
                  }
                ],
                resolutionNotes: resolutionNotes,
                feedbackGiven: false,
              }
            : conv
        )
      );
      
      setSelectedConversationForAdmin(null);
      showSnackbar(`Conversation ${conversationId} resolved successfully!`, 'success');
    } catch (error) {
      console.error('Error resolving conversation:', error);
      showSnackbar('Failed to resolve conversation', 'error');
    }
  };

  // User Management Functions
  const handleAddUser = async (newUser) => {
    try {
      const addedUser = await adminService.addUser(newUser);
      setUsers(prevUsers => [...prevUsers, addedUser]);
      showSnackbar('User added successfully', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showSnackbar('Failed to add user', 'error');
    }
  };

  const handleUpdateUser = async (userId, updatedUser) => {
    try {
      await adminService.updateUser(userId, updatedUser);
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === userId ? updatedUser : user))
      );
      showSnackbar('User updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Failed to delete user', 'error');
    }
  };

  // Role Management Functions
  const handleOpenRoleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseRoleMenu = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (newRole) => {
    if (newRole !== null && newRole !== currentUserRole) {
      setCurrentUserRole(newRole);
      setSelectedConversationForAdmin(null);
      
      if (newRole === 'user') {
        const firstUnresolved = conversations.find(conv => !conv.isResolved);
        setCurrentConversationId(firstUnresolved ? firstUnresolved.id : null);
      } else {
        setCurrentConversationId(null);
      }
      
      // Refresh data for new role
      fetchInitialData();
    }
    handleCloseRoleMenu();
  };

  // Utility Functions
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Computed Values
  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === currentConversationId) || null;
  }, [currentConversationId, conversations]);

  const adminSelectedConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedConversationForAdmin?.id) || null;
  }, [selectedConversationForAdmin, conversations]);

  // Show loading screen during initial auth check
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#f8fafc'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderBottom: '1px solid',
          borderColor: '#e2e8f0',
          borderRadius: 0,
        }}
        elevation={0}
      >
        <Toolbar>
          {currentUserRole === 'user' && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              edge="start"
              sx={{ mr: 2, color: '#1e293b' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Branding and Global Controls */}
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
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', whiteSpace: 'nowrap' }}>
                SVAYAM-AMS: Intelligent Support Specialist
              </Typography>
            </Stack>

            {/* Right section: User Info & Role Switcher */}
 <Stack direction="row" alignItems="center" spacing={2}>
  <IconButton sx={{ color: '#64748b' }}>
    <NotificationsIcon />
  </IconButton>
  
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    onClick={handleOpenRoleMenu}
    sx={{ cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'grey.100' } }}
  >
    <Avatar sx={{ bgcolor: 'grey.300', color: 'text.primary', fontWeight: 'bold', width: 36, height: 36 }}>
      {globalUserDisplayName?.charAt(0) || 'U'}
    </Avatar>
    <Box>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
          {globalUserDisplayName}
        </Typography>
        <Chip 
          label={currentUserRole.toUpperCase()} 
          size="small" 
          color={currentUserRole === 'admin' ? 'error' : 'primary'}
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
        />
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {globalUserEmail}
      </Typography>
    </Box>
  </Stack>

  {/* User Menu - Only shows Logout now */}
  <Menu
    id="user-menu"
    anchorEl={anchorEl}
    open={openRoleMenu}
    onClose={handleCloseRoleMenu}
  >
    <MenuItem onClick={handleLogout}>
      Logout
    </MenuItem>
  </Menu>
</Stack>
</Box>
</Toolbar>
</AppBar>
      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexGrow: 1, mt: `${appBarHeight}px`, width: '100%' }}>
        
        {/* USER VIEW */}
        {currentUserRole === 'user' && (
          <>
            <UserSidebar
              conversations={conversations}
              onNewChat={handleNewChat}
              onSelectConversation={setCurrentConversationId}
              currentConversationId={currentConversationId}
              sidebarOpen={sidebarOpen}
              appBarHeight={appBarHeight}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: '#f8fafc',
                transition: (theme) => theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                display: 'flex',
                flexDirection: 'column',
                height: `calc(100vh - ${appBarHeight}px)`,
                overflow: 'hidden',
              }}
            >
              {dataLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Chatbot
                  currentConversation={currentConversation}
                  onSendMessage={handleSendMessageToChatbot}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  chatLoading={chatLoading}
                  onMarkConversationResolved={handleMarkConversationResolved}
                />
              )}
            </Box>
          </>
        )}

        {/* ADMIN VIEW */}
        {currentUserRole === 'admin' && (
          <>
            <AdminSidebar
              selectedTab={selectedAdminTab}
              onTabChange={setSelectedAdminTab}
              appBarHeight={appBarHeight}
            />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: '#f1f5f9',
                p: 4,
                minHeight: `calc(100vh - ${appBarHeight}px)`,
                overflow: 'auto',
                boxSizing: 'border-box',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                },
              }}
            >
              {dataLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {/* DASHBOARD TAB */}
                  {selectedAdminTab === 'dashboard' && (
                    <>
                      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          Dashboard
                        </Typography>
                      </Box>

                      {/* Search Bar */}
                      <Box sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            bgcolor: '#ffffff',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              '& fieldset': {
                                borderColor: '#e2e8f0',
                              },
                            }
                          }}
                        />
                      </Box>

                      {/* Stats Cards */}
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                              {users.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                              Total Users
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                              {stats.open}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                              Open Tickets
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                              {stats.resolved}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                              Resolved Tickets
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                              ${stats.aiCosts.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                              AI Costs
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* User Management and Knowledge Base */}
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} lg={6}>
                          <Paper elevation={0} sx={{
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 600,
                            overflow: 'hidden',
                          }}>
                            <AdminManagementPanel
                              users={users}
                              onAddUser={handleAddUser}
                              onUpdateUser={handleUpdateUser}
                              onDeleteUser={handleDeleteUser}
                            />
                          </Paper>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Paper elevation={0} sx={{
                            bgcolor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            height: 600
                          }}>
                            <KnowledgeBaseManagement />
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Recent Conversations */}
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Paper elevation={0} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1, overflow: 'hidden' }}>
                            <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0' }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Recent Conversations
                              </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                              <RecentConversationList
                                conversations={conversations}
                                users={users}
                                onConversationClick={(conv) => setSelectedConversationForAdmin(conv)}
                              />
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Conversation Detail View */}
                      {adminSelectedConversation && (
                        <Paper elevation={0} sx={{ mt: 3, border: '1px solid #e2e8f0', borderRadius: 1, overflow: 'hidden', bgcolor: '#ffffff' }}>
                          <Box sx={{ p: 3, bgcolor: alpha('#3b82f6', 0.03), borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              Conversation Details
                            </Typography>
                          </Box>
                          <Box sx={{ p: 3 }}>
                            <EngineerTicketDetail
                              ticket={{
                                id: adminSelectedConversation.id,
                                title: adminSelectedConversation.topic,
                                description: adminSelectedConversation.messages?.map(m => `${m.sender}: ${m.text}`).join('\n\n') || '',
                                status: adminSelectedConversation.isResolved ? 'resolved' : 'open',
                                priority: adminSelectedConversation.priority || 'Medium',
                                user: adminSelectedConversation.user,
                                createdAt: adminSelectedConversation.startDate,
                                engineerNotes: adminSelectedConversation.resolutionNotes || '',
                                llmSuggestion: 'AI Chat conversation. Review messages above.',
                                llmCost: 0,
                                llmTokens: 0,
                                llmModel: '',
                              }}
                              onBack={() => setSelectedConversationForAdmin(null)}
                              onResolveTicket={(convId, resolutionNotes) => handleResolveConversationForAdmin(convId, resolutionNotes)}
                              onLLMSuggestion={() => showSnackbar('LLM Suggestion feature coming soon', 'info')}
                            />
                          </Box>
                        </Paper>
                      )}
                    </>
                  )}

                  {/* USERS TAB */}
                  {selectedAdminTab === 'users' && (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          User Management
                        </Typography>
                      </Box>
                      <Paper elevation={0} sx={{
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: 'calc(100vh - 200px)',
                        overflow: 'hidden',
                      }}>
                        <AdminManagementPanel
                          users={users}
                          onAddUser={handleAddUser}
                          onUpdateUser={handleUpdateUser}
                          onDeleteUser={handleDeleteUser}
                        />
                      </Paper>
                    </>
                  )}

                  {/* KNOWLEDGE BASE TAB */}
                  {selectedAdminTab === 'knowledge-base' && (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          Knowledge Base
                        </Typography>
                      </Box>
                      <Paper elevation={0} sx={{
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 1,
                        overflow: 'hidden',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100vh - 200px)'
                      }}>
                        <KnowledgeBaseManagement />
                      </Paper>
                    </>
                  )}

                  {/* CONVERSATIONS TAB */}
                  {selectedAdminTab === 'conversations' && (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          All Conversations
                        </Typography>
                      </Box>
                      <Paper elevation={0} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            Conversation List
                          </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <RecentConversationList
                            conversations={conversations}
                            users={users}
                            onConversationClick={(conv) => setSelectedConversationForAdmin(conv)}
                          />
                        </Box>
                      </Paper>

                      {/* Conversation Detail View (if selected) */}
                      {adminSelectedConversation && (
                        <Paper elevation={0} sx={{ mt: 3, border: '1px solid #e2e8f0', borderRadius: 1, overflow: 'hidden', bgcolor: '#ffffff' }}>
                          <Box sx={{ p: 3, bgcolor: alpha('#3b82f6', 0.03), borderBottom: '1px solid #e2e8f0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              Conversation Details
                            </Typography>
                          </Box>
                          <Box sx={{ p: 3 }}>
                            <EngineerTicketDetail
                              ticket={{
                                id: adminSelectedConversation.id,
                                title: adminSelectedConversation.topic,
                                description: adminSelectedConversation.messages?.map(m => `${m.sender}: ${m.text}`).join('\n\n') || '',
                                status: adminSelectedConversation.isResolved ? 'resolved' : 'open',
                                priority: adminSelectedConversation.priority || 'Medium',
                                user: adminSelectedConversation.user,
                                createdAt: adminSelectedConversation.startDate,
                                engineerNotes: adminSelectedConversation.resolutionNotes || '',
                                llmSuggestion: 'AI Chat conversation. Review messages above.',
                                llmCost: 0,
                                llmTokens: 0,
                                llmModel: '',
                              }}
                              onBack={() => setSelectedConversationForAdmin(null)}
                              onResolveTicket={(convId, resolutionNotes) => handleResolveConversationForAdmin(convId, resolutionNotes)}
                              onLLMSuggestion={() => showSnackbar('LLM Suggestion feature coming soon', 'info')}
                            />
                          </Box>
                        </Paper>
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Global Snackbar for Notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;