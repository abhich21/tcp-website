import React from 'react';
import Image from 'next/image';
import styles from './PortfolioSection.module.css';
import ShineButton from '../ui effects/ShineButton';

// Dummy data for the project grid
const projects = [
  { title: 'Boombox Music Concert' },
  { title: 'Boombox Music Concert' },
  { title: 'Boombox Music Concert' },
];

const PortfolioSection = () => {
  return (
    <section className={styles.section}>
      {/* "Designed To Design" Card */}
      <div className={styles.glassCard}>
        <div className={styles.cardTextContent}>
          <h2>Designed To Design</h2>
          <p>
            We are a live and virtual event Experience Design studio committed to designing and developing inspiring Meetings & Events.
          </p>
        </div>
        <div className={styles.cardImageContainer}>
          <Image
            src="/d2d.png"
            alt="Abstract design image"
            width={350}
            height={350}
            className=" w-100% h-full object-cover rounded-2xl ml-auto"
          />
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <h2 className={styles.projectsTitle}>Projects</h2>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <div className={styles.projectImageContainer}>
                {/* Placeholder for project images */}
              </div>
              <p>{project.title}</p>
            </div>
          ))}
        </div>
        <ShineButton className={`${styles.loadMoreButton} py-2 px-6`}>
          Load More
        </ShineButton>
      </div>
    </section>
  );
};

export default PortfolioSection;