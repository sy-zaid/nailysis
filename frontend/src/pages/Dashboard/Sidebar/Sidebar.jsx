import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidePanel}>
      <button className={styles.sideButton1}>
        <img src="dashboard.png" alt="dashboard icon" />
      </button>
      <button className={styles.sideButton2}>
        <img src="board.png" alt="clipboard icon" />
      </button>
      <button className={styles.sideButton3}>
        <img src="appoint.png" alt="ticks icon" />
      </button>
      <button className={styles.sideButton4}>
        <img src="lab.png" alt="lab icon" />
      </button>
      <button className={styles.sideButton5}>
        <img src="calendar.png" alt="calendar icon" />
      </button>
      <button className={styles.sideButton6}>
        <img src="account.png" alt="account icon" />
      </button>
    </div>
  );
};

export default Sidebar;
