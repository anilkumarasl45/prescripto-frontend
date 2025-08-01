import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Clock, CheckCircle, Sparkles, Phone, RotateCcw } from "lucide-react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const OTPModal = ({ phoneNumber, onClose, setIsDetailsModalOpen }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { backendUrl, Loader, setToken } = useContext(AppContext);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Cooldown timer for resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (value.length <= 1 && /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1 && value) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value.length > 1) {
      const pastedOtp = value.slice(0, otp.length);
      setOtp(pastedOtp.split(""));
      if (inputRefs.current[otp.length - 1]) {
        inputRefs.current[otp.length - 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index] && index >= 0) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  const handleClearOTP = () => {
    setOtp(Array(6).fill(""));
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      
      const { data } = await axios.post(backendUrl + '/api/user/generate-otp', { 
        phone: phoneNumber 
      });

      if (data.success) {
        toast.success('OTP resent successfully!');
        setResendCooldown(30); // 30 second cooldown
        setError('');
        handleClearOTP();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const enteredOTP = otp.join("");

      const { data } = await axios.post(backendUrl + "/api/user/phone-login", {
        phone: phoneNumber,
        otp: enteredOTP,
      });

      if (data.success) {
        if (data.existing) {
          setToken(data.token);
          onClose();
        } else {
          setIsDetailsModalOpen(true);
        }
        
        toast.success(data.message);
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      >
        {/* Enhanced Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Enhanced Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: [0, 30, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ 
                scale: [1.1, 1, 1.1],
                rotate: [360, 180, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl"
            />
          </div>

          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-primary to-secondary p-4 sm:p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-2xl flex items-center justify-center backdrop-blur-sm"
                >
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6" />
                </motion.div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Verify Your Number</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Enter the 6-digit code</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <X className="w-3 h-3 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-4 sm:p-8 space-y-4 sm:space-y-6">
            {/* Phone Number Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-base sm:text-lg font-semibold text-neutral-700">
                  {phoneNumber}
                </span>
              </div>
              <p className="text-sm sm:text-base text-neutral-600">
                We've sent a verification code to your phone number
              </p>
            </motion.div>

            {/* OTP Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex justify-center space-x-2 sm:space-x-3">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileFocus={{ scale: 1.1, borderColor: "#5f6fff" }}
                    type="tel"
                    maxLength="1"
                    className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-neutral-200 rounded-lg sm:rounded-2xl text-center text-lg sm:text-xl font-bold focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                >
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
                  </div>
                  {error}
                </motion.p>
              )}

              {otp.every(digit => digit !== "") && !error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-green-500 text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  Code entered successfully
                </motion.p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearOTP}
                className="flex-1 py-3 px-4 border-2 border-neutral-200 text-neutral-600 rounded-lg sm:rounded-2xl font-semibold hover:bg-neutral-50 transition-all duration-300 text-sm sm:text-base"
              >
                Clear
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 25px rgba(95, 111, 255, 0.3)" 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={otp.some((digit) => digit === "") || loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg sm:rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden text-sm sm:text-base"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader color="#fff" />
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Verify
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>

            {/* Security Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-lg sm:rounded-2xl border border-blue-100"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-900">Secure Verification</p>
                  <p className="text-xs text-blue-700 mt-1">
                    This code expires in 5 minutes for your security.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Resend Option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-xs sm:text-sm text-neutral-600 mb-2">
                Didn't receive the code?
              </p>
              {resendCooldown > 0 ? (
                <div className="flex items-center justify-center gap-2 text-neutral-500">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    Resend in {resendCooldown}s
                  </span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors disabled:opacity-50 text-xs sm:text-sm"
                >
                  {resendLoading ? (
                    <Loader color="#5f6fff" />
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                      Resend Code
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OTPModal;