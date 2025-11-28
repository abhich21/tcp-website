"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "@/data/services";

interface Props {
  isOpen: boolean;
}

const ServicesDropdown: React.FC<Props> = ({ isOpen }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        // ANIMATION WRAPPER — ONLY THIS MOVES
<motion.div
  key="services-menu"
  initial={{ y: -10 }}
  animate={{ y: 0 }}
  exit={{ y: -10 }}
  transition={{
    duration: 0.32,
    ease: [0.16, 1, 0.3, 1],
  }}
  className="w-full max-w-5xl mx-auto px-3"
>

          {/* STATIC BLUR LAYER — NO ANIMATION HERE */}
          <div
            className="
              rounded-2xl
              backdrop-blur-[50px]
              bg-black/30 
              border border-white/10
              shadow-2xl
              p-3
              will-change-transform
            "
            style={{
              WebkitBackdropFilter: "blur(50px)",
              backdropFilter: "blur(50px)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="block"
                >
                  <div
                    className="
                      px-4 py-2 min-h-[42px]
                      rounded-lg flex items-center
                      text-sm font-medium text-white
                      border border-white/10
                      transition-all duration-200
                      hover:bg-lime-400/10
                      hover:border-lime-400/40
                      hover:text-lime-400
                    "
                  >
                    {service.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServicesDropdown;
