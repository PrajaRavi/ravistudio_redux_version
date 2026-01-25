import React, { useEffect, useRef, useState } from "react";
import { motion, number } from "framer-motion";
import PlayingGif from "../assets/playing.gif"
import { useSelector ,useDispatch} from "react-redux";
import "../App.css"
let firstrender=false;
import Hls from "hls.js";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
} from "lucide-react";
import { SetCurrSongIdx, SetisPlaying } from "../Redux/Slices/Song.slice";

export default function BottomMusicPlayer() {
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState("all");
  const [progress, setProgress] = useState(0);
  const dispatch=useDispatch()

  const IsUserLogin = useSelector((state) => state.User.IsUserLogin);
  const isPlaying = useSelector((state) => state.Song.isPlaying);
  const SongData = useSelector((state) => state.Song.SongArray);
  const currsongindex = useSelector((state) => state.Song.currsongidx);
  let [suffle,setsuffle]=useState(false)
  

  
useEffect(() => {

  const audio = audioRef.current;
  if (!audio) return;
  

  const handleEnded = () => {
   if(suffle==false){

     if (currsongindex < SongData.length - 1) {
       dispatch(SetCurrSongIdx(parseInt(currsongindex)+1))
       dispatch(SetisPlaying(true))
      }
    }
    else{
     const random = Math.floor(Math.random() * SongData.length);
      dispatch(SetCurrSongIdx(parseInt(random)))
      dispatch(SetisPlaying(true))
 
    } 
  };

  audio.addEventListener("ended", handleEnded);
  return () => {audio.removeEventListener("ended", handleEnded) 
    firstrender=true;
  };
}, [currsongindex]);

  /* =======================
     INIT HLS
  ======================= */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      if(currsongindex){
        // alert('chala')
        hls.loadSource(SongData[currsongindex]?.audioURL?.master);
      }
      hls.attachMedia(audio);

      hlsRef.current = hls;
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari (native HLS)
      audio.src = SongData[currsongindex]?.audioURL?.master;
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [currsongindex]);

  /* =======================
     PLAY / PAUSE
  ======================= */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlaying ? audio.play() : audio.pause();
  }, [currsongindex,isPlaying]);

  /* =======================
     PROGRESS HANDLING
  ======================= */
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent || 0);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;

    audio.currentTime = percent * audio.duration;
  };

  const toggleLoop = () => {
    setLoopMode((prev) =>
      prev === "all" ? "one" : prev === "one" ? "off" : "all"
    );
  };

  /* =======================
     LOOP MODE
  ======================= */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = loopMode === "one";
  }, [loopMode]);

  const HandleNextSong=async()=>{
    if (currsongindex < SongData.length - 1) {
      dispatch(SetCurrSongIdx(parseInt(currsongindex)+1))
      dispatch(SetisPlaying(true))
    }
    else{
      dispatch(SetCurrSongIdx(0))
      dispatch(SetisPlaying(true))
      
    }
    
  }
  const HandlePrevSong=async()=>{
    if (currsongindex > 0) {
      dispatch(SetCurrSongIdx(parseInt(currsongindex)-1))
      dispatch(SetisPlaying(true))
    }
    else{
      dispatch(SetCurrSongIdx(0))
      dispatch(SetisPlaying(true))
      
    }
  }
  const HandleSuffleSong=()=>{
    if(suffle){

      setsuffle(false)
    }
    else {
      const random = Math.floor(Math.random() * SongData.length);
      dispatch(SetCurrSongIdx(parseInt(random)))
      dispatch(SetisPlaying(true))

      setsuffle(true)

    }
  }
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={IsUserLogin ? "fixed bottom-0 left-0 z-40 w-full" : "hidden"}
    >
      {/* 🎵 Hidden Audio */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch(SetisPlaying(false))}
      />

      {/* Progress Bar */}
      <div
        onClick={handleSeek}
        className="h-1 w-full bg-black/50 cursor-pointer"
      >
        <motion.div
          className="h-full bg-purple-600"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* Player */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 bg-white/5 backdrop-blur-xl border-t border-white/10">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-30 h-12 rounded-lg overflow-hidden bg-white/10">
            <img
              src={PlayingGif}
              alt="playing"
              className={isPlaying?"w-full h-full object-cover anim1":"w-full anim1 h-full object-cover hidden"}
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">
              {SongData[parseInt(currsongindex)]?.title}
            </p>
            <p className="text-xs text-purple-700 truncate">{SongData[parseInt(currsongindex)]?.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center relative md:right-20 gap-3 md:gap-4">
          <button onClick={()=>HandleSuffleSong()}>

          <Shuffle size={18} className={suffle==false?"text-gray-400 hover:text-purple-700":"text-purple-700 hover:text-purple-400"} />
          </button>
          <button onClick={()=>HandlePrevSong()}>


          <SkipBack size={22} className="text-gray-300" />
          </button>

          <button
            onClick={() => dispatch(SetisPlaying(!isPlaying))}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={()=>HandleNextSong()}>

          <SkipForward  size={22} className="text-gray-300" />
          </button>

          <button onClick={toggleLoop}>
            {loopMode === "one" ? (
              <Repeat1 size={18} className="text-purple-500" />
            ) : (
              <Repeat
                size={18}
                className={loopMode === "all" ? "text-purple-500" : "text-gray-400"}
              />
            )}
          </button>
        </div>

        {/* Rotating Art */}
        <div className="hidden sm:block">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isPlaying
                ? { repeat: Infinity, duration: 12, ease: "linear" }
                : { duration: 0.3 }
            }
            className="w-12 h-12 rounded-full overflow-hidden border border-white/10"
          >
            <img
              src={`http://localhost:4500/${SongData[parseInt(currsongindex)]?.coverImage}`}
              alt="album"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
