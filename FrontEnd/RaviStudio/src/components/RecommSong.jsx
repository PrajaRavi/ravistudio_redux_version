import React, { useEffect } from "react";
import {motion} from "framer-motion"
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrSongIdx, SetFavouirtePageOpenOrNot, SetisPlaying, SetRecomSong, SetSongArray } from "../Redux/Slices/Song.slice";
import { useState } from "react";
import { RecommConst } from "./utils/constant";
const RecommendedSongs = () => {
  const CurrUser=useSelector(state=>state.User.CurrUser)
  const SongData = useSelector((state) => state.Song.SongArray);
  let [CurrRecommSongId,setCurrRecommSongId]=useState("")
  
  let currsongindex = useSelector((state) => state.Song.currsongidx);
      const isPlaying=useSelector(state=>state.Song.isPlaying)
      const IsFavouriteSongPlay=useSelector((state) => state.Song.FavouritePageOpenOrNot)
      
    
    const dispatch=useDispatch();
    let [recommendedSongs,setrecommendedSongs]=useState(SongData)
    

async function GetLastyPlayedSong(songid){
  try {
    let {data}=await axios.get(`http://localhost:4500/user/get-last-played-song/${songid}`)
    let song=data?.msg
    console.log(song)
    GetRecommendedSong(song[0].title,song[0].artist,song[0].genre,song[0].album)

  } catch (error) {
    console.log(error)
    console.log("error in GetLastyPlayedSong")
  }
}

// This function will give detail of each of the song come from GetRecommendedSong
async function GetRecommSongDetail(songs){
  try {
    let {data}=await axios.post(`http://localhost:4500/songs/get-recom-song-detail`,{songs})
    if(data.success){
      console.log(data)
      setrecommendedSongs(data?.msg)
    }
  } catch (error) {
         console.log(error)
      console.log("error in GetRecommendedSongDetail")
 
  }
}

const HandleSongPlay=async (songname,artist,cover,idx,totalsong,MasterFileUrl,songid)=>{
  setCurrRecommSongId(songid)
    if(IsFavouriteSongPlay){
      dispatch(SetFavouirtePageOpenOrNot(false))
      
      
    }
    dispatch(SetSongArray(recommendedSongs))
      setTimeout(() => {
        dispatch(SetCurrSongIdx(idx))
        dispatch(SetisPlaying(true))
      }, 100);
    
        

  }

  // this function will give ids of all the recommend song
  async function GetRecommendedSong(title,artist,genre,album){
    try {
      let {data}=await axios.post("http://localhost:4500/songs/get-song-by-similiraty-search",{title:title,artist:artist,_id:'',genre:genre,album:album,language:"en"})
      console.log(data)
      if(data?.success){
        dispatch(SetRecomSong(data?.msg))
        GetRecommSongDetail(data?.msg)
        // since this data?.msg contains id's of the songs so here we should use pagination concept

      }
    } catch (error) {
      console.log(error)
      console.log("error in GetRecommendedSong")
    }
  }
  useEffect(()=>{
    if(CurrUser?.Lastsongplayed){
      GetLastyPlayedSong(CurrUser?.Lastsongplayed)
    }
     

  },[CurrUser])

  useEffect(()=>{
    if(localStorage.getItem(RecommConst)==20){
    localStorage.setItem(RecommConst,0);
    GetRecommendedSong(SongData[currsongindex]?.title,SongData[currsongindex]?.artist,SongData[currsongindex]?.genre,SongData[currsongindex]?.album)
  }
  else{
    localStorage.setItem(RecommConst,parseInt(localStorage.getItem(RecommConst))+1)
  }
},[currsongindex])

  

  return (
    <section className="md:w-[94%] md:min-h-[190px] lg:min-h-[210px] mx-auto w-[96%]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">
          Recommended Songs
        </h2>

        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition">
          View All
        </button>
      </div>

      <div
        className="
          flex
          gap-4
          overflow-x-auto
          scroll-smooth
          pb-2
          scrollbar-hide
        "
      >
        {recommendedSongs.map((singer, i) => (
      <button 
      onClick={()=>HandleSongPlay(singer.title,singer.artist,singer.coverImage,i,recommendedSongs.length,singer.audioURL.master,singer._id)}
         key={i}  // ❗ FIXED KEY (see below)
        className="snap-start group flex-shrink-0
                    w-[130px] sm:w-[140px] md:w-[150px] cursor-pointer
                  bg-white/10 backdrop-blur-xl border border-white/10
                   rounded-2xl p-3"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="w-full aspect-square rounded-xl overflow-hidden"
        >
          <img
            src={String(singer.coverImage).startsWith("http")?singer.coverImage:`http://localhost:4500/${singer.coverImage}`}
            alt={singer.title}
            decoding="async"
            width={"150"}
            height={"150"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <h3 className={CurrRecommSongId==singer._id?"mt-1 text-sm font-semibold text-blue-300 truncate":"mt-1 text-sm font-semibold text-gray-100 truncate"}>
          <p>{singer.title}</p>
        </h3>

        <p className={CurrRecommSongId==singer._id?"text-xs text-blue-300 line-clamp-2":"text-xs text-gray-400 line-clamp-2"}>
          {singer.artist}
        </p>
      </button>
    ))}

      </div>
    </section>
  );
};

export default RecommendedSongs;