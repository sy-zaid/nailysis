import React from "react";
import styles from "./Picture.module.css";

function Picture() {
  return (
    <div className={styles.picture}>
      <img src="pic.png" alt="Illustration" />
    </div>
  );
}

export default Picture;
