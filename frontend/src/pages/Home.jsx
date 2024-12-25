import React from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/Login");
  };

  const handleRegister = () => {
    navigate("/Register");
  };

  return (
    <div className={styles.container}>
      <div>
        <img src="logo.png" alt="Logo" />
      </div>
      <div className={styles.button}>
        <button onClick={handleLogin}>Proceed to login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Home;
