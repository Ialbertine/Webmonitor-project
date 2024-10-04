import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  ListItemButton,
  Box,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, useMediaQuery } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LanguageIcon from "@mui/icons-material/Language";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false); // State to control mobile drawer
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detect if the screen size is small

  // State to track the active link
  const [activeLink, setActiveLink] = useState<string>("/dashboard/homepage");

  const handleNavigation = (path: string) => {
    setActiveLink(path);
    navigate(path);
  };

  // Toggle the mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Toolbar>
        <Typography variant="h5" align="center" sx={{ width: "100%" }}>
          <img
            src="/internet-remove.png"
            alt="logo"
            style={{ maxWidth: "45%", height: "auto", objectFit: "contain", display: "block", margin: "10px auto" }}
          />
        </Typography>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={handleDrawerToggle}
            sx={{ position: "absolute", right: 10 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <List>
        <ListItemButton
          onClick={() => handleNavigation("/dashboard/homepage")}
          sx={{
            backgroundColor:
              activeLink === "/dashboard/homepage" ? "#e0f7fa" : "transparent",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor:
                activeLink === "/dashboard/homepage"
                  ? "#e0f7fa"
                  : "transparent",
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          onClick={() => handleNavigation("/dashboard/all_websites")}
          sx={{
            backgroundColor:
              activeLink === "/dashboard/all_websites"
                ? "#e0f7fa"
                : "transparent",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor:
                activeLink === "/dashboard/all_websites"
                  ? "#e0f7fa"
                  : "transparent",
            },
          }}
        >
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary="Monitored Websites" />
        </ListItemButton>

        <ListItemButton
          onClick={() => handleNavigation("/dashboard/create_website")}
          sx={{
            backgroundColor:
              activeLink === "/dashboard/create_website"
                ? "#e0f7fa"
                : "transparent",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor:
                activeLink === "/dashboard/create_website"
                  ? "#e0f7fa"
                  : "transparent",
            },
          }}
        >
          <ListItemIcon>
            <AddBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Add Website" />
        </ListItemButton>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List>
        <ListItemButton
          onClick={() => handleNavigation("/dashboard/settings")}
          sx={{
            backgroundColor:
              activeLink === "/dashboard/settings" ? "#e0f7fa" : "transparent",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor:
                activeLink === "/dashboard/settings"
                  ? "#e0f7fa"
                  : "transparent",
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton
          onClick={() => handleNavigation("/logout")}
          sx={{
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1400, 
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`, 
          ml: isMobile ? 0 : `${drawerWidth}px`, 
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {/* Menu Icon for Small Screens */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6"  noWrap sx={{ flexGrow: 1 }}>
            Website Monitoring Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer for larger screens */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Drawer for small screens */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            zIndex: 2000,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </div>
  );
};

export default Sidebar;
