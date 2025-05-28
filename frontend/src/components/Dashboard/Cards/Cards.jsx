import React, { useEffect, useState } from "react";
import styles from "./Cards.module.css";

const Cards = ({ heading, count, percentage, text }) => {
  const isPrimaryCard = heading === "Patients"; // You can change logic as needed
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(count);
    if (start === end) return;

    let incrementTime = 20;
    let step = Math.ceil(end / 50); // Speed of counting

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplayedCount(end.toLocaleString());
        clearInterval(timer);
      } else {
        setDisplayedCount(start.toLocaleString());
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [count]);

  const cardStyle = {
    backgroundColor: isPrimaryCard ? "#0067ff" : "#ffffff",
    color: isPrimaryCard ? "#ffffff" : "#000000",
  };

  const percentStyle = {
    backgroundColor: isPrimaryCard ? "#ffffff" : "#0067ff",
  };

  const percentColor = {
    color: isPrimaryCard ? "#000000" : "#ffffff",
  };

  return (
    <div className={styles.contain} style={cardStyle}>
      <div className={styles.head}>
        <div className={styles.imgDiv}>
          <img src="icon-stocks-black.png" alt="icon" />
        </div>
        <h2 className={styles.title}>{heading}</h2>
      </div>

      <div className={styles.main}>
        <h1 className={styles.count}>{displayedCount}</h1>
        <div className={styles.percent} style={percentStyle}>
          <h3 style={percentColor}>+{percentage}%</h3>
        </div>
      </div>

      <div className={styles.foot}>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Cards;
