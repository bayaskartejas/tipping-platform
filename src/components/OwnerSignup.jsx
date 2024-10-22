import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  Box, 
  IconButton,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,  
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';
import { Camera, X, Loader2, Trash2, Save } from 'lucide-react';
import { Signin2 } from './States';
import { WarningAlert } from './Alerts';
import Cropper from 'react-easy-crop';
import { Show } from '@chakra-ui/react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#229799',
    },
  },
});

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg');
  });
};

export default function OwnerSignup({ setShowOwnerSignup, setShowOtpVerify, setUserType, token, setToken }) {
  const [activeStep, setActiveStep] = useState(0);
  const [showWarning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [storeLogo, setStoreLogo] = useState(null);
  const [ownerSelfie, setOwnerSelfie] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [ownerData, setOwnerData] = useState({
    storeName: '',
    storeAddress: '',
    ownerName: '',
    day: '',
    month: '',
    year: '',
    gender: '',
    mobileNumber: '',
    aadhaarNumber: '',
    upiId: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (showWarning) {
      const element = document.getElementById('alert');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showWarning]);

  const fileInputRefLogo = useRef(null);
  const fileInputRefSelfie = useRef(null);
  const setSignin = useSetRecoilState(Signin2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submission started");
    console.log("Owner Data:", ownerData);
    console.log("Store Logo:", storeLogo);
    console.log("Owner Selfie:", ownerSelfie);

    if (password !== confirmPassword) {
      setWarning(true);
      setWarningMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const formData = {
        name: ownerData.storeName,
        address: ownerData.storeAddress,
        ownerName: ownerData.ownerName,
        ownerDob: `${ownerData.year}-${String(ownerData.month).padStart(2, '0')}-${String(ownerData.day).padStart(2, '0')}`,
        ownerGender: ownerData.gender,
        ownerPhone: ownerData.mobileNumber,
        ownerAadhaar: ownerData.aadhaarNumber,
        ownerUpi: ownerData.upiId,
        email: ownerData.email,
        password: password,
        logoFile: storeLogo ? {
          contentType: storeLogo.type
        } : null,
        ownerPhotoFile: ownerSelfie ? {
          contentType: ownerSelfie.type
        } : null
      };

      console.log("Form Data to be sent:", formData);

      const response = await axios.post('https://tipnex-server.tipnex.com/api/store/register', formData);
      console.log("Server Response:", response.data);
      
      if (response.data.logoPutUrl && storeLogo) {
        console.log("Uploading store logo");
        await axios.put(response.data.logoPutUrl, storeLogo, {
          headers: { 'Content-Type': storeLogo.type }
        });
      }
      if (response.data.ownerPhotoPutUrl && ownerSelfie) {
        console.log("Uploading owner selfie");
        await axios.put(response.data.ownerPhotoPutUrl, ownerSelfie, {
          headers: { 'Content-Type': ownerSelfie.type }
        });
      }

      localStorage.setItem('storeId', response.data.storeId);

      console.log("Registration successful, navigating to OTP verification");
      setShowOtpVerify(true);
      setShowOwnerSignup(false);
      setLoading(false);
      setUserType("store");
    } catch (error) {
      console.error("Error during form submission:", error);
      setWarning(true);
      setLoading(false);
      setWarningMessage(error.response?.data?.error || 'An error occurred');
      setUploadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setWarning(true);
        setWarningMessage("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target.result);
        setCurrentImageType(imageType);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(currentImage, croppedAreaPixels);
      if (currentImageType === 'logo') {
        setStoreLogo(croppedImage);
      } else if (currentImageType === 'selfie') {
        setOwnerSelfie(croppedImage);
      }
      setCurrentImage(null);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, currentImage, currentImageType]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Store Name"
              variant="outlined"
              margin="normal"
              required
              sx={{ my: 1 }}
              value={ownerData.storeName}
              onChange={(e) => setOwnerData({ ...ownerData, storeName: e.target.value })}
            />
            <TextField
              fullWidth
              label="Store Address"
              variant="outlined"
              margin="normal"
              multiline
              rows={3}
              required
              sx={{ my: 1 }}
              value={ownerData.storeAddress}
              onChange={(e) => setOwnerData({ ...ownerData, storeAddress: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
              <Button
                variant="contained"
                startIcon={<Camera />}
                onClick={() => fileInputRefLogo.current.click()}
              >
                Upload Logo
              </Button>
              <input
                type="file"
                ref={fileInputRefLogo}
                onChange={(e) => handleFileChange(e, 'logo')}
                hidden
                accept="image/*"
              />
              {storeLogo && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(storeLogo)}
                    alt="Store Logo"
                    sx={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', ml:5 }}
                  />
                  <IconButton onClick={() => setStoreLogo(null)} size="small">
                    <X size={16} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Owner Name"
              variant="outlined"
              margin="normal"
              required
              sx={{ my: 1 }}
              value={ownerData.ownerName}
              onChange={(e) => setOwnerData({ ...ownerData, ownerName: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
              <FormControl sx={{ width: '30%', my: 1 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={ownerData.day}
                  label="Day"
                  onChange={(e) => setOwnerData({ ...ownerData, day: e.target.value })}
                >
                  {[...Array(31)].map((_, i) => (
                    <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: '30%', my: 1 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={ownerData.month}
                  label="Month"
                  onChange={(e) => setOwnerData({ ...ownerData, month: e.target.value })}
                >
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
                    <MenuItem key={i} value={i + 1}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: '30%', my: 1 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={ownerData.year}
                  label="Year"
                  onChange={(e) => setOwnerData({ ...ownerData, year: e.target.value })}
                >
                  {[...Array(100)].map((_, i) => (
                    <MenuItem key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <FormControl fullWidth margin="normal" sx={{ my: 1 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={ownerData.gender}
                label="Gender"
                onChange={(e) => setOwnerData({ ...ownerData, gender: e.target.value })}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              margin="normal"
              required
              type="number"
              sx={{ my: 1 }}
              value={ownerData.mobileNumber}
              onChange={(e) => setOwnerData({ ...ownerData, mobileNumber: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              required
              type="email"
              sx={{ my: 1 }}
              value={ownerData.email}
              onChange={(e) => {
                setOwnerData({ ...ownerData, email: e.target.value });
                sessionStorage.setItem("email", e.target.value);
              }}
            />
            <TextField
              fullWidth
              label="Aadhaar Number"
              variant="outlined"
              margin="normal"
              required
              type="number"
              sx={{ my: 1 }}
              value={ownerData.aadhaarNumber}
              onChange={(e) => setOwnerData({ ...ownerData, aadhaarNumber: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
              <Button
                variant="contained"
                startIcon={<Camera />}
                onClick={() => fileInputRefSelfie.current.click()}
              >
                Upload Selfie
              </Button>
              <input
                type="file"
                ref={fileInputRefSelfie}
                onChange={(e) => handleFileChange(e, 'selfie')}
                hidden
                accept="image/*"
              />
              {ownerSelfie && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={URL.createObjectURL(ownerSelfie)}
                    alt="Owner Selfie"
                    sx={{ width: 64,   height: 64, borderRadius: '50%', objectFit: 'cover', ml:5 }}
                  />
                  <IconButton onClick={() => setOwnerSelfie(null)} size="small">
                    <X size={16} />
                  </IconButton>
                </Box>
              )}
            </Box>
            <TextField
              fullWidth
              label="UPI ID"
              variant="outlined"
              margin="normal"
              required
              sx={{ my: 1 }}
              value={ownerData.upiId}
              onChange={(e) => setOwnerData({ ...ownerData, upiId: e.target.value })}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              required
              type="password"
              sx={{ my: 1 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              required
              type="password"
              sx={{ my: 1 }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 400, mx: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
        {showWarning && (
          <Alert id='alert' severity="warning" onClose={() => setWarning(false)} sx={{ mb: 2 }}>
            {warningMessage}
          </Alert>
        )}
        {uploadError && (
          <Alert severity="error" onClose={() => setUploadError(null)} sx={{ mb: 2 }}>
            {uploadError}
          </Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Create Owner Account</Typography>
          <IconButton onClick={() => setShowOwnerSignup(false)}>
            <X />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          For Store Owners
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Store Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Owner Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create Password</StepLabel>
          </Step>
        </Stepper>
        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === 2 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Sign up"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && (!ownerData.storeName || !ownerData.storeAddress)) ||
                  (activeStep === 1 && (!ownerData.ownerName || !ownerData.email || !ownerData.mobileNumber))
                }
              >
                Next
              </Button>
            )}
          </Box>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => { setSignin(true); setShowOwnerSignup(false); }}
          >
            Sign in
          </Typography>
        </Typography>
        {currentImage && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'white',
                padding: 2,
                borderRadius: 2,
                width: '90%',
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Cropper
                image={currentImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
              <Button 
                onClick={handleCropSave} 
                variant="contained" 
                startIcon={<Save />}
                sx={{ mt: 2, width: '50%', position:"fixed" , bottom:50}}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </ThemeProvider>
  );
}