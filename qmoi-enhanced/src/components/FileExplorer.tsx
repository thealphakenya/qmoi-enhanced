
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const mockFiles = [
  { name: 'src', type: 'folder' },
  { name: 'README.md', type: 'file' },
  { name: 'package.json', type: 'file' },
  { name: 'public', type: 'folder' },
  { name: 'next.config.js', type: 'file' },
];

export function FileExplorer() {
  return (
    <List sx={{ maxWidth: 300, bgcolor: 'background.paper', border: '1px solid #ccc', borderRadius: 2 }}>
      {mockFiles.map((item, idx) => (
        <ListItem key={idx}>
          <ListItemIcon>
            {item.type === 'folder' ? <FolderIcon /> : <InsertDriveFileIcon />}
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  );
}