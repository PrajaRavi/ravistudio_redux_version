import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, MoreVertical, Share2, Plus } from "lucide-react";
import axios from "axios"
import { useParams } from "react-router-dom";
import PlaylistSkeleton from "./SkeltonLoading/ShowSong";
import {useDispatch,useSelector} from "react-redux"
import {toast} from "react-toastify"
import { Helmet } from "react-helmet-async";
import {  SetCurrSongIdx, SetFavouirtePageOpenOrNot, SetFavouriteSongArray, SetisPlaying, SetSongArray } from "../Redux/Slices/Song.slice";
export default function PlaylistSongsPage() {
  const [songs,setsongs]=useState([])
  let [loading,setloading]=useState(false)
  let [playlistdata,setplaylistdata]=useState([])
  const [showPlaylistBox, setShowPlaylistBox] = useState(false);
const [selectedSongId, setSelectedSongId] = useState(null);
const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const {playlist}=useParams()
  const dispatch=useDispatch()
  const isPlaying=useSelector(state=>state.Song.isPlaying)
  // const songs=useSelector(state=>state.Song.SongArray)
  const IsFavouriteSongPlay=useSelector((state) => state.Song.FavouritePageOpenOrNot)
  const UserPlaylistData=useSelector((state) => state.Song.UserPlaylist)
    
// const SelectedSongId=useSelector((state)=>state.Song.songid)
const SongData = useSelector((state) => state.Song.SongArray);
  const currsongindex = useSelector((state) => state.Song.currsongidx);
  const FavSongData = useSelector((state) => state.Song.favouriteSongArray);
  const playlists = [
  {
    _id: "pl1",
    name: "My Favorites",
    image: "https://picsum.photos/200?random=1",
    isPublic: false,
  },
  {
    _id: "pl2",
    name: "Workout Vibes",
    image: "https://picsum.photos/200?random=2",
    isPublic: true,
  },
  {
    _id: "pl3",
    name: "Late Night Chill",
    image: "https://picsum.photos/200?random=3",
    isPublic: false,
  },
  {
    _id: "pl4",
    name: "Coding Focus",
    image: "https://picsum.photos/200?random=4",
    isPublic: false,
  },
  {
    _id: "pl5",
    name: "Road Trip Hits",
    image: "https://picsum.photos/200?random=5",
    isPublic: true,
  },
  {
    _id: "pl6",
    name: "Romantic Classics",
    image: "https://picsum.photos/200?random=6",
    isPublic: false,
  },
];



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
         
        // dispatch(SetSongArray(data.msg))
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

  const HandleFavouriteSongAddInDB=async (songId)=>{
if(!liked[songId]){

  setLiked({ ...liked, [songId]: true })
  
  try {
    let {data}=await axios.post(`http://localhost:4500/user/add-favourite-song`,{songId})
    if(data.success){
        toast.success("Added successfully")
        StoreUserIdinSong(songId)
        
      }
      else{
        return toast.error("something went wrong in favourite song add")
      }
    } catch (error) {
      console.log(error)
      return toast.error(error)
    }finally{
      
    }
  }
  }

  const GetAllFavouriteSongId=async()=>{
    axios.defaults.withCredentials=true
    let {data}=await axios.get(`http://localhost:4500/user/get-favourite-songId`)
    if(data.success){
      dispatch(SetFavouriteSongArray(data.msg))
      data.msg.forEach(id=>{
      liked[id]=true
   })
        
    }
    else{
      alert("error occured")
    }

  }


  useEffect(()=>{
    console.log(UserPlaylistData)
    console.log("userplaylistdata")
    
GetAllFavouriteSongId()
  },[])

  useEffect(()=>{
    FavSongData?.forEach(id=>{
      liked[id]=true
    })
   },[FavSongData])
  
  const HandleSongPlay=async (songname,artist,cover,idx,totalsong,MasterFileUrl,songid)=>{
    if(IsFavouriteSongPlay){
      dispatch(SetFavouirtePageOpenOrNot(false))
      
      
    }
    dispatch(SetSongArray(songs))
      setTimeout(() => {
        dispatch(SetCurrSongIdx(idx))
        dispatch(SetisPlaying(true))
      }, 100);
    
        

  }
  const StoreUserIdinSong=async(songId)=>{
    // UserAddedInSong="kaunhaibetushale"
    
    
    let {data}=await axios.post(`http://localhost:4500/songs/Store-user-Id/${songId}`)
    if(data.success) localStorage.setItem("kaunhaibetushale","yes") 
      else return

  }
  const handleAddSongToPlaylists=async(song,playlist)=>{
    axios.defaults.withCredentials=true;
    let {data}=await axios.post(`http://localhost:4500/playlist/post-user-playlist-song-by-userplaylistid`,{songId:song,playlistNames:playlist})
    console.log(data)
    if(data.success){
      toast.success("song added successfully")
                setShowPlaylistBox(false);
                setSelectedPlaylists([]);
              }
              else{
                toast.error("something went wrong")
              }
    
  }

  useEffect(()=>{  
    
    FetchAllSongs()
    FetchPlaylistById()
    
  },[])

  return (

    <>
    <Helmet>
            <title>PlaylistSong Page | My Music App</title>
    
            <meta
              name="description"
              content="Listen to trending playlists and curated songs updated daily."
            />
          </Helmet>
    {loading==false?<div className="min-h-screen overflow-y-scroll md:w-[70%] w-[96%] z-20 bg-transparent text-white px-3">
      {/* Playlist Header */}
      <div className="w-full h-[90px]">

      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 mb-10">
        <img loading="lazy" src={`http://localhost:4500/${playlistdata.playlistimage}`} alt="playlist" className="w-48 h-48 rounded-2xl object-cover" />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{playlistdata.name}</h1>
          <p className="text-gray-400 mt-2 max-w-xl">{playlistdata.title}</p>
          <span className="text-sm text-gray-500 mt-1">10 Songs</span>
        </div>
      </motion.div>

      {/* Songs List */}
      <div className="space-y-3 w-full  ">
        {songs?.map((song,index) => (
          <motion.div
            key={song._id}
            whileHover={{ scale: 1.01 }}
            className={SongData[currsongindex]?._id!=song?._id?"relative flex items-center gap-4 z-10 w-full bg-white/5 border  border-black/10 backdrop-blur-xl rounded-xl p-3":"relative flex items-center gap-4 z-10 w-full bg-purple-300/50 border  border-black/10 backdrop-blur-xl rounded-xl p-3"}
          >
            {/* Image */}
            <img loading="lazy" src={`http://localhost:4500/${song.coverImage}`} className="w-14 h-14 rounded-lg object-cover" />

            {/* Title */}
             <div className="flex-1">
             <h3 className="hidden sm:block truncate">{song.title}</h3>
<h3 className="block sm:hidden truncate">
  {song.title.slice(0, 15)}...
</h3>
             <h3 className="hidden sm:block truncate">{song.artist}</h3>
<h3 className="block sm:hidden truncate">
  {song.artist.slice(0, 15)}...
</h3>
             </div>


            {/* Actions */}
            <button name="heart" onClick={()=>{HandleFavouriteSongAddInDB(song._id)
            }}>
              <Heart className={liked[song._id] ? "fill-red-500 text-red-500" : "text-white"} />
              {/* <Heart className={"text-gray-400"} /> */}
            </button>
            <button name="songplay" onClick={()=>HandleSongPlay(song.title,song.artist,song.coverImage,index,songs.length,song.audioURL.master,song._id)} className="cursor-pointer"><Play /></button>
            <button name="cimenukabab" onClick={() => setOpenMenu(openMenu === song._id ? null : song._id)}>
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
                  <button
                  name="addplaylist"
          onClick={() => {
            setSelectedSongId(song._id);
            setShowPlaylistBox(true);
            setOpenMenu(null);
          }}
  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/10"
>
  <Plus size={16} /> Add Playlist
</button>
                  <button name="share" onClick={() => handleShare(song)} className="flex items-center gap-2 w-full px-4 py-3 hover:bg-white/10"><Share2 size={16} />Share</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        <AnimatePresence>
  {showPlaylistBox && (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-[90%] sm:w-[400px]
                   bg-white/10 backdrop-blur-xl
                   border border-white/20
                   rounded-2xl p-5 text-white"
      >
        <h3 className="text-lg font-semibold mb-4">
          Add to Playlist
        </h3>

        {/* Playlist list */}
        <div className="max-h-[250px] overflow-y-auto space-y-2">
          {UserPlaylistData.map((pl) => (
            <label
              key={pl._id}
              className="flex items-center gap-3 p-3
                         rounded-xl cursor-pointer
                         hover:bg-white/10"
            >
              <input
                type="checkbox"
                checked={selectedPlaylists.includes(pl.name)}
                onChange={() => {
                  setSelectedPlaylists((prev) =>
                    prev.includes(pl.name)
                      ? prev.filter((name) => name !== pl.name)
                      : [...prev, pl.name]
                  );
                }}
                className="accent-purple-500"
              />
              <div className="flex flex-col">

              <span className="truncate">{pl.name}</span>
              <p>{pl.title}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button
          name="cancel"
            onClick={() => {
              setShowPlaylistBox(false);
              
              setSelectedPlaylists([]);
            }}
            className="px-4 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20"
          >
            Cancel
          </button>

          <button
          name="addsonginfavourite"
            onClick={() => {
              console.log(selectedPlaylists)
              handleAddSongToPlaylists(
                selectedSongId,
                selectedPlaylists
              );
              

            }}
            disabled={!selectedPlaylists.length}
            className="px-4 py-2 rounded-lg text-sm
                       bg-purple-600 hover:bg-purple-700
                       disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
      <div className="w-full h-[90px]">

      </div>
      
    </div>:<PlaylistSkeleton/>}
    </>

  );
}
