import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const RELEASES = [
	{ version: 'v1.0', desc: 'Initial release with core features.' },
	{ version: 'v1.1', desc: 'Added AI trading and chatbot.' },
	{ version: 'v1.2', desc: 'Performance improvements and bug fixes.' }
];

export const ReleaseNotes: React.FC = () => (
	<Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, maxWidth: 400 }}>
		<Typography variant="h6">Release Notes</Typography>
		{RELEASES.map((note, idx) => (
			<Box key={idx} sx={{ mb: 2 }}>
				<Typography variant="subtitle1">{note.version}</Typography>
				<Typography variant="body2">{note.desc}</Typography>
			</Box>
		))}
	</Box>
);

export default ReleaseNotes; 