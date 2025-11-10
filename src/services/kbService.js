// src/services/kbService.js
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_MOCK = !process.env.REACT_APP_API_URL;

const mockKBStructure = [
  {
    id: 'kb-001', 
    name: 'SEWA', 
    type: 'folder', 
    children: [
      {
        id: 'kb-001-001', 
        name: 'Authorization', 
        type: 'folder', 
        children: [
          { 
            id: 'kb-001-001-001', 
            name: 'Auth_Guide.pdf', 
            type: 'file', 
            content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            status: 'indexed',
            size: 1024000,
            uploadedAt: '2024-01-15'
          }
        ]
      }
    ]
  }
];

export const kbService = {
  getKnowledgeBase: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, knowledgeBase: mockKBStructure };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/structure`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch knowledge base');
    return await response.json();
  },

  getDocuments: async (folderId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true, documents: [] };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/documents?folderId=${folderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  },

  uploadDocument: async (file, category, folderId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        document: {
          id: `doc-${Date.now()}`,
          filename: file.name,
          blobUrl: URL.createObjectURL(file),
          status: 'processing',
          uploadedAt: new Date().toISOString(),
          size: file.size
        }
      };
    }
    
    const token = authService.getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('folderId', folderId);
    
    const response = await fetch(`${API_BASE_URL}/kb/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  },

  getDocumentStatus: async (documentId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 'indexed', chunks: 5 };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/documents/${documentId}/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to fetch document status');
    return await response.json();
  },

  deleteDocument: async (documentId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/documents/${documentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to delete document');
    return await response.json();
  },

  renameDocument: async (documentId, newName) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/documents/${documentId}/rename`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newName })
    });
    
    if (!response.ok) throw new Error('Failed to rename document');
    return await response.json();
  },

  downloadDocument: async (documentId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return new Blob(['Mock file content'], { type: 'application/pdf' });
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/documents/${documentId}/download`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to download document');
    return await response.blob();
  },

  createFolder: async (parentId, folderName) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: 'folder',
        children: []
      };
    }
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/kb/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ parentId, name: folderName })
    });
    
    if (!response.ok) throw new Error('Failed to create folder');
    return await response.json();
  }
};