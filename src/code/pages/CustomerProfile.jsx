import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  CircularProgress,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack, CameraAlt, Visibility, VisibilityOff } from '@mui/icons-material';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNavigate } from 'react-router-dom';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


const AnimatedPaper = motion(Paper);
const AnimatedCard = motion(Card);

// Demo data (use only if customerData doesn't have the corresponding data)
const demoTransactionData = [
  { id: 1, paidBill: 50.00, paidTip: 7.50, restaurantName: "Tasty Bites" },
  { id: 2, paidBill: 35.00, paidTip: 5.25, restaurantName: "Burger Palace" },
  // ... (rest of the demo data)
];

const demoCoupons = [
  { id: 1, discount: 15, restaurantName: "Tasty Bites", validity: "2023-12-31", code: "TB15OFF2023" },
  { id: 2, discount: 20, restaurantName: "Burger Palace", validity: "2023-11-30", code: "BP20OFF2023" },
  // ... (rest of the demo data)
];

const demoVisitedRestaurants = [
  { id: 1, name: "Tasty Bites", visits: 5 },
  { id: 2, name: "Burger Palace", visits: 3 },
  // ... (rest of the demo data)
];

export default function CustomerProfile() {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showVisitedRestaurants, setShowVisitedRestaurants] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageConfirmation, setShowImageConfirmation] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageUrls, setImageUrls] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [image, setImage] = useState()

  useEffect(() => {
    fetchProfileData();
    fetchCustomerData();
    
  }, []);
  
 
  const fetchProfileData = async () => {
    await fetchCustomerData()
    try {
      const imageUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/customer/image-urls/${localStorage.getItem("id")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setImageUrls(imageUrlsResponse.data.Url);
    } catch (err) {
      console.log(err.response?.data?.error || 'An error occurred while fetching profile data');
    }
  };

  const fetchCustomerData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('https://tipnex-server.tipnex.com/api/customer/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem("id", response.data.id)
      setCustomerData(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      navigate("/login")
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImage(file)
        setShowImageConfirmation(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/");
  } 
  const handleConfirmImage = async () => {
    try {
      setLoading(true)
      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
      const formData = new FormData();
      formData.append('customerPhotoFile', croppedImage, 'profile.jpg');

      const response = await axios.post('https://tipnex-server.tipnex.com/api/customer/update-profile-image', {
        customerPhotoFile: {
          contentType: 'image/jpeg'
        },
        phone: customerData.phone
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await axios.put(response.data.customerPhotoPutUrl, croppedImage, {
        headers: { 'Content-Type': 'image/jpeg' }
      });
      setLoading(false)
      setShowImageConfirmation(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile image:', error);
      setLoading(false)
    }
  };

  if (!customerData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <div className='flex justify-between'>
          <Button
          startIcon={<ArrowBack />}
          sx={{ mb: 2, color: "#229299"  }}
          onClick={() => {/* Handle go back */}}
        >
          Go Back
        </Button>
        <Button
          endIcon={<LogOut  size={18}/>}
          sx={{ mb: 2, color: "#229299"  }}
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>

      <AnimatedPaper
        elevation={3}
        sx={{ p: 3, mb: 4, bgcolor: theme.palette.background.paper }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3} alignItems="center" >
          <Grid item>
            <Avatar
              src={imageUrls || "/placeholder.svg?height=100&width=100"}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              component="label"
              variant="contained"
              sx={{ mt: 1, bgcolor: theme.palette.primary.main }}
              startIcon={<CameraAlt />}
            > Uplaod Photo
              <VisuallyHiddenInput type="file" onChange={handleImageChange} accept="image/*" />
            </Button>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom color= "#000">{customerData.name}</Typography>
            <Typography variant="body1" color={theme.palette.text.secondary}>{customerData.email}</Typography>
          </Grid>
          <Grid item>
            <AnimatedCard
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Spent on Tips</Typography>
                <Typography variant="h4" color="#229299">
                  ${customerData.totalSpent ? customerData.totalSpent.toFixed(2) : '0.00'}
                </Typography>
              </CardContent>
            </AnimatedCard>
          </Grid>
        </Grid>
      </AnimatedPaper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => setShowCoupons(true)}
            sx={{ bgcolor: "#229299"  }}
          >
            Coupons
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => setShowVisitedRestaurants(true)}
            sx={{ bgcolor: "#229299"  }}
          >
            Visited Restaurants
          </Button>
        </Grid>
      </Grid>

      <AnimatedPaper
        elevation={3}
        sx={{ p: 3, bgcolor: theme.palette.background.paper }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography variant="h5" gutterBottom color={"#229299" }>Transaction History</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Restaurant/Store</TableCell>
                <TableCell align="right">Paid Bill</TableCell>
                <TableCell align="right">Paid Tip</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(customerData.transactions || demoTransactionData).map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.restaurantName}</TableCell>
                  <TableCell align="right">${transaction.paidBill.toFixed(2)}</TableCell>
                  <TableCell align="right">${transaction.paidTip.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AnimatedPaper>

      <CouponsDialog
        open={showCoupons}
        onClose={() => setShowCoupons(false)}
        coupons={demoCoupons}
        theme={theme}
      />

      <VisitedRestaurantsDialog
        open={showVisitedRestaurants}
        onClose={() => setShowVisitedRestaurants(false)}
        restaurants={customerData.visitedRestaurants || demoVisitedRestaurants}
        theme={theme}
      />

      <Dialog open={showImageConfirmation} onClose={() => setShowImageConfirmation(false)} fullWidth>
        <DialogTitle>Crop Profile Image</DialogTitle>
        <DialogContent>
        <div className='text-red-600'>{image ? image.size > 5 * 1024 * 1024 ? "File size should not be more than 5 MB" : "":""}</div>
          <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageConfirmation(false)}>Cancel</Button>
          <Button disabled={loading || (image && image.size > 5 * 1024 * 1024)} onClick={handleConfirmImage} variant="contained" sx={{ bgcolor: "#229299"  }}>
            Confirm
            {loading ? <CircularProgress color='white' sx={{ml:"5px"}} size={24} /> : <></>}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function CouponsDialog({ open, onClose, coupons, theme }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: "#229299"  }}>Your Coupons</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {coupons.map((coupon) => (
            <Grid item xs={12} sm={6} key={coupon.id}>
              <CouponCard coupon={coupon} theme={theme} />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#229299"  }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function CouponCard({ coupon, theme }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <AnimatedCard
      sx={{ background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`, color: 'white' }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>{coupon.restaurantName}</Typography>
        <Typography variant="h4" gutterBottom>{coupon.discount}% OFF</Typography>
        <Typography variant="body2" gutterBottom>Valid until: {coupon.validity}</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontFamily="monospace">
            {showCode ? coupon.code : '*'.repeat(coupon.code.length)}
          </Typography>
          <IconButton onClick={() => setShowCode(!showCode)} color="inherit">
            {showCode ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
      </CardContent>
    </AnimatedCard>
  );
}

function VisitedRestaurantsDialog({ open, onClose, restaurants, theme }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "#229299"  }}>Visited Restaurants</DialogTitle>
      <DialogContent>
        <List>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <ListItem key={restaurant.id} divider>
                <ListItemText primary={restaurant.name} />
                <Chip
                  label={`${restaurant.visits} ${restaurant.visits === 1 ? 'visit' : 'visits'}`}
                  sx={{ bgcolor: "#229299" , color: 'white' }}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No restaurants visited" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#229299" }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}