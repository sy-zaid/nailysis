import React, { useState, useRef, useEffect } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
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
                <img src="logo.png" alt="Logo"/>
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
                <img src="stethoscope.png" alt="" style={{ width: "100%" }} />
              </span>
            </div>

            <div className={`${styles.heroImageCard} ${styles.heroImageCard6}`}>
              <span>
                <img src="hand.png" alt="" style={{ width: "100%" }} />
              </span>
            </div>

            <img src="hero-header.png" alt="Hero Image" style={{ width: "100%" }} />
            
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
              <img src="about-us.png" alt="" style={{ width: "100%" }} />
            </div>

          </div>
        </section>

        <section className={styles.serviceSection}>
          <h2 className={styles.serviceSectionHeading}>Our Services</h2>
          <p className={styles.serviceSectionText}>
            They can reveal early signs of infections, nutritional deficiencies, or underlying conditions. Nailysis uses AI to scan and analyze nail images, helping you uncover possible health issues in seconds — safely, quickly, and intelligently.
          </p>

          <img src="services-bg-1.jpg" alt="" className={styles.serviceBg1} />
          <img src="services-bg-2.jpg" alt="" className={styles.serviceBg2} />

          <div className={styles.serviceCards}>

            <div className={styles.serviceCard1}>
              <i className="fa-solid fa-stethoscope"></i>
              <div className={styles.serviceCardContent}>
                <h2 className={styles.serviceCardHeading}>Consult a Doctor</h2>
                <p className={styles.serviceCardText}>Easy access to professional medical advice.</p>
              </div>
            </div>
            <div className={styles.serviceCard2}>
              <i className="fa-solid fa-calendar-days"></i>
              <div className={styles.serviceCardContent}>
                <h2 className={styles.serviceCardHeading}>Medical Appointments</h2>
                <p className={styles.serviceCardText}>Hassle-free scheduling for clinic visits.</p>
              </div>
            </div>
            <div className={styles.serviceCard3}>
              <i className="fa-solid fa-robot"></i>
              <div className={styles.serviceCardContent}>
                <h2 className={styles.serviceCardHeading}>AI Technology</h2>
                <p className={styles.serviceCardText}>Advanced disease detection using AI-powered nail image analysis.</p>
              </div>
            </div>
            <div className={styles.serviceCard4}>
              <i class="fa-solid fa-headset"></i>
              <div className={styles.serviceCardContent}>
                <h2 className={styles.serviceCardHeading}>24/7  Online Support</h2>
                <p className={styles.serviceCardText}>Round-the-clock assistance for users.</p>
              </div>
            </div>

          </div>   
        </section>

        <section className={styles.howItWorksSection}>
          <h2 className={styles.howItWorksSectionHeading}>How it <span>works?</span></h2>

          <img src="robot-arm.png" alt="" className={styles.howItWorksSectionImage} />

          <div className={styles.howItWorksCards}>

            <div className={styles.howItWorksCard1}>
              <h2 className={styles.howItWorksCardHeading}>Capture And Upload</h2>
              <p className={styles.howItWorksCardText}>Take a clear photo of your fingernail</p>
            </div>
            <div className={styles.howItWorksCard2}>
              <h2 className={styles.howItWorksCardHeading}>AI Analysis</h2>
              <p className={styles.howItWorksCardText}>Our system detects potential health conditions</p>
            </div>
            <div className={styles.howItWorksCard3}>
              <h2 className={styles.howItWorksCardHeading}>Get Results & Insights</h2>
              <p className={styles.howItWorksCardText}>Receive instant feedback and recommendations</p>
            </div>

            <img src="how-it-works-1.png" alt="" className={styles.howItWorksImage1} />
            <img src="how-it-works-2.png" alt="" className={styles.howItWorksImage2} />

          </div>   

        </section>

        <section className={styles.parallaxSection}>
          <div className={styles.parallaxContent}>
            <h2 className={styles.parallaxSectionHeading}>Why Choose Nailysis?</h2>
            <i className="fa-solid fa-chevron-right"></i>
            <div className={styles.parallaxBottomContent}>
              <h2 className={styles.parallaxSectionSubHeading}>AI-Powered Accuracy</h2>
              <p className={styles.parallaxSectionText}>
                Our AI-powered system analyzes nail images with high precision, leveraging machine <br /> learning to detect potential health issues quickly and accurately.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.teamSection}>
          <h2 className={styles.teamSectionHeading}>
            Meet Our Expert Medical Team of <br /> Dedicated Specialists
          </h2>

          <div className={styles.doctorGrids}>

            <div className={styles.doctorGrid1}>
              <img src="doctor-1.png" alt=""  style={{ width: "100%" }}/>
              <h4 className={styles.doctorName}>Dr. Mary Alen</h4>
              <p className={styles.doctorSpeciality}>Dermatologist</p>
            </div>

            <div className={styles.doctorGrid2}>
              <img src="doctor-2.png" alt="" style={{ width: "100%" }} />
              <h4 className={styles.doctorName}>Dr. Pearson  Jack </h4>
              <p className={styles.doctorSpeciality}>Dermatologist</p>
            </div>
            
            <div className={styles.doctorGrid3}>
              <img src="doctor-3.png" alt="" style={{ width: "100%" }} />
              <h4 className={styles.doctorName}>Dr. Ally Hanson</h4>
              <p className={styles.doctorSpeciality}>Dermatologist</p>
            </div>

            <div className={styles.doctorGrid4}>
              <img src="doctor-4.png" alt="" style={{ width: "100%" }} />
              <h4 className={styles.doctorName}>Dr. Michael James</h4>
              <p className={styles.doctorSpeciality}>Dermatologist</p>
            </div>
          </div>
        </section>

      </main>

      <footer>
        <div className={styles.footerContent}>

          <div className={styles.leftFooterSection}>
            <img src="logo.png" alt="Logo" />
            <h5>Subscribe Now</h5>
            <i className="fa-solid fa-envelope"></i>
            <input type="text" className={styles.inputMailField} placeholder="Enter your email here" />

            <div className={styles.footerContactInfo}>
              <p>Tel: 021 12345678</p>
              <p>Mail: Nailysis@gmail.com</p>
            </div>
          </div>

          <div className={styles.centerFooterSection}>
            <h4>Menu</h4>

            <div className={styles.footerMenuItems}>
              <p>Book An Appointment</p>
              <p>About</p>
              <p>Contact</p>
              <p>Policy</p>
            </div>
          </div>

          <div className={styles.rightFooterSection}>
            <h4>Socials</h4>

            <div className={styles.footerSocialItems}>
              <p><i class='bx bxl-facebook-square' style={{ color: "#3B5998" }}  ></i> <span>Facebook</span> </p>
              <p><i class='bx bxl-twitter' style={{ color: "#24A4F2" }} ></i> <span>Twitter</span> </p>
              <p><i class='bx bxl-instagram-alt' style={{ color: "#FE0895" }} ></i> <span>Instagram</span></p>
            </div>
          </div>

        </div>

      </footer>
      
      <div className={styles.copyrightSection}>
        © 2025 Nailysis. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
