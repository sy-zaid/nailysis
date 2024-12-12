import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>Welcome, Dr.Jhon!</h1>
      <p>Here is your patient dashboard</p>
    </div>
  );
};

export default Header;
