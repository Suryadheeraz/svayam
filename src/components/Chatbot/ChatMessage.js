// src/components/Chatbot/ChatMessage.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ChatMessage = ({ message, sender }) => {
  const isUser = sender === 'user';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 1.2,
          maxWidth: '80%',
          bgcolor: isUser ? 'primary.light' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
          borderRadius: isUser ? '10px 10px 0 10px' : '10px 10px 10px 0',
        }}
      >
        <Typography variant="body2">{message}</Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;