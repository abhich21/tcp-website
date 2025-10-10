import React from 'react';
import ShineButton from '../ui effects/ShineButton';
import Carousel3D from '../hero-carousel/Carousel';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-10 px-4 font-[montserrat] leading-tight tracking-tight">
      <h1 className={styles.title}>
        {/* Animated Layer (Top) */}
        <span className={styles.animatedText}>
          HIGH IMPACT <br />
          {/* The text-lime-400 class has been REMOVED from this span */}
          <span>DESIGN</span>
          <br />
          FOR BRANDS
        </span>

        {/* Static Text Layer (Bottom) */}
        <span className='font-[montserrat] leading-tight tracking-tight'>
          HIGH IMPACT <br />
          <span className="text-lime-400">DESIGN</span>
          <br />
          FOR BRANDS
        </span>
      </h1>

      {/* ... (rest of the component is the same) ... */}
      <ShineButton className="py-2 px-6 text-sm">
        Let&apos;s Connect
      </ShineButton>
      <div className="mt-10 mb-10 w-full">
        <Carousel3D />
      </div>
    </section>
  );
};

export default Hero;