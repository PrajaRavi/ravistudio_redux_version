import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {Lock, Mail} from "lucide-react"
import { SetLogin } from "../Redux/Slices/User.slice";
export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch=useDispatch()
  const signindata=useSelector(state=>state.User.signindata)
  const signinerror=useSelector(state=>state.User.error)
  const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    
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

  if (!formData.email || !formData.password) {
    setError("Email and password are required");
    return;
  }

  try {
    setLoading(true);

    const { data } = await axios.post(
      "http://localhost:4500/user/login",
      {
        email: formData.email,
        password: formData.password,
      },
      {
        withCredentials: true, // IMPORTANT for cookies
      }
    );

    if (data.success) {
      setSuccess(data.msg || "Login successful");
      dispatch(SetLogin(true))
      // OPTIONAL: store email or user info (not token)
      toast.success(data.msg)
      localStorage.setItem("CurrUser", data.email);
      navigate("/");
  
      // OPTIONAL redirect
      // navigate("/dashboard");
    } else {
      setError(data.msg || "Login failed");
    }
  } catch (err) {
    if (err.response && err.response.data) {
      setError(err.response.data.msg || "Invalid credentials");
    } else {
      setError("Server error. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async () => {
  if (!formData.email) {
    toast.warning(t("enteremailfirst"));
    return;
  }

  try {
    await axios.post("http://localhost:4500/SendResetPassOTP", {
      email: formData.email
    });
    toast.success(t("otpSent"));
  } catch (error) {
    toast.error("Failed to send OTP");
  }
};

  useEffect(() => {
  
  
  if (loading) return;
  if (!signindata) return;

  // switch (signinerror) {
   
  //   case "User Not found":
  //     toast.info(t("plzcreteanaccount"));
  //     navigate("/SignUp");
  //     dispatch(Setsignindata(null))

  //     break;
  //   case "Please verify your account first":
  //     toast.info(t("varify your account"));
  //     navigate("/SignUp");
  //     dispatch(Setsignindata(null))

  //     break;

  //   case "Invalid credentials":
  //     toast.warning(t("invalidcredential"));
  //     dispatch(Setsignindata(null))

  //     break;

  //   case "Please verify your account first":
  //     toast.error(t("Please verify your account first"));
  //     dispatch(Setsignindata(null))

  //     break;

  //   default:
  //     toast.error(t("somethingwentwrong"));
  //     dispatch(Setsignindata(null))

  // }
}, [loading, signindata]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
           
          {/* Email */}
          <InputField
            icon={<Mail size={18} />}
            placeholder="Email"
            name="email"
            onChange={handleChange}
            type="email"
          />

          {/* Password */}
          <InputField
            icon={<Lock size={18} />}
            placeholder="Password"
            name="password"
            onChange={handleChange}
            type="password"
          />

         <div className="flex justify-end">
    <motion.button
      type="button"
      onClick={handleForgotPassword}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-sm text-black font-bold hover:underline"
    >
      Forgot password?
    </motion.button>
  </div>
  <span className="font-bold text-black">{error}</span>
          {/* Submit */}
          <motion.button
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                type="submit"
                disabled={loading}
                className={`w-full bg-purple-700 shadow-inner rounded-xl py-3 font-semibold 
                  text-gray-800 transition-all flex items-center justify-center
                  ${loading ? "cursor-not-allowed opacity-80" : "hover:shadow-lg"}`}
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </motion.button>
        </form>
      </motion.div>
    </div>
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
        required
      />
    </div>
  );
}
