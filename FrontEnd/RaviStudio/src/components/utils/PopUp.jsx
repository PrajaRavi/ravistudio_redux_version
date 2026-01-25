import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

export default function DeleteSongPopup({ open, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          {/* Popup Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="relative w-full max-w-md rounded-2xl
                       bg-white/10 backdrop-blur-xl border border-white/20
                       shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center
                         rounded-full bg-red-500/20 text-red-400"
            >
              <Trash2 size={26} />
            </motion.div>

            {/* Text */}
            <h2 className="text-center text-xl font-semibold text-white">
              Delete this song?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              This action cannot be undone. The song will be permanently removed
              from your library.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/20
                           bg-white/5 py-2 text-sm text-gray-200
                           hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-red-600/80 py-2
                           text-sm font-semibold text-white
                           hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
