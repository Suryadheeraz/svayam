// src/components/TicketFormModal.js
import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Stack
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const TicketFormModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description) {
      onSubmit({ title, description, priority, category });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('General');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-ticket-modal-title"
    >
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="create-ticket-modal-title" variant="h6" component="h2" mb={3}>
          Raise a New Ticket
        </Typography>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit Ticket
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TicketFormModal;