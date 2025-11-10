// src/components/EngineerTicketDetail.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl, Stack, Chip, Paper, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlashOnIcon from '@mui/icons-material/FlashOn';

// Mock LLM suggestions (can be moved to a service in real app)
const mockLLMSuggestions = {
    'TKT001': {
        suggestion: `For printer issues: 1. Check cable connections. 2. Restart printer and computer. 3. Update printer drivers. 4. Clear print queue. If network printer, ping its IP.`,
        cost: 0.015,
        tokens: 120
    },
    'TKT002': {
        suggestion: `For dashboard loading issues: 1. Optimize database queries (add indexes, reduce joins). 2. Cache frequently accessed data. 3. Lazy load components. 4. Reduce data transferred by pagination or server-side filtering.`,
        cost: 0.0375,
        tokens: 1250
    },
    'TKT003': {
        suggestion: `To handle API rate limits: 1. Implement exponential backoff for retries. 2. Use client-side rate limiting. 3. Request higher limits from API provider. 4. Cache API responses where possible.`,
        cost: 0.0220,
        tokens: 800
    },
    'TKT004': {
        suggestion: `For email notification failures: 1. Check mail server logs for delivery errors. 2. Verify recipient email addresses. 3. Check spam filters on both ends. 4. Test notification service with a known working email. 5. Review application's email sending configuration and credentials.`,
        cost: 0.0180,
        tokens: 150
    },
    // Default for tickets not explicitly mocked
    'default': {
        suggestion: `LLM couldn't find a specific solution. General troubleshooting steps include: review recent changes, check logs, restart related services, verify network connectivity.`,
        cost: 0.01,
        tokens: 80
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


const EngineerTicketDetail = ({ ticket, onBack, onResolveTicket, onLLMSuggestion }) => {
  const [engineerNotes, setEngineerNotes] = useState(ticket.engineerNotes || '');
  const [selectedLLM, setSelectedLLM] = useState('gpt-3.5-turbo');

  useEffect(() => {
      setEngineerNotes(ticket.engineerNotes || ''); // Update notes if ticket changes
      setSelectedLLM(ticket.llmModel || 'gpt-3.5-turbo'); // Set LLM if already used
  }, [ticket]);

  const handleGetLLMSuggestion = () => {
    // Simulate API call to LLM
    const llmOutput = mockLLMSuggestions[ticket.id] || mockLLMSuggestions['default'];

    onLLMSuggestion(ticket.id, llmOutput.suggestion, selectedLLM, llmOutput.cost, llmOutput.tokens);
  };

  const handleResolve = () => {
    if (engineerNotes.trim()) {
      onResolveTicket(ticket.id, engineerNotes);
    } else {
      alert('Please add resolution notes before marking as resolved.');
    }
  };

  const isResolved = ticket.status === 'resolved';

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        variant="text"
        sx={{ mb: 3, textTransform: 'none' }}
      >
        Back to All Tickets
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Ticket #{ticket.id} - {ticket.title}
      </Typography>

      <Stack direction="row" spacing={1} mb={2} alignItems="center">
        <Chip
          label={ticket.status === 'in-progress' ? 'In Progress' : ticket.status}
          color={ticket.status === 'open' ? 'error' : ticket.status === 'in-progress' ? 'warning' : 'success'}
          sx={{ textTransform: 'capitalize' }}
        />
        <Chip
          label={`Priority: ${ticket.priority}`}
          sx={getPriorityChipColor(ticket.priority)}
        />
        <Chip label={`Category: ${ticket.category}`} variant="outlined" />
        <Typography variant="body2" color="text.secondary">
            Created: {ticket.createdAt} by {ticket.user}
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{ mb: 3 }}>
        <strong>Description:</strong> {ticket.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        LLM Assistance
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FormControl sx={{ minWidth: 200 }} size="small" disabled={isResolved}>
          <InputLabel id="llm-model-select-label">Select LLM Model</InputLabel>
          <Select
            labelId="llm-model-select-label"
            value={selectedLLM}
            label="Select LLM Model"
            onChange={(e) => setSelectedLLM(e.target.value)}
          >
            <MenuItem value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</MenuItem>
            <MenuItem value="gpt-4">OpenAI GPT-4</MenuItem>
            <MenuItem value="gemini-pro">Google Gemini Pro</MenuItem>
            <MenuItem value="llama-2-70b">Meta Llama 2 (70B)</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleGetLLMSuggestion}
          startIcon={<FlashOnIcon />}
          disabled={isResolved}
        >
          Get LLM Suggestion
        </Button>
      </Stack>

      {ticket.llmSuggestion && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center' }}>
            <FlashOnIcon sx={{ mr: 1, color: 'status.aiAssisted' }} /> LLM Suggestion ({ticket.llmModel}):
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {ticket.llmSuggestion}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Tokens Used: {ticket.llmTokens}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cost: ${ticket.llmCost?.toFixed(4)}
            </Typography>
          </Stack>
          {/* Add a button here to 'Apply Suggestion' which could copy to engineer notes */}
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Engineer Notes / Resolution
      </Typography>
      <TextField
        label="Your Notes"
        fullWidth
        multiline
        rows={6}
        value={engineerNotes}
        onChange={(e) => setEngineerNotes(e.target.value)}
        sx={{ mb: 2 }}
        disabled={isResolved}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {!isResolved ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleResolve}
            disabled={!engineerNotes.trim()}
          >
            Resolve Ticket
          </Button>
        ) : (
          <Chip label="Ticket Resolved" color="success" sx={{ fontSize: '1rem', p:1 }} />
        )}
      </Stack>
    </Box>
  );
};

export default EngineerTicketDetail;