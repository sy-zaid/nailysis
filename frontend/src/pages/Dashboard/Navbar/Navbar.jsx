import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <img src="menu.png" alt="menu button" />
      <span className={styles.search}>
        <h5>Search...</h5>
        <img src="search.png" alt="search icon" />
      </span>
      <div className={styles.navSide}>
        <button>
          {/* <img src="nail.png" alt="nail icon" /> */}
          <h5>Scan Nails</h5>
        </button>
        <div>
          <img src="bell.png" alt="notification button" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
