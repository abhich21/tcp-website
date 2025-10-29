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
  itemDistance = 1, // Default to a stacking value
  itemScale = 0.05,
  itemStackDistance = 15,
  stackPosition = '100%',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const animationStartPointRef = useRef<number | null>(null); // <-- ADD THIS
  const lenisRef = useRef<Lenis | null>(null);
   // --- THIS IS THE FIX ---
  // Get a stable count of the children
  const numChildren = React.Children.count(children);
  

  // ScrollStack.tsx

// REPLACE the old updateCardTransforms with this new one
// ScrollStack.tsx

// REPLACE the entire old updateCardTransforms function with this one
// ScrollStack.tsx

const updateCardTransforms = useCallback(() => {
    const scrollTop = window.scrollY;
    const startPoint = animationStartPointRef.current;

    // --- THIS IS THE FIX ---
    // First, check if we've scrolled far enough to start the animation.
    if (startPoint === null || scrollTop < startPoint) {
        // If not, ensure all cards are in their default, non-transformed state.
        // This allows them to scroll normally with the page.
        cardsRef.current.forEach((card) => {
            card.style.transform = 'translateY(0px) scale(1)';
        });
        return; // Stop the function here.
    }

    // --- Animation is Active ---
    // This code only runs AFTER you've scrolled past the startPoint.

    const endElement = document.querySelector('.scroll-stack-end') as HTMLElement;
    if (!endElement) return;

    const cardHeight = cardsRef.current[0]?.offsetHeight || 0;
    const stickyPositionPx = window.innerHeight / 2 - cardHeight / 2;
    const endElementTop = endElement.offsetTop;
    const pinEnd = endElementTop - stickyPositionPx;

    const scrollProgress = scrollTop - startPoint;

    cardsRef.current.forEach((card, i) => {
        const cardTop = card.offsetTop;

        let translateY = 0;
        const isPinned = scrollTop < pinEnd;

        if (isPinned) {
            // Manually calculate translateY to counteract the scroll, pinning the card.
            translateY = scrollTop - cardTop + stickyPositionPx;
        } else {
            // Once past the end, lock the card at its final translated position.
            translateY = pinEnd - cardTop + stickyPositionPx;
        }

        const totalPinDuration = pinEnd - startPoint;
        const scaleProgress = Math.min(1, scrollProgress / (totalPinDuration || 1));
        const targetScale = 1 - (cardsRef.current.length - 1 - i) * itemScale;
        const scale = 1 - (1 - targetScale) * scaleProgress;

        const itemStackDistance = 15; // Visual depth for the stack
        card.style.transform = `translateY(${translateY - i * itemStackDistance}px) scale(${scale})`;
        card.style.zIndex = `${cardsRef.current.length - i}`;
    });
}, [ itemScale]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    // Set up cards
    cardsRef.current = Array.from(container.querySelectorAll('.scroll-stack-card'));
    // ---- ADD THIS BLOCK ----
if (cardsRef.current.length > 0 && animationStartPointRef.current === null) {
  const firstCard = cardsRef.current[0];
  const firstCardRect = firstCard.getBoundingClientRect();
  const scrollTop = window.scrollY;

  // This calculates the exact scrollY value where the card's center will be at the viewport's center
  const startPoint = (firstCardRect.top + scrollTop) + (firstCardRect.height / 2) - (window.innerHeight / 2);
  animationStartPointRef.current = startPoint;
}
// // --- ADD THIS BLOCK to calculate the centered top position ---
let centeredTopInPixels = 0;
if (cardsRef.current.length > 0) {
    const cardHeight = cardsRef.current[0].offsetHeight;
    const viewportHeight = window.innerHeight;
    centeredTopInPixels = (viewportHeight / 2) - (cardHeight / 2);
}
// --- END OF NEW BLOCK ---


// --- THEN REPLACE the old forEach loop with this one ---
cardsRef.current.forEach((card, i) => {
    // This is the offset that creates the visible stack
    const topOffset = i * 15;
    card.style.transformOrigin = 'center center';
    card.style.position = 'sticky';

    // We use our new PIXEL-based calculation plus the offset
    card.style.top = `${centeredTopInPixels + topOffset}px`;

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
    // The container no longer needs a calculated height.
    // Its height will come from the content inside it.
    <div ref={containerRef}>
        {children}
    </div>
);
};

export default ScrollStack;