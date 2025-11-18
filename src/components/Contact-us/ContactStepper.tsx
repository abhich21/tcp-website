// tumul901/tcp-website/tcp-website-d66ffaf1bb64fc577ab80a112ef9305a0440dc75/src/components/Contact-us/ContactStepper.tsx
"use client";

import React, { useState, useRef } from "react";
// Import Stepper default and the Handle type
import Stepper, { Step, StepperHandle } from "../ui/Stepper-form/Stepper";
import styles from "./ContactStepper.module.css";
import GlassCard from "../ui/GlassCard/GlassCard";
import ShineButton from "../ui/ShineButton";

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Simple email validation helper
const isValidEmail = (email: string) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ContactStepper = () => {
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    service: "default",
    message: "",
    honeypot: "", // Honeypot field
  };

  const [formData, setFormData] = useState(initialFormData);

  // State for submission status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null); // For API errors

  // State for field validation errors
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // Refs for inputs to focus them on error
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Ref to control the stepper component
  const stepperRef = useRef<StepperHandle>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this field when the user starts typing
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  /**
   * Validates the entire form.
   * If errors are found, it updates the error state,
   * jumps to the corresponding step, and focuses the field.
   */
  const validateForm = () => {
    const { name, email, phone, message } = formData;
    const newErrors = {
      name: !name.trim(),
      email: !email.trim() || !isValidEmail(email),
      phone: !phone.trim(),
      message: !message.trim(),
    };

    setErrors(newErrors);

    // Find the first error and navigate to it
    if (newErrors.name) {
      stepperRef.current?.setActiveStep(0); // Step 1 is index 0
      nameRef.current?.focus();
      return false;
    }
    if (newErrors.email) {
      stepperRef.current?.setActiveStep(0); // Step 1 is index 0
      emailRef.current?.focus();
      return false;
    }
    if (newErrors.phone) {
      stepperRef.current?.setActiveStep(0); // Step 1 is index 0
      phoneRef.current?.focus();
      return false;
    }
    if (newErrors.message) {
      stepperRef.current?.setActiveStep(1); // Step 2 is index 1
      messageRef.current?.focus();
      return false;
    }

    return true; // All valid
  };

  const handleSubmit = async () => {
    if (loading) return; // Prevent double-submit

    // 1. Run validation
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop if validation fails
    }

    // 2. Proceed with submission
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      setFormData(initialFormData); // Reset form
      // Don't reset stepperRef, let the success UI replace it
    } catch (err: any) {
      setError(
        err.message || "A network error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Let&apos;s <span className="text-lime-400">Talk</span>
      </h2>

      {/* This is the main change:
        We now render the <GlassCard> in *both* cases, but change its *content*
        based on the 'success' state.
      */}
      <GlassCard className="p-4 md:p-2 rounded-3xl">
        {success ? (
          // --- NEW SUCCESS SCREEN ---
          <div className={styles.successCard}>
            <div className={styles.checkmarkContainer}>
              <svg
                className={styles.checkmark}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className={styles.checkmarkCircle}
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className={styles.checkmarkPath}
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
            <h3
              className={styles.stepTitle}
              style={{ fontSize: "1.5rem", textAlign: "center" }}
            >
              Thank You!
            </h3>
            <p
              className={styles.stepDescription}
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              Your message has been sent successfully. We'll be in touch soon!
            </p>
            <ShineButton
              onClick={() => {
                setSuccess(false);
                stepperRef.current?.setActiveStep(0); // Reset stepper to first page
              }}
              className={styles.successButton}
            >
              Send Another Message
            </ShineButton>
          </div>
        ) : (
          // --- EXISTING STEPPER FORM ---
          <>
            <Stepper onFinalStepCompleted={handleSubmit} ref={stepperRef}>
              {/* --- STEP 1 --- */}
              <Step>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Your Contact Info</h3>
                  <p className={styles.stepDescription}>
                    How can we reach you?
                  </p>

                  {/* Honeypot Field (hidden) */}
                  <div
                    style={{ position: "absolute", left: "-5000px" }}
                    aria-hidden="true"
                  >
                    <label htmlFor="honeypot">Don't fill this out</label>
                    <input
                      type="text"
                      id="honeypot"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Name
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${styles.inputField} ${
                        errors.name ? styles.errorInput : ""
                      }`}
                      placeholder="Your Name"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email
                    </label>
                    <input
                      ref={emailRef}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.inputField} ${
                        errors.email ? styles.errorInput : ""
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone
                    </label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${styles.inputField} ${
                        errors.phone ? styles.errorInput : ""
                      }`}
                      placeholder="Your Phone Number"
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
                    <label htmlFor="service" className={styles.label}>
                      What service are you interested in?
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={styles.inputField} // No error state, as it's optional
                    >
                      <option value="default" disabled>
                        Select a service...
                      </option>
                      <option value="event-content">Event Content</option>
                      <option value="3d-motion">3D & Motion Design</option>
                      <option value="team-building">Team Building</option>
                      <option value="strategy">Brand Strategy</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="message" className={styles.label}>
                      Your Message
                    </label>
                    <textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`${styles.textareaField} ${
                        errors.message ? styles.errorInput : ""
                      }`}
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

                  <div className={styles.summary}>
                    <p>
                      <strong>Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {formData.phone}
                    </p>
                    <p>
                      <strong>Service:</strong> {formData.service}
                    </p>
                  </div>
                </div>
              </Step>
            </Stepper>

            {/* Loading and Error messages displayed below the stepper */}
            {loading && (
              <div
                className="text-center p-4"
                style={{ color: "white" }}
              >
                Sending...
              </div>
            )}
            {error && (
              <div
                className="text-center pt-2 pb-4"
                style={{
                  color: "#EF4444" /* red-500 */,
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}
          </>
        )}
      </GlassCard>
    </section>
  );
};

export default ContactStepper;