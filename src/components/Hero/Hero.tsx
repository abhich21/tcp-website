import React from 'react';
import ShineButton from '../ui/ShineButton';
import Carousel3D from './hero-carousel/Carousel';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center text-center py-8 px-4 md:py-10 lg:py-16 font-[montserrat] leading-tight tracking-tight">
      <h1 className={`${styles.title} text-4xl sm:text-5xl lg:text-6xl`}>
        {/* Animated Layer (Top) */}
        <span className={styles.animatedText}>
          HIGH IMPACT <br />
          <span>DESIGNS</span>
          <br />
          FOR BRANDS
        </span>

        {/* Static Text Layer (Bottom) */}
        <span className='font-[montserrat] leading-tight tracking-wide'>
          HIGH IMPACT <br />
          <span className="text-lime-400">DESIGNS</span>
          <br />
          FOR BRANDS
        </span>
      </h1>

      {/* CTA Button - Enhanced for mobile touch */}
      <ShineButton 
        className="
          py-2 px-4 text-base font-bold mb-4 min-h-[44px]
          md:py-2 md:px-5 md:text-lg 
          lg:py-2 lg:px-6 lg:text-xl"
      >
        Let&apos;s Connect
      </ShineButton>
      
      <div className={styles.carouselCard}>
        <Carousel3D />
      </div>
    </section>
  );
};

export default Hero;