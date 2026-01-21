import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
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

export default function BottomMusicPlayer() {
  const audioRef = useRef(null);
  const hlsRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState("all");
  const [progress, setProgress] = useState(0);

  const IsUserLogin = useSelector((state) => state.User.IsUserLogin);

  // 🔗 Your HLS master playlist
  const HLS_URL = "http://localhost:4500/hls-output/1769016309072-Martin_Bravi_Needed_You.mp3/index.m3u8";

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

      hls.loadSource(HLS_URL);
      hls.attachMedia(audio);

      hlsRef.current = hls;
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari (native HLS)
      audio.src = HLS_URL;
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, []);

  /* =======================
     PLAY / PAUSE
  ======================= */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying]);

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
        onEnded={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
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

      {/* Player */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 bg-white/5 backdrop-blur-xl border-t border-white/10">
        {/* Left */}
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

        {/* Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          <Shuffle size={18} className="text-gray-400" />

          <SkipBack size={22} className="text-gray-300" />

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <SkipForward size={22} className="text-gray-300" />

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
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d"
              alt="album"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
