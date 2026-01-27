import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {motion} from "framer-motion"
import {useSelector,useDispatch} from "react-redux"
import { Calendar, Lock, Mail, Phone, Satellite, User } from 'lucide-react';
import { SignUpUser } from '../Redux/Thunk/User.thunk';
import { SetCurrUser } from '../Redux/Slices/User.slice';
import {Helmet} from "react-helmet-async"

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const btnRef = useRef();

  const UserState=useSelector(state=>state.User.CurrUser)
  const signuperror=useSelector(state=>state.User.error)
  const SignUpFormLoading=useSelector(state=>state.User.signuploading)

  const dispatch=useDispatch()
  // 1. Group state into one object for efficiency
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contact: '',
    dob: ''
  });
  
  // console.log(formData.firstName)
  const [errmsg, seterrmsg] = useState('*This is error message');

  // 2. Single handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Simplified Validation Logic
  const validate = () => {
    if (!formData.firstName || formData.firstName.length < 4) return '*firstName must have at least 4 char';
    if (!formData.lastName || formData.lastName.length < 4) return '*lastName must have at least 4 char';
    if (!formData.email.includes('@') || !formData.email.includes('gmail.com')) return '*Provide a valid Gmail';
    if (formData.password.length < 5) return '*Password must have at least 5 char';
    if (formData.contact.length !== 10) return '*Provide a valid 10-digit contact';
    if (!formData.dob) return '*dob is required';
    return null;
  };

  async function handleSubmit(e) {
    // alert("chaala")
    e.preventDefault();
    seterrmsg(''); // Clear previous errors

    const validationError = validate();
    if (validationError) {
      seterrmsg(validationError);
      return;
    }

      dispatch(SignUpUser(formData))

      
    
  }
  useEffect(()=>{
    if(signuperror){
      toast.error(signuperror)
    }
    
    if(SignUpFormLoading==false && UserState){
      

      if (UserState?.msg == "Signup successful. Please verify your email.") {
        toast.success(t('signupsuccessfully'));
        setTimeout(() => toast.success('OTP sent to your email'), 2000);
        dispatch(SetCurrUser(null))
        navigate('/VerifyOTP');
      } else if (UserState?.msg == "User already exist") {
        toast.warning(t('alreadysignup'));
        dispatch(SetCurrUser(null))
        navigate('/signin');

      } else {
        dispatch(SetCurrUser(null))

        toast.error(UserState?.msg || "Something went wrong");
        // btnRef.current.innerText = 'Submit';
      }
    }
  },[SignUpFormLoading])
  return (
    <>
    <Helmet>
        <title>SignUp Page | My Music App</title>

        <meta
          name="description"
          content="Listen to trending playlists and curated songs updated daily."
        />
      </Helmet>
    <div className="h-[500px] z-20 flex items-center justify-center  p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>

        <form  onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="flex gap-4">
            <InputField
              icon={<User size={18} />}
              placeholder="First Name"
              name="firstName"
              
              // value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              icon={<User size={18} />}
              placeholder="Last Name"
              name="lastName"
              // value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <InputField
            icon={<Mail size={18} />}
            placeholder="Email"
            name="email"
            // value={formData.email}
            onChange={handleChange}
            type="email"
          />

          {/* Password */}
          <InputField
            icon={<Lock size={18} />}
            placeholder="Password"
            name="password"
            // value={formData.password}
            onChange={handleChange}
            type="password"
          />

          {/* Phone */}
          <InputField
            icon={<Phone size={18} />}
            placeholder="Phone Number"
            name="contact"
            // value={formData.phone}
            onChange={handleChange}
            type="number"
          />

          {/* Date */}
          <InputField
            icon={<Calendar size={18} />}
            placeholder="Date of Birth"
            name="dob"
            
            
            // value={formData.date}
            onChange={handleChange}
            type="date"
          />

          {/* Submit */}
           <motion.button
           name='signup'
      whileHover={!SignUpFormLoading ? { scale: 1.05 } : {}}
      whileTap={!SignUpFormLoading ? { scale: 0.95 } : {}}
      type="submit"
      disabled={SignUpFormLoading}
      className={`w-full bg-purple-700 shadow-inner rounded-xl py-3 font-semibold 
        text-gray-800 transition-all flex items-center justify-center
        ${SignUpFormLoading ? "cursor-not-allowed opacity-80" : "hover:shadow-lg"}`}
    >
      {SignUpFormLoading ? (
        <span className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      ) : (
        "Sign Up"
      )}
    </motion.button>
          <span className='text-black font-bold'>{errmsg}</span>
        </form>
      </motion.div>
    </div>
    </>

  );
  
}

/* ---------- Polymorphism Input Field (like Contact page) ---------- */
function InputField({ icon, placeholder, name, value, onChange, type = "text" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 w-full rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-inner focus-within:ring-2 focus-within:ring-purple-700 transition-all">
      {icon}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="ml-2 w-full bg-transparent outline-none placeholder-gray-500 text-gray-800"
        
      />
    </div>
  );
}

export default SignUp;