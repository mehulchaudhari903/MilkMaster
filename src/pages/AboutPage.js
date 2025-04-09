import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

function AboutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Team members data
  const teamMembers = [
    {
      name: 'John Smith',
      position: 'CEO & Founder',
      bio: 'With over 20 years of experience in the dairy industry, John founded MilkMaster B2B to provide premium quality dairy products to businesses.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sarah Johnson',
      position: 'Head of Operations',
      bio: 'Sarah oversees all operational aspects of our dairy production, ensuring the highest standards of quality and efficiency.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Chen',
      position: 'Sales Director',
      bio: 'Michael leads our B2B sales team, building strong relationships with clients and understanding their specific dairy product needs.',
      image: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      name: 'Emily Rodriguez',
      position: 'Quality Control Manager',
      bio: 'Emily ensures that all our products meet the strictest quality standards before they reach our B2B customers.',
      image: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  ];

  // Company values
  const values = [
    {
      title: 'Quality',
      description: 'We are committed to providing the highest quality dairy products by controlling every step of the process from farm to delivery.'
    },
    {
      title: 'Sustainability',
      description: 'Our sustainable farming practices ensure that we minimize environmental impact while maintaining the health and happiness of our cattle.'
    },
    {
      title: 'Reliability',
      description: 'We understand that businesses depend on consistent supply. Our reliable delivery and consistent product quality are cornerstones of our service.'
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate our processes and products to meet the evolving needs of our B2B customers in the food service industry.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                About MilkMaster B2B
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  maxWidth: 700,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Premium dairy products supplier for businesses since 
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: 600,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                MilkMaster B2B has been supplying high-quality dairy products to cafes, 
                restaurants, bakeries, and food manufacturers for nearly two decades. 
                Our commitment to quality, sustainability, and service has made us a 
                trusted partner for businesses across the country.
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: -100, md: -150 },
            right: { xs: -100, md: -150 },
            width: { xs: 300, md: 450 },
            height: { xs: 300, md: 450 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -100, md: -150 },
            left: { xs: -100, md: -150 },
            width: { xs: 250, md: 400 },
            height: { xs: 250, md: 400 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/assets/image/about.jpeg"
              alt="Dairy farm"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              MilkMaster B2B began as a small family-owned dairy farm in 2005. With a commitment 
              to producing the highest quality milk, we quickly gained a reputation among local 
              businesses for our fresh and delicious dairy products.
            </Typography>
            <Typography variant="body1" paragraph>
              As demand grew, we expanded our operations while maintaining our core values of 
              quality, sustainability, and service. Today, we operate multiple dairy farms and 
              a state-of-the-art processing facility, supplying premium dairy products to 
              businesses nationwide.
            </Typography>
            <Typography variant="body1">
              Our direct farm-to-business model allows us to maintain strict quality control at 
              every step, ensuring that our B2B customers receive the freshest and highest quality 
              dairy products for their businesses.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Our Values
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              The principles that guide everything we do
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 'auto' }}>
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>



    </Box>
  );
}

export default AboutPage; 