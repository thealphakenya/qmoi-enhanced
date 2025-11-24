import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export const AlphaQAiSystem: React.FC = () => {
	const [status, setStatus] = useState<'online' | 'offline'>('offline');

	const toggleStatus = () => {
		setStatus(status === 'online' ? 'offline' : 'online');
	};

	return (
		<Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
			<Typography variant="h6">Alpha Q AI System</Typography>
			<Typography sx={{ mb: 2 }}>Status: <strong>{status}</strong></Typography>
			<Button variant="contained" color={status === 'online' ? 'secondary' : 'primary'} onClick={toggleStatus}>
				{status === 'online' ? 'Go Offline' : 'Go Online'}
			</Button>
		</Box>
	);
};

export default AlphaQAiSystem; 