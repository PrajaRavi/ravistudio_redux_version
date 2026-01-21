import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
} from "lucide-react";

export default function BottomMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState("all"); // all | one | off
  const [progress, setProgress] = useState(35); // demo progress %
  const IsUserLogin=useSelector(state=>state.User.IsUserLogin)

  const toggleLoop = () => {
    setLoopMode((prev) =>
      prev === "all" ? "one" : prev === "one" ? "off" : "all"
    );
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = (clickX / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={IsUserLogin?"fixed bottom-0 left-0 z-40 w-full":"hidden"}
    >
      {/* Seekable Progress Bar */}
      <div
        onClick={handleSeek}
        className="h-1 w-full bg-white/10 cursor-pointer"
      >
        <motion.div
          className="h-full bg-purple-600"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* Player Container */}
      <div
        className="flex items-center justify-between gap-4 px-4 md:px-6 py-3
                   bg-white/5 backdrop-blur-xl border-t border-white/10"
      >
        {/* Left: GIF + Song Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
            <img
              src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
              alt="playing"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">
              Song Name Goes Here
            </p>
            <p className="text-xs text-gray-400 truncate">Singer Name</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-gray-400 hover:text-white">
            <Shuffle size={18} />
          </button>

          <button className="text-gray-300 hover:text-white">
            <SkipBack size={22} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full
                       bg-purple-600 hover:bg-purple-700"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button className="text-gray-300 hover:text-white">
            <SkipForward size={22} />
          </button>

          <button onClick={toggleLoop} className="text-gray-400 hover:text-white">
            {loopMode === "one" ? (
              <Repeat1 size={18} className="text-purple-500" />
            ) : (
              <Repeat
                size={18}
                className={loopMode === "all" ? "text-purple-500" : ""}
              />
            )}
          </button>
        </div>

        {/* Right: Rotating Album Art */}
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
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d"
              alt="current"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
