// src/services/adminService.js
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_MOCK = !process.env.REACT_APP_API_URL;

let mockUsers = [
  { id: 'usr001', name: 'John Doe', email: 'john.doe@company.com', role: 'Admin', lastLogin: '2 hours ago' },
  { id: 'usr002', name: 'Alice Smith', email: 'alice.smith@company.com', role: 'Customer', lastLogin: '3 hours ago' },
  { id: 'usr003', name: 'Bob Engineer', email: 'bob@company.com', role: 'Contact', lastLogin: '1 day ago' }
];

let mockConversations = [];

export const adminService = {
  getDashboardStats: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        stats: {
          totalUsers: mockUsers.length,
          openConversations: 5,
          resolvedConversations: 12,
          totalDocuments: 45,
          aiCosts: 24.50,
          recentActivity: []
        }
      };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  },
  
  getUsers: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, users: mockUsers };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  },
  
  addUser: async (userData) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const newUser = {
        ...userData,
        id: `usr${String(mockUsers.length + 1).padStart(3, '0')}`,
        lastLogin: 'Just now'
      };
      mockUsers.push(newUser);
      return newUser;
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Failed to add user');
    return await response.json();
  },

  updateUser: async (userId, userData) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockUsers = mockUsers.map(u => u.id === userId ? { ...u, ...userData } : u);
      return { success: true };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  },

  deleteUser: async (userId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockUsers = mockUsers.filter(u => u.id !== userId);
      return { success: true };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to delete user');
    return await response.json();
  },

  getAllConversations: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, conversations: mockConversations };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
  },

  resolveConversation: async (conversationId, resolutionNotes) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockConversations = mockConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, isResolved: true, resolvedDate: new Date().toISOString().split('T')[0], resolutionNotes }
          : conv
      );
      return { success: true };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/conversations/${conversationId}/resolve`, {
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