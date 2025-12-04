
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export function QIStateWindow() {
  const [state, setState] = useState<'active' | 'inactive'>('inactive');

  const toggleState = () => {
    setState(state === 'active' ? 'inactive' : 'active');
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
      <Typography variant="h6">QI State Window</Typography>
      <Typography sx={{ mb: 2 }}>Current State: <strong>{state}</strong></Typography>
      <Button variant="contained" color={state === 'active' ? 'secondary' : 'primary'} onClick={toggleState}>
        {state === 'active' ? 'Deactivate' : 'Activate'}
      </Button>
    </Box>
  );
}