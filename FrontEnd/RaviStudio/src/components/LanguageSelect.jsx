import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {useSelector} from "react-redux"
import { useDispatch } from "react-redux";
import { SetLanguage } from "../Redux/Slices/User.slice";
import axios from "axios";
import { toast } from "react-toastify";
import {Helmet} from "react-helmet-async"
import { useTranslation } from "react-i18next";

const languages = [
  { name: "Hindi", nativeName: "हिन्दी, हिंदी", code: "hi", icon: "अ" },
  { name: "English", nativeName: "English", code: "en", icon: "A" },
  { name: "Bengali", nativeName: "বাংলা", code: "bn", icon: "অ" },
  { name: "Marathi", nativeName: "मराठी", code: "Mr", icon: "अ" },
  { name: "Telugu", nativeName: "తెలుగు", code: "te", icon: "అ" },
  { name: "Gujarati", nativeName: "ગુજરાતી", code: "gu", icon: "અ" },
  { name: "Urdu", nativeName: "اردو", code: "ur", icon: "ا" },
  { name: "Kannada", nativeName: "ಕನ್ನಡ", code: "kn", icon: "ಅ" },
  { name: "Oriya", nativeName: "ଓଡ଼ିଆ", code: "or", icon: "ଅ" },
  { name: "Malayalam", nativeName: "മലയാളം", code: "ml", icon: "അ" },
  { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ, پنجابی", code: "pa", icon: "ੳ" },
  { name: "Assamese", nativeName: "অসমীয়া", code: "as", icon: "অ" },
  { name: "Bhojpuri", nativeName: "भोजपुरी", code: "bh", icon: "अ" },
  { name: "Nepali", nativeName: "नेपाली", code: "ne", icon: "अ" },
  { name: "Sindhi", nativeName: "सिन्धी, سنڌي", code: "sd", icon: "ا" },
  { name: "Tamil", nativeName: "தமிழ்", code: "ta", icon: "அ" },
  { name: "Santali", nativeName: "Santali", code: "sat", icon: "Ol" },
  { name: "Maithili", nativeName: "मैथिली", code: "mai", icon: "अ" },
  { name: "Dogri", nativeName: "डोगरी", code: "doi", icon: "ड" },
  { name: "Manipuri", nativeName: "Meitei", code: "mni", icon: "ꯑ" },
];

export default function LanguageSelectionPage() {
  const SelectedLang=useSelector(state=>state.User.language)
  const UserLogin=useSelector(state=>state.User.IsUserLogin)
  const {t,i18n}=useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState(SelectedLang);
  const dispatch=useDispatch()
  
  const handleSubmit =async  () => {
     axios.defaults.withCredentials=true;
    console.log("Selected Language:", selectedLanguage);
    let {data}=await axios.post(`http://localhost:4500/update-user-language/`,{language:selectedLanguage.code})
if(data.success){
  toast.success("your language is "+String(selectedLanguage.name))
  i18n.changeLanguage(selectedLanguage.code)

}
else{
  toast.warning("something went wrong")
}
   
  };
  useEffect(()=>{
    setSelectedLanguage(SelectedLang)
    // alert(SelectedLang.code)
  },[SelectedLang])

  return (
    <>
    <Helmet>
        <title>Language Page | My Music App</title>

        <meta
          name="description"
          content="Listen to trending playlists and curated songs updated daily."
        />
      </Helmet>
    <div className="w-full min-h-screen overflow-y-scroll">
    <div className=" w-[90%] mx-auto bg-transparent mt-[70px] py-5   text-white flex flex-col items-center px-4 ">
      {/* Heading */}
    
      {/* Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
        {languages.map((lang) => (
          <motion.div
            key={lang.code}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              dispatch(SetLanguage(lang))
              setSelectedLanguage(lang)}}
            className={`cursor-pointer rounded-2xl p-4 backdrop-blur-xl border transition-all
              ${selectedLanguage?.code === lang.code
                ? "bg-purple-600/30 border-purple-500"
                : "bg-white/10 border-white/20 hover:bg-white/20"}`}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
                {lang.icon}
              </div>
              <h3 className="font-semibold">{lang.name}</h3>
              <p className="text-sm text-gray-300 truncate">{lang.nativeName}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Language + Submit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10  flex flex-col items-center gap-4"
      >
        
        {UserLogin?<button
        name="continue"
          onClick={handleSubmit}
          disabled={!selectedLanguage}
          className="px-8 py-3 rounded-xl  bg-purple-600 hover:bg-purple-700 disabled:opacity-40 transition"
        >
          {t('submit')}
        </button>:null}
      </motion.div>
    </div>
    <div  className="w-full h-[100px]">

    </div>
    
    </div>
    </>

  );
}
