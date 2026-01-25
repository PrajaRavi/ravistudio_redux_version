import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SingerHorizontalSkeleton from "./SkeltonLoading/SingerSection";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector ,useDispatch} from "react-redux";
import { SetCurrUser } from "../Redux/Slices/User.slice";
import { SetUserPlaylist } from "../Redux/Slices/Song.slice";


export default function UserPlaylistSection({heading}) {
  const [singers, setSingers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch=useDispatch()
  const [loading, setLoading] = useState(false);
  const CurrUser=useSelector(state=>state.User.CurrUser)
  const scrollRef=useRef(null)
  const handleScroll = () => {
  const el = scrollRef.current;
  if (!el) return;
const isAtEnd =
    el.scrollLeft+el.clientWidth+1>=el.scrollWidth

console.log(isAtEnd)
  if (isAtEnd) {
    setPage((prev)=>prev+1)
        }

};

 const FetchAllUserPlaylist = async (page = 1, limit = 10) => {
    
    axios.defaults.withCredentials=true;
    const { data } = await axios.get(
      `http://localhost:4500/get-all-user-playlist/?page=${page}&limit=${limit}`);

      setTotalPages(data.totalPages);
  if(page>1){
    // console.log([...ApiData,...data.singers])
      setSingers((prev)=>[...prev,...data.singers])
    }
    else{
      console.log(data.singers)
      setSingers(data.singers)
    }
  
  
};
useEffect(()=>{  

  dispatch(SetUserPlaylist(singers))
},[singers])
  useEffect(()=>{  
  FetchAllUserPlaylist(page)

  },[page])


  return (
    <>
   {loading==false? <section className="md:w-[94%] w-[96%]">
  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 mb-1">
    {heading}
  </h2>

  <div
    ref={scrollRef}
    onScroll={handleScroll}
    className="flex gap-4 sm:gap-5 overflow-x-auto
               scroll-smooth snap-x snap-mandatory
               [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              "
              >
    {singers.length>0?singers.map((singer, i) => (
      <div
         key={i}  // ❗ FIXED KEY (see below)
        className={`snap-start group flex-shrink-0 
                    w-[130px] sm:w-[140px] md:w-[150px]
                  bg-white/10 ${i} backdrop-blur-xl border border-white/10
                   rounded-2xl p-3`}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="w-full aspect-square rounded-xl overflow-hidden"
        >
          <img
            src={`http://localhost:4500/${singer.coverImage}`}
            alt={singer.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <h3 className="mt-1 text-sm font-semibold text-gray-100 truncate">
          <Link to={`/usershowsong/${singer._id}`}>{singer.name}</Link>
        </h3>

        <p className="text-xs text-gray-400 line-clamp-2">
          {singer.desc}
        </p>
      </div>
    )):
    <div>
      <Link to={"/addplaylist"} className="text-purple-400 font-bold md:text-2xl text-sm"><h1>Click to add your own playlist</h1></Link>
    </div>
    }

    </div>
</section>:<SingerHorizontalSkeleton/>}

    </>

  );
}
