import React from "react";
import styles from "./SignupButton.module.css";

function SignupButton({ text, onClick }) {
  return (
    <button type="button" className={styles.signupButton} onClick={onClick}>
      {text}
    </button>
  );
}

export default SignupButton;
