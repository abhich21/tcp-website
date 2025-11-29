import React from 'react';
import Image from 'next/image';
import styles from './PortfolioSection.module.css';
import ShineButton from '../ui/ShineButton';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card'; // Adjust this import path!

// Dummy data for the project grid
const projects = [
  { 
    title: 'Boombox Music Concert', 
    description: 'An immersive audio-visual experience.',
    imageUrl: '/projects/project-1.png' // Path from /public folder
  },
  { 
    title: 'Boombox Music Concert', 
    description: 'An immersive audio-visual experience.',
    imageUrl: '/projects/project-2.png' // Path from /public folder
  },
  { 
    title: 'Boombox Music Concert', 
    description: 'An immersive audio-visual experience.',
    imageUrl: '/projects/project-3.png' // Path from /public folder
  },
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

        {/* This new wrapper will stack the blur and the grid */}
        <div className={styles.projectsWrapper}>

          {/* Layer 1: The Glass "Tray" (Blur) */}
          <div className={styles.projectsGridBackground} />

          {/* Layer 2: The 3D Cards (No Blur) */}
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <CardContainer
                key={index}
                containerClassName="w-full"
                className="!flex-col !items-stretch !justify-start"
              >
                <CardBody
                  className={`${styles.projectCard} !h-auto !w-full !relative`}
                >
                  <CardItem
                    translateZ="50"
                    className="w-full relative z-10"
                  >
                    <div className={styles.projectImageContainer}>
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        layout="fill"
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </CardItem>
                  <CardItem
                    translateZ="30"
                    className="w-full relative z-10"
                  >
                    <p className={styles.projectTitle}>{project.title}</p>
                  </CardItem>
                  <CardItem
                    translateZ="20"
                    className="w-full relative z-10"
                  >
                    <p className={styles.projectDescription}>{project.description}</p>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>

        {/* Turn the button into a link to your new portfolio page */}
        <ShineButton
          href="/portfolio"           // 1. Add the link
          target="_blank"             // 2. Add target to open in a new tab
          rel="noopener noreferrer"     // 3. Security for new tabs
          className={`${styles.loadMoreButton} py-2 px-6`}
        >
          Load More
        </ShineButton>
      </div>
    </section>
  );
};

export default PortfolioSection;