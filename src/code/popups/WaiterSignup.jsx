import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSetRecoilState } from 'recoil';
import { Signin2 } from '../States';
import { Loader2 } from 'lucide-react';
import { WarningAlert } from '../components/Alerts';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const steps = ['Personal Info', 'Work Details', 'Create Password'];

function WaiterSignup({ setShowWaiterSignup, setShowOtpVerify, setUserType }) {
  const setSignin = useSetRecoilState(Signin2);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    aadhaar: '',
    upi: '',
    storeId: '',
    password: '',
    confirmPassword: '',
  });
  const [showWarning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  useEffect(() => {
    validateStep();
  }, [formData, activeStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        setIsNextDisabled(
          !formData.firstName || !formData.lastName || !formData.email ||
          !formData.mobileNumber || !formData.gender || !formData.day ||
          !formData.month || !formData.year
        );
        break;
      case 1:
        setIsNextDisabled(!formData.aadhaar || !formData.upi || !formData.storeId);
        break;
      case 2:
        setIsNextDisabled(!formData.password || !formData.confirmPassword);
        break;
      default:
        setIsNextDisabled(false);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setWarningMessage("Passwords do not match");
      setWarning(true);
      setLoading(false);
      return;
    }

    const waiterData = {
      storeId: formData.storeId,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      aadhaar: parseInt(formData.aadhaar),
      upi: formData.upi,
      dob: `${formData.year}-${formData.month}-${formData.day}`,
      gender: formData.gender,
      number: parseInt(formData.mobileNumber),
      password: formData.password,
    };

    try {
      const response = await axios.post('https://tipnex-server.tipnex.com/api/staff/register', waiterData);
      sessionStorage.setItem("email", formData.email);
      sessionStorage.setItem("storeId", formData.storeId);
      setShowOtpVerify(true);
      setShowWaiterSignup(false);
      setUserType("staff");
    } catch (error) {
      setWarning(true);
      setWarningMessage(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                type="number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  label="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth required>
                <InputLabel >Day</InputLabel>
                <Select
                  name='day'
                  label="day"
                  value={formData.day}
                  onChange={handleChange}
                >
                  {[...Array(31)].map((_, i) => (
                    <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth required>
                <InputLabel>Month</InputLabel>
                <Select
                  name='month'
                  label="month"
                  value={formData.month}
                  onChange={handleChange}
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth required>
                <InputLabel>Year</InputLabel>
                <Select
                  name='year'
                  label="year"
                  value={formData.year}
                  onChange={handleChange}
                >
                  {[...Array(100)].map((_, i) => (
                    <MenuItem key={i} value={String(new Date().getFullYear() - i)}>
                      {new Date().getFullYear() - i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Aadhaar Number"
                name="aadhaar"
                type="number"
                value={formData.aadhaar}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UPI ID"
                name="upi"
                value={formData.upi}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Store ID"
                name="storeId"
                value={formData.storeId}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      {showWarning && (
        <Box sx={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1100, width: '100%', maxWidth: 'sm' }}>
          <WarningAlert message={warningMessage} onClose={() => setWarning(false)} />
        </Box>
      )}
      <Paper sx={{ width: '100%', maxWidth: 400, p: 3, borderRadius: 2, maxHeight: '90vh', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">Create Waiter Account</Typography>
          <IconButton onClick={() => setShowWaiterSignup(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', mb: 3 }}>
          {steps.map((label, index) => (
            <React.Fragment key={label}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: index === activeStep ? '#229799' : '#e0e0e0',
                  color: index === activeStep ? 'white' : 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 1,
                    bgcolor: index < activeStep ? '#229799' : '#e0e0e0',
                    my: 'auto',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight:500, fontSize:"20px" }}>{steps[activeStep]}</Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          {renderStepContent(activeStep)}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isNextDisabled}
            sx={{ bgcolor: '#229799', '&:hover': { bgcolor: '#1b7b7d' }, '&:disabled': { bgcolor: '#a0a0a0' } }}
          >
            {activeStep === steps.length - 1 ? (isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up') : 'Next'}
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button
              onClick={() => { setShowWaiterSignup(false); setSignin(true); }}
              sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline', color: '#229799' }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default WaiterSignup;