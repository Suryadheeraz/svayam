import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';

// Icons
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Mock Knowledge Base Structure
const initialKnowledgeBase = [
  {
    id: 'kb-001', name: 'SEWA', type: 'folder', children: [
      {
        id: 'kb-001-001', name: 'Authorization', type: 'folder', children: [
          { id: 'kb-001-001-001', name: 'Auth_Guide.pdf', type: 'file', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'kb-001-001-002', name: 'Role_Matrix.xlsx', type: 'file', content: 'https://www.learningcontainer.com/wp-content/uploads/2020/07/Sample-Spreadsheet-10-rows.xlsx' },
        ]
      },
      {
        id: 'kb-001-002', name: 'Basis', type: 'folder', children: [
          { id: 'kb-001-002-doc1', name: 'Basis_Overview.docx', type: 'file', content: 'https://file-examples.com/storage/fe3280148762747d1748239/2017/10/file-example_PPT_250kB.ppt' },
        ]
      },
      { id: 'kb-001-004', name: 'EAM', type: 'folder', children: [] },
      {
        id: 'kb-001-007', name: 'HCM', type: 'folder', children: [
          { id: 'kb-001-007-doc1', name: 'HCM_Overview.pdf', type: 'file', content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ]
      },
    ],
  },
];

const KnowledgeBaseManagement = () => {
  const [knowledgeBase, setKnowledgeBase] = useState(initialKnowledgeBase);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expanded, setExpanded] = useState({});

  const [openAddFolderDialog, setOpenAddFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const fileInputRef = useRef(null);

  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [renamingNodeName, setRenamingNodeName] = useState('');
  const [fileToRename, setFileToRename] = useState(null);

  const handleToggleExpand = (nodeId) => {
    setExpanded(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Recursive tree rendering
  const renderTreeItem = (node, level = 0) => {
    if (node.type !== 'folder') return null;
    const isExpanded = expanded[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <Box key={node.id}>
        <ListItem
          disablePadding
          sx={{
            bgcolor: selectedNode?.id === node.id ? 'primary.light' : 'transparent',
            borderRadius: 1,
          }}
        >
          <ListItemButton
            onClick={() => {
              setSelectedNode(node);
              if (hasChildren) handleToggleExpand(node.id);
            }}
            sx={{ pl: 2 + level * 2 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {isExpanded ? <FolderOpenIcon sx={{ color: 'primary.main' }} /> : <FolderIcon sx={{ color: 'primary.main' }} />}
            </ListItemIcon>
            <ListItemText primary={node.name} primaryTypographyProps={{ fontWeight: 500 }} />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children.map(child => renderTreeItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  // Helper functions
  const addNodeToTree = (nodes, parentId, newNode) => {
    return nodes.map(node => {
      if (node.id === parentId && node.type === 'folder') {
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (node.children) {
        return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  const updateNodeInTree = (nodes, nodeId, updateFn) => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return updateFn(node);
      }
      if (node.children) {
        return { ...node, children: updateNodeInTree(node.children, nodeId, updateFn) };
      }
      return node;
    });
  };

  const deleteNodeInTree = (nodes, nodeIdToDelete) => {
    return nodes.filter(node => node.id !== nodeIdToDelete).map(node => {
      if (node.children) {
        return { ...node, children: deleteNodeInTree(node.children, nodeIdToDelete) };
      }
      return node;
    });
  };

  // Action handlers
  const handleAddFolder = () => {
    if (!selectedNode || selectedNode.type !== 'folder') {
      alert('Please select a folder to add a new folder inside it.');
      return;
    }
    setOpenAddFolderDialog(true);
  };

  const confirmAddFolder = () => {
    if (newFolderName.trim() && selectedNode) {
      const newId = `${selectedNode.id}-${Date.now()}`;
      const newNode = { id: newId, name: newFolderName.trim(), type: 'folder', children: [] };
      setKnowledgeBase(prev => addNodeToTree(prev, selectedNode.id, newNode));
      setExpanded(prev => ({ ...prev, [selectedNode.id]: true }));
      setNewFolderName('');
      setOpenAddFolderDialog(false);
    }
  };

  const handleAddFile = () => {
    if (!selectedNode || selectedNode.type !== 'folder') {
      alert('Please select a folder to add a new file inside it.');
      return;
    }
    setOpenAddFileDialog(true);
  };

  const confirmAddFile = () => {
    if (newFileName.trim() && selectedNode) {
      const newId = `${selectedNode.id}-${Date.now()}`;
      const newNode = { id: newId, name: newFileName.trim(), type: 'file', content: newFileContent || `Mock content for ${newFileName.trim()}` };
      setKnowledgeBase(prev => addNodeToTree(prev, selectedNode.id, newNode));
      setExpanded(prev => ({ ...prev, [selectedNode.id]: true }));
      setNewFileName('');
      setNewFileContent('');
      setOpenAddFileDialog(false);
    }
  };

  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewFileName(file.name);
      setNewFileContent(`data:${file.type};name=${file.name};base64,...`);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setKnowledgeBase(prev => deleteNodeInTree(prev, fileId));
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2.5, 
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Knowledge Base Management
        </Typography>
      </Box>

      {/* Content Area with Scroll */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Tree View Section - 40% width */}
        <Box sx={{ 
          width: '40%', 
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Action Buttons */}
          <Box sx={{ p: 2, flexShrink: 0 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CreateNewFolderIcon />}
                onClick={handleAddFolder}
                disabled={!selectedNode || selectedNode.type !== 'folder'}
              >
                Add Folder
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<UploadFileIcon />}
                onClick={handleAddFile}
                disabled={!selectedNode || selectedNode.type !== 'folder'}
              >
                Add File
              </Button>
            </Stack>
          </Box>

          {/* Scrollable Tree */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
            <List>
              {knowledgeBase.map(node => renderTreeItem(node))}
            </List>
          </Box>
        </Box>

        {/* Details Section - 60% width */}
        <Box sx={{ 
          width: '60%', 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ p: 3, flex: 1, overflow: 'auto' }}>
            {selectedNode ? (
              selectedNode.type === 'folder' ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Files in "{selectedNode.name}"
                  </Typography>

                  {selectedNode.children && selectedNode.children.filter(c => c.type === 'file').length > 0 ? (
                    <Stack spacing={1.5}>
                      {selectedNode.children
                        .filter(child => child.type === 'file')
                        .map(file => (
                          <Paper key={file.id} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8fafc' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <InsertDriveFileIcon sx={{ color: 'text.secondary' }} />
                              <Typography>{file.name}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => file.content && window.open(file.content, '_blank')}
                                disabled={!file.content}
                              >
                                View
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DriveFileRenameOutlineIcon />}
                                onClick={() => {
                                  setFileToRename(file);
                                  setRenamingNodeName(file.name);
                                  setOpenRenameDialog(true);
                                }}
                              >
                                Rename
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Paper>
                        ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary">No files in this folder.</Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{selectedNode.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Type: File
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => selectedNode.content && window.open(selectedNode.content, '_blank')}
                    disabled={!selectedNode.content}
                  >
                    Download/View
                  </Button>
                </>
              )
            ) : (
              <Typography color="text.secondary">Select a folder to see its files.</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add Folder Dialog */}
      <Dialog open={openAddFolderDialog} onClose={() => setOpenAddFolderDialog(false)}>
        <DialogTitle>Add New Folder in "{selectedNode?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFolderDialog(false)}>Cancel</Button>
          <Button onClick={confirmAddFolder} variant="contained" disabled={!newFolderName.trim()}>
            Add Folder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add File Dialog */}
      <Dialog open={openAddFileDialog} onClose={() => setOpenAddFileDialog(false)}>
        <DialogTitle>Add New File in "{selectedNode?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="File Content (URL or text)"
            type="text"
            fullWidth
            variant="outlined"
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleUploadFile}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<UploadFileIcon />}
                  >
                    Browse
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFileDialog(false)}>Cancel</Button>
          <Button onClick={confirmAddFile} variant="contained" disabled={!newFileName.trim()}>
            Add File
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
        <DialogTitle>Rename "{fileToRename?.name || selectedNode?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            type="text"
            fullWidth
            variant="outlined"
            value={renamingNodeName}
            onChange={(e) => setRenamingNodeName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (!renamingNodeName.trim()) return;
              if (fileToRename) {
                setKnowledgeBase(prev => updateNodeInTree(prev, fileToRename.id, node => ({
                  ...node,
                  name: renamingNodeName.trim()
                })));
                setFileToRename(null);
              }
              setRenamingNodeName('');
              setOpenRenameDialog(false);
            }} 
            variant="contained" 
            disabled={!renamingNodeName.trim()}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KnowledgeBaseManagement;