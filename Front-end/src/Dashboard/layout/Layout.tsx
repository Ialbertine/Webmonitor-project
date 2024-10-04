import React from 'react';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  // Ensure the drawerWidth is accessible here

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        style={{
          flexGrow: 1,
          marginTop: '64px',
          height: '100vh',
          // display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
