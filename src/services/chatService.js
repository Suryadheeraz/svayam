// src/services/chatService.js
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_MOCK = !process.env.REACT_APP_API_URL;

let mockConversations = [
  {
    id: 'CONV001',
    topic: 'Login Issues with SSO',
    startDate: '2024-01-15',
    isResolved: false,
    messages: [
      { sender: 'user', text: 'I cannot log in using SSO. Password reset not working.' },
      { sender: 'assistant', text: 'I understand. Have you tried clearing your browser cache and cookies?' }
    ],
    user: 'John Doe',
    category: 'Account Access',
    priority: 'High',
  }
];

const mockSendMessage = async (conversationId, message) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "I understand your concern. Let me help you with that.",
    "Based on our knowledge base, here's what I found...",
    "That's a common issue. Here's how to resolve it:",
    "I've checked our documentation and found a solution.",
    "Let me walk you through the steps to fix this."
  ];
  
  const aiResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    success: true,
    message: aiResponse,
    confidence: 0.85,
    sources: [
      { title: 'User Guide', score: 0.92 },
      { title: 'FAQ Document', score: 0.78 }
    ],
    metadata: {
      tokens: 150,
      cost: 0.0045
    }
  };
};

const mockGetConversations = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    success: true,
    conversations: mockConversations
  };
};

const mockCreateConversation = async (topic) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newConv = {
    id: `CONV${String(mockConversations.length + 1).padStart(3, '0')}`,
    topic: topic || 'New Chat',
    startDate: new Date().toISOString().split('T')[0],
    isResolved: false,
    messages: [
      { sender: 'assistant', text: "Hello! How can I help you today?" }
    ],
    user: authService.getCurrentUser()?.name || 'User',
    category: 'General',
    priority: 'Medium'
  };
  
  mockConversations.unshift(newConv);
  return newConv;
};

const mockResolveConversation = async (conversationId, resolutionNotes) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockConversations = mockConversations.map(conv => 
    conv.id === conversationId 
      ? { ...conv, isResolved: true, resolvedDate: new Date().toISOString().split('T')[0], resolutionNotes }
      : conv
  );
  
  return { success: true };
};

export const chatService = {
  sendMessage: async (conversationId, message) => {
    if (USE_MOCK) {
      return await mockSendMessage(conversationId, message);
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ conversationId, message })
    });
    
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  },
  
  getConversations: async () => {
    if (USE_MOCK) {
      return await mockGetConversations();
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
  },
  
  createConversation: async (topic) => {
    if (USE_MOCK) {
      return await mockCreateConversation(topic);
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ topic })
    });
    
    if (!response.ok) throw new Error('Failed to create conversation');
    return await response.json();
  },

  resolveConversation: async (conversationId, resolutionNotes) => {
    if (USE_MOCK) {
      return await mockResolveConversation(conversationId, resolutionNotes);
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ resolutionNotes })
    });
    
    if (!response.ok) throw new Error('Failed to resolve conversation');
    return await response.json();
  }
};