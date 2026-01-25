import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion"
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Trash, Play } from 'lucide-react'
import { SetCurrSongIdx, SetFavouirtePageOpenOrNot, SetisPlaying, SetSongArray } from '../Redux/Slices/Song.slice'
import DeleteSongPopup from './utils/PopUp'
import { useParams } from 'react-router-dom'
import PlaylistSkeleton from './SkeltonLoading/ShowSong'
function UserShowSong() {
  let [songs,setsongs]=useState([])
  const [open, setOpen] = useState(false); //this is for popup
  const FavSongData = useSelector((state) => state.Song.favouriteSongArray); //This is nothing but data of the favouriteSongId not song detail 
  let [loading,setloading]=useState()
  const SongData = useSelector((state) => state.Song.SongArray); //This is the actual songarray where all the song lived which have to play
    let [playlistdata,setplaylistdata]=useState([])
  const {userplaylist}=useParams()
  const currsongindex = useSelector((state) => state.Song.currsongidx);
  let [DeletedSongId,setDeletedSongId]=useState("")
  const IsFavouriteSongPlay=useSelector((state) => state.Song.FavouritePageOpenOrNot)
  const dispatch=useDispatch()
const GetAllSongs=async()=>{
  try {
    setloading(true)
    axios.defaults.withCredentials=true;
    let {data}=await axios.get(`http://localhost:4500/playlist/get-user-playlist-song-by-id/${userplaylist}`)
    console.log(data)
    if(data.success){
      setsongs(data.msg)
    }
    else{
      toast.error("error during song fetching in favourite")
    }
  } catch (error) {
    
  }finally{
setloading(false)
  }
}
const HandleSongPlay=(idx)=>{
  // alert(IsFavouriteSongPlay)
  if(IsFavouriteSongPlay==false){
    dispatch(SetSongArray(songs))
  }
  setTimeout(() => {
    
    dispatch(SetCurrSongIdx(idx))
    dispatch(SetisPlaying(true))
    dispatch(SetFavouirtePageOpenOrNot(true))
  }, 100);
    

}
  const FetchPlaylistById=async()=>{
    axios.defaults.withCredentials=true;
      let {data}=await axios.get(`http://localhost:4500/playlist/get-user-playlist-by-id/${userplaylist}`)
      if(data.success){
        setplaylistdata(data.msg)
        
      }
      
    }

const HandleSongDelete=async (songId)=>{
setDeletedSongId(songId)
  setOpen(true)
  
  
  
}

useEffect(()=>{
FetchPlaylistById()
},[])
useEffect(()=>{  
GetAllSongs()
},[FavSongData,open])

  return (
    <>
    {loading==false?<div className='min-h-screen md:w-[70%] w-[96%] z-20 bg-transparent text-white px-3'>
      <div className='w-full h-[80px]'>
        

      </div>
      {/* showing playlist detail */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 mb-10">
              <img src={`http://localhost:4500/${playlistdata.coverImage}`} alt="playlist" className="w-48 h-48 rounded-2xl object-cover" />
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold">{playlistdata.name}</h1>
                <p className="text-gray-400 mt-2 max-w-xl">{playlistdata.title}</p>
                <span className="text-sm text-gray-500 mt-1">10 Songs</span>
              </div>
            </motion.div>
      
      {/* showing songlist */}
      <div className='w-full h-full mx-auto'>
         {songs?.length!=0?songs?.map((song,index) => (
          <motion.div
            key={song._id}
            whileHover={{ scale: 1.01 }}
            className={songs[currsongindex]._id!=song._id?"relative flex items-center gap-4 z-10 w-full bg-white/5 border  border-black/10 backdrop-blur-xl my-2 rounded-xl p-3":"relative flex items-center gap-4 z-10 w-full bg-purple-300/50 border  border-black/10 backdrop-blur-xl rounded-xl p-3"}
            // className={"relative flex items-center gap-4 z-10 w-full bg-white/10 border my-2  border-black/10 backdrop-blur-xl rounded-xl p-3"}
          >
            {/* Image */}
            <img src={`http://localhost:4500/${song.coverImage}`} className="w-14 h-14 rounded-lg object-cover" />

            {/* Title */}
            <div className="flex-1">
              {window.innerWidth>500?<h3 className="font-semibold truncate">{song.title}</h3>:<h3 className="font-semibold truncate">{String(song.title).length>15?String(song.title).slice(0,15)+"...":song.title}</h3>}
             {window.innerWidth>500?<p className="font-semibold truncate">{song.artist}</p>:<h3 className="font-semibold truncate">{String(song.artist).length>15?String(song.artist).slice(0,15)+"...":song.artist}</h3>}
             </div>

            {/* Actions */}
             <button onClick={()=>HandleSongPlay(index)} className="cursor-pointer"><Play /></button>
             <button onClick={()=>HandleSongDelete(song._id)} className="cursor-pointer text-red-300 hover:text-red-700"><Trash /></button>
            
            
          </motion.div>
        )): 
        <div className='w-full  items-center flex justify-center'>

        <h1 className='text-3xl font-bold'>Nothing here in the playlist</h1>
        </div>
        }
        
      </div>
      
      
    </div>:<PlaylistSkeleton/>}
    
    </>

  )
}

export default UserShowSong
