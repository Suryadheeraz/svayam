// src/components/Admin/RecentConversationList.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import ConversationCard from './ConversationCard'; // Import the new card component

const RecentConversationList = ({ conversations, users, onConversationClick }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, mt: 4 }}>
        Recent Conversations
      </Typography>
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <ConversationCard
            key={conv.id}
            conversation={conv}
            users={users} // Pass users data to resolve names
            onClick={onConversationClick}
          />
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No recent conversations to display.
        </Typography>
      )}
    </Box>
  );
};

export default RecentConversationList;