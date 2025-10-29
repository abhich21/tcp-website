// Services.tsx

'use client';

import React, { useState } from 'react';
import styles from './Services.module.css';
import ScrollStack, { ScrollStackItem } from '../Services/ScrollStack';
import GlassCard from '../ui/GlassCard/GlassCard';

// 1. Import icons from lucide-react
import {
  Clapperboard,
  Orbit,
  Users,
  Lightbulb,
  Target,
  MousePointerClick,
  Component, // A different icon for the duplicate service
} from 'lucide-react';

// 2. Add an 'icon' property to your services data
const servicesData = [
  {
    title: 'Event Content',
    description:
      'We craft compelling narratives and create immersive content for live, virtual, and hybrid events. From keynote presentations to interactive breakout sessions, we ensure your message captivates the audience.',
    icon: <Clapperboard size={32} />,
  },
  {
    title: '3D & Motion Design',
    description:
      'Transform your concepts into breathtaking reality with our cutting-edge 3D and motion design. We create dynamic animations, product visualizations, and brand stories that are not just seen, but felt.',
    icon: <Orbit size={32} />,
  },
  {
    title: 'Team Building',
    description:
      'Foster collaboration and boost morale with bespoke team-building experiences. We design engaging activities, both digital and physical, that strengthen bonds and align your team towards a common goal.',
    icon: <Users size={32} />,
  },
  {
    title: 'Conceptualization',
    description:
      'Every great project starts with a powerful idea. We take your initial spark and develop it into a fully-realized strategy, complete with creative direction, feasibility analysis, and a roadmap for execution.',
    icon: <Lightbulb size={32} />,
  },
  {
    title: 'Brand Strategy',
    description:
      'Gain your edge with a robust brand strategy. We help define your unique voice, identify your target audience, and carve out a distinct market position that resonates and builds lasting brand equity.',
    icon: <Target size={32} />,
  },
  {
    title: 'Interactive Installations',
    description:
      'Bridge the gap between the physical and digital worlds with unforgettable interactive installations. We design and build immersive experiences for events and retail that drive engagement and create shareable moments.',
    icon: <MousePointerClick size={32} />,
  },
  {
    title: 'Digital Experiences',
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
                {/* 3. Render the icon */}
                <div className={styles.cardIcon}>{service.icon}</div>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
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