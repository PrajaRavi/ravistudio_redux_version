import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, MoreVertical, Share2, Plus } from "lucide-react";
import axios from "axios"
import { useParams } from "react-router-dom";
import PlaylistSkeleton from "./SkeltonLoading/ShowSong";
import {useDispatch,useSelector} from "react-redux"
import {toast} from "react-toastify"
import { SaveSong, SetisPlaying } from "../Redux/Slices/Song.slice";
export default function PlaylistSongsPage() {
  const [songs,setsongs]=useState([])
  let [loading,setloading]=useState(false)
  let [playlistdata,setplaylistdata]=useState([])
  const {playlist}=useParams()
  const dispatch=useDispatch()
  const songstate=useSelector(state=>state.Song)
  const artist=useSelector(state=>state.Song.artist)
  const isPlaying=useSelector(state=>state.Song.isPlaying)
const SelectedSongId=useSelector((state)=>state.Song.songid)


  const FetchPlaylistById=async()=>{
      let {data}=await axios.get(`http://localhost:4500/playlist/get-playlist-by-id/${playlist}`)
      if(data.success){
        setplaylistdata(data.msg)
      }

  }
  const FetchAllSongs=async ()=>{
    try {
      setloading(true)
      let {data}=await axios.get(`http://localhost:4500/songs/get-all-songs`)
      if(data.success){
        setsongs(data.msg)
      }
    } catch (error) {
      alert("failed fetching data frontend")
          
    }finally{
      setloading(false)
    }
  }
  

    const [liked, setLiked] = useState({});
  const [openMenu, setOpenMenu] = useState(null);

  const handleShare = (song) => {
    if (navigator.share) {
      navigator.share({
        title: song.title,
        text: `Listening to ${song.title} by ${song.artist}`,
        url: window.location.href,
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(song.title)}`);
    }
  };

  const HandleSongPlay=async (songname,artist,cover,idx,totalsong,MasterFileUrl,songid)=>{
    // alert(`${songname} and ${artist} and ${cover} and ${idx} and ${totalsong} and ${MasterFileUrl}`)
  // if(!songname||!artist||!cover||!idx||!totalsong||!MasterFileUrl) return toast.warn("something went wrong during song play")
    // else{
  
  dispatch(SaveSong({songname,artist,cover,idx,totalsong,MasterFileUrl,songid}))
  dispatch(SetisPlaying(true))
  // }

  }
  useEffect(()=>{  
    FetchAllSongs()
    FetchPlaylistById()
    
  },[])

  useEffect(()=>{  
    console.log(songstate)
    console.log(artist)
    console.log("hello")
    
  },[songstate])
  return (

    <>
    {loading==false?<div className="min-h-screen md:w-[70%] w-[96%] z-20 bg-transparent text-white px-3 md:px-">
      {/* Playlist Header */}
      <div className="w-full h-[90px]">

      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 mb-10">
        <img src={`http://localhost:4500/${playlistdata.playlistimage}`} alt="playlist" className="w-48 h-48 rounded-2xl object-cover" />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{playlistdata.name}</h1>
          <p className="text-gray-400 mt-2 max-w-xl">{playlistdata.title}</p>
          <span className="text-sm text-gray-500 mt-1">10 Songs</span>
        </div>
      </motion.div>

      {/* Songs List */}
      <div className="space-y-3 w-full  ">
        {songs.map((song,index) => (
          <motion.div
            key={song._id}
            whileHover={{ scale: 1.01 }}
            className={SelectedSongId!=song._id?"relative flex items-center gap-4 z-10 w-full bg-white/5 border  border-black/10 backdrop-blur-xl rounded-xl p-3":"relative flex items-center gap-4 z-10 w-full bg-purple-300/50 border  border-black/10 backdrop-blur-xl rounded-xl p-3"}
          >
            {/* Image */}
            <img src={`http://localhost:4500/${song.coverImage}`} className="w-14 h-14 rounded-lg object-cover" />

            {/* Title */}
            <div className="flex-1">
              <h3 className="font-semibold truncate">{song.title}</h3>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>

            {/* Actions */}
            <button onClick={() => setLiked({ ...liked, [song._id]: !liked[song._id] })}>
              <Heart className={liked[song._id] ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
            <button onClick={()=>HandleSongPlay(song.title,song.artist,song.coverImage,index,songs.length,song.audioURL.master,song._id)} className="cursor-pointer"><Play /></button>
            <button onClick={() => setOpenMenu(openMenu === song._id ? null : song._id)}>
              <MoreVertical />
            </button>

            {/* Menu */}
            <AnimatePresence>
              {openMenu === song._id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-10 -top-10 bg-black border border-white/10 rounded-xl w-40 overflow-hidden z-50"
                >
                  <button className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/10"><Plus size={16} />Add Playlist</button>
                  <button onClick={() => handleShare(song)} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/10"><Share2 size={16} />Share</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="w-full h-[90px]">

      </div>
      
    </div>:<PlaylistSkeleton/>}
    </>

  );
}
