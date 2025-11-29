"use client"; 

import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard/GlassCard'; 
import styles from './FaqSection.module.css'; // 1. Import the new CSS module
import clsx from 'clsx'; // 2. Import clsx to handle dynamic classes

// Data for the FAQs
const faqData = [
  {
    q: "What types of corporate events does CloudplayXP specialize in?",
    a: "We specialize in a wide range of corporate events, including product launches, brand activations, conferences, trade shows, and immersive internal meetings—both virtual and in-person."
  },
  {
    q: "How does CloudplayXP ensure that an event reflects our brand message?",
    a: "Our process begins with a deep dive into your brand guidelines and strategic goals. Every creative, technical, and logistical decision is then filtered through that lens to ensure a consistent and powerful brand experience."
  },
  {
    q: "Do you provide end-to-end event solutions?",
    a: "Yes, we are a full-service agency. We handle everything from initial concept and creative design to technical production, on-site management, and post-event analytics."
  },
  {
    q: "Can CloudplayXP work with our internal marketing or creative team?",
    a: "Absolutely. We are built to collaborate and can seamlessly integrate with your in-house teams, acting as an extension of your brand to provide specialized expertise where you need it most."
  },
  {
    q: "What makes a CloudplayXP event memorable for attendees?",
    a: "We focus on creating multi-sensory, interactive experiences that engage attendees on an emotional level. It's not just about what they see, but what they do, feel, and share."
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    // 3. All classNames now use the 'styles' object
    <section className={styles.section}>
      <div className={styles.gridContainer}>
        
        {/* === LEFT SIDE: TITLE === */}
        <div className={styles.titleWrapper}>
          <p className={styles.titleLabel}>FAQs</p>
          <h2 className={styles.titleHeading}>
            Creative/
            Brand-focused
          </h2>
        </div>

        {/* === RIGHT SIDE: ACCORDION === */}
        <div className={styles.accordionWrapper}>
          <GlassCard className={styles.faqCard}>
            
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className={styles.accordionItem}>
                  
                  <button
                    onClick={() => handleClick(index)}
                    className={styles.faqButton}
                  >
                    <span className={styles.faqQuestion}>
                      {faq.q}
                    </span>
                    
                    <span 
                      className={styles.faqIcon}
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }} 
                    >
                      +
                    </span>
                  </button>
                  
                  {/* 4. Use clsx to combine base styles with dynamic open/closed styles */}
                  <div
                    className={clsx(
                      styles.faqAnswerContainer,
                      isOpen ? styles.answerOpen : styles.answerClosed
                    )}
                  >
                    <p className={styles.faqAnswer}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;