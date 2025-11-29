'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ServicesMarquee.module.css';
import GlassCard from '../ui/GlassCard/GlassCard';

const rowOneText = "UI DESIGN • VIDEO • DESIGN • 3D • 2D • STORYBOARDING • ANAMORPHIC • GRAPHICS • SEO •";
const rowTwoText = "ENGAGEMENT • WEBSITE • CONCEPTUALIZATION • MICROSITE • WEB DESIGNS • CREATIVE DIRECTION  • CONCEPTUALIZATION • CONCEPTUALIZATION •";

const ServicesMarquee = () => {
  return (
    <GlassCard className={styles.marqueeGlassCard}>
    <div className={styles.marqueeContainer}>
      {/* First row, scrolling left */}
      <motion.div
        className={styles.track}
        animate={{ x: ['0%', '-75%'] }} // Animate by half the total width
        transition={{
          ease: 'linear',
          duration: 20,
          repeat: Infinity,
        }}
      >
        {/* Use exactly two copies of the text */}
        <span className={styles.marqueeText}>{rowOneText}</span>
        <span className={styles.marqueeText}>{rowOneText}</span>
        <span className={styles.marqueeText}>{rowOneText}</span>
        <span className={styles.marqueeText}>{rowOneText}</span>
        <span className={styles.marqueeText}>{rowOneText}</span>
        <span className={styles.marqueeText}>{rowOneText}</span>
      </motion.div>

      {/* Second row, scrolling right */}
      <motion.div
        className={styles.track}
        animate={{ x: ['-75%', '0%'] }} // Animate by half the total width
        transition={{
          ease: 'linear',
          duration: 20,
          repeat: Infinity,
        }}
      >
        {/* Use exactly two copies of the text */}
        <span className={styles.marqueeText}>{rowTwoText}</span>
        <span className={styles.marqueeText}>{rowTwoText}</span>
        <span className={styles.marqueeText}>{rowTwoText}</span>
        <span className={styles.marqueeText}>{rowTwoText}</span>
        <span className={styles.marqueeText}>{rowTwoText}</span>
        <span className={styles.marqueeText}>{rowTwoText}</span>
      </motion.div>
    </div>
    </GlassCard>
  );
};

export default ServicesMarquee;