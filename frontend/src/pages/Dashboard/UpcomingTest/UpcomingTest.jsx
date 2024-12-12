import React from "react";
import styles from "./UpcomingTest.module.css";

const UpcomingTest = () => {
  return (
    <div className={styles.contain}>
      <div className={styles.heading}>
        <div className={styles.blue}></div>
        <h4>Upcoming Tests</h4>
      </div>
      <div className={styles.box}>
        <div className={styles.boxHeading}>
          <div className={styles.calendar}>
            <img src="calendar 2.png" alt="calendar icon" />
          </div>
          <div className={styles.topText}>
            <p>Next Checkup</p>
            <h5>Fri, 24 Mar</h5>
          </div>
          <div className={styles.dateNav}>
            <img src="left.png" alt="arrow left" />
            <p>20-March-24</p>
            <img src="right.png" alt="arrow right" />
          </div>

          <div className={styles.profile}>
            <img src="profiles.png" alt="profiles" />
          </div>

          <button className={styles.button}>
            Consult Now
            <img src="up.png" alt="up icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTest;
