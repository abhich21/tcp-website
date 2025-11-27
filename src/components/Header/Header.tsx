// src/components/Header/Header.tsx
"use client"; 

// 1. Import Link from next/link and useRouter
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShineButton from '../ui/ShineButton';
import styles from './Header.module.css';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/#contact' },
  { name: 'Games', href: '/portfolio' },
  { name: 'FAQs', href: '/#faq' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-4 z-50 mx-4 md:mx-auto max-w-5xl"> 
      <nav className={styles.navbar}>
        {/* Logo - Responsive sizing */}
        <Image
          src="/Cloudplay xp white logo.png"
          alt="CloudPlayXP Logo"
          width={80}
          height={32}
          className="w-20 h-auto md:w-24 lg:w-28"
          priority
        />

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-gray-100 hover:text-white transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link href="/#contact">
            <ShineButton className="py-1 px-4 text-l font-medium">
              Let&apos;s Connect
            </ShineButton>
          </Link>
        </div>

        {/* Mobile Burger Menu Button - Enhanced touch target */}
        <button
          className="md:hidden z-[101] text-white p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay - Enhanced transitions and spacing */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 w-full h-screen bg-black/90 backdrop-blur-lg z-[100] flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMenuOpen(false)} 
        >
          <ul className="flex flex-col items-center gap-6 mb-12">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className="text-gray-100 hover:text-white active:text-lime-400 transition-colors text-2xl font-semibold py-2 px-4 min-h-[44px] flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* CTA Button for mobile menu - Enhanced sizing */}
          <ShineButton 
            className="py-3 px-8 text-lg font-medium min-h-[48px]"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/#contact');
              setIsMenuOpen(false);
            }}
          >
            Let&apos;s Connect
          </ShineButton>
        </div>
      )}
    </header>
  );
};

export default Header;