import React from 'react';
import styles from './GlassCard.module.css';
import clsx from 'clsx';

// Define the component's props
interface GlassCardProps {
  children: React.ReactNode;
  className?: string; // Allow custom classes to be passed in
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    // Merge the base .card style with any custom classes
    <div className={clsx(styles.card, className)}>
      {children}
    </div>
  );
};

export default GlassCard;