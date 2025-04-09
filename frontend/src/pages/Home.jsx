import React, { useState, useRef, useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "scrollreveal";

const Home = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const navLinksRef = useRef(null);
  const menuBtnIconRef = useRef(null);

  const handleLogin = () => {
    navigate("/Login");
  };

  const handleRegister = () => {
    navigate("/Register");
  };

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

  // ScrollReveal animations using unique IDs
  useEffect(() => {
    // Base options for ScrollReveal animations
    const scrollRevealOptions = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    // Reveal the hero image (targeting the image within the heroImage container)
    ScrollReveal().reveal("#heroImage img", {
      ...scrollRevealOptions,
      origin: "right",
      delay: 1500,
    });

    // Reveal the heading and paragraph using unique IDs
    ScrollReveal().reveal("#heroH1", {
      ...scrollRevealOptions,
      delay: 700,
    });

    ScrollReveal().reveal("#heroP", {
      ...scrollRevealOptions,
      delay: 900,
    });

    ScrollReveal().reveal("#heroBtns", {
      ...scrollRevealOptions,
      delay: 1200,
      interval: 200,
    });
  }, []);

  return (
    <div className={styles.container}>

      <header>
        <nav>
          <div className={styles.navHeader}>
            <div className={styles.navLogo}>
              <a href="#">
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
              <a href="#">Home</a>
            </li>
            <li onClick={handleLinkClick}>
              <a href="#">Book an Appointment</a>
            </li>
            <li onClick={handleLinkClick}>
              <a href="#about">About</a>
            </li>
            <li onClick={handleLinkClick}>
              <a href="#">Contact Us</a>
            </li>
          </ul>
          <div className={styles.navSearch}>
            <input type="text" placeholder="Search" />
            <i class="fa-solid fa-magnifying-glass fa-rotate-90"></i>
          </div>
        </nav>
      </header>

      <main>
        
        <section className={styles.heroSection}>
          <div className={styles.heroImage} id="heroImage">
            <div className={`${styles.heroImageCard} ${styles.heroImageCard1}`}>
              <span>
                <i className="fa-solid fa-circle fa-2xs"></i>
              </span>
              Healthcare
            </div>
            <div className={`${styles.heroImageCard} ${styles.heroImageCard2}`}>
              <span>
                <i className="fa-solid fa-circle fa-2xs"></i>
              </span>
              Nail Disease Detection
            </div>
            <div className={`${styles.heroImageCard} ${styles.heroImageCard3}`}>
              <span>
                <i className="fa-solid fa-circle fa-2xs"></i>
              </span>
              Easy to Use
            </div>
            <div className={`${styles.heroImageCard} ${styles.heroImageCard4}`}>
              <span>
                <i className="fa-solid fa-circle fa-2xs"></i>
              </span>
              AI Diagnosis
            </div>

            <div className={`${styles.heroImageCard} ${styles.heroImageCard5}`}>
              <span>
                <img src="stethoscope.png" alt="" />
              </span>
            </div>

            <div className={`${styles.heroImageCard} ${styles.heroImageCard6}`}>
              <span>
                <img src="hand.png" alt="" />
              </span>
            </div>

            <img src="hero-header.png" alt="Hero Image" />
            
          </div>
          <div className={styles.heroContent} id="heroContent">
            <h1 id="heroH1">
              An Expert <br /> <span>Diagnosis System</span>
            </h1>
            <p id="heroP">
              Simply upload a photo, and our smart diagnostic tool analyzes it
              using artificial intelligence — delivering quick, reliable
              results to aid clinical consultations and early treatment.
            </p>
            <div className={styles.heroBtns} id="heroBtns">
              <button className={styles.addBtn}>Scan Nail Health</button>
              <button className={styles.addBtn}>
                Book an Appointment{" "}
                <i className="fa-solid fa-arrow-up fa-rotate-by"></i>
              </button>
            </div>
          </div>
        </section>

        <section className={styles.featureSection}>
          <h2 className={styles.featureSectionHeading}>Fast. Accurate. Scalable.</h2>

          <div className={styles.featureCards}>
            <div className={styles.featureCard1}>
              <p className={styles.featureCardHeading}>Analyzed Nail Images</p>
              <p className={styles.featureCardResult}>20,549</p>
              <p className={styles.featureCardPercent}>+15%</p>
              <p className={styles.featureCardText}>Nail images analyzed using AI for the past year</p>
            </div>
            <div className={styles.featureCard1}>
              <p className={styles.featureCardHeading}>Results Accuracy</p>
              <p className={styles.featureCardResult}>92%</p>
              <p className={styles.featureCardPercent}>+15%</p>
              <p className={styles.featureCardText}>Results accuracy in disease detection</p>
            </div>
            <div className={styles.featureCard1}>
              <p className={styles.featureCardHeading}>Time Consumption</p>
              <p className={styles.featureCardResult}>3x Faster</p>
              <p className={styles.featureCardText}>Diagnosis time compared to manual analysis</p>
            </div>
            <div className={styles.featureCard1}>
              <p className={styles.featureCardHeading}>Data security</p>
              <p className={styles.featureCardResult}>99.9%</p>
              <p className={styles.featureCardPercent}>+15%</p>
              <p className={styles.featureCardText}>Data security & patient confidentiality ensured</p>
            </div>
          </div>

          <img src="feature-section.png" alt="" className={styles.featureSectionImg} />

          <div className={styles.aboutUs} id="about">

            <div className={styles.aboutUsContent}>
              <h1 className={styles.aboutUsHeading}>Welcome to <br /> Nailysis</h1>
              <p className={styles.aboutUsSubheading}>Your nails say a lot about your health.</p>
              <p className={styles.aboutUsText}>
                They can reveal early signs of infections, nutritional deficiencies, or underlying conditions. Nailysis uses AI to scan and analyze nail images, helping you uncover possible health issues in seconds — safely, quickly, and intelligently.  
              </p>
            </div>

            <div className={styles.aboutUsImage}>
              <img src="about-us.png" alt="" />
            </div>

          </div>
        </section>

        <section className={styles.serviceSection}>
          <h2 className={styles.serviceSectionHeading}>Our Services</h2>
          <p className={styles.serviceSectionText}>
            They can reveal early signs of infections, nutritional deficiencies, or underlying conditions. Nailysis uses AI to scan and analyze nail images, helping you uncover possible health issues in seconds — safely, quickly, and intelligently.
          </p>

          <div className={styles.serviceCards}>
            <div className={styles.serviceCard1}>
              <p>Icon</p>
              <div className={styles.serviceCardContent}>
                <h2 className={styles.serviceCardHeading}>Consult a Doctor</h2>
                <p className={styles.serviceCardText}>Easy access to professional medical advice.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default Home;
