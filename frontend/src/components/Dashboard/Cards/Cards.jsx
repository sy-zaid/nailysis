import React from "react";
import styles from "./Cards.module.css";

const Cards = (props) => {
  const isFirstCard = props.heading === "Patients";

  const cardStyle = {
    backgroundColor: isFirstCard ? "#0067ff" : "#ffffff",
    color: isFirstCard ? "#ffffff" : "#000000",
  };

  const percentStyle = {
    backgroundColor: isFirstCard ? "#ffffff" : "#0067ff",
  };

  const percentColor = {
    color: isFirstCard ? "#000000" : "#FFFFFF",
  };

  return (
    <div className={styles.contain} style={cardStyle}>
      <div className={styles.head}>
        <div className={styles.imgDiv}>
          <img src="icon-stocks-black.png" alt="stocks icon" />
        </div>
        <h2 className={styles.title}>{props.heading}</h2>
      </div>
      <div className={styles.main}>
        <h1 className={styles.count}>20,549</h1>
        <div className={styles.percent} style={percentStyle}>
          <h3>+15%</h3>
        </div>
      </div>
      <div className={styles.foot}>
        <p>
          Data obtained from the past 7 days from 5,768 patients to 15,981
          patients.
        </p>
      </div>
    </div>
  );
};

export default Cards;
