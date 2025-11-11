import React, { forwardRef } from 'react'; // Import forwardRef
// import styles from './GlassCard.module.css'; // <-- Removed this import
import clsx from 'clsx';

// Define the component's props
interface GlassCardProps {
  children: React.ReactNode;
  className?: string; // Allow custom classes to be passed in
  // Allow any other props a div can take
  [key: string]: any;
}

// --- MODIFICATION: Wrap in forwardRef ---
// The component now accepts 'props' and a 'ref'
const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, ...rest }, ref) => {
    // --- MODIFICATION: Inlined styles from the CSS module ---
    const glassCardClasses = 'border border-white/10 bg-white/5 backdrop-blur-[50px]';

    return (
      // Merge the base .card style with any custom classes
      <div
        ref={ref} // <-- Apply the forwarded ref here
        className={clsx(glassCardClasses, className)} // <-- Use inlined classes
        {...rest} // Pass down other props (like 'id', 'role' from Headless UI)
      >
        {children}
      </div>
    );
  }
);

// Add a display name for better debugging
GlassCard.displayName = 'GlassCard';

export default GlassCard;