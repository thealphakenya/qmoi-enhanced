"use client";

import * as React from 'react';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import ChatIcon from '@mui/icons-material/Chat';

export function FloatingAQ() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
      <Tooltip title={open ? 'Close AQ Panel' : 'Open AQ Panel'}>
        <Fab color={open ? 'secondary' : 'primary'} onClick={handleClick}>
          <ChatIcon />
        </Fab>
      </Tooltip>
      {open && (
        <div style={{ position: 'absolute', bottom: 72, right: 0, width: 300, background: '#fff', border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 16 }}>
          <h3>Alpha Q Quick Panel</h3>
          <p>Access quick actions and info here.</p>
        </div>
      )}
    </div>
  );
}