'use client';

import React from 'react';
import Image from 'next/image';
import styles from './Meet-The-Team.module.css';
import GlassCard from '../ui/GlassCard/GlassCard'; // 1. Import GlassCard
import TiltedCard from '../ui/TiltedCard';

// Define the structure for team member data
interface TeamMember {
  name: string;
  title: string;
  photoUrl: string;
}

// Dummy data - Replace with your actual team members
const teamData: TeamMember[] = [
  { name: 'Alex Johnson', title: 'Creative Director', photoUrl: '/team-photos/member-1.jpg' },
  { name: 'Maria Garcia', title: 'Lead Designer', photoUrl: '/team-photos/member-2.jpg' },
  { name: 'David Smith', title: 'Lead Developer', photoUrl: '/team-photos/member-3.jpg' },
  { name: 'Sophia Lee', title: 'Project Manager', photoUrl: '/team-photos/member-4.jpg' },
  // Add more team members here...
];

const MeetTheTeam = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Meet the <span className="text-lime-400">Team</span></h2>

      <div className={styles.teamGrid}>
  {teamData.map((member, index) => (
    // 1. Use GlassCard as the outer container
    <GlassCard key={index} className={`${styles.teamMemberCard} overflow-hidden`}>
      {/* 2. Place TiltedCard inside */}
      <TiltedCard
        imageSrc={member.photoUrl}
        altText={member.name}
        captionText={`${member.name} - ${member.title}`} // Tooltip
        containerHeight="var(--card-height)" // Give TiltedCard a height
        imageWidth="100%"
        imageHeight="100%" // Image fills the TiltedCard container
        scaleOnHover={1.05}
        rotateAmplitude={8}
        showTooltip={true}
        // We don't need the overlayContent here anymore
      />
      {/* 3. Place Name and Title *outside* TiltedCard, but *inside* GlassCard */}
      <div className={styles.memberInfo}>
        <h3 className={styles.memberName}>{member.name}</h3>
        <p className={styles.memberTitle}>{member.title}</p>
      </div>
    </GlassCard>
  ))}
</div>
    </section>
  );
};

export default MeetTheTeam; 