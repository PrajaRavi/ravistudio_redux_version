import React, { useEffect, useState } from "react";
import { Music, Search, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {Link} from "react-router-dom"
import ProfilePage from "./ProfilePage";
export default function MusicNavbar() {
  const [open, setOpen] = useState(false);
  const IsUserLogin=useSelector(state=>state.User.IsUserLogin)
  const IsAdmin=useSelector(state=>state.User.IsAdmin)
  const CurrUser=useSelector(state=>state.User.CurrUser)
  const FetchUserLoading=useSelector(state=>state.User.GetUserLoading)
  let [openprofile,setopenprofile]=useState(false)
  let [ProfileImg,setProfileImg]=useState("http://localhost:4500")
  const SearchBar = () => {
  return (
    <div className="flex items-center w-[100px] border-purple-700 max-w-md rounded-full border-2 bg-white/5 backdrop-blur-xl px-4  shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-blue-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
        />
      </svg>

      <input
        type="text"
        placeholder="Search..."
        className="ml-3 w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
};


  useEffect(()=>{
    if(FetchUserLoading==false){

      setProfileImg(CurrUser?.profileImage)
    }
  },[CurrUser,IsUserLogin,FetchUserLoading])
  return (
    <>
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-2 left-1/2  -translate-x-1/2 z-30 w-full md:w-[96%] px-2"
    >
      {/* Main Bar */}
      <div
        className="flex items-center justify-between rounded-2xl px-5 py-3
        bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-gray-100">
          <Music className="text-purple-500" />
          <span className="text-lg">MyMusic</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-sm text-gray-400">
          <li className="hover:text-gray-100 cursor-pointer"><Link to={"/"}>Home</Link></li>
          <li className="hover:text-gray-100 cursor-pointer"><Link to={'/contact'}>Contact</Link></li>
          {IsAdmin && IsUserLogin ?<li className="hover:text-gray-100 cursor-pointer"><Link to={'/admin'}>Admin</Link></li>:null}
          {IsUserLogin?<li className="hover:text-gray-100 cursor-pointer"><Link to={"/addplaylist"}>AddPlaylist</Link></li>:null}
          {IsUserLogin?<li className="hover:text-gray-100 cursor-pointer"><Link>Favourite</Link></li>:null}
          <li className="hover:text-gray-100 cursor-pointer"><Link to={"/lang"}>Language</Link></li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {IsUserLogin?
          <div className="w-fit inline-flex gap-2">

<SearchBar/>
          <button onClick={()=>setopenprofile(true)} className="w-10 h-10 flex  items-center justify-center rounded-full border-purple-700  border-2">
            {ProfileImg!=""?<img src={ProfileImg?.includes("UserProfile")?`http://localhost:4500/${ProfileImg}`:ProfileImg} alt={ProfileImg} className="rounded-full" />:
            <div>
                
            <User onClick={()=>setopenprofile(true)} size={18} />
            </div>
            }
            {/* {CurrUser?<img src={CurrUser.profileImage} alt="User" className="rounded-full" />:<User size={18} />} */}
          </button>
          </div>
          :
 <ul className="hidden md:flex gap-8 text-sm text-gray-400">
          <li className="hover:text-gray-100 cursor-pointer"><Link to={"/signup"}>SignUp</Link></li>
          <li className="hover:text-gray-100 cursor-pointer"><Link to={"/signin"}>SignIn</Link></li>
        </ul>} 

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-200"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 rounded-2xl bg-transparent backdrop-blur-xl border border-black/10 shadow-xl md:hidden"
          >
            <ul className="flex flex-col divide-y divide-black/10 text-black">
              {[
                {name:"Home",path:"/"},
                {name:"AddPlaylist",path:"addplaylist"},
                {name:"Favroute",path:"/favourite"},
                {name:"Language",path:"/lang"},
              ].map((item) => (
               <Link to={item.path}> <li
                  key={item.name}
                  className="px-6 py-4 hover:bg-white/5 hover:text-gray-100 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </li></Link>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
    {IsUserLogin?  <div className={openprofile==false?"fixed  top-22 right-10 w-[400px] h-[400px]":"fixed  top-22 md:right-10 right-3 w-[400px] h-[400px] z-50"}>

    <ProfilePage isOpen={openprofile} setOpen={setopenprofile} onClose={()=>setopenprofile(false)} profileImg={ProfileImg} setProfileImg={setProfileImg} CurrUser={CurrUser} FetchUserLoading={FetchUserLoading}/>      

    </div>:null}
    </>

  );
}
