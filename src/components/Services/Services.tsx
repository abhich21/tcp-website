'use client';

import React from 'react';
import styles from './Services.module.css';
import ScrollStack, { ScrollStackItem } from '../Services/ScrollStack';
import GlassCard from '../ui effects/GlassCard/GlassCard';

const servicesData = [
  { title: 'Event Content', description: 'Engaging content for live and virtual events.' },
  { title: '3D & Motion Design', description: 'Bringing ideas to life with stunning visuals.' },
  { title: 'Team Building', description: 'Interactive experiences that unite teams.' },
  { title: 'Conceptualization', description: 'From initial idea to full-fledged concept.' },
{ title: 'Brand Strategy', description: 'Defining your brand’s voice and market position.' },
  { title: 'Interactive Installations', description: 'Creating memorable physical and digital experiences.' },
  { title: 'Interactive Installations2', description: 'Creating memorable physical and digital experiences.' },
];


const ServicesSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Services We Offer</h2>

      <ScrollStack>
        {servicesData.map((service, index) => (
          <ScrollStackItem key={index}>
            <GlassCard>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
              </div>
              </GlassCard>
            </ScrollStackItem>
          
        ))}
      </ScrollStack>
    </section>
  );
};

export default ServicesSection;