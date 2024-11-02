import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ChevronRight, IndianRupee, CreditCard, ThumbsUp, ThumbsDown, X, Ticket } from 'lucide-react';
import axios from 'axios';
import default_person from "../assets/default-person.png";
import Slider from "react-slick";
import CouponPopup from './CouponPopup';
import ReactSlider from 'react-slider';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentPage({setAmount, setTransaction_id, setPayment_mode, setReceivers_name, setDateAndTime}) {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [billAmount, setBillAmount] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [helpers, setHelpers] = useState([]);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const sliderRef = useRef(null);
  const [imageUrls, setImageUrls] = useState("");
  const [staffUrls, setStaffUrls] = useState();

  // State variables for questions
  const [showQuestions, setShowQuestions] = useState(true);
  const [paidByCash, setPaidByCash] = useState(null);
  const [wantToTip, setWantToTip] = useState(null);
  const [wantToReview, setWantToReview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // State variables for coupons
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponList, setShowCouponList] = useState(false);
  const handleCloseCouponPopup = useCallback(() => {
    setShowCouponPopup(false);
  }, []);

  useEffect(()=>{
    localStorage.clear()
  },[])
  
  useEffect(() => {
    fetchStoreAndHelpers();
  }, [storeId]);

  const fetchStoreAndHelpers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching store and helpers for storeId:', storeId);
      const imageUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/image-urls/${storeId}`);
      setImageUrls(imageUrlsResponse.data);
      const staffUrlsResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/staff-image-urls/${storeId}`);
      setStaffUrls(staffUrlsResponse.data.staffPhotoUrls);
      console.log("StaffUrl", staffUrlsResponse.data.staffPhotoUrls);
      const storeResponse = await axios.get(`https://tipnex-server.tipnex.com/api/store/${storeId}`);
      console.log('Store data:', storeResponse.data);
      setStore(storeResponse.data);
      const helpersResponse = await axios.get(`https://tipnex-server.tipnex.com/api/staff/store/${storeId}`);
      console.log('Helpers data:', helpersResponse.data);
      setHelpers(helpersResponse.data);
    } catch (error) {
      console.error('Error fetching store and helpers:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoBack = () => {
    navigate('/');
  };

  const handleBillAmountChange = (e) => {
    const value = e.target.value;
    setBillAmount(value === '' ? '' : Math.max(0, parseFloat(value)));
    if (selectedCoupon && selectedCoupon.minimumPurchase > parseFloat(value)) {
      setSelectedCoupon(null);
    }
  };

  const handleTipSliderChange = (value) => {
    setTipAmount(value);
    setCustomTip('');
  };

  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    setCustomTip(value);
    setTipAmount(value === '' ? 0 : Math.max(0, parseInt(value)));
  };

  const handleHelperSelect = (helper) => {
    setSelectedHelper(helper);
  };

  const handlePayment = async () => {
    if (totalAmount === 0 || (selectedHelper == null && helpers.length > 0)) {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 1000);
      return;
    }
  
    try {
      if (selectedCoupon) {
        await axios.post(`https://tipnex-server.tipnex.com/api/customer/update-coupon/${storeId}`, {
          phone: phoneNumber,
          couponId: selectedCoupon.id
        });
      }
      localStorage.setItem("storeId", storeId)
      localStorage.setItem("staffId", selectedHelper.id)
      localStorage.setItem("phone", phoneNumber)
      setTransaction_id("T" + (Math.floor(Math.random() * 100000000)));
      setPayment_mode("UPI");
      setReceivers_name(selectedHelper.name);
      setDateAndTime(Date.now());
      navigate(`/payment-success/${storeId}`);
    } catch (error) {
      console.error('Error updating coupon usage:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  const calculateDiscount = () => {
    if (!selectedCoupon) return 0;
    if (selectedCoupon.discountType === 'percentage') {
      return (parseFloat(billAmount) * selectedCoupon.discountValue) / 100;
    } else {
      return selectedCoupon.discountValue;
    }
  };

  const totalAmount = (parseFloat(billAmount) || 0) + (parseFloat(tipAmount) || 0) - calculateDiscount();
  setAmount(totalAmount)

  const sliderSettings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    beforeChange: (current, next) => handleHelperSelect(helpers[next]),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "30px",
        }
      }
    ]
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  // Functions for handling questions
  const handlePaidByCash = (answer) => {
    setPaidByCash(answer);
    if (answer) {
      setCurrentQuestion(1);
    } else {
      setShowQuestions(false);
    }
  };

  const handleWantToTip = (answer) => {
    setWantToTip(answer);
    if (answer) {
      setShowQuestions(false);
    } else {
      setCurrentQuestion(2);
    }
  };

  const handleWantToReview = (answer) => {
    setWantToReview(answer);
    if (answer) {
      navigate("/review");
    } else {
      setShowQuestions(false);
    }
  };

  // Functions for handling coupons
  const handleUseCoupons = () => {
    setShowCouponPopup(true);
  };

  const handleFetchCoupons = useCallback(async (phoneNumber) => {
    try {
      setPhoneNumber(phoneNumber)
      const response = await axios.get(`https://tipnex-server.tipnex.com/api/customer/get-coupon-info/${storeId}`, {
        params: { phone: phoneNumber }
      });
      setCoupons(response.data.coupons);
      setShowCouponList(true);
      setShowCouponPopup(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('User not found. Please create an account first.');
      } else {
        console.error('Error fetching coupons:', error);
        alert('Failed to fetch coupons. Please try again.');
      }
    }
  }, [storeId]);

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponList(false);
    setShowCouponPopup(false);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  const QuestionBox = ({ question, onYes, onNo }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">{question}</h3>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onYes()}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <ThumbsUp className="mr-2" size={18} />
          Yes
        </button>
        <button
          onClick={() => onNo()}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <ThumbsDown className="mr-2" size={18} />
          No
        </button>
      </div>
    </motion.div>
  );

  const CouponList = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Coupons</h3>
        {coupons.filter(coupon => parseFloat(billAmount) >= coupon.minimumPurchase).map((coupon) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200"
            onClick={() => handleSelectCoupon(coupon)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-[#229799]">{coupon.title}</h4>
                <p className="text-sm text-gray-600">{coupon.description}</p>
              </div>
              <Ticket className="text-[#229799]" size={24} />
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>Discount: {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</p>
              <p>Min. Purchase: ₹{coupon.minimumPurchase}</p>
            </div>
          </motion.div>
        ))}
        <button
          onClick={() => setShowCouponList(false)}
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#1b7b7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799]"
        >
          Close
        </button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div  className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center mb-4">
          <button
            onClick={onGoBack}
            className="flex items-center text-[#229799] hover:text-[#1b7b7d] transition-colors duration-300"
          >
            <ChevronLeft size={20} />
            <span className="ml-1">Go Back</span>
          </button>
        </div>
        {store && <ProfileHeader imageUrls={imageUrls} store={store} />}

        <AnimatePresence>
          {showQuestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion === 0 && (
                <QuestionBox
                  question="Have you already paid the bill by cash?"
                  onYes={() => handlePaidByCash(true)}
                  onNo={() => handlePaidByCash(false)}
                />
              )}
              {currentQuestion === 1 && (
                <QuestionBox
                  question="Would you like to tip our waiter?"
                  onYes={() => handleWantToTip(true)}
                  onNo={() => handleWantToTip(false)}
                />
              )}
              {currentQuestion === 2 && (
                <QuestionBox
                  question="Would you like to rate and review our waiter and platform?"
                  onYes={() => handleWantToReview(true)}
                  onNo={() => handleWantToReview(false)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showQuestions ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-white rounded-lg shadow-md p-6 space-y-6 ${showQuestions ? 'pointer-events-none' : ''}`}
        >
          <div>
            <label htmlFor="billAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Bill Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="billAmount"
                id="billAmount"
                className="block w-full rounded-md border-gray-300 pl-10 pr-12 h-8 border-2 focus:border-[#229799] focus:ring-[#229799] sm:text-sm"
                placeholder="Enter bill amount"
                value={billAmount}
                onChange={handleBillAmountChange}
                min="0"
                disabled={paidByCash}
              />
            </div>
          </div>
          <div>
            <label htmlFor="tipAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Tip Amount: ₹{tipAmount}
            </label>
            <ReactSlider
              className="w-full h-10 flex items-center mt-7"
              thumbClassName="w-6 h-6 bg-[#229799] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799] cursor-pointer"
              trackClassName="h-2 bg-gray-200 rounded-md"
              min={0}
              max={100}
              value={tipAmount}
              onChange={handleTipSliderChange}
              renderThumb={(props, state) => (
                <div {...props}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#229799] text-white px-2 py-1 rounded text-xs">
                    ₹{state.valueNow}
                  </div>
                </div>
              )}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>₹0</span>
              <span>₹100</span>
            </div>
          </div>
          <div>
            <label htmlFor="customTip" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Tip
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="customTip"
                id="customTip"
                className="block h-8 border-2 w-full rounded-md border-gray-300 pl-10 pr-12 focus:border-[#229799] focus:ring-[#229799] sm:text-sm"
                placeholder="Enter custom tip"
                value={customTip}
                onChange={handleCustomTipChange}
                min="0"
              />
            </div>
          </div>
          <div>
            <div className={`relative rounded-lg ${showGlow ? 'animate-glow' : ''}`}>
              {helpers.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Helper</h3>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {helpers.map((helper) => (
                      <div key={helper.id} className="px-2">
                        <div className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                          selectedHelper && selectedHelper.id === helper.id ? 'scale-110 z-10' : 'scale-90 opacity-50'
                        }`}>
                          <img
                            src={staffUrls ? staffUrls[helper.id] : default_person}
                            alt={helper.name}
                            className="w-20 h-20 rounded-full object-cover mb-2"
                          />
                          <span className="font-medium">{helper.name}</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{helper.avgRating ? helper.avgRating.toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 p-2 rounded-full shadow-md"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={handleUseCoupons}
              className="w-full py-2 px-4 border border-[#229799] rounded-md shadow-sm text-sm font-medium text-[#229799] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799]"
            >
              Use Coupons
            </button>
          </div>
          {selectedCoupon && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-semibold text-[#229799]">{selectedCoupon.title}</h4>
                <p className="text-sm text-gray-600">Code: {selectedCoupon.couponCode}</p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Price Breakup</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bill Amount:</span>
                <span>₹{billAmount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip Amount:</span>
                <span>₹{tipAmount || 0}</span>
              </div>
              {selectedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                {selectedCoupon ? (
                  <div>
                    <span className="line-through text-gray-500 mr-2">₹{(parseFloat(billAmount) + parseFloat(tipAmount)).toFixed(2)}</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  <span>₹{totalAmount.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#1b7b7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#229799] ${
              totalAmount === 0 || (selectedHelper == null && helpers.length > 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <CreditCard className="inline-block mr-2" size={20} />
            Pay ₹{totalAmount.toFixed(2)}
          </button>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showCouponPopup && <CouponPopup onClose={handleCloseCouponPopup} onFetchCoupons={handleFetchCoupons} setPhoneNumber={setPhoneNumber}/>}
        {showCouponList && <CouponList />}
      </AnimatePresence>
    </div>
  );
}

function ProfileHeader({ imageUrls, store }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url("${imageUrls.coverUrl || '/placeholder.svg?height=200&width=800'}")` }}
      ></div>
      <div className="p-6 -mt-16 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={imageUrls.logoUrl || '/placeholder.svg?height=100&width=100'}
            alt="Store Logo"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
            <h2 className="text-lg text-gray-600">{store.address}</h2>
            <p className="text-sm text-gray-500 mt-1">UPI: {store.ownerUpi}</p>
            <div className="flex items-center justify-center md:justify-start mt-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-600">{store.avgRating ? store.avgRating.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}