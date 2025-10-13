'use client';

import React from 'react';
import styles from './ShowReel.module.css';
// 1. Import the reusable GlassCard component
import GlassCard from '../ui effects/GlassCard/GlassCard';

const ShowReel: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Show<span className="text-lime-400">Reel</span></h2>

      {/* 2. Wrap the video container with the GlassCard component */}
      <GlassCard className={styles.card}>
        <div className={styles.videoContainer}>
          <iframe
            src="https://player.vimeo.com/video/1095892189?autoplay=1&loop=1&muted=1&autopause=0"
            className={styles.reactPlayer}
            style={{ border: 'none', width: '100%', height: '100%' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </GlassCard>
    </section>
  );
};

export default ShowReel;