import React from 'react';
import Image from 'next/image';
import styles from './PortfolioSection.module.css';
import ShineButton from '../ui/ShineButton';

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
          <h2 className='font-[montserrat]'>Designed To <span className="text-lime-400">Design</span></h2>
          <p className='font-[montserrat]'>
            We create high-impact<span className="text-green-600"> event experiences</span> that move 
            people and  
               <span className="text-green-600"> elevate brands</span>—both online and on-site.         
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
      <div className='!font-[montserrat]'>
        <h2 className={styles.projectsTitle} >Our <span className="text-lime-400">Projects</span></h2>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectCard}>
              <div className={styles.projectImageContainer}>
                {/* Placeholder for project images */}
              </div>
              <p >{project.title}</p>
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