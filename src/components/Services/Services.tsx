// Services.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // 1. Import Link
import styles from './Services.module.css';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import GlassCard from '../ui/GlassCard/GlassCard';

// 2. Import icons from lucide-react
import {
  Clapperboard,
  Orbit,
  Users,
  Lightbulb,
  Target,
  MousePointerClick,
  Component,
  ArrowRight, // 3. Import ArrowRight for the link
} from 'lucide-react';

// 4. Add a 'slug' property to your services data, matching services.ts
const servicesData = [
  {
    title: 'Event Content',
    slug: 'event-content',
    description:
      'We craft compelling narratives and create immersive content for live, virtual, and hybrid events. From keynote presentations to interactive breakout sessions, we ensure your message captivates the audience.',
    icon: <Clapperboard size={32} />,
  },
  {
    title: '3D & Motion Design',
    slug: '3d-motion-design',
    description:
      'Transform your concepts into breathtaking reality with our cutting-edge 3D and motion design. We create dynamic animations, product visualizations, and brand stories that are not just seen, but felt.',
    icon: <Orbit size={32} />,
  },
  {
    title: 'Team Building',
    slug: 'team-building',
    description:
      'Foster collaboration and boost morale with bespoke team-building experiences. We design engaging activities, both digital and physical, that strengthen bonds and align your team towards a common goal.',
    icon: <Users size={32} />,
  },
  {
    title: 'Conceptualization',
    slug: 'conceptualization',
    description:
      'Every great project starts with a powerful idea. We take your initial spark and develop it into a fully-realized strategy, complete with creative direction, feasibility analysis, and a roadmap for execution.',
    icon: <Lightbulb size={32} />,
  },
  {
    title: 'Brand Strategy',
    slug: 'brand-strategy',
    description:
      'Gain your edge with a robust brand strategy. We help define your unique voice, identify your target audience, and carve out a distinct market position that resonates and builds lasting brand equity.',
    icon: <Target size={32} />,
  },
  {
    title: 'Interactive Installations',
    slug: 'interactive-installations',
    description:
      'Bridge the gap between the physical and digital worlds with unforgettable interactive installations. We design and build immersive experiences for events and retail that drive engagement and create shareable moments.',
    icon: <MousePointerClick size={32} />,
  },
  {
    title: 'Digital Experiences',
    slug: 'digital-experiences',
    description:
      'In the digital realm, experience is everything. We design and develop seamless platforms, from interactive websites to engaging online campaigns, ensuring every click is intuitive, memorable, and meaningful.',
    icon: <Component size={32} />,
  },
];

const ServicesSection = () => {
  
  return (
    <section className={styles.section}>
      
      
      {/* ---- ADD THIS SPACER DIV ---- */}
      {/* <div style={{ height: '50vh' }} />  */}
<div>
      <ScrollStack>
         <div className={styles.cardContainer}><h2 className={styles.title}>Services We <span className="text-lime-400">Offer</span></h2>
        {servicesData.map((service, index) => (
          <ScrollStackItem key={index}>
            <GlassCard className='mb-5 p-8 rounded-3xl'>
              <div className={styles.cardContent}>
                
                {/* --- MODIFICATION START --- */}
                {/* 1. New flex container for top row */}
                <div className="flex justify-between items-start mb-6 w-full"> 
                  
                  {/* 2. Icon (styles.cardIcon no longer has mb-6) */}
                  <div className={styles.cardIcon}>{service.icon}</div>
                  
                  {/* 3. "Know More" Link, moved and restyled */}
                  <Link 
                    href={`/services/${service.slug}`} 
                    className="group text-lime-400 font-semibold text-sm inline-flex items-center gap-1 mt-1 flex-shrink-0" // smaller gap, smaller text, mt-1 for alignment
                  >
                    Know More
                    <ArrowRight 
                      size={16} 
                      className="transition-transform duration-200 group-hover:translate-x-1" 
                    />
                  </Link>
                </div>
                {/* --- MODIFICATION END --- */}

                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                
                {/* Link was here, now it's in the flex container above */}
              </div>
            </GlassCard>
          </ScrollStackItem>
        ))}
        </div>
      </ScrollStack>
      </div>
    </section>
  );
};

export default ServicesSection;