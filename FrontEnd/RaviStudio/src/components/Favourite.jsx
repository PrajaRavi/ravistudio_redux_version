import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion"
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Trash, Play } from 'lucide-react'
import { SetCurrSongIdx, SetFavouirtePageOpenOrNot, SetisPlaying, SetSongArray } from '../Redux/Slices/Song.slice'
import DeleteSongPopup from './utils/PopUp'
import { Helmet } from 'react-helmet-async'
function Favourite() {
  let [songs,setsongs]=useState([])
  const [open, setOpen] = useState(false); //this is for popup
  const FavSongData = useSelector((state) => state.Song.favouriteSongArray); //This is nothing but data of the favouriteSongId not song detail 
  const SongData = useSelector((state) => state.Song.SongArray); //This is the actual songarray where all the song lived which have to play
  const currsongindex = useSelector((state) => state.Song.currsongidx);
  let [DeletedSongId,setDeletedSongId]=useState("")
  const IsFavouriteSongPlay=useSelector((state) => state.Song.FavouritePageOpenOrNot)
  const dispatch=useDispatch()
const GetAllSongs=async()=>{
  axios.defaults.withCredentials=true;
  let {data}=await axios.get(`http://localhost:4500/songs/GetAllFavouriteSong`)
  if(data.success){
    setsongs(data.songs)
  }
  else{
    toast.error("error during song fetching in favourite")
  }
}
const HandleSongPlay=(idx)=>{
  // alert(IsFavouriteSongPlay)
  if(IsFavouriteSongPlay==false){
    dispatch(SetFavouirtePageOpenOrNot(true))
  }
  dispatch(SetSongArray(songs))
  setTimeout(() => {
    
    dispatch(SetCurrSongIdx(idx))
    dispatch(SetisPlaying(true))
  }, 100);
    

}
const HandleSongDelete=async (songId)=>{
setDeletedSongId(songId)
  setOpen(true)
  
  // try {
    
  //   axios.defaults.withCredentials=true
  //   let {data}=await axios.post(`http://localhost:4500/songs/DeleteSongFromBothSection/${songId}`)
    
  //   if(data.success){
      
  //   }
  // } catch (error) {
  //  alert(error) 
  // }
    // call delete song API here

  
}

useEffect(()=>{
console.log(songs)
console.log("favourite songs")
},[songs])
useEffect(()=>{  
GetAllSongs()
},[open])

  return (
    <>
    <Helmet>
            <title>Admin Page | My Music App</title>
    
            <meta
              name="description"
              content="Listen to trending playlists and curated songs updated daily."
            />
          </Helmet>
    <div className='min-h-screen md:w-[70%] w-[96%] z-20 bg-transparent text-white px-3'>
      <div className='w-full h-[80px]'>
        

      </div>
      <div className='w-full h-full mx-auto'>
         {songs?.length!=0?songs.map((song,index) => (
          <motion.div
            key={song._id}
            whileHover={{ scale: 1.01 }}
            className={SongData[currsongindex]?._id!=song?._id?"relative flex my-2 items-center gap-4 z-10 w-full bg-white/5 border  border-black/10 backdrop-blur-xl rounded-xl p-3":"relative my-2 flex items-center gap-4 z-10 w-full bg-purple-300/50 border  border-black/10 backdrop-blur-xl rounded-xl p-3"}
            // className={"relative flex items-center gap-4 z-10 w-full bg-white/10 border my-2  border-black/10 backdrop-blur-xl rounded-xl p-3"}
          >
            {/* Image */}
            <img loading='lazy' src={`http://localhost:4500/${song.coverImage}`} className="w-14 h-14 rounded-lg object-cover" />

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
             <button name='play' onClick={()=>HandleSongPlay(index)} className="cursor-pointer"><Play /></button>
             <button name='delete' onClick={()=>HandleSongDelete(song._id)} className="cursor-pointer text-red-300 hover:text-red-700"><Trash /></button>
            
            
          </motion.div>
        )): 
        <div className='w-full  items-center flex justify-center'>

        <h1 className='text-3xl font-bold'>Nothing here in favourite</h1>
        </div>
        }
        
      </div>
      
      
    </div>
    {<DeleteSongPopup
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={async ()=>{
    try {
    // alert(DeletedSongId)
    axios.defaults.withCredentials=true
    let {data}=await axios.post(`http://localhost:4500/songs/DeleteSongFromBothSection/${DeletedSongId}`)
    
    if(data.success){
      setOpen(false)
    }
      
  } catch (error) {
   alert(error) 
  }
  
  }}/>}
    </>

  )
}

export default Favourite
