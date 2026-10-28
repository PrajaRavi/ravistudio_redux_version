import React, { useRef, useEffect } from "react";

// RiverThemeUnderwater.jsx
// Fullscreen underwater/river-themed container background using Tailwind CSS.
// Works as a wrapper for children content, so you can place your app UI inside.

export  function RiverThemeUnderwater({
  children,
  bubbleCount = 28,
  waterColorTop = "rgba(10,45,71,0.85)",
  waterColorBottom = "#1882A2",
  sandColor = "#d8b38b",
  rockColor = "#6b5e54",
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const bubbles = [];
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function initBubbles() {
      bubbles.length = 0;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      for (let i = 0; i < bubbleCount; i++) {
        const size = rand(6, 28);
        bubbles.push({
          x: rand(w * 0.05, w * 0.95),
          y: rand(h * 0.6, h * 0.98),
          r: size,
          speed: rand(18, 70),
          drift: rand(-10, 10),
          wobble: rand(0.5, 2.5),
          opacity: rand(0.08, 0.28),
        });
      }
    }

    initBubbles();
    let last = performance.now();

    function drawBubble(b, dt) {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      b.y -= (b.speed * dt) / 1000;
      b.x += Math.sin((b.y + b.wobble * 50) * 0.02) * (b.wobble * 0.2) + (b.drift * dt) / 100000;

      const topFadeZone = h * 0.12;
      let alpha = b.opacity;
      if (b.y < topFadeZone) alpha *= Math.max(0, b.y / topFadeZone);

      const gradient = ctx.createRadialGradient(b.x - b.r * 0.28, b.y - b.r * 0.4, b.r * 0.08, b.x, b.y, b.r);
      gradient.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
      gradient.addColorStop(0.25, `rgba(220,240,255,${0.45 * alpha})`);
      gradient.addColorStop(1, `rgba(190,220,235,${0.06 * alpha})`);

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.strokeStyle = `rgba(255,255,255,${0.12 * alpha})`;
      ctx.lineWidth = Math.max(1, b.r * 0.06);
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    function step(now) {
      const dt = now - last;
      last = now;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        drawBubble(b, dt);
        if (b.y + b.r < -20) {
          b.x = rand(w * 0.05, w * 0.95);
          b.y = rand(h * 0.8, h * 1.05);
          b.r = rand(6, 28);
          b.speed = rand(18, 70);
          b.drift = rand(-10, 10);
          b.wobble = rand(0.5, 2.5);
          b.opacity = rand(0.08, 0.28);
        }
      }

      animationRef.current = requestAnimationFrame(step);
    }

    animationRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [bubbleCount]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${waterColorTop} 0%, ${waterColorBottom} 60%, rgba(8,34,48,1) 100%)`,
        }}
      />

      {/* Waves */}
      <div className="absolute left-0 right-0 top-0 pointer-events-none">
        <svg className="w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ transform: "translateY(-20%)" }}>
          <defs>
            <linearGradient id="w1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>
          <g className="animate-[waveSlow_14s_linear_infinite]">
            <path d="M0,80 C240,160 480,0 720,80 C960,160 1200,0 1440,80 L1440 200 L0 200 Z" fill="url(#w1)" opacity="0.85" />
          </g>
          <g className="animate-[waveFaster_9s_linear_infinite]">
            <path d="M0,100 C260,40 520,180 780,80 C1040,-20 1300,60 1440,100 L1440 200 L0 200 Z" fill="rgba(255,255,255,0.03)" />
          </g>
        </svg>
      </div>

      {/* Bubble canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Sand & rocks */}
      <div className="absolute left-0 right-0 bottom-0 pointer-events-none">
        <svg className="w-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sandGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={sandColor} />
              <stop offset="100%" stopColor="#b58966" />
            </linearGradient>
          </defs>
          <path d="M0,80 C160,20 320,120 480,90 C640,60 800,160 960,110 C1120,60 1280,140 1440,90 L1440 220 L0 220 Z" fill="url(#sandGrad)" />
          <g transform="translate(60,48) scale(0.9)">
            <ellipse cx="60" cy="120" rx="48" ry="28" fill={rockColor} opacity="0.95" />
          </g>
        </svg>
      </div>

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-hidden text-white">
        {children}
      </div>

    </div>
  );
}
