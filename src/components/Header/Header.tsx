// 1. ADD "use client" - This is required for useState
"use client"; 

// 2. Import useState
import React, { useState } from 'react';
import Image from 'next/image';
import ShineButton from '../ui/ShineButton';
import styles from './Header.module.css';

// 3. Import icons for the menu
import { Menu, X } from 'lucide-react'; // You'll need to install lucide-react: npm install lucide-react

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '#' },
  { name: 'Games', href: '#' },
];

const Header = () => {
  // 4. Add state to track if the mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // The z-index on the header (50) needs to be lower than the mobile menu (100)
    <header className="sticky top-4 z-50 mx-4 md:mx-auto max-w-5xl"> 
      <nav className={styles.navbar}>
        {/* Logo (No changes needed) */}
        <Image
          src="/Cloudplay xp white logo.png"
          alt="CloudPlayXP Logo"
          width={100}
          height={40}
          priority
        />

        {/* Desktop Navigation Links (Your existing code is perfect) */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="text-gray-100 hover:text-white transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA Button 
            5. ADD: "hidden md:block" to hide this on mobile
        */}
        <div className="hidden md:block">
          <ShineButton className="py-1 px-4 text-l font-medium">
            Let&apos;s Connect
          </ShineButton>
        </div>

        {/* 6. ADD: Mobile Burger Menu Button 
            This button is ONLY visible on mobile (md:hidden)
        */}
        <button
          className="md:hidden z-[101] text-white" // z-[101] keeps it above the menu overlay
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggles the state
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 7. ADD: Mobile Menu Overlay 
          This entire div only appears if isMenuOpen is true
      */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 w-full h-screen bg-black/90 backdrop-blur-lg z-[100] flex flex-col items-center justify-center"
          onClick={() => setIsMenuOpen(false)} // Click background to close
        >
          <ul className="flex flex-col items-center gap-8 mb-12">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="text-gray-100 hover:text-white transition-colors text-2xl font-semibold"
                  onClick={(e) => e.stopPropagation()} // Don't close menu if link is clicked
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          
          {/* CTA Button for mobile menu */}
          <ShineButton 
            className="py-2 px-6 text-xl font-medium"
            onClick={(e) => e.stopPropagation()} // Don't close menu if button is clicked
          >
            Let&apos;s Connect
          </ShineButton>
        </div>
      )}
    </header>
  );
};

export default Header;