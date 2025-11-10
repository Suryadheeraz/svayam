// src/components/Admin/AdminManagementPanel.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const AdminManagementPanel = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formUser, setFormUser] = useState({ name: '', email: '', role: 'agent' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAdd = () => { 
    setFormUser({ name: '', email: '', role: 'agent' }); 
    setEditingUser(null); 
    setOpenAdd(true); 
  };
  
  const handleCloseAdd = () => { 
    setOpenAdd(false); 
    setEditingUser(null); 
  };

  const handleSaveUser = () => {
    if (editingUser) {
      onUpdateUser(editingUser.id, { ...editingUser, ...formUser });
    } else {
      onAddUser(formUser);
    }
    handleCloseAdd();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormUser({ name: user.name, email: user.email, role: user.role || 'agent' });
    setOpenAdd(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2.5, 
        borderBottom: '1px solid #e2e8f0', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: 200,
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
              }
            }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAdd}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Table Container with Scroll */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(u => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(u)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField 
              label="Name" 
              value={formUser.name} 
              onChange={e=>setFormUser({...formUser, name: e.target.value})} 
              fullWidth 
            />
            <TextField 
              label="Email" 
              value={formUser.email} 
              onChange={e=>setFormUser({...formUser, email: e.target.value})} 
              fullWidth 
            />
            <TextField 
              label="Role" 
              value={formUser.role} 
              onChange={e=>setFormUser({...formUser, role: e.target.value})} 
              fullWidth 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveUser} 
            disabled={!formUser.name || !formUser.email}
          >
            {editingUser ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagementPanel;