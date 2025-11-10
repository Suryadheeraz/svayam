// src/components/RecentTicketList.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import TicketCard from './TicketCard';

const RecentTicketList = ({ tickets, onTicketClick }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 4 }}>
        Recent Tickets
      </Typography>
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} onClick={onTicketClick} />
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No tickets to display.
        </Typography>
      )}
    </Box>
  );
};

export default RecentTicketList;