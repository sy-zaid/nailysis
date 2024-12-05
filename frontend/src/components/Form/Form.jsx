import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import SignupButton from "../SignupButton/SignupButton";

function Form() {
  const handleSignup = () => {
    // alert("Signup button clicked!");
  };

  return (
    <div className={styles.form}>
      <section className={styles.main}>
        <h2>Create Your Account</h2>
        <form>
          <div className={styles.inputRow}>
            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
              <label htmlFor="first-name">First Name</label>
              <input
                type="text"
                id="first-name"
                placeholder="Enter your first name"
              />
            </div>
            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                id="last-name"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
            />
          </div>
          <SignupButton text="Sign Up" onClick={handleSignup} />
        </form>
        <p>or</p>
        <SocialLogin />
      </section>
    </div>
  );
}

export default Form;
