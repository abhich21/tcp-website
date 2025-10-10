'use client';

import React, { useState, useRef } from 'react';
import styles from './ShowReel.module.css';
// 1. Import icons for the mute button
import { VscMute, VscUnmute } from 'react-icons/vsc';

const ShowReel = () => {
  // State to track if the audio is muted
  const [isMuted, setIsMuted] = useState(true);
  // Ref to get direct access to the <video> element
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to toggle the video's muted property
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Show<span className="text-lime-400">Reel</span></h2>

      <div className={styles.card}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/"
          poster="/showreel-poster.jpg"
          autoPlay // 2. Add autoPlay
          muted    // 3. Start muted
          loop
          playsInline
        />

        {/* 4. Add the new mute/unmute button */}
        <button className={styles.muteButton} onClick={toggleMute}>
          {isMuted ? <VscMute size={20} /> : <VscUnmute size={20} />}
        </button>
      </div>
    </section>
  );
};

export default ShowReel;