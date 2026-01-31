import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ReviewPopup({ isOpen, onClose }) {
  let [message,setmessage]=useState("")
  async function onSubmit(e){
    e.preventDefault();
    let {data}=await axios.post(`http://localhost:4500/review/post-review`,{message})
    if(data.success){
      setmessage("")
      toast.success("your review is received!!!!")
      onClose()
    }


  }
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
        >
          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Glass Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-[92%] max-w-lg
                       rounded-2xl p-6
                       bg-white/10 backdrop-blur-xl
                       border border-white/20
                       shadow-2xl"
          >
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X size={22} />
            </button>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-white mb-4">
              Write a Review
            </h2>

            {/* Message Box */}
            <textarea
            onChange={(e)=>{
              setmessage(e.target.value)
            }}
            value={message}
              placeholder="Share your thoughts..."
              className="w-full h-32 resize-none
                         rounded-xl p-4
                         bg-white/10 text-white
                         placeholder:text-white
                         border border-white/10
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Action */}
            <button
              onClick={onSubmit}
              className="mt-4 w-full py-2.5 rounded-xl
                         bg-purple-600 hover:bg-purple-700
                         text-white font-semibold
                         transition"
            >
              Submit Review
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
