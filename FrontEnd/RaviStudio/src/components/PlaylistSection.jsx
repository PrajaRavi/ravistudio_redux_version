import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SingerHorizontalSkeleton from "./SkeltonLoading/SingerSection";
import axios from "axios";
import { toast } from "react-toastify";


export default function PlaylistSection({heading}) {
  const [singers, setSingers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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

 const fetchSingers = async (page = 1, limit = 10) => {
  const { data } = await axios.get(
    `http://localhost:4500/playlist/get-all-playlist/?page=${page}&limit=${limit}`
  );
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
  fetchSingers(page)
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
    {singers.map((singer, i) => (
      <div
         key={i}  // ❗ FIXED KEY (see below)
        className="snap-start group flex-shrink-0
                    w-[130px] sm:w-[140px] md:w-[150px]
                  bg-white/10 backdrop-blur-xl border border-white/10
                   rounded-2xl p-3"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="w-full aspect-square rounded-xl overflow-hidden"
        >
          <img
            src={`http://localhost:4500/${singer.playlistimage}`}
            alt={singer.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <h3 className="mt-1 text-sm font-semibold text-gray-100 truncate">
          <Link to={`/showsong/${singer._id}`}>{singer.name}</Link>
        </h3>

        <p className="text-xs text-gray-400 line-clamp-2">
          {singer.desc}
        </p>
      </div>
    ))}

    </div>
</section>:<SingerHorizontalSkeleton/>}

    </>

  );
}
