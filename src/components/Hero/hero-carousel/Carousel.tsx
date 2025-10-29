'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { DotButton, useDotButton } from '../../ui/EmblaCarouselDotButton';
import styles from './Hero-Carousel.module.css'; // 1. Import the CSS Module
import clsx from 'clsx'; // We'll use clsx to combine classes

const carouselImages = [
  { src: '/hero-carousel/slide1.jpg', alt: 'Mastercard project' },
  { src: '/hero-carousel/slide2.jpg', alt: 'Event stage project' },
  { src: '/hero-carousel/slide3.png', alt: 'Volvo project' },
  { src: '/hero-carousel/slide4.jpg', alt: 'Another project' },
  { src: '/hero-carousel/slide5.jpg', alt: 'Final project' },
];

const TWEEN_FACTOR = 0.9;

const Carousel3D = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      return diffToTarget * (-1 / TWEEN_FACTOR) * 100;
    });
    setTweenValues(styles);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);
  }, [emblaApi, onScroll]);

  return (

    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {carouselImages.map((img, index) => (
            <div className={styles.embla__slide} key={index}>
              {/* The overlay div has been completely removed */}
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                className={styles.embla__slide__img} // Using a class for base styles
                style={{
                  // All animation is now controlled here
                  ...(tweenValues.length && {
                    transform: `scale(${1 - Math.abs(tweenValues[index] / 100) * 1.5})`,
                    filter: `brightness(${1 - Math.abs(tweenValues[index] / 100) * 2})`,
                  }),
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
       <div className={styles.embla__dots}>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            // Use clsx to combine the base class with the selected class
            className={clsx(styles.embla__dot, {
              [styles['embla__dot--selected']]: index === selectedIndex,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;