'use client';

import React from 'react';
import styles from './PartnersSection.module.css';
// 1. Import the LogoLoop component and its props type
import { LogoLoop, LogoItem } from '../ui/LogoLoop';
import GlassCard from '../ui/GlassCard/GlassCard';


// 2. Define the props for this component
interface PartnersSectionProps {
  logos: LogoItem[];
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ logos }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Meet Our <span className="text-lime-400">Partners</span></h2>
      <GlassCard className={styles.logoGlassCard}>
      {/* 3. Use the LogoLoop component with your data */}
       <LogoLoop
        logos={logos}
        speed={160}
        direction="left"
        logoHeight={180}
        gap={40}
        pauseOnHover
       scaleOnHover={false}
        fadeOut
        className="-my-8"
      
        ariaLabel="partners"
      />
      </GlassCard>
    </section>
  );
};

export default PartnersSection;