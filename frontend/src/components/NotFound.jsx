import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h2>404 | Page not found</h2>
      <button onClick={() => navigate("/dashboard")}>Go to homepage</button>
    </div>
  );
};

export default NotFound;

// hello this is a comment
