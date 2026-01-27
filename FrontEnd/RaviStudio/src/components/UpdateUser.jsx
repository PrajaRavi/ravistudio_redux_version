import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion"
import { Lock, Mail, Phone, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Helmet} from "react-helmet-async"
import { SetUpdatedUser } from '../Redux/Slices/Song.slice';
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
        required={true}
        className="ml-2 w-full bg-transparent outline-none placeholder-gray-500 text-gray-800"
        
      />
    </div>
  );
}

function UpdateUser() {
  let [errmsg,seterrmsg]=useState()
    const CurrUser=useSelector(state=>state.User.CurrUser)
    const UserUpdatedProfile=useSelector(state=>state.Song.userupdated) //this is just for telling that their is an updation in user profile so fetch user again
    
    const dispatch=useDispatch();
    const validate = () => {
    if (!formData.firstName || formData.firstName.length < 4) return '*firstName must have at least 4 char';
    if (!formData.lastName || formData.lastName.length < 4) return '*lastName must have at least 4 char';
    if (!formData.email.includes('@') || !formData.email.includes('gmail.com')) return '*Provide a valid Gmail';
    if (formData.contact.length !== 10) return '*Provide a valid 10-digit contact';
    return null;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    seterrmsg(''); // Clear previous errors

    const validationError = validate();
    if (validationError) {
      seterrmsg(validationError);
      return;
    }
    let {data}=await axios.post(`http://localhost:4500/user/updateuser`,formData)
    if(data.success) {
      toast.success(data.msg)
      {UserUpdatedProfile?dispatch(SetUpdatedUser(false)):dispatch(SetUpdatedUser(true))}
    }
      
    
  }
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      });
      const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  useEffect(()=>{
  setFormData({
firstName:CurrUser?.firstName,
lastName:CurrUser?.lastName,
email:CurrUser?.email,
contact:CurrUser?.contact
    
  }
    
  
)
  },[CurrUser])
  
  return (
    <>
    <Helmet>
            <title>Home Page | My Music App</title>
    
            <meta
              name="description"
              content="Listen to trending playlists and curated songs updated daily."
            />
          </Helmet>
     <div className="h-[500px] z-20 w-full flex items-center justify-center  p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Update Your Profile
        </h2>

        <form  onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center justify-center">
          {/* First & Last Name */}
          
            <InputField
              icon={<User size={18} />}
              placeholder="First Name"
              name="firstName"
              
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              icon={<User size={18} />}
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          
          {/* Email */}
          <InputField
            icon={<Mail size={18} />}
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />

         
          {/* Phone */}
          <InputField
            icon={<Phone size={18} />}
            placeholder="Phone Number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            type="number"
          />

          {/* Submit */}
          <motion.button name='submit' className={`w-full bg-purple-700 shadow-inner rounded-xl py-3 font-semibold 
        text-gray-800 transition-all flex items-center justify-center`}>
          submit

          </motion.button>
           
          <span className='text-black font-bold'>{errmsg}</span>
        </form>
      </motion.div>
    </div>
 
      
    </>
  )
}

export default UpdateUser
