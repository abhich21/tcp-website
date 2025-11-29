import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';
import { CardContainer, CardBody, CardItem } from '../ui/3d-card'; // Adjust this import path!

// --- 1. SVG Icons (Helper Components) ---
// MOVED TO THE TOP OF THE FILE
// Now they are declared before they are used in the 'socials' array

const InstagramIcon = () => (
  <svg className={styles.socialIconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg className={styles.socialIconSvg} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
  </svg>
);

const YouTubeIcon = () => (
  <svg className={styles.socialIconSvg} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.58 7.19c-.23-.86-.9-1.52-1.76-1.76C18.25 5 12 5 12 5s-6.25 0-7.82.43c-.86.24-1.52.9-1.76 1.76C2 8.75 2 12 2 12s0 3.25.42 4.81c.24.86.9 1.52 1.76 1.76C5.75 19 12 19 12 19s6.25 0 7.82-.43c.86-.24 1.52.9 1.76-1.76C22 15.25 22 12 22 12s0-3.25-.42-4.81zM9.75 15.02V8.98l5.2 3.02-5.2 3.02z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg className={styles.socialIconSvg} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// --- 2. Data for the links ---
// Now this array is defined AFTER the icons it needs

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'Games', href: '/games' },
];

const socials = [
  { name: 'Instagram', href: '#', icon: <InstagramIcon /> },
  { name: 'Facebook', href: '#', icon: <FacebookIcon /> },
  { name: 'YouTube', href: '#', icon: <YouTubeIcon /> },
  { name: 'LinkedIn', href: '#', icon: <LinkedInIcon /> },
];

// --- 3. Footer Component ---

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* === Top Section === */}
      <div className={styles.mainFooter}>
        
        {/* 1. Logo (with 3D Effect) */}
        <div className={styles.logoSection}>
          <CardContainer containerClassName={styles.logoCardContainer}>
            <CardBody className="!w-auto !h-auto">
              <CardItem translateZ="30" as={Link} href="/">
                <Image
                  src="/Cloudplay xp white logo.png" // <-- UPDATE THIS PATH
                  alt="Cloudplayxp"
                  width={170} // Adjust as needed
                  height={50} // Adjust as needed
                  className={styles.logo}
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* 2. Navigation */}
        <div className={styles.navSection}>
          <h3 className={styles.title}>NAVIGATION</h3>
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 3. Social Media (with 3D Effect) */}
        <div className={styles.socialSection}>
          <h3 className={styles.title}>SOCIAL MEDIA</h3>
          <div className={styles.socialIcons}>
            {socials.map((social) => (
              <CardContainer key={social.name} containerClassName={styles.socialCardContainer}>
                <CardBody className="!w-auto !h-auto">
                  <CardItem translateZ="20">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialIconLink}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </div>

      {/* === Bottom Section === */}
      <div className={styles.subFooter}>
        <p className={styles.copyright}>© 2025 - Cloudplayxp</p>
        <Link href="/terms-and-conditions" className={styles.termsLink}>
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
};

export default Footer;