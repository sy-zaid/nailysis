import React from "react";
import styles from "./SignupButton.module.css";

const SignupButton = ({ text }) => {
  return (
    <button type="button" className={styles.signupButton}>
      <a href="/components/pages/login">{text}</a>
    </button>
  );
};

export default SignupButton;
