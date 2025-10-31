'use client';

import React from 'react';
import styles from './ShowReel.module.css';
import GlassCard from '../ui/GlassCard/GlassCard';

const ShowReel: React.FC = () => {
  return (
    // No changes to this part
    <section className={`${styles.section} px-4 py-8 md:py-12 lg:py-16`}>
      <h2
        className={`${styles.title} 
          text-3xl mt-12 mb-4 
          md:text-4xl md:mb-8`}
      >
        Show<span className="text-lime-400">Reel</span>
      </h2>

      {/* No changes to this part */}
      <GlassCard
        className={`${styles.card} 
          w-full max-w-[95%] p-2 
          sm:p-4 
          md:max-w-4xl 
          lg:p-8`}
      >
        {/* No changes to this part */}
        <div className={styles.videoContainer}>
          {/* KEY FIX: The inline 'style' prop has been removed.
            All styles are now in styles.reactPlayer.
          */}
          <iframe
            src="https://player.vimeo.com/video/1095892189?autoplay=1&loop=1&muted=1&autopause=0"
            className={styles.reactPlayer}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </GlassCard>
    </section>
  );
};

export default ShowReel;