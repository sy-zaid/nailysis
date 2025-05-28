import React, { useState, useRef, useEffect } from "react";
import styles from "./about-us.module.css"; // Assuming we're using the same CSS module
import { Link, useNavigate } from "react-router-dom";
import ScrollReveal from "scrollreveal";


const AboutUs = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const navLinksRef = useRef(null);
  const menuBtnIconRef = useRef(null);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  // Toggle menu icon using state and refs
  useEffect(() => {
    if (navLinksRef.current && menuBtnIconRef.current) {
      if (isMenuOpen) {
        navLinksRef.current.classList.add(styles.open);
        menuBtnIconRef.current.setAttribute("class", "fa-solid fa-xmark");
      } else {
        navLinksRef.current.classList.remove(styles.open);
        menuBtnIconRef.current.setAttribute("class", "fa-solid fa-bars");
      }
    }
  }, [isMenuOpen, styles.open]);

  // ScrollReveal animations
  useEffect(() => {
    const scrollRevealOptions = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    ScrollReveal().reveal("#aboutHeader", {
      ...scrollRevealOptions,
      delay: 300,
    });

    ScrollReveal().reveal(".feature-box", {
      ...scrollRevealOptions,
      delay: 500,
      interval: 200,
    });

    ScrollReveal().reveal("#whyStarted", {
      ...scrollRevealOptions,
      delay: 700,
    });

    ScrollReveal().reveal("#services", {
      ...scrollRevealOptions,
      delay: 900,
    });
  }, []);

  return (
    <div className={styles.container}>
      {/* Header with Navigation */}
      <header>
        <nav>
          <div className={styles.navHeader}>
            <div className={styles.navLogo}>
              <a href="#">
                {/* Blue plus symbol logo */}
                <img src="logo.png" alt="Logo" />
              </a>
            </div>
            <div
              className={styles.navMenuBtn}
              id="menu-btn"
              ref={menuBtnRef}
              onClick={handleMenuClick}
            >
              <span>
                <i className="fa-solid fa-bars" ref={menuBtnIconRef}></i>
              </span>
            </div>
          </div>
       
          <ul className={styles.navLinks} id="nav-links" ref={navLinksRef}>
            <li onClick={handleLinkClick}>
              <Link to="/">Home</Link>
            </li>
            <li onClick={handleLinkClick}>
              <Link to="/login">Book An Appointment</Link>
            </li>
            <li onClick={handleLinkClick}>
              <Link to="/about-us">About</Link>
            </li>
            <li onClick={handleLinkClick}>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>


          <div>
            <button className={styles.loginButton}>
              Login
            </button>
          </div>
          <div className={styles.navSearch}>
            <input type="text" placeholder="Search" />
            <i class="fa-solid fa-magnifying-glass fa-rotate-90"></i>
          </div>
        </nav>
      </header>

      <main>
        {/* About Us Hero Section with 3 background images */}
        <section className={styles.aboutHeroSection} id="aboutHeader">
          <div className={styles.imageGrid}>
            <div className={styles.gridImage}>
              <img src="clinic1.png" alt="clinic ceiling" />
            </div>
            <div className={styles.gridImage}>
              <img src="clinic2.png" alt="clinic hallway" />
            </div>
            <div className={styles.gridImage}>
              <img src="clinic3.png" alt="clinic directory" />
            </div>
          </div>

          <div className={styles.aboutOverlay}>
            <div className={styles.aboutHeroContent}>
              <h1>About Us</h1>
              <p>
                We provide an AI-powered clinical application designed to
                simplify diagnostics and streamline operations for hospitals and
                clinics. Our goal is to enhance patient care through smart,
                efficient, and integrated healthcare solutions.
              </p>
              <div className={styles.aboutCta}>
                <button className={styles.primaryBtn}>
                  <span>Scan Nail Health</span>
                </button>
                <button className={styles.secondaryBtn}>
                  <span>Book An Appointment</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className={styles.featuresGrid}>
          <div className={`${styles.featureBox} feature-box`}>
            <h3>Our Mission</h3>
            <p>
              To empower healthcare providers with intelligent digital tools
              that improve diagnostics, streamline workflows, and enhance
              patient care..
            </p>
          </div>

          <div className={`${styles.featureBox} feature-box`}>
            <h3>Our Vision</h3>
            <p>
              To empower healthcare providers with intelligent digital tools
              that improve diagnostics, streamline workflows, and enhance
              patient care.
            </p>
          </div>

          <div className={`${styles.featureBox} feature-box`}>
            <h3>Our Values</h3>
            <p>
              Innovation, Integrity, Compassion, and Excellence — these guide
              everything we do to support better healthcare outcomes.
            </p>
          </div>

          <div className={`${styles.featureBox} feature-box`}>
            <h3>What We Do</h3>
            <p>
              To empower healthcare providers with intelligent digital tools
              that improve diagnostics, streamline workflows, and enhance
              patient care.
            </p>
          </div>
        </section>

        {/* Why We Started Section (previously "Why We're Trusted") */}
        <section className={styles.whyStartedSection} id="whyStarted">
          <div className={styles.whyStartedContent}>
            <div className={styles.whyStartedText}>
              <h2>Why We Started</h2>
              <p>
                Healthcare deserves better — faster diagnoses, fewer delays, and
                smarter systems. We saw the everyday struggles clinics face and
                knew technology could help. That’s why we built a solution that
                blends intelligent automation with real human care. Our goal? To
                support healthcare teams and improve every patient’s experience,
                one clinic at a time.
              </p>
            </div>

            <div className={styles.doctorPatientImage}>
              <img src="mareez.png" alt="Doctor consulting with patient" />
            </div>
          </div>
        </section>

        {/* Our Range of Services Section with Icons */}
        <section className={styles.servicesSection} id="services">
          <h2>Our Range Of Services</h2>

          <div className={styles.servicesGrid}>
            {/* Service 1 - Clinical Analysis */}
            <div className={styles.serviceItem}>
              {/* Icon placeholder */}
              <div className={styles.serviceIcon}>
                {/* Medical/Clinical icon should be placed here */}
                <i className="fa-solid fa-stethoscope"></i>
              </div>
              <h3>Consult a Doctor</h3>
              <p>
                We make it easy for patients to access professional healthcare
                without long wait times or complicated processes. Through our
                platform, users can consult with licensed doctors for real-time
                medical advice, get prescriptions, and even receive follow-up
                care — all through a secure, user-friendly interface. Whether
                in-person or virtually, our goal is to keep quality care within
                reach.
              </p>
            </div>

            {/* Service 2 - Medical Appointments */}
            <div className={styles.serviceItem}>
              {/* Icon placeholder */}
              <div className={styles.serviceIcon}>
                {/* Calendar/Appointment icon should be placed here */}
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h3>Medical Appointments</h3>
              <p>
                Say goodbye to chaotic appointment systems. Our smart scheduling
                feature allows clinics to manage appointments efficiently while
                giving patients the freedom to book, reschedule, or cancel with
                ease. With automated reminders and real-time availability, we
                help reduce no-shows and keep the clinic flow smooth and
                stress-free for both staff and patients.
              </p>
            </div>

            {/* Service 3 - AI Technology */}
            <div className={styles.serviceItem}>
              {/* Icon placeholder */}
              <div className={styles.serviceIcon}>
                {/* AI/Tech icon should be placed here */}
                <i className="fa-solid fa-microchip"></i>
              </div>
              <h3>AI Technology</h3>
              <p>
                We’ve integrated cutting-edge AI technology to assist in early
                and accurate diagnosis of potential health issues using nail
                image analysis. This feature helps doctors catch warning signs
                earlier, make informed decisions faster, and reduce diagnostic
                delays. It’s a powerful tool designed to support — not replace —
                the expertise of healthcare professionals.
              </p>
            </div>

            {/* Service 4 - 24/7 Online Support */}
            <div className={styles.serviceItem}>
              {/* Icon placeholder */}
              <div className={styles.serviceIcon}>
                {/* Support/Headset icon should be placed here */}
                <i className="fa-solid fa-headset"></i>
              </div>
              <h3>24/7 Online Support</h3>
              <p>
                Technical difficulties or questions shouldn’t disrupt
                healthcare. That’s why we provide full-time, responsive support
                to our users — whether you’re a doctor, clinic admin, lab
                technician, or patient. Our support team is available 24/7 to
                offer real-time assistance, ensuring your operations run
                smoothly and your experience stays hassle-free.We’re not just a
                platform — we’re your partner in delivering uninterrupted,
                quality care.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Left Column - Subscribe & Contact */}
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <img src="logo.png" alt="Nailysis Logo" />
            </div>
            <h4>Subscribe Now</h4>
            <div className={styles.subscribeForm}>
              <div className={styles.emailInput}>
                <i className="fa-solid fa-envelope"></i>
                <input type="email" placeholder="Enter your email here" />
              </div>
            </div>
            <p className={styles.contactInfo}>Tel: 03335567122</p>
            <p className={styles.contactInfo}>Mail: Nailysis@gmail.com</p>
          </div>

                    {/* Middle Column - Menu */}
                    <div className={styles.footerColumn}>
            <h4>Menu</h4>
            <ul className={styles.menuLinks}>
              <li>
                <Link to="/login">Book An Appointment</Link>
              </li>
              <li>
                <Link to="/about-us">About</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact</Link>
              </li>
              <li>
                <Link to="/policy">Policy</Link>
              </li>
            </ul>
          </div>

          {/* Right Column - Socials */}
          <div className={styles.footerColumn}>
            <h4>Socials</h4>
            <ul className={styles.socialIcons}>
              <li>
                <a href="#" className={styles.socialLink}>
                  <div className={styles.socialIcon}>
                    <i className="fa-brands fa-facebook-f"></i>
                  </div>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className={styles.socialLink}>
                  <div className={styles.socialIcon}>
                    <i className="fa-brands fa-x-twitter"></i>
                  </div>
                  <span>X</span>
                </a>
              </li>
              <li>
                <a href="#" className={styles.socialLink}>
                  <div className={styles.socialIcon}>
                    <i className="fa-brands fa-instagram"></i>
                  </div>
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className={styles.copyright}>
          <p>© 2025 Nailysis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
