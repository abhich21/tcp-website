'use client'; // This component must be a client component

import React, { ReactNode, useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export interface ScrollStackItemProps {
  children: ReactNode;
}

// Simplified ScrollStackItem
export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children }) => (
  <div className="scroll-stack-card" style={{ transformStyle: 'preserve-3d' }}>
    {children}
  </div>
);

interface ScrollStackProps {
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
}

// Main ScrollStack component, simplified for window scroll
const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  itemDistance = -250, // Default to a stacking value
  itemScale = 0.05,
  itemStackDistance = 15,
  stackPosition = '30%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
   // --- THIS IS THE FIX ---
  // Get a stable count of the children
  const numChildren = React.Children.count(children);

  const updateCardTransforms = useCallback(() => {
    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPositionPx = (parseFloat(stackPosition) / 100) * containerHeight;

    cardsRef.current.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top + scrollTop;
      
      // Pinning logic starts here
      const pinStart = cardTop - stackPositionPx;
      const totalPinDuration = (cardsRef.current.length - 1 - i) * Math.abs(itemDistance);
      const pinEnd = pinStart + totalPinDuration;

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - pinStart;
      } else if (scrollTop > pinEnd) {
        translateY = totalPinDuration;
      }

      // Scaling logic
      const scaleStart = cardTop - containerHeight;
      const scaleEnd = cardTop - stackPositionPx;
      const scaleProgress = Math.max(0, Math.min(1, (scrollTop - scaleStart) / (scaleEnd - scaleStart)));
      const scale = 1 - (1 - (1 - itemScale * (cardsRef.current.length - 1 - i))) * scaleProgress;

      card.style.transform = `translateY(-${translateY}px) scale(${scale})`;
    });
  }, [itemDistance, itemScale, stackPosition]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    // Set up cards
    cardsRef.current = Array.from(container.querySelectorAll('.scroll-stack-card'));
    cardsRef.current.forEach((card, i) => {
        const topPosition = (parseFloat(stackPosition) / 100) * 100;
      // This is the offset that creates the visible stack
      const topOffset = i * 15; // 10px offset for each card
      card.style.transformOrigin = 'center center';
      card.style.position = 'sticky';
       // We add the calculated offset to the top position
      card.style.top = `calc(${topPosition}vh + ${topOffset}px)`;
       // --- THIS IS THE FIX ---
      // Changed from (length - i) to just (i)
      card.style.zIndex = `${i}`;
    });

    // Set up Lenis for smooth scrolling
    const lenis = new Lenis();
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    
    // Attach scroll listener
    const handleScroll = () => updateCardTransforms();
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [updateCardTransforms, stackPosition, numChildren]);

  return (
     <div ref={containerRef} style={{ height: `${numChildren * Math.abs(itemDistance)}px`}}>
      {children}
    </div>
  );
};

export default ScrollStack;