import React, { useState, useRef } from "react";
import styles from "./contact.module.css";

const ContactUs = () => {
  // Step 1: Declare refs using useRef
  const menuBtnRef = useRef(null);
  const menuBtnIconRef = useRef(null);
  const navLinksRef = useRef(null);

  // Step 2: Define event handlers
  const handleMenuClick = () => {
    const navLinks = navLinksRef.current;
    if (navLinks) {
      navLinks.classList.toggle(styles.active); // Toggle active class for navigation links
    }
  };

  const handleLinkClick = () => {
    const navLinks = navLinksRef.current;
    if (navLinks) {
      navLinks.classList.remove(styles.active); // Close the menu after a link is clicked
    }
  };

  return (
    <div className={styles.container}>
      {/* Navbar component will be placed here */}
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
              <a href="/">Home</a>
            </li>
            <li onClick={handleLinkClick}>
              <a href="/appointment">Book An Appointment</a>
            </li>
            <li onClick={handleLinkClick}>
              <a href="/about">About</a>
            </li>
            <li onClick={handleLinkClick}>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
          <div className={styles.navSearch}>
            <input type="text" placeholder="Search" />
            <i className="fa-solid fa-magnifying-glass fa-rotate-90"></i>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          Whether you're a patient, clinic admin or healthcare provider, we're
          here to help. Reach out with any questions, suggestions, or support
          needs.
        </p>

        <div className={styles.contactCard}>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <img src="/location.png" alt="location" />
              <div className={styles.iconPlaceholder}></div>
              <div className={styles.infoText}>
                <p>ST-13 Abul Hasan Isphahani Rd, Block 7</p>
                <p>Gulshan-e-Iqbal, Karachi, 75300</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <img src="/phone.png" alt="phone" />
              <div className={styles.iconPlaceholder}></div>
              <p className={styles.infoText}>021-12345678</p>
            </div>

            <div className={styles.infoItem}>
              <img src="/email.png" alt="email" />
              <div className={styles.iconPlaceholder}></div>
              <p className={styles.infoText}>Nailysis@gmail.com</p>
            </div>

            <div className={styles.infoItem}>
              <img src="/clock 1.png" alt="clock" />
              <div className={styles.iconPlaceholder}></div>
              <div className={styles.infoText}>
                <p>Monday — Saturday: 9:00 AM — 8:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className={styles.mapWrapper}>
            {/* Map image will go here */}
            <img src="/map.png" alt="Location Map" className={styles.map} />
          </div>
        </div>

        <p className={styles.feedbackText}>
          Have feedback or inquiries? We're always listening—reach out and let's
          improve care, one step at a time.
        </p>
      </main>

      <div className={styles.stayInTouch}>
        <div className={styles.stayInTouchContent}>
          <div className={styles.stayInTouchLeft}>
            <h2 className={styles.stayInTouchTitle}>Stay In Touch With Us</h2>
            <p className={styles.stayInTouchSubtitle}>
              Follow us on social media and never miss an update from the world
              of Nailysis
            </p>

            <div className={styles.contactInformation}>
              <h3 className={styles.contactInformationTitle}>
                Contact Information
              </h3>
              <p className={styles.contactInfoItem}>Tel: 021 12345678</p>
              <p className={styles.contactInfoItem}>Mail: Nailysis@gmail.com</p>
            </div>
          </div>

          <div className={styles.stayInTouchMiddle}>
            <h3 className={styles.menuTitle}>Menu</h3>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>Book An Appointment</li>
              <li className={styles.menuItem}>About</li>
              <li className={styles.menuItem}>Contact</li>
              <li className={styles.menuItem}>Policy</li>
            </ul>
          </div>

          <div className={styles.stayInTouchRight}>
            <h3 className={styles.socialsTitle}>Socials</h3>
            <div className={styles.socialList}>
              <div className={styles.socialItem}>
                <img
                  src="/facebook.png"
                  alt="Facebook"
                  className={styles.socialIcon}
                />
                <span className={styles.socialName}>Facebook</span>
              </div>
              <div className={styles.socialItem}>
                <img src="/x-logo.png" alt="X" className={styles.socialIcon} />
                <span className={styles.socialName}>X</span>
              </div>
              <div className={styles.socialItem}>
                <img
                  src="/insta.png"
                  alt="Instagram"
                  className={styles.socialIcon}
                />
                <span className={styles.socialName}>Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer will be placed here */}
      {/* <Footer /> */}
      <div className={styles.copyright}>
        <p>© 2025 Nailysis. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ContactUs;
