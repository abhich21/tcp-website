// src/components/Header/Header.tsx
"use client"; 

// 1. Import Link from next/link and useRouter
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- ADD THIS
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
  const router = useRouter(); // <-- 2. Initialize the router

  return (
    <header className="sticky top-4 z-50 mx-4 md:mx-auto max-w-5xl"> 
      <nav className={styles.navbar}>
        {/* Logo */}
        <Image
          src="/Cloudplay xp white logo.png"
          alt="CloudPlayXP Logo"
          width={100}
          height={40}
          priority
        />

        {/* 3. Desktop Navigation Links (use <Link>) */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              {/* REPLACE <a> with <Link> */}
              <Link href={link.href} className="text-gray-100 hover:text-white transition-colors">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* 4. Desktop CTA Button (use <Link> wrapper) */}
        <div className="hidden md:block">
          {/* We wrap the button in a <Link> tag */}
          <Link href="/#contact">
            <ShineButton className="py-1 px-4 text-l font-medium">
              Let&apos;s Connect
            </ShineButton>
          </Link>
        </div>

        {/* Mobile Burger Menu Button */}
        <button
          className="md:hidden z-[101] text-white" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* 5. Mobile Menu Overlay (use <Link> and router.push) */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 w-full h-screen bg-black/90 backdrop-blur-lg z-[100] flex flex-col items-center justify-center"
          onClick={() => setIsMenuOpen(false)} 
        >
          <ul className="flex flex-col items-center gap-8 mb-12">
            {navLinks.map((link) => (
              <li key={link.name}>
                {/* REPLACE <a> with <Link> */}
                <Link 
                  href={link.href} 
                  className="text-gray-100 hover:text-white transition-colors text-2xl font-semibold"
                  onClick={(e) => e.stopPropagation()} 
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* CTA Button for mobile menu */}
          <ShineButton 
            className="py-2 px-6 text-xl font-medium"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/#contact'); // <-- Use router.push
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