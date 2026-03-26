import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {Lock, Mail} from "lucide-react"
import { SetLogin } from "../Redux/Slices/User.slice";
import {Helmet} from "react-helmet-async"
import { useTranslation } from "react-i18next";
export default function Forgotpassforuser() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch=useDispatch()
  const signindata=useSelector(state=>state.User.signindata)
  
  const [formData, setFormData] = useState({
      email: ''  });
    
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
    // 2. Single handler for all inputs
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!formData.email) {
    setError("Email and password are required");
    return;
  }
handleForgotPassword();

};
 const handleForgotPassword = async () => {
  if (!formData.email) {
    toast.warning(t("enteremailfirst"));
    return;
  }

  try {
    setLoading(true)
    let {data}=await axios.post("http://localhost:4500/user/SendResetPassOTP", {
      email: formData.email
    });
    if(data.success){

        navigate(`/resetpass/${formData.email}`)
      toast.success(t("otpSent"));
    }
    else{
      console.log("error in frontend in sending forgot pass otp")
    }
  } catch (error) {
      if (error.response) {
          const { status, data } = error.response;
          toast.error(data.msg)
        }
        else{

            toast.error("Failed to send OTP");
        }
  }finally{
    setLoading(false)
  }
};
  

  
  return (
    <>
    <Helmet>
        <title>Forgotpass Page | My Music App</title>

        <meta
          name="description"
          content="Listen to trending playlists and curated songs updated daily."
        />
      </Helmet>
    <div className="min-h-screen w-full flex items-center justify-center  p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('forgotpass')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
         
           
          {/* Email */}
          <InputField
            icon={<Mail size={18} />}
            placeholder="Email"
            name="email"
            onChange={handleChange}
            type="email"
          />

        
       
  <span className="font-bold text-black">{error}</span>
          {/* Submit */}
          <motion.button
          name="siging"
          whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-400 shadow-inner rounded-xl py-3 font-semibold 
                  text-gray-800 transition-all flex items-center justify-center
                  ${loading ? "cursor-not-allowed opacity-80" : "hover:shadow-lg"}`}
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  t("submit")
                )}
              </motion.button>
        </form>
      </motion.div>
    </div>
</>
  );
}

/* ---------- Polymorphism Input Field (like Contact page) ---------- */
function InputField({ icon, placeholder, name, value, onChange, type = "text" }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 w-full rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 shadow-inner focus-within:ring-2 focus-within:ring-blue-400 transition-all">
      {icon}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="ml-2 w-full bg-transparent outline-none placeholder-gray-500 text-gray-800"
        required
      />
    </div>
  );
}
