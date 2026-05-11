import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Card, CardContent, CardActionArea } from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  LocalOffer as CouponIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { PageTransition, StaggerContainer, StaggerItem } from '../../../shared/PageTransition';
import { StatCard, StatCardSkeleton } from '../../../shared';
import { PageHeader } from '../../../shared/PageHeader';
import { useAppSelector } from '../../../../hooks/useAppStore';
import axiosJWT from '../../../Util/AxiosJWT';

export function AdminMenu(): JSX.Element {
  const navigate = useNavigate();
  const { name, id: userId } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    companies: 0,
    coupons: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, companiesRes, couponsRes] = await Promise.all([
          axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/customers`),
          axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/companies`),
          axiosJWT.get(`${import.meta.env.VITE_API_URL}/admin/coupons`),
        ]);

        setStats({
          customers: Array.isArray(customersRes.data) ? customersRes.data.length : customersRes.data.content?.length || 0,
          companies: Array.isArray(companiesRes.data) ? companiesRes.data.length : companiesRes.data.content?.length || 0,
          coupons: Array.isArray(couponsRes.data) ? couponsRes.data.length : couponsRes.data.content?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    {
      title: 'Manage Companies',
      description: 'Add, update, or remove companies. View their coupons and details.',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      path: `/admin/${userId}/companies`,
      color: 'primary.main',
    },
    {
      title: 'Manage Customers',
      description: 'View customer profiles, their purchased coupons, and account details.',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: `/admin/${userId}/customers`,
      color: 'secondary.main',
    },
    {
      title: 'All Coupons',
      description: 'Browse and manage all coupons across the platform.',
      icon: <CouponIcon sx={{ fontSize: 40 }} />,
      path: `/admin/${userId}/coupons`,
      color: 'success.main',
    },
  ];

  return (
    <PageTransition>
      <PageHeader
        title={`Welcome back, ${name || 'Admin'}`}
        subtitle="Here's an overview of your platform"
      />

      {/* Stats Cards */}
      <StaggerContainer>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {loading ? (
            <>
              {[1, 2, 3].map(i => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <StatCardSkeleton />
                </Grid>
              ))}
            </>
          ) : (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <StaggerItem>
                  <StatCard
                    title="Total Customers"
                    value={stats.customers}
                    icon={<PeopleIcon />}
                    color="#7C3AED"
                  />
                </StaggerItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StaggerItem>
                  <StatCard
                    title="Total Companies"
                    value={stats.companies}
                    icon={<BusinessIcon />}
                    color="#2563EB"
                  />
                </StaggerItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StaggerItem>
                  <StatCard
                    title="Active Coupons"
                    value={stats.coupons}
                    icon={<CouponIcon />}
                    color="#10B981"
                  />
                </StaggerItem>
              </Grid>
            </>
          )}
        </Grid>
      </StaggerContainer>

      {/* Quick Links */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <StaggerContainer>
        <Grid container spacing={3}>
          {quickLinks.map((link) => (
            <Grid item xs={12} md={4} key={link.title}>
              <StaggerItem>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(link.path)}
                    sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${link.color}15`,
                        color: link.color,
                        mb: 2,
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {link.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {link.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <Typography variant="body2" fontWeight={600}>
                        Go to {link.title.split(' ')[1]}
                      </Typography>
                      <ArrowIcon fontSize="small" sx={{ ml: 0.5 }} />
                    </Box>
                  </CardActionArea>
                </Card>
              </StaggerItem>
            </Grid>
          ))}
        </Grid>
      </StaggerContainer>
    </PageTransition>
  );
}
