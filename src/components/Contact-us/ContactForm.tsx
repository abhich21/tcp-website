// src/components/ContactForm/ContactForm.tsx
"use client";

import React, { useState } from 'react';
import styles from './ContactForm.module.css';
import GlassCard from '../ui/GlassCard/GlassCard';
import ShineButton from '../ui/ShineButton';

const ContactForm = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to an API endpoint
    console.log('Form data submitted:', formData);
    // You could add a success message here
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Get in <span className="text-lime-400">Touch</span>
      </h2>
      
      {/* Reuse your GlassCard component as the form's container */}
      <GlassCard className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="message" className={styles.label}>Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textareaField}
              placeholder="How can we help?"
              rows={5}
              required
            />
          </div>

          {/* Reuse your ShineButton component */}
          <ShineButton
            type="submit"
            className={styles.submitButton}
          >
            Send Message
          </ShineButton>
        </form>
      </GlassCard>
    </section>
  );
};

export default ContactForm;