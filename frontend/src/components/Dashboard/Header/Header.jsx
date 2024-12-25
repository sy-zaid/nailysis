import React from "react";
import styles from "./Header.module.css";

const Header = ({curUserRole}) => {
  return (
    <div className={styles.header}>
      <h1>{curUserRole}</h1>
      <p>Here you can view and manage all the booked {curUserRole}</p>
    </div>
  );
};

export default Header;
