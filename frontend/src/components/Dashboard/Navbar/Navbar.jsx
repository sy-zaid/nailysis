import React from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";


const Navbar = () => {

  const navigate = useNavigate();


  const handleScanNailsClick = () => {
    navigate("/upload-image"); 
  };

  return (
    <nav className={styles.container}>
      
      <span className={styles.search}>
        <h5>Search...</h5>
        <img src="icon-search-black.png" alt="search icon" />
      </span>
      <div className={styles.navSide}>
        <button onClick={handleScanNailsClick}>
          {/* <img src="nail.png" alt="nail icon" /> */}
          <h5>Scan Nails</h5>
        </button>
        <div>
          <img src="icon-bell-black.png" alt="notification button" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
