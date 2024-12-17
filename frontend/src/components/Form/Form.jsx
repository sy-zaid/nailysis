import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function RegisterForm({ route }) {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(route, {
        first_name,
        last_name,
        email,
        password,
        role,
      });
      console.log(response.data);
    } catch (error) {
      alert("Registration failed successfully!");
    } finally {
      setLoading(false);
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
