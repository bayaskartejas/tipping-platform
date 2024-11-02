import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Typography, Paper } from '@mui/material';
import { CheckCircle, Add, ArrowBack } from '@mui/icons-material';
import Confetti from 'react-confetti';

export default function CouponSuccess({ 
  couponDetails, 
  onCreateAnother, 
  onBack,
  width = typeof window !== 'undefined' ? window.innerWidth : 0,
  height = typeof window !== 'undefined' ? window.innerHeight : 0
}) {
  const [showConfetti, setShowConfetti] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Stop confetti after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 2,
          bgcolor: 'rgba(0, 0, 0, 0.03)'
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: { xs: '100%', sm: 400 },
              width: '100%',
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Success Icon Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              <CheckCircle 
                sx={{ 
                  fontSize: 80, 
                  color: '#229799',
                  mb: 2
                }} 
              />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography variant="h5" gutterBottom sx={{ color: '#229799', fontWeight: 600 }}>
                Coupon Created Successfully!
              </Typography>
            </motion.div>

            {/* Coupon Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Box sx={{ 
                my: 3, 
                p: 2, 
                bgcolor: 'rgba(34, 151, 153, 0.1)',
                borderRadius: 1
              }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Coupon Code: <strong>{couponDetails?.code || 'SAVE20'}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {couponDetails?.description || 'Get 20% off on your next purchase'}
                </Typography>
              </Box>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={onBack}
                  sx={{ 
                    borderColor: '#229799',
                    color: '#229799',
                    '&:hover': {
                      borderColor: '#1b7b7d',
                      bgcolor: 'rgba(34, 151, 153, 0.1)'
                    }
                  }}
                >
                  Back to Coupons
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={onCreateAnother}
                  sx={{ 
                    bgcolor: '#229799',
                    '&:hover': {
                      bgcolor: '#1b7b7d'
                    }
                  }}
                >
                  Create Another
                </Button>
              </Box>
            </motion.div>

            {/* Decorative Background Elements */}
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.6, duration: 1 }}
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: '#229799',
                zIndex: 0
              }}
            />
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.7, duration: 1 }}
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: '#229799',
                zIndex: 0
              }}
            />
          </Paper>
        </motion.div>
      </Box>
    </>
  );
}