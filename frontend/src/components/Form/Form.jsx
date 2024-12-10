import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useNavigate } from "react-router-dom";

function Form() {
  const navigate = useNavigate();
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
                required
              />
            </div>
            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                id="last-name"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            onClick={() => navigate("login")}
            type="submit"
            className={styles.submitButton}
          >
            Sign Up
          </button>
        </form>
        <p>or</p>
        <SocialLogin />
      </section>
    </div>
  );
}

export default Form;
