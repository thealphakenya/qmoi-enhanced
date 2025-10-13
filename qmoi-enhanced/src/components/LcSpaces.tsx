
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function LcSpaces() {
  const [spaces, setSpaces] = useState<string[]>(['LC1', 'LC2']);
  const [newSpace, setNewSpace] = useState('');

  const addSpace = () => {
    if (newSpace.trim()) {
      setSpaces([...spaces, newSpace.trim()]);
      setNewSpace('');
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
      <Typography variant="h6">LC Spaces</Typography>
      <Box sx={{ mb: 2 }}>
        {spaces.map((space, idx) => (
          <Typography key={idx} sx={{ mb: 1 }}>{space}</Typography>
        ))}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={newSpace}
        onChange={e => setNewSpace(e.target.value)}
        placeholder="Add new LC space..."
        sx={{ mb: 1 }}
        onKeyDown={e => {
          if (e.key === 'Enter') addSpace();
        }}
      />
      <Button variant="contained" color="primary" onClick={addSpace} fullWidth>
        Add LC Space
      </Button>
    </Box>
  );
}