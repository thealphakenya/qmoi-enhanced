
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function GitStatus() {
  // This would be dynamic in a real app
  const status = 'Up to date';
  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
      <Typography variant="h6">Git Status</Typography>
      <Typography>Status: <strong>{status}</strong></Typography>
    </Box>
  );
}