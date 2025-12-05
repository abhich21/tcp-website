"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import GlassCard from "../ui/GlassCard/GlassCard";
import dynamic from "next/dynamic";

// Import SplashCursor as client-only to avoid hydration issues
// (it uses Date.now() and Math.random() which differ between server and client)
const SplashCursor = dynamic(() => import("../ui/SplashCursor"), {
  ssr: false,
});

// Static data arrays
const serviceCards = [
  { title: "3D Animation", desc: "Photorealistic renders", icon: "✨" },
  { title: "Brand Design", desc: "Visual identities", icon: "🎨" },
  { title: "Motion Graphics", desc: "Dynamic animations", icon: "🎬" },
  { title: "Video Production", desc: "Full-service production", icon: "🎥" },
] as const;

const stats = [
  { value: "1000+", label: "Projects" },
  { value: "5+", label: "Years" },
  { value: "50+", label: "Clients" },
] as const;


function Hero2() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Defer SplashCursor by 200ms to reduce initial WebGL competition
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);




  // Trigger CSS reveal animations after brief delay for page stabilization
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Brief delay to let WebGL initialize, then reveal
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center px-6 pt-10 pb-10"
    >
      {/* SplashCursor Background Effect */}
      <div className="absolute inset-0 z-0">
        {isMounted && (
          <SplashCursor
            TRANSPARENT={true}
            BACK_COLOR={{ r: 0, g: 0, b: 0 }}
            SPLAT_RADIUS={0.15}
            MOVEMENT_THRESHOLD={0.008}
            DYE_RESOLUTION={720}
            SIM_RESOLUTION={64}
          />
        )}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">

        {/* Titles */}
        <div className="text-center mb-6">
          <h1 
            className={`text-[15vw] sm:text-[12vw] md:text-[10vw] font-black leading-none text-white
              transition-all duration-700 ease-out
              ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            DESIGNED
          </h1>

          <h1
            className={`gradient-animate text-[15vw] sm:text-[12vw] md:text-[10vw] font-black leading-none inline-block
              transition-all duration-700 ease-out delay-100
              ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            TO DESIGN
          </h1>
        </div>

        {/* Subtitle */}
        <div 
          className={`text-center mb-10 max-w-2xl mx-auto text-gray-200
            transition-all duration-600 ease-out delay-200
            ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <p className="text-lg md:text-xl leading-relaxed">
            We create <span className="text-white font-semibold">bold, unforgettable experiences</span>.
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            From cutting-edge 3D visuals to premium brand identities.
          </p>
        </div>

        {/* CTA Buttons */}
        <div 
          className={`flex gap-4 w-full max-w-xs mx-auto mb-5
            transition-all duration-600 ease-out delay-300
            ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Link
            href="/portfolio"
            className="w-1/2 px-0 py-3 text-center rounded-full bg-green-800
      text-white font-bold hover:bg-green-700 transition-all duration-300
      hover:scale-[1.04] shadow-green-900/40 shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              Explore Work
              <svg className="w-4 h-4" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          <a
            href="#contact"
            className="w-1/2 px-0 py-3 text-center rounded-full bg-green-800
      text-white font-bold border border-green-700 hover:bg-green-700 
      transition-all duration-300 hover:scale-[1.04]"
          >
            <span className="flex items-center justify-center gap-2">
              Let's Talk
              <svg className="w-4 h-4" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </span>
          </a>
        </div>



        {/* WHAT WE DO - Service Cards */}
        <div 
          className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-10
            transition-transform duration-700 ease-out delay-[400ms]
            ${showContent ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
        >
          {serviceCards.map((item, i) => (
            <GlassCard
              key={i}
              className="
                relative p-4 sm:p-5 rounded-xl 
                h-32 sm:h-36 md:h-40
                flex flex-col items-center justify-center text-center
                cursor-pointer transition-all duration-300
                border border-white/10
                hover:border-lime-400/40
                hover:shadow-[0_0_20px_3px_rgba(163,255,71,0.25)]
                hover:scale-[1.02]
              "
            >
              {/* Icon */}
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 transition-transform duration-300 hover:scale-110">
                {item.icon}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white">
                {item.title}
              </h3>

              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-tight">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>



        <div 
          className={`flex flex-wrap items-center justify-center gap-10 mb-6
            transition-all duration-500 ease-out delay-500
            ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
              <div className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs uppercase tracking-[0.3em] text-gray-500 mt-10">
          Trusted by Industry Leaders
        </p>
      </div>
    </section>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(Hero2);
