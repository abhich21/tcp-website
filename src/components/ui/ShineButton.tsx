import React from 'react';
import { twMerge } from 'tailwind-merge';
type BaseProps = {
  children: React.ReactNode;
  className?: string;
};
// Props when used as a Link (must have href)
type LinkButtonProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};
// Props when used as a Button (must NOT have href)
type ActionButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};
export type ShineButtonProps = LinkButtonProps | ActionButtonProps;
const ShineButton = (props: ShineButtonProps) => {
  const { children, className } = props;
  const baseClasses = 'relative group overflow-hidden bg-green-800 text-white font-bold rounded-full transition-colors duration-300 inline-block text-center';
  // Check if it's a link
  if ('href' in props && props.href) {
    const { href, ...rest } = props as LinkButtonProps;
    return (
      <a
        href={href}
        className={twMerge(baseClasses, className)}
        {...rest}
      >
        {children}
        <div className="absolute inset-0 w-full h-full transform -skew-x-30 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
      </a>
    );
  }
  // Otherwise it's a button
  const { ...rest } = props as ActionButtonProps;
  return (
    <button
      className={twMerge(baseClasses, className)}
      {...rest}
    >
      {children}
      <div className="absolute inset-0 w-full h-full transform -skew-x-30 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
    </button>
  );
};
export default ShineButton;