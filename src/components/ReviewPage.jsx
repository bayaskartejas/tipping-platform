import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  SentimentVeryDissatisfied, 
  SentimentDissatisfied, 
  SentimentSatisfied, 
  SentimentSatisfiedAlt, 
  SentimentVerySatisfied,
  Restaurant,
  Person,
  Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfied color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfied color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfied color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAlt color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfied color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

const ReviewCard = ({ 
  title, 
  subtext, 
  onSubmit, 
  onSkip, 
  googleReviewUrl, 
  type, 
  storeId, 
  staffId 
}) => {
  const [rating, setRating] = useState(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleRatingChange = (event, value) => {
    setRating(value);    
  };

  const handleSubmit = async () => {
    if (rating && rating >= 4 && type === 'restaurant') {
      setOpenDialog(true);
    } else {
      try {
        let endpoint = '';
        let data = { rating, title: reviewTitle, content: reviewContent };

        switch (type) {
          case 'restaurant':
            endpoint = `https://tipnex-server.tipnex.com/api/review/store/${storeId}`;
            break;
          case 'staff':       
            endpoint = `https://tipnex-server.tipnex.com/api/staff/${staffId}/review`;
            break;
          case 'platform':
            endpoint = 'https://tipnex-server.tipnex.com/api/platform-review';
            break;
        }

        await axios.post(endpoint, data);
        onSubmit();
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

  const handleDialogClose = (redirect) => {
    setOpenDialog(false);
    if (redirect) {
      window.open(googleReviewUrl, '_blank');
    }
    onSubmit();
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4, borderRadius: "10px"}}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton color="primary" sx={{ mr: 1 }}>
            {type === 'restaurant' && <Restaurant />}
            {type === 'staff' && <Person />}
            {type === 'platform' && <Star />}
          </IconButton>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {subtext}
        </Typography>
        <Box sx={{ my: 2 }}>
          {type === 'restaurant' ? (
            <StyledRating
              name="highlight-selected-only"
              value={rating}
              onChange={handleRatingChange}
              IconContainerComponent={IconContainer}
              getLabelText={(value) => customIcons[value].label}
              highlightSelectedOnly
            />
          ) : (
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={handleRatingChange}
            />
          )}
        </Box>
        <AnimatePresence>
          {rating !== null /*&& (rating < 4 || type !== 'restaurant')*/ && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Would you like to suggest any improvements?
              </Typography>
              <TextField
                fullWidth
                label="Review Title"
                variant="outlined"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Your Review"
                variant="outlined"
                multiline
                rows={4}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={onSkip}>
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={rating === null}
          >
            Submit
          </Button>
        </Box>
      </CardContent>
      <Dialog
        open={openDialog}
        onClose={() => handleDialogClose(false)}
      >
        <DialogTitle>Share Your Experience</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to share your positive experience on our Google page? Your review helps others discover our restaurant!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>No, Thanks</Button>
          <Button onClick={() => handleDialogClose(true)} autoFocus>
            Yes, I'll Review
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const ReviewPage = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [storeId, setStoreId] = useState(null);
  const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    // Simulating fetching storeId and staffId
    setStoreId(1);
    setStaffId(1);
  }, []);

  const reviews = [
    {
      title: "How was your dining experience?",
      subtext: "We'd love to hear about the food, service, and atmosphere!",
      type: "restaurant",
      googleReviewUrl: "https://www.google.com/search?gs_ssp=eJzj4tVP1zc0LEsqTjarsCgzYLRSNagwTkoxSzRNTUozMbawSDU0tTKoSEmxSLRITkw2S062MEhKSfYSKcssKk5UyMgvSc1RSMwtSixLLMkEAHalGHg&q=virsa+hotel+amravati&rlz=1C1RXQR_enIN1085IN1086&oq=virsa&gs_lcrp=EgZjaHJvbWUqEggBEC4YFBivARjHARiHAhiABDIMCAAQRRg5GLEDGIAEMhIIARAuGBQYrwEYxwEYhwIYgAQyDQgCEC4YgwEYsQMYgAQyBwgDEC4YgAQyBwgEEAAYgAQyCQgFEC4YChiABDIJCAYQABgKGIAEMgkIBxAuGAoYgAQyBwgIEC4YgAQyBwgJEAAYgATSAQkxNDgyOWowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x3bd6a5ebf4388e15:0xdd8a8cac6cc80bdc,3",
    },
    {
      title: "How was your interaction with our staff?",
      subtext: "Your feedback helps us improve our service.",
      type: "staff",
    },
    {
      title: "How was your experience with TipNex?",
      subtext: "We're always looking to improve our platform.",
      type: "platform",
    },
  ];

  const handleSubmit = () => {
    setCurrentReview((prev) => prev + 1);
  };

  const handleSkip = () => {
    setCurrentReview((prev) => prev + 1);
  };

  if (currentReview >= reviews.length) {
    return (
      <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Thank you for your feedback!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We appreciate you taking the time to share your experience with us.
          </Typography>
        </CardContent>
      </Card>
    );
  }
   
  return (
    <ReviewCard
      {...reviews[currentReview]}
      onSubmit={handleSubmit}
      onSkip={handleSkip}
      storeId={storeId}
      staffId={staffId}
    />
  );
};

export default ReviewPage;