import React, { useState } from "react";
import { motion } from "framer-motion";
import { Music, Type, ImagePlus, FileText, Upload } from "lucide-react";

export default function AddPlaylist() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if (imageFile) payload.append("image", imageFile);

    try {
      await fetch("https://your-backend-api/playlists", {
        method: "POST",
        body: payload,
      });

      alert("Playlist created successfully 🎶");
      setFormData({ name: "", title: "", description: "" });
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist ❌");
    }
  };

  return (
    <div className="min-h-screen md:w-[90%] w-full flex items-center justify-center  px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
          Add Playlist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <Music className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Playlist Name"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Title */}
          <div className="relative">
            <Type className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Playlist Title"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-dashed border-white/20 py-4 text-gray-300 hover:border-purple-500">
              <ImagePlus size={20} /> Upload Playlist Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </label>

            {preview && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex justify-center"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded-xl border border-white/10"
                />
              </motion.div>
            )}
          </div>

          {/* Description */}
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Playlist Description"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            <Upload size={18} /> Create Playlist
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
