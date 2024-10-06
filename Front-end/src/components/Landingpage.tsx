import React from 'react';
import { Button, Container, Box } from '@mui/material';
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
      <div className='flex flex-col items-center justify-center gap-4 '>
       <h2 className='text-4xl font-bold'>Welcome to Website Monitoring Dashboard</h2>
        <p className='text-lg'>
        You can easily create and monitor websites whether they are offline or online with our dashboard<br/> Just click on the button below to get started.
        </p>
      </div>
      
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
