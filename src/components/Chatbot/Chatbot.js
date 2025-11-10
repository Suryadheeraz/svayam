// src/components/Chatbot/Chatbot.js

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Paper,
  Rating, // NEW: Import Rating component for feedback
  Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatMessage from './ChatMessage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FeedbackIcon from '@mui/icons-material/Feedback'; // NEW: Import Feedback icon

// Dummy Knowledge Base Solutions for demonstration (from UserChatThread)
const mockKnowledgeBaseSolutions = {
  'TKT001': `Solution for Login Issues with SSO:
1. Ensure your company email is correct and active.
2. Clear browser cache and cookies, then try logging in again.
3. Attempt to log in using an incognito/private browser window.
4. Verify your network connection is stable.
5. If the issue persists, contact IT support directly for a password reset on the SSO system.`,
  'TKT002': `Solution for Dashboard Loading Slowly:
1. Try refreshing the page after 5 minutes.
2. Check your internet connection speed.
3. If using a VPN, try disconnecting and reconnecting.
4. Reduce the data range of the dashboard view if possible.
5. The IT team is aware of potential performance issues and is working on database optimization. Your patience is appreciated.`,
  'TKT004': `Solution for Email Notifications Failing:
1. Check your spam/junk folder for missing notifications.
2. Ensure your email client is correctly configured and receiving other emails.
3. Verify your notification settings in your profile.
4. If you have an IT ticketing system, check if notification logs show successful delivery.`,
  'default': `General solution from knowledge base:
1. Restart your device (computer, phone, router).
2. Check for pending updates and install them.
3. Clear temporary files and browser cache.
4. If it's a software issue, try reinstalling the application.
5. If none of these work, please provide more details to IT support.`
};

const Chatbot = ({ currentConversation, onSendMessage, chatInput, setChatInput, chatLoading, onMarkConversationResolved }) => {
  const messagesEndRef = useRef(null);

  const [openResolveDialog, setOpenResolveDialog] = useState(false);

  // NEW: State for feedback
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // To prevent multiple submissions

  useEffect(() => {
    if (currentConversation?.messages.length > 0) {
      scrollToBottom();
    }
    // NEW: Reset feedback state when conversation changes
    setFeedbackSubmitted(currentConversation?.feedbackGiven || false);
    setFeedbackRating(0);
    setFeedbackComment('');
  }, [currentConversation?.messages, currentConversation?.id, currentConversation?.feedbackGiven]); // Added currentConversation.feedbackGiven

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInternalSendMessage = async () => {
    await onSendMessage(chatInput);
  };

  const handleOpenResolveDialog = () => {
    setOpenResolveDialog(true);
  };

  const handleCloseResolveDialog = () => {
    setOpenResolveDialog(false);
  };

  const handleConfirmResolve = () => {
    if (currentConversation) {
        const solutionText = mockKnowledgeBaseSolutions[currentConversation.ticketId] || mockKnowledgeBaseSolutions['default'];
        onMarkConversationResolved(currentConversation.id, solutionText);
    }
    handleCloseResolveDialog();
  };

  // NEW: Feedback handlers
  const handleOpenFeedbackDialog = () => {
    setOpenFeedbackDialog(true);
  };

  const handleCloseFeedbackDialog = () => {
    setOpenFeedbackDialog(false);
    // Optionally reset fields here if dialog is closed without submitting
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = () => {
    if (currentConversation && (feedbackRating > 0 || feedbackComment.trim())) {
      console.log(`Feedback for conversation ${currentConversation.id}:`);
      console.log(`Rating: ${feedbackRating} stars`);
      console.log(`Comment: "${feedbackComment.trim()}"`);
      // In a real app, you would send this data to an API
      // For this mock, we'll just update the local state to show it's submitted
      setFeedbackSubmitted(true);
      // You might also want to update currentConversation's `feedbackGiven` property in App.js
      // For simplicity, we'll just rely on the local state here.
      alert('Thank you for your feedback!');
      handleCloseFeedbackDialog();
    } else {
      alert('Please provide a rating or a comment.');
    }
  };


  if (!currentConversation) {
    return (
        <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" color="text.secondary">
                Select a chat from the sidebar or start a new one.
            </Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Conversation Header (formerly part of UserChatThread) */}
      <Paper elevation={1} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderRadius: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{p: 2}}>
          {currentConversation.isResolved ? (
            <CheckCircleOutlineIcon color="success" />
          ) : (
            <HelpOutlineIcon color="warning" />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {currentConversation.topic || `Conversation ${currentConversation.id}`}
          </Typography>
        </Stack>
        {/* NEW: Conditional rendering for "Mark as Resolved" and "Give Feedback" buttons */}
        <Stack direction="row" spacing={1} sx={{ p: 2, mr: 2 }}>
            {!currentConversation.isResolved && (
            <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={handleOpenResolveDialog}
                size="small"
            >
                Mark as Resolved
            </Button>
            )}
            {currentConversation.isResolved && !feedbackSubmitted && ( // Show "Give Feedback" if resolved and no feedback yet
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FeedbackIcon />}
                    onClick={handleOpenFeedbackDialog}
                    size="small"
                >
                    Give Feedback
                </Button>
            )}
            {currentConversation.isResolved && feedbackSubmitted && ( // Show "Feedback Submitted" if resolved and feedback given
                <Chip
                    label="Feedback Submitted"
                    icon={<FeedbackIcon />}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ height: 32, '& .MuiChip-icon': { fontSize: 18 } }}
                />
            )}
        </Stack>
      </Paper>

      {/* Conversation Metadata */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2 }}>
        Started: {currentConversation.startDate}
        {currentConversation.isResolved && ` | Resolved: ${currentConversation.resolvedDate}`}
      </Typography>

      {/* <Divider sx={{ my: 2, px: 2 }} /> */}

      {/* Chat Messages Area */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
        {currentConversation.messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} sender={msg.sender} />
        ))}
        {chatLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
          </Box>
        )}
        {currentConversation.resolutionNotes && (
          <Box sx={{ p: 1.5, bgcolor: 'success.light', color: 'white', borderRadius: 1, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Resolution Notes (from Knowledge Base):
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {currentConversation.resolutionNotes}
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Divider sx={{ mx: 2 }} />

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', flexShrink: 0 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Enter a prompt here..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !chatLoading && !currentConversation.isResolved) { // Disable input if resolved
              handleInternalSendMessage();
            }
          }}
          disabled={currentConversation.isResolved} // Disable input if resolved
          InputProps={{
            startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1 }}>
                    <IconButton color="primary" size="small" sx={{ bgcolor: 'primary.light', '&:hover': {bgcolor: 'primary.dark'}, color: 'white' }} disabled={currentConversation.isResolved}>
                        <AddIcon />
                    </IconButton>
                    <IconButton color="primary" size="small" sx={{ ml: 1, mr: 1 }} disabled={currentConversation.isResolved}>
                        <AttachFileIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">Tools</Typography>
                </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {chatLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                <IconButton onClick={handleInternalSendMessage} disabled={chatLoading || !chatInput.trim() || currentConversation.isResolved} color="primary">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: 'text.secondary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            Prompt gallery
        </Typography>
      </Box>

      {/* Confirmation Dialog for Marking as Resolved */}
      <Dialog
        open={openResolveDialog}
        onClose={handleCloseResolveDialog}
        aria-labelledby="resolve-dialog-title"
        aria-describedby="resolve-dialog-description"
      >
        <DialogTitle id="resolve-dialog-title">Confirm Resolution</DialogTitle>
        <DialogContent>
          <DialogContentText id="resolve-dialog-description">
            Are you sure you want to mark this conversation as resolved? This will add a knowledge base solution to the ticket notes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResolveDialog}>Cancel</Button>
          <Button onClick={handleConfirmResolve} variant="contained" color="success" autoFocus>
            Resolve
          </Button>
        </DialogActions>
      </Dialog>

      {/* NEW: Feedback Dialog */}
      <Dialog
        open={openFeedbackDialog}
        onClose={handleCloseFeedbackDialog}
        aria-labelledby="feedback-dialog-title"
      >
        <DialogTitle id="feedback-dialog-title">How was your experience?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide your feedback on this conversation.
          </DialogContentText>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="conversation-feedback-rating"
            value={feedbackRating}
            onChange={(event, newValue) => {
              setFeedbackRating(newValue);
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Additional Comments (Optional)"
            multiline
            rows={4}
            fullWidth
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitFeedback}
            variant="contained"
            disabled={feedbackRating === 0 && feedbackComment.trim() === ''}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chatbot;