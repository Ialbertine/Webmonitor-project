import React, { useState } from 'react';
import { Box, Button, TextField, Stack } from '@mui/material';

interface CreateProps {
  onSubmit: (newData: { Name: string; Url: string }) => void;
  onCancel: () => void;
}

const CreateWebsite: React.FC<CreateProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (name && url) {
      onSubmit({ Name: name, Url: url });
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
      sx={{
        padding: 4,
        width: '100%',
        maxWidth: '600px',
        margin: '20px auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 className='text-center text-2xl text-[#2d7bc9] font-semibold'>Add New Website</h2>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <TextField
          label="Website Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CreateWebsite;
