import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import photo from "../../assets/signin.jpg"
import { login } from "../api"
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Store, Person, PersonOutline } from '@mui/icons-material';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));


const BackgroundImage = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${photo})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.up('md')]: {
    height: '100vh',
    width: '50%',
  },
  [theme.breakpoints.down('md')]: {
    height: '100vh',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
}));

export default function Login({ onLoginSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('customer');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      setUserType(newUserType);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let endpoint = '/auth/login';
      switch (userType) {
        case 'owner':
          endpoint = '/auth/login-store';
          break;
        case 'staff':
          endpoint = '/auth/login-staff';
          break;
        default:
          endpoint = '/auth/login-customer';
      }
      const user = await login(endpoint, { email, password });
      navigate(`/${user.role}`);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <BackgroundImage />
      <Container 
        component="main" 
        maxWidth="xs" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: isMobile ? '100%' : '50%',
          ml: isMobile ? 0 : 'auto',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.9)' : 'white',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Login to TipNex
          </Typography>
          
          <StyledToggleButtonGroup
            value={userType}
            exclusive
            onChange={handleUserTypeChange}
            aria-label="user type"
            sx={{ mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <ToggleButton value="customer" aria-label="customer">
              <PersonOutline sx={{ mr: 1 }} />
              Customer
            </ToggleButton>
            <ToggleButton value="staff" aria-label="staff">
              <Person sx={{ mr: 1 }} />
              Staff
            </ToggleButton>
            <ToggleButton value="owner" aria-label="owner">
              <Store sx={{ mr: 1 }} />
              Owner
            </ToggleButton>
          </StyledToggleButtonGroup>

          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#229799',
                '&:hover': {
                  bgcolor: '#1b7b7d',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            By logging in, you agree to TipNex's Terms of Service and Privacy Policy.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}