import React from "react";
import styles from "./Cards.module.css";

function Card({ icon, title, value, description, trend, isHighlighted }) {
  return (
    <div
      className={`${styles.card} ${
        isHighlighted ? styles.highlighted : ""
      }`}
    >
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>
          {value}{" "}
          <span
            className={
              trend > 0 ? styles.positiveTrend : styles.negativeTrend
            }
          >
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        </p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default Card;
