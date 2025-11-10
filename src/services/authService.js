// src/services/authService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_MOCK = !process.env.REACT_APP_API_URL;
console.log("API_BASE_URL =", process.env.REACT_APP_API_URL);
console.log("USE_MOCK =", !process.env.REACT_APP_API_URL);

// Mock users database
const MOCK_USERS = [
  {
    id: 'user-001',
    email: 'user@company.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user'
  },
  {
    id: 'user-002',
    email: 'admin@company.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const token = 'mock-jwt-token-' + Date.now();
  
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  
  return {
    success: true,
    token: token,
    user: userData
  };
};

const realLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return await response.json();
};

export const authService = {
  login: async (email, password) => {
    try {
      const data = USE_MOCK 
        ? await mockLogin(email, password)
        : await realLogin(email, password);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};