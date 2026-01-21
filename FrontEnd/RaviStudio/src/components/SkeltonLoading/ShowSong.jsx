import React from "react";

export default function PlaylistSkeleton() {
  return (
    <div className="md:w-[70%] w-[96%] min-h-screen px-4 md:px-10 py-8 animate-pulse">
      <div className="w-full h-[70px]">

      </div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Cover Image */}
        <div
          className="w-40 h-40 md:w-48 md:h-48 rounded-2xl
                     bg-white/10 backdrop-blur-xl"
        />

        {/* Title */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="w-48 h-6 rounded bg-white/10" />
          <div className="w-32 h-4 rounded bg-white/10" />
          <div className="w-24 h-3 rounded bg-white/10" />
        </div>
      </div>

      {/* Song List */}
      <div className="mt-10 space-y-4">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between
                       rounded-xl p-4
                       bg-white/5 backdrop-blur-xl
                       border border-white/10"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="w-44 h-4 rounded bg-white/10" />
                <div className="w-32 h-3 rounded bg-white/10" />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-white/10" />
              <div className="w-5 h-5 rounded-full bg-white/10" />
              <div className="w-2 h-6 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
