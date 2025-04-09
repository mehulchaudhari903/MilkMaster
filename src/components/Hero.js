import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AnimatedCounter from './AnimatedCounter';

function Hero({ stats }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/products');
  };

  return (
    <Box
      sx={{
        pt: { xs: 4, sm: 6, md: 8 },
        pb: { xs: 5, sm: 8, md: 10 },
        bgcolor: '#f8f9fa',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
            <Box
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                py: { xs: 3, md: 0 },
              }}
            >
              <Typography
                variant="overline"
                component="div"
                sx={{ color: 'secondary.main', fontWeight: 600, mb: 1 }}
              >
                PREMIUM DAIRY PRODUCTS FOR BUSINESSES
              </Typography>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Quality Dairy Products for Your Business Needs
              </Typography>
              <Typography
                variant="h6"
                component="p"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: { md: '90%' }, fontWeight: 'normal' }}
              >
                We supply cafes, restaurants, bakeries, and food manufacturers with the highest quality milk and dairy products at wholesale prices.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={handleExplore}
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  Explore Products
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Sales
                </Button>
              </Box>
              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    minWidth: 100,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Typography 
                    variant="h4" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 700,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: 'secondary.main',
                      }
                    }}
                  >
                    <AnimatedCounter target={stats.totalProducts} duration={2500} />
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    Products
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    minWidth: 100,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Typography 
                    variant="h4" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 700,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: 'secondary.main',
                      }
                    }}
                  >
                    <AnimatedCounter target={stats.totalB2bClients} duration={2500} />
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    B2B Clients
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    minWidth: 100,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Typography 
                    variant="h4" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 700,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: 'secondary.main',
                      }
                    }}
                  >
                    24/7
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    Support
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: '70%',
                  height: '70%',
                  backgroundImage: 'radial-gradient(circle, #2e7d32 0%, transparent 70%)',
                  opacity: 0.2,
                  zIndex: 1,
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                },
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1000&auto=format&fit=crop"
                alt="Dairy products"
                sx={{
                  width: '100%',
                  maxHeight: { xs: 300, md: 400 },
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  position: 'relative',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Hero; 