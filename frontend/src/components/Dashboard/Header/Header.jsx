import React from "react";
import styles from "./Header.module.css";

const Header = ({curUserRole, genderPrefix}) => {
  return (
    <div className={styles.header}>
      <h1>Welcome, {genderPrefix} John!</h1>
      <p>Here is your {curUserRole}</p>
    </div>
  );
};

export default Header;
