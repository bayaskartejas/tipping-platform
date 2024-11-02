import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import CouponSuccess from './CouponSuccess';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Typography,
  InputAdornment,
  Grid,
  Switch,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import MailIcon from '@mui/icons-material/Mail';
import StoreIcon from '@mui/icons-material/Store';
import { div, p } from 'framer-motion/client';

const steps = [
  'Basic Details',
  'Usage Rules',
  'Restrictions',
  'Visibility'
];

const DateInput = ({ value, onChange, label }) => (
  <TextField
    fullWidth
    type="date"
    label={label}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    InputLabelProps={{ shrink: true }}
    required
  />
);

export default function ManageCoupons({onClose, onReappear, setShowCouponSuccess, setCouponDetails}) {
  const [activeStep, setActiveStep] = useState(0);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumPurchase: '',
    couponCode: '',
    expirationDate: '',
    totalUses: '',
    usesPerCustomer: '',
    applicableItems: 'all',
    specificItems: '',
    customerRestriction: 'none',
    termsConditions: '',
    visibility: {
      website: true,
      email: false,
      qrCode: false,
    },
    contactInfo: '',
  });

  useEffect(() => {
    validateStep();
  }, [formData, activeStep]);

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        setIsNextDisabled(
          !formData.title || !formData.description || !formData.discountValue ||
          !formData.couponCode || !formData.expirationDate
        );
        break;
      case 1:
        setIsNextDisabled(!formData.totalUses || !formData.usesPerCustomer);
        break;
      case 2:
        setIsNextDisabled(false); // No required fields in this step
        break;
      case 3:
        setIsNextDisabled(false); // No required fields in this step
        break;
      default:
        setIsNextDisabled(true);
    }
  };

  const handleIntValues = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
  };

  const handleVisibilityChange = (name) => {
    setFormData(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [name]: !prev.visibility[name]
      }
    }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setFormData(prev => ({ ...prev, expirationDate: new Date(formData.expirationDate)}))
      const response = await axios.post(`http://localhost:3000/api/coupon/create-coupon/:${localStorage.getItem("storeId")}`, formData, 
    {
      headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}
    });
      setCouponDetails({code: response.data.couponCode, description: response.data.description})
      onClose()
      setShowCouponSuccess(true)
    }
    catch(error){
      console.log(error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: 20% Off on All Items"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Brief description of the offer"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  label='Discount Type'
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="percentage">Percentage (%)</MenuItem>
                  <MenuItem value="fixed">Fixed Amount (₹)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount Value"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleIntValues}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {formData.discountType === 'percentage' ? '%' : '₹'}
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Coupon Code"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleChange}
                placeholder="Example: SAVE20"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateInput
                label="Expiration Date"
                value={formData.expirationDate}
                onChange={(value) => setFormData(prev => ({ ...prev, expirationDate: value}))}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Uses Allowed"
                name="totalUses"
                value={formData.totalUses}
                onChange={handleIntValues}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Uses per Customer"
                name="usesPerCustomer"
                value={formData.usesPerCustomer}
                onChange={handleIntValues}
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Purchase Requirement"
                name="minimumPurchase"
                value={formData.minimumPurchase}
                onChange={handleIntValues}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  name="applicableItems"
                  value={formData.applicableItems}
                  onChange={handleChange}
                >
                  <FormControlLabel value="all" control={<Radio />} label="Apply to all items" />
                  <FormControlLabel value="specific" control={<Radio />} label="Specific items only" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {formData.applicableItems === 'specific' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specific Items"
                  name="specificItems"
                  value={formData.specificItems}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  placeholder="Enter names of applicable items or services"
                />
              </Grid>
            )}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  name="customerRestriction"
                  value={formData.customerRestriction}
                  onChange={handleChange}
                >
                  <FormControlLabel value="new" control={<Radio />} label="New Customers Only" />
                  <FormControlLabel value="existing" control={<Radio />} label="Existing Customers Only" />
                  <FormControlLabel value="none" control={<Radio />} label="No Restrictions" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.visibility.website}
                    onChange={() => handleVisibilityChange('website')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StoreIcon sx={{ mr: 1 }} />
                    Display on website/app
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.visibility.email}
                    onChange={() => handleVisibilityChange('email')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MailIcon sx={{ mr: 1 }} />
                    Share via email
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.visibility.qrCode}
                    onChange={() => handleVisibilityChange('qrCode')}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <QrCodeIcon sx={{ mr: 1 }} />
                    Generate QR code for in-store use
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Information"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Contact details for customer inquiries about the coupon"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Box sx={{ 
        maxWidth: { xs: '100%', sm: 600 }, // Reduced from 800 to 600
        mx: 'auto', 
        p: { xs: 1, sm: 3 }, // Reduced padding on mobile
        scrollbarColor: "#229299",
        overflowY: "auto",
        maxHeight:"650px",
      }}>
        <Card sx={{p: {sm: 2}}}>
          
          <CardContent>
          
            <Typography variant="h5" gutterBottom sx={{ 
              color: '#229799', 
              mb: 3,
              mt:1,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Smaller font on mobile
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div className='ml-2'>Create New Coupon</div>
              <div className='mr-2'><X onClick={onClose}></X></div>
            </Typography>

            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 4,
                '& .MuiStepLabel-label': {
                  // Hide labels on mobile
                  display: { xs: 'none', sm: 'block' }
                },
                // Reduce spacing between steps on mobile
                '& .MuiStep-root': {
                  px: { xs: 0, sm: 1 },
                  '&:first-of-type': {
                    pl: { xs: 0 }
                  },
                  '&:last-of-type': {
                    pr: { xs: 0 }
                  }
                },
                // Ensure step numbers remain visible and centered
                '& .MuiStepLabel-iconContainer': {
                  px: { xs: 1, sm: 2 }
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
        </Stepper>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              {renderStepContent(activeStep)}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              px: { xs: 1, sm: 0 } // Add horizontal padding on mobile
            }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ 
                  visibility: activeStep === 0 ? 'hidden' : 'visible',
                  minWidth: { xs: '64px', sm: '80px' } // Smaller buttons on mobile
                }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: '#229799',
                    '&:hover': { bgcolor: '#1b7b7d' },
                    minWidth: { xs: '64px', sm: '80px' }
                  }}
                >
                  Create
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  sx={{
                    bgcolor: '#229799',
                    '&:hover': { bgcolor: '#1b7b7d' },
                    minWidth: { xs: '64px', sm: '80px' }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
    </div>
  );
}