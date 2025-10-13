import React from 'react';
import { clsx } from 'clsx';

// Define the props the button will accept
interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const ShineButton = ({ children, className, ...props }: ShineButtonProps) => {
  return (
    <button
      className={clsx(
        '  relative group overflow-hidden text-white-300 rounded-full transition-colors duration-300  bg-green-600/95  ',
        className // This allows you to add more classes from the outside
      )}
      {...props} // Pass down any other button props like onClick
    >
      {/* The text or icon you pass in goes here */}
      {children}

      {/* The Shine Element */}
      <div className=" absolute inset-0 w-full h-full transform -skew-x-30 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
    </button>
  );
};

export default ShineButton;