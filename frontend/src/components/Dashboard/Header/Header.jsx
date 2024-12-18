import React from "react";
import styles from "./Header.module.css";

const Header = ({curUserRole}) => {
  return (
    <div className={styles.header}>
      <h1>Welcome, Dr.Jhon!</h1>
      <p>Here is your {curUserRole}</p>
    </div>
  );
};

export default Header;
