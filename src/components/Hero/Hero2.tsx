"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import GlassCard from "../ui/GlassCard/GlassCard";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Import SplashCursor as client-only to avoid hydration issues
// (it uses Date.now() and Math.random() which differ between server and client)
const SplashCursor = dynamic(() => import("../ui/SplashCursor"), {
  ssr: false,
});

export default function Hero2() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line-1",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", immediateRender: false }
      );

      gsap.fromTo(
        ".hero-line-2",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, delay: 0.15, duration: 1, ease: "power2.out", immediateRender: false }
      );

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, delay: 0.35, duration: 0.9, ease: "power2.out", immediateRender: false }
      );

      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          delay: 0.65,
          duration: 0.9,
          stagger: 0.12,
          ease: "power2.out",
          immediateRender: false,
        }
      );

      gsap.fromTo(
        ".stat-item",
        { opacity: 0, scale: 0.85 },
        {
          opacity: 1,
          scale: 1,
          delay: 1.4,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          immediateRender: false,
        }
      );
    }, containerRef);

    return () => ctx.revert();
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
            SPLAT_RADIUS={0.25}
            MOVEMENT_THRESHOLD={0.008}
          />
        )}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">

        {/* Titles */}
        <div className="text-center mb-6">
          <h1 className="hero-line-1 text-[15vw] sm:text-[12vw] md:text-[10vw] font-black leading-none text-white">
            DESIGNED
          </h1>

          <h1
            className="hero-line-2 gradient-animate text-[15vw] sm:text-[12vw] md:text-[10vw] font-black leading-none inline-block"
          >
            TO DESIGN
          </h1>
        </div>

        {/* Subtitle */}
        <div className="hero-subtitle text-center mb-10 max-w-2xl mx-auto text-gray-200">
          <p className="text-lg md:text-xl leading-relaxed">
            We create <span className="text-white font-semibold">bold, unforgettable experiences</span>.
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            From cutting-edge 3D visuals to premium brand identities.
          </p>
        </div>

        {/* CTA Buttons */}
<div className="flex gap-4 w-full max-w-xs mx-auto mb-5">
  <Link
    href="/portfolio"
    className="hero-cta w-1/2 px-0 py-3 text-center rounded-full bg-green-800
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
    className="hero-cta w-1/2 px-0 py-3 text-center rounded-full bg-green-800
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



        {/* WHAT WE DO */}
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.15 }}
  className="
    grid 
    grid-cols-2
    sm:grid-cols-2 
    lg:grid-cols-4 
    gap-3 sm:gap-4 lg:gap-5

    mb-10
  "
>

  {[
    { title: "3D Animation", desc: "Photorealistic renders", icon: "✨" },
    { title: "Brand Design", desc: "Visual identities", icon: "🎨" },
    { title: "Motion Graphics", desc: "Dynamic animations", icon: "🎬" },
    { title: "Video Production", desc: "Full-service production", icon: "🎥" },
  ].map((item, i) => (
    <motion.div key={i} variants={cardVariants}>
   <GlassCard
  className="
    relative 
    p-4 sm:p-5 
    rounded-xl 
    h-32 sm:h-36 md:h-40      /* Smaller on mobile/tablet */
    flex flex-col items-center justify-center text-center
    cursor-pointer transition-all duration-300
    border border-white/10
    hover:border-lime-400/40
    hover:shadow-[0_0_20px_3px_rgba(163,255,71,0.25)]
  "
>
  {/* Radial lime bloom */}
  <div
    className="
      absolute inset-0 rounded-xl pointer-events-none
      opacity-0 hover:opacity-100 transition-opacity duration-500
      bg-[radial-gradient(circle_at_center,rgba(163,255,71,0.12)_0%,transparent_70%)]
    "
  ></div>

  {/* Animated icon */}
  <motion.div
    whileHover={{ rotate: 6, scale: 1.12 }}
    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
    className="text-2xl sm:text-3xl mb-1 sm:mb-2 relative z-10"
  >
    {item.icon}
  </motion.div>

  <h3 className="text-sm sm:text-base font-bold text-white relative z-10">
    {item.title}
  </h3>

  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 relative z-10 leading-tight">
    {item.desc}
  </p>
</GlassCard>

    </motion.div>
  ))}
</motion.div>



        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-10 mb-6">
          {[
            { value: "1000+", label: "Projects" },
            { value: "5+", label: "Years" },
            { value: "50+", label: "Clients" },
          ].map((stat, i) => (
            <div key={i} className="stat-item text-center opacity-0">
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
