import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Play, MoreVertical, Share2, Plus } from "lucide-react";

export default function PlaylistSongsPage() {
  const playlist = {
    title: "Chill Vibes",
    description: "Relaxing songs to boost your mood",
    image: "https://picsum.photos/500/500",
    totalSongs: 6,
  };

  const songs = [
    { id: 1, title: "Night Changes", artist: "One Direction", image: "https://picsum.photos/200?1" },
    { id: 2, title: "Perfect", artist: "Ed Sheeran", image: "https://picsum.photos/200?2" },
    { id: 3, title: "Believer", artist: "Imagine Dragons", image: "https://picsum.photos/200?3" },
    { id: 4, title: "Blinding Lights", artist: "The Weeknd", image: "https://picsum.photos/200?4" },
    { id: 5, title: "Lovely", artist: "Billie Eilish", image: "https://picsum.photos/200?5" },
    { id: 6, title: "Stay", artist: "Justin Bieber", image: "https://picsum.photos/200?6" },
  ];

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

  return (
    <div className="min-h-screen md:w-[70%] w-[96%] z-20 bg-transparent text-white px-3 md:px-">
      {/* Playlist Header */}
      <div className="w-full h-[90px]">

      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 mb-10">
        <img src={playlist.image} alt="playlist" className="w-48 h-48 rounded-2xl object-cover" />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-gray-400 mt-2 max-w-xl">{playlist.description}</p>
          <span className="text-sm text-gray-500 mt-1">{playlist.totalSongs} Songs</span>
        </div>
      </motion.div>

      {/* Songs List */}
      <div className="space-y-3 w-full  ">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            whileHover={{ scale: 1.01 }}
            className="relative flex items-center gap-4 z-10 w-full bg-white/5 border  border-black/10 backdrop-blur-xl rounded-xl p-3"
          >
            {/* Image */}
            <img src={song.image} className="w-14 h-14 rounded-lg object-cover" />

            {/* Title */}
            <div className="flex-1">
              <h3 className="font-semibold truncate">{song.title}</h3>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>

            {/* Actions */}
            <button onClick={() => setLiked({ ...liked, [song.id]: !liked[song.id] })}>
              <Heart className={liked[song.id] ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
            <button><Play /></button>
            <button onClick={() => setOpenMenu(openMenu === song.id ? null : song.id)}>
              <MoreVertical />
            </button>

            {/* Menu */}
            <AnimatePresence>
              {openMenu === song.id && (
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
      
    </div>
  );
}
