import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  LocalOffer as CouponIcon,
  ShoppingCart as ShoppingCartIcon,
  Storefront as StorefrontIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../theme/ThemeContext';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

function getNavItems(userType: string, userId: number): NavItem[] {
  switch (userType) {
    case 'ADMIN':
      return [
        { label: 'Dashboard', path: `/admin/${userId}`, icon: <DashboardIcon /> },
        { label: 'Companies', path: `/admin/${userId}/companies`, icon: <BusinessIcon /> },
        { label: 'Customers', path: `/admin/${userId}/customers`, icon: <PeopleIcon /> },
        { label: 'All Coupons', path: `/admin/${userId}/coupons`, icon: <CouponIcon /> },
      ];
    case 'COMPANY':
      return [
        { label: 'My Coupons', path: `/company/${userId}`, icon: <StorefrontIcon /> },
      ];
    case 'CUSTOMER':
      return [
        { label: 'Browse Coupons', path: `/customer/${userId}`, icon: <ShoppingCartIcon /> },
        { label: 'My Purchases', path: `/customer/${userId}/coupons`, icon: <CouponIcon /> },
      ];
    default:
      return [];
  }
}

/**
 * Dashboard layout with responsive sidebar, top app bar, and main content area.
 * Used for all authenticated pages (admin, company, customer).
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { name, userType, id: userId } = useAppSelector(state => state.auth);
  const { performLogout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => getNavItems(userType, userId), [userType, userId]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    performLogout();
  };

  const drawerWidth = isMobile ? DRAWER_WIDTH : (collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo / Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          px: collapsed && !isMobile ? 1 : 2.5,
          py: 2,
          minHeight: 64,
        }}
      >
        {(!collapsed || isMobile) && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            CoupCoupon
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={() => setCollapsed(!collapsed)} size="small">
            <ChevronLeftIcon
              sx={{
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation items */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    px: collapsed && !isMobile ? 2 : 2.5,
                    justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed && !isMobile ? 0 : 40,
                      color: isActive ? 'primary.contrastText' : 'text.secondary',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(!collapsed || isMobile) && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.875rem' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom section */}
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={toggleTheme}
          sx={{ borderRadius: 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}
        >
          <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 40, justifyContent: 'center' }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          {(!collapsed || isMobile) && (
            <ListItemText
              primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
            aria-label="open navigation"
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* User menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{ paper: { sx: { mt: 1, minWidth: 180 } } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>{name}</Typography>
              <Typography variant="caption" color="text.secondary">{userType}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar — mobile (temporary drawer) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar — desktop (permanent drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
