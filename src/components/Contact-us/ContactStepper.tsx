// src/components/ContactForm/ContactStepper.tsx
"use client";

import React, { useState } from 'react';
import Stepper, { Step } from '../ui/Stepper-form/Stepper'; // Import your Stepper
import styles from './ContactStepper.module.css'; // New CSS file for inputs
import GlassCard from '../ui/GlassCard/GlassCard';

const ContactStepper = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'default',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // This is called when the final "Complete" button is clicked
    console.log('Final Form Data:', formData);
    // Here you would send the data to your API
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Let&apos;s <span className="text-lime-400">Talk</span>
      </h2>

      {/* Wrap the Stepper in your GlassCard for the consistent theme.
        We apply padding here to the card.
      */}
      <GlassCard className="p-4 md:p-2 rounded-3xl">
        <Stepper onFinalStepCompleted={handleSubmit}>
          
          {/* --- STEP 1 --- */}
          <Step>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Your Contact Info</h3>
              <p className={styles.stepDescription}>
                How can we reach you?
              </p>
              
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Your Name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </Step>

          {/* --- STEP 2 --- */}
          <Step>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Project Details</h3>
              <p className={styles.stepDescription}>
                Tell us a bit about your project.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="service" className={styles.label}>What service are you interested in?</label>
                <select 
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={styles.inputField} // We reuse the input style
                >
                  <option value="default" disabled>Select a service...</option>
                  <option value="event-content">Event Content</option>
                  <option value="3d-motion">3D & Motion Design</option>
                  <option value="team-building">Team Building</option>
                  <option value="strategy">Brand Strategy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message" className={styles.label}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textareaField}
                  placeholder="Describe your project, goals, or any questions you have..."
                  rows={4}
                />
              </div>
            </div>
          </Step>

          {/* --- STEP 3 (Confirmation) --- */}
          <Step>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>All Set!</h3>
              <p className={styles.stepDescription}>
                You're all done. Click "Complete" to send us your message. 
                We'll be in touch soon!
              </p>
              
              {/* You can optionally show a summary here */}
              <div className={styles.summary}>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Service:</strong> {formData.service}</p>
              </div>
            </div>
          </Step>
        </Stepper>
      </GlassCard>
    </section>
  );
};

export default ContactStepper;