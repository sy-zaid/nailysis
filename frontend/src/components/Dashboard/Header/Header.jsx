import React from "react";
import styles from "./Header.module.css";

const Header = ({subHeading, mainHeading}) => {
  return (
    <div className={styles.header}>
      <h1>{mainHeading}</h1>
      <p>{subHeading}</p>
    </div>
  );
};

export default Header;
