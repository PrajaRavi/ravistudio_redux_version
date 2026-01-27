import React from "react";

export default function SingerHorizontalSkeleton() {
  return (
    <section className="md:w-[94%] w-[96%] mx-auto min-h-[210px] animate-pulse">
      {/* Heading Skeleton */}
      <div className="h-6 w-40 bg-white/10 rounded-md mb-3"></div>

      {/* Scroll Container */}
      <div
        className="flex gap-4 sm:gap-5 overflow-x-auto
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start
                       w-[130px] sm:w-[140px] md:w-[150px]
                       bg-white/10 backdrop-blur-xl border border-white/10
                       rounded-2xl p-3"
          >
            {/* Image Skeleton */}
            <div className="w-full aspect-square rounded-xl bg-white/20"></div>

            {/* Name Skeleton */}
            <div className="mt-3 h-4 w-3/4 bg-white/20 rounded"></div>

            {/* Description Skeleton */}
            <div className="mt-2 h-3 w-full bg-white/10 rounded"></div>
            <div className="mt-1 h-3 w-2/3 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
      <div
        className="flex gap-4 sm:gap-5 overflow-x-auto
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start
                       w-[130px] sm:w-[140px] md:w-[150px]
                       bg-white/10 backdrop-blur-xl border border-white/10
                       rounded-2xl p-3"
          >
            {/* Image Skeleton */}
            <div className="w-full aspect-square rounded-xl bg-white/20"></div>

            {/* Name Skeleton */}
            <div className="mt-3 h-4 w-3/4 bg-white/20 rounded"></div>

            {/* Description Skeleton */}
            <div className="mt-2 h-3 w-full bg-white/10 rounded"></div>
            <div className="mt-1 h-3 w-2/3 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
      <div
        className="flex gap-4 sm:gap-5 overflow-x-auto
                   [-ms-overflow-style:none] [scrollbar-width:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start
                       w-[130px] sm:w-[140px] md:w-[150px]
                       bg-white/10 backdrop-blur-xl border border-white/10
                       rounded-2xl p-3"
          >
            {/* Image Skeleton */}
            <div className="w-full aspect-square rounded-xl bg-white/20"></div>

            {/* Name Skeleton */}
            <div className="mt-3 h-4 w-3/4 bg-white/20 rounded"></div>

            {/* Description Skeleton */}
            <div className="mt-2 h-3 w-full bg-white/10 rounded"></div>
            <div className="mt-1 h-3 w-2/3 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
