import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import OtpTimer from "./utils/Timer";
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const EmailVerification = () => {
  const navigate=useNavigate()
  const {email}=useParams();
  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: email,
    otp: "",
    confirmOtp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  // Frontend validation
  if (formData.otp !== formData.confirmOtp) {
    setError("OTP does not match");
    return;
  }

  try {
    setLoading(true);

    const { data } = await axios.post(
      "http://localhost:4500/user/verifyotp",
      {
        email: formData.email,
        otp: formData.otp,
      },
      {
        withCredentials: true, // optional (use if cookies involved)
      }
    );

    if (data.success) {
      setSuccess(data.msg || "Email verified successfully");
      toast.success(data.msg)
      navigate("/signin")
      
    }
    } catch (error) {
      console.log("error in otp verification")
      console.log(error)
   const { status, data } = error.response;
   if(status==404){
    navigate("/signup")
   }
   toast.error(data.msg)
  } finally {
    setLoading(false);
  }
};
useEffect(()=>{
setFormData({email:email,otp:"",confirmOtp:""})
},[])
const HandleResendOtp=async()=>{
  if(!email){
    toast.error("email is required")
  }
  try {
    let {data}=await axios.post(`http://localhost:4500/user/resend-otp`,{email})
    if(data.success){
      toast.success(data.msg)
      return true;

    }
  } catch (error) {

    if(error.response){
      toast.error(error.response.data.msg)
    }
    console.log(error)
    console.log("error in resend verification otp")
    
  }
}
  return (
    <>
    <Helmet>
            <title>Email varification | My Music App</title>
    
            <meta
              name="description"
              content="Listen to trending playlists and curated songs updated daily."
            />
          </Helmet>
    <div className="min-h-screen w-full flex items-center justify-center bg-transparent px-4">
      
      {/* Glass Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          w-full max-w-md 
          rounded-2xl 
          p-6 sm:p-8
          bg-white/20 
          backdrop-blur-xl 
          border border-white/30
          shadow-2xl
        "
      >
        {/* Heading */}
        <motion.h2
          variants={inputVariants}
          className="text-2xl sm:text-3xl font-bold text-center text-white mb-2"
        >
          Verify it’s you
        </motion.h2>

        <motion.p
          variants={inputVariants}
          className="text-center text-white/80 mb-6 text-sm sm:text-base"
        >
          Enter the OTP sent to your email
        </motion.p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="
                w-full px-4 py-2 sm:py-3
                bg-white/10 text-white placeholder-white/70
                border border-white/40
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </motion.div>

          {/* OTP */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-white/90 mb-1">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
              className="
                w-full px-4 py-2 sm:py-3
                bg-white/10 text-white placeholder-white/70
                border border-white/40
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </motion.div>

          {/* Confirm OTP */}
          <motion.div variants={inputVariants}>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Confirm OTP
            </label>
            <input
              type="text"
              name="confirmOtp"
              value={formData.confirmOtp}
              onChange={handleChange}
              placeholder="Confirm OTP"
              required
              className="
                w-full px-4 py-2 sm:py-3
                bg-white/10 text-white placeholder-white/70
                border border-white/40
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          </motion.div>

          {/* Button */}
          <motion.button 
          name="submit"
  whileHover={{ scale: !loading ? 1.04 : 1 }}
  whileTap={{ scale: !loading ? 0.96 : 1 }}
  disabled={loading}
  type="submit"
  className="
    w-full py-2 sm:py-3
    rounded-lg font-semibold
    flex items-center justify-center
    text-indigo-700
    bg-white/90
    hover:bg-white
    transition
    disabled:opacity-70 disabled:cursor-not-allowed
  "
>
  {loading ? (
    <span className="flex items-center gap-2">
      <span className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
      Verifying...
    </span>
  ) : (
    "Verify Email"
  )}
</motion.button>

        </form>
        <OtpTimer onResend={()=>{HandleResendOtp()}}/>
      </motion.div>
    </div>
    </>

  );
};

export default EmailVerification;
