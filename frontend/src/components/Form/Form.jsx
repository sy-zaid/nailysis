import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();

      try {
          const res = await api.post(route, { username, password })
          if (method === "login") {
              localStorage.setItem(ACCESS_TOKEN, res.data.access);
              localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
              navigate("/")
          } else {
              navigate("/login")
          }
      } catch (error) {
          alert(error)
      } finally {
          setLoading(false)
      }
  };
  
  return (
    <div className={styles.form}>
      <section className={styles.main}>
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} className="form-container">
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
            <label htmlFor="email">Username</label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {/* <button
            onClick={(e) => {
              e.preventDefault(); // Prevent default form submission
              navigate("Login");
            }}
            type="submit"
            className={styles.submitButton}
          >
            Register
          </button> */}

          <button type="submit" className={styles.submitButton}>
                {name}
          </button>
        </form>
        <p>or</p>
        <SocialLogin />
      </section>
    </div>
  );
}

export default Form;
