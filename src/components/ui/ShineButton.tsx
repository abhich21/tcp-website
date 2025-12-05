import React from 'react';
import { twMerge } from 'tailwind-merge';

// Define the core props shared by both button and link versions
type BaseProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

// Define the specific HTML attribute props using a conditional type
// If href exists, use Anchor attributes, otherwise use Button attributes
type SpecificHTMLProps = BaseProps & (
  BaseProps['href'] extends string
    ? React.AnchorHTMLAttributes<HTMLAnchorElement>
    : React.ButtonHTMLAttributes<HTMLButtonElement>
);

// Final props type is the combination
export type ShineButtonProps = SpecificHTMLProps;

const ShineButton = ({ children, className, href, ...props }: ShineButtonProps) => {
  const baseClasses = 'relative group overflow-hidden bg-green-800 text-white font-bold rounded-full transition-colors duration-300 inline-block text-center'; // Added inline-block and text-center

  if (href) {
    // Cast props to Anchor attributes when rendering an <a>
    const anchorProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        className={twMerge(baseClasses, className)}
        {...anchorProps} // Spread the correctly typed props
      >
        {children}
        <div className="absolute inset-0 w-full h-full transform -skew-x-30 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
      </a>
    );
  }

  // Cast props to Button attributes when rendering a <button>
  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={twMerge(baseClasses, className)}
      {...buttonProps} // Spread the correctly typed props
    >
      {children}
      <div className="absolute inset-0 w-full h-full transform -skew-x-30 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
    </button>
  );
};

export default ShineButton;