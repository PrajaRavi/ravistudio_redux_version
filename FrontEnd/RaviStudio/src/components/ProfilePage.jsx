import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, LogOut, User, X } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { SetLanguage, SetLogin } from "../Redux/Slices/User.slice";
import { Loader2 } from "./utils/Loader";
import { useNavigate } from "react-router-dom";
export default function ProfileCard({ isOpen, onClose,profileImg,setProfileImg ,setOpen,CurrUser,FetchUserLoading}) {
  
  const dispatch=useDispatch()
  const navigate=useNavigate()
  let [loading,setloading]=useState(false)
  const user = {
    username: "Aman Prajapati",
    email: "aman@gmail.com",
  };

  const handleImageChange = async (e) => {
    setloading(true)
    try {
      
      let formdata=new FormData();
      
      const file = e.target.files[0];
    formdata.append('Profile',file)
    if (file) {
      
      axios.defaults.withCredentials=true
      let {data}=await axios.post("http://localhost:4500/update-profile-image",formdata)
      if(data.success){
        toast.success(t('profileupdate'))
      }
      else{
        return
      }    
      setProfileImg(URL.createObjectURL(file));
      
      
      // 🔥 upload to backend here
    }
  } catch (error) {
    console.log(error)
  }finally{
    setloading(false)
  }
  };

  const handleLogout =async () => {
    axios.defaults.withCredentials=true;

    let {data}=await axios.post(`http://localhost:4500/user/logout`)
    if(data.success){

      localStorage.removeItem("CurrUser");
      dispatch(SetLanguage({code:"en"}))
      dispatch(SetLogin(false))
      navigate("/")
      setOpen(false)
    }
    else{
      toast.error("can't logout")
    }
    
    
    
    

  };
  useEffect(()=>{
    console.log(CurrUser)
    setProfileImg(CurrUser?.profileImage)
    },[FetchUserLoading])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-[400px] z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
          >
            <X size={22} />
          </button>

          {/* Profile Image */}
          <div className="relative mx-auto w-28 h-28">
            {loading?<span className="absolute top-10 left-10 w-full h-full"><Loader2/></span>:null}
            {profileImg!=""?<motion.img
              src={String(profileImg).includes("UserProfile")?`http://localhost:4500/${profileImg}`:profileImg}
              className="w-full h-full rounded-full object-cover border-4 border-purple-600"
              whileHover={{ scale: 1.05 }}
            />:<motion.img
              src={profileImg}
              className="w-full h-full rounded-full object-cover border-4 border-purple-600"
              whileHover={{ scale: 1.05 }}
            />}

            <label className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition">
              <Camera size={16} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold text-white">
              {CurrUser.firstName} {CurrUser.lastName}
            </h2>
            <p className="text-gray-300 text-sm">{CurrUser.email}</p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-2.5 rounded-xl font-semibold text-white transition">
              <User size={16} />
              Update Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2.5 rounded-xl font-semibold transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
