// src/components/Admin/AdminPanel.js (This remains a general placeholder for other admin tools)
import React from 'react';
import { Typography, Paper } from '@mui/material';

const AdminPanel = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Admin Specific Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This section can contain tools unique to the Admin role, like system settings, audit logs, or configuration management.
      </Typography>
    </Paper>
  );
};

export default AdminPanel;