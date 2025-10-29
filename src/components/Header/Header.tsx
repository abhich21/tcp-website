import React from 'react';
import Image from 'next/image'; // 1. Import the Image component
import ShineButton from '../ui/ShineButton';

  
import styles from './Header.module.css'; // 1. Import the CSS Module

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'Projects', href: '#' },
  { name: 'Contact', href: '#' },
  { name: 'Games', href: '#' },
];

const Header = () => {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl">
      <nav className={styles.navbar}>
        {/* Logo */}
        <Image
          src="/Cloudplay xp white logo.png" // <-- IMPORTANT: Change this to your exact filename (e.g., /logo.png)
          alt="CloudPlayXP Logo"
          width={100} // Adjust width as needed
          height={40}// Adjust height as needed
          priority  
        />

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="text-gray-100 hover:text-white transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
      <ShineButton className="py-1 px-4 text-l font-medium">
        Let&apos;s Connect
      </ShineButton>
      </nav>
    </header>
  );
};

export default Header;