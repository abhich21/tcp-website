"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ServicesDropdown from "./ServicesDropdown";
import styles from "./Header.module.css";
import ShineButton from "../ui/ShineButton";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/#contact" },
  { name: "Games", href: "/portfolio" },
  { name: "FAQs", href: "/#faq" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsServicesOpen(true);
  };

  const handleLeave = () => {
    hoverTimeout.current = setTimeout(() => setIsServicesOpen(false), 120);
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-4 z-[80] mx-4 md:mx-auto max-w-5xl">
        <nav className={styles.navbar}>
          <Image
            src="/Cloudplay xp white logo.png"
            alt="CloudPlayXP Logo"
            width={80}
            height={32}
            className="w-20 md:w-24 lg:w-28"
            priority
          />

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.name === "Services") {
                return (
                  <li
                    key={link.name}
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                    className="relative"
                  >
                    <Link
                      href={link.href}
                      className={`transition-colors ${
                        isServicesOpen ? "text-white" : "text-gray-100"
                      }`}
                    >
                      Services
                    </Link>
                  </li>
                );
              }

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-100 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block">
            <ShineButton className="py-1 px-4 text-l font-medium">
              Let's Connect
            </ShineButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`${styles.mobileMenu} ${
            isMenuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed
          } md:hidden`}
        >
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileButtonWrapper}>
            <ShineButton className="w-full py-3 px-4 text-base font-medium">
              Let's Connect
            </ShineButton>
          </div>
        </div>
      </header>

      {/* FIXED MEGA MENU (Overlays hero, blur works) */}
      {isServicesOpen && (
        <div
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="
            fixed left-1/2 top-[82px] -translate-x-1/2 
            z-[70] 
            w-full max-w-5xl px-4
          "
        >
          <ServicesDropdown isOpen={isServicesOpen} />
        </div>
      )}
    </>
  );
};

export default Header;
