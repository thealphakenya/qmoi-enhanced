
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export function PreviewWindow() {
  return (
    <Card sx={{ maxWidth: 400, border: '1px solid #ccc', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6">Preview Window</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          This is a preview of your selected file or content. You can show markdown, images, or other file types here.
        </Typography>
      </CardContent>
    </Card>
  );
}