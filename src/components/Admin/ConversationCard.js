// src/components/Admin/ConversationCard.js
import React from 'react';
import { Paper, Typography, Stack, Avatar, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ConversationCard = ({ conversation = {}, users = [], onClick }) => {
  const messages = conversation?.messages || [];
  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  const user = users.find(u => u.name === conversation?.user) || null;

  const handleClick = () => {
    if (typeof onClick === 'function') onClick(conversation);
  };

  return (
    <Paper
      onClick={handleClick}
      sx={{
        p: 2,
        mb: 2,
        cursor: typeof onClick === 'function' ? 'pointer' : 'default',
        '&:hover': { boxShadow: 6 },
      }}
      elevation={1}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar>{user ? user.name?.[0] : (conversation?.user?.[0] || '?')}</Avatar>
        <Stack sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {conversation?.topic || 'Untitled conversation'}
            </Typography>
            <Chip
              size="small"
              icon={conversation?.isResolved ? <CheckCircleOutlineIcon /> : <HelpOutlineIcon />}
              label={conversation?.isResolved ? 'Resolved' : 'Open'}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {lastMessage?.text ? (lastMessage.text.length > 100 ? lastMessage.text.substring(0, 100) + '...' : lastMessage.text) : 'No messages yet.'}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.disabled">
              {conversation?.startDate || '—'}
            </Typography>
            {conversation?.isResolved && (
              <Typography variant="caption" color="text.disabled">
                • Resolved: {conversation?.resolvedDate || '—'}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ConversationCard;
