// src/components/TicketCard.js
import React from 'react';
import { Paper, Typography, Chip, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlashOnIcon from '@mui/icons-material/FlashOn';

const getStatusIcon = (status) => {
  switch (status) {
    case 'open': return <ErrorOutlineIcon fontSize="small" sx={{ color: 'status.open' }} />;
    case 'in-progress': return <AccessTimeIcon fontSize="small" sx={{ color: 'status.inProgress' }} />;
    case 'resolved': return <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'status.resolved' }} />;
    default: return null;
  }
};

const getStatusChipColor = (status) => {
  switch (status) {
    case 'open': return 'error';
    case 'in-progress': return 'warning';
    case 'resolved': return 'success';
    default: return 'default';
  }
};

const getPriorityChipColor = (priority) => {
  switch (priority) {
    case 'critical': return { bgcolor: 'priority.critical', color: 'white' };
    case 'high': return { bgcolor: 'priority.high', color: 'white' };
    case 'medium': return { bgcolor: 'priority.medium', color: 'white' };
    case 'low': return { bgcolor: 'priority.low', color: 'white' };
    default: return { bgcolor: 'grey.400', color: 'white' };
  }
};

const TicketCard = ({ ticket, onClick }) => {
  const isClickable = typeof onClick === 'function';
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        cursor: isClickable ? 'pointer' : 'default',
        '&:hover': isClickable ? { boxShadow: 3 } : {},
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={isClickable ? () => onClick(ticket) : null}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {getStatusIcon(ticket.status)}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {ticket.title}
          </Typography>
          {ticket.aiAssisted && (
            <Chip
              label="AI"
              size="small"
              icon={<FlashOnIcon sx={{ color: 'status.aiAssisted !important' }} />}
              sx={{ bgcolor: 'background.default', '& .MuiChip-icon': { color: 'status.aiAssisted' } }}
            />
          )}
          {ticket.llmModel && (
            <Chip
              label={ticket.llmModel}
              size="small"
              sx={{ bgcolor: 'grey.200', color: 'text.primary' }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
            <Chip
                label={ticket.priority}
                size="small"
                sx={getPriorityChipColor(ticket.priority)}
            />
            <Chip
                label={ticket.status === 'in-progress' ? 'in progress' : ticket.status}
                size="small"
                color={getStatusChipColor(ticket.status)}
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
            />
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={1}>
        {ticket.description}
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mt: 'auto', pt: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.disabled">
            #{ticket.id.slice(3)}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {ticket.category}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {ticket.createdAt}
          </Typography>
          {ticket.llmTokens > 0 && (
            <Typography variant="caption" color="text.disabled">
              {ticket.llmTokens} tokens
            </Typography>
          )}
          {ticket.llmCost > 0 && (
            <Typography variant="caption" color="text.disabled">
              ${ticket.llmCost?.toFixed(4)}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TicketCard;