'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import GlassCard from '../ui/GlassCard/GlassCard';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import styles from './Testimonial-Carousel.module.css';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// --- No changes to interfaces ---
interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

// --- Define animation variants outside the component ---
// We use the `custom` prop (which we'll set to our `direction` state)
// to dynamically change the initial and exit positions.
const slideVariants = {
  // `direction` is 1 for "next", -1 for "previous", 0 for initial load
  enter: (direction: number) => ({
    opacity: 0,
    // Start from the right if "next", from the left if "previous"
    x: direction > 0 ? 50 : -50,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    // Exit to the left if "next", to the right if "previous"
    x: direction < 0 ? 50 : -50,
  }),
};

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // <-- CHANGED: Add new state to track animation direction
  const [direction, setDirection] = useState(0); // 0 = initial, 1 = next, -1 = prev

  const goToPrevious = () => {
    setDirection(-1); // <-- CHANGED: Set direction to "previous"
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setDirection(1); // <-- CHANGED: Set direction to "next"
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.container}>
      <button
        onClick={goToPrevious}
        className={clsx(styles.navButton, styles.prevButton)}
        aria-label="Previous testimonial"
      >
        <IconChevronLeft className={styles.navIcon} />
      </button>

      <div className={styles.carouselWrapper}>
        {/* <-- CHANGED: Pass the `custom` prop to AnimatePresence */}
        <AnimatePresence mode="wait" custom={direction}>
          {/*
            <-- CHANGED: We now use `variants` and `custom`
            instead of static initial/animate/exit props.
          */}
          <motion.div
            key={currentIndex}
            custom={direction} // Pass the direction to our variants
            variants={slideVariants} // Use the variants we defined
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }} // Your original duration
            className="absolute w-full h-full" // The motion div fills the wrapper
          >
            <GlassCard className={styles.contentCard}>
              <p className={styles.quote}>
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>
              <div className={styles.authorContainer}>
                <div className="flex-shrink-0">
                  <Image
                    src={testimonials[currentIndex].src}
                    alt={testimonials[currentIndex].name}
                    width={64}
                    height={64}
                    className={styles.authorImage}
                  />
                </div>
                <div className="min-w-0 md:min-w-auto">
                  <p className={styles.authorName}>{testimonials[currentIndex].name}</p>
                  <p className={styles.authorDesignation}>{testimonials[currentIndex].designation}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={goToNext}
        className={clsx(styles.navButton, styles.nextButton)}
        aria-label="Next testimonial"
      >
        <IconChevronRight className={styles.navIcon} />
      </button>
    </div>
  );
};

// Memoize with custom comparison - only re-render if testimonials array reference changes
const MemoizedTestimonialCarousel = memo(TestimonialCarousel, (prevProps, nextProps) => {
  return prevProps.testimonials === nextProps.testimonials;
});

export default MemoizedTestimonialCarousel;
export { MemoizedTestimonialCarousel as TestimonialCarousel };