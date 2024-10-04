import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Landingpage: React.FC = () => {
  return (
    <>
    <Box sx={{
      backgroundImage: `url('umuravaimage.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minheight: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
    <Container
      maxWidth="sm"
      sx={{
        textAlign: 'center',
        minHeight: '100vh', 
        padding: '20px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Website Monitoring Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        You can easily create and monitor websites whether they are offline or online with our dashboard. Just click on the button below to get started.
      </Typography>
      <Box mt={4}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={Link} 
          to="/Dashboard/homepage"
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
    </Box>
    </>
  );
};

export default Landingpage;
