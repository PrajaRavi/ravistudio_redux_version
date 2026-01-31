import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import {Helmet} from "react-helmet-async"
import {toast} from "react-toastify"
import axios from "axios"
import { useTranslation } from "react-i18next";
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const {t}=useTranslation()
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with your backend API endpoint
    try {
     let {data}= await  axios.post("http://localhost:4500/contact/post-contact-detail",formData);
     if(data.success){
      toast.success("submited successfully😊😊")
       setFormData({ name: "", email: "", contact: "", message: "" });
      }

    } catch (error) {
      console.error(error);
      toast.success("Something went wrong ❌");
    }
  };

  return (
    <>
    <Helmet>
        <title>Contact Page | My Music App</title>

        <meta
          name="description"
          content="Listen to trending playlists and curated songs updated daily."
        />
      </Helmet>
    <div className="min-h-screen flex items-center justify-center w-[100%] md:w-[90%]  px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
          {t("feelfreetocontact")}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={t("Name is required")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailreq")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Contact */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder={t("contact")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <MessageSquare
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder={t("entermessage")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Submit Button */}
          <motion.button
          name="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            <Send size={18} /> {t('submit')}
          </motion.button>
        </form>
      </motion.div>
    </div>
    </>

  );
}
