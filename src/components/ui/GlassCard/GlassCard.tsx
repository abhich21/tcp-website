import React, { forwardRef } from 'react';
import styles from './GlassCard.module.css';
import clsx from 'clsx';

// Define the component's props
interface GlassCardProps {
  children: React.ReactNode;
  className?: string; // Allow custom classes to be passed in
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(styles.card, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;