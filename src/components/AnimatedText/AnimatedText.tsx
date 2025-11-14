'use client';

import { useEffect, useRef } from 'react';

// NOTE: Since I don't have the exact 'react-bits' or OGL text component, 
// this is a placeholder that will render the text and reserve space.
// You would replace this with your actual OGL-based Animated Text component.

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className }: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // useEffect(() => {
  //   // In a real scenario, this is where you would initialize
  //   // your OGL/react-bits text animation (e.g., a displacement shader).

  //   // Example:
  //   // const canvas = containerRef.current.querySelector('canvas');
  //   // const renderer = new Renderer({ canvas });
  //   // ... setup OGL for text animation ...

  //   // For now, it's just a placeholder to show where the OGL logic goes.
  //   if (containerRef.current) {
  //     console.log(`Setting up OGL animation for: ${text}`);
  //   }
  // }, [text]);

  return (
    <div ref={containerRef} className={`w-full flex justify-center items-center ${className}`}>
      {/* Placeholder for animated OGL text. The font will be Montserrat from layout.tsx. */}
      <h1 
        ref={textRef} 
        className="!text-5xl sm:!text-7xl md:!text-8xl !text-center !font-bold !text-white tracking-widest"
        style={{
            // Add a subtle text shadow to simulate glow
            textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(100, 100, 255, 0.3)'
        }}
      >
        {text}
      </h1>
      {/* If using OGL, the text will be rendered on a canvas inside this div */}
    </div>
  );
}