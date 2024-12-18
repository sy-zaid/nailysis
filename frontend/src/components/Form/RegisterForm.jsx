import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function RegisterForm({ route }) {
  const [first_name, setFirstname] = useState("");
  const [last_name, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("patient");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Debugging: Log form data
    console.log({ first_name, last_name, email, password, phone, role });
    
    // Basic password confirmation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(route, {
        first_name,
        last_name,
        email,
        password,
        confirmPassword,
        phone,
        role,
      });
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      alert("Registration failed!" + error.message);
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
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first-name"
                value={first_name}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last-name"
                value={last_name}
                onChange={(e) => setLastname(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          {/* <div className={styles.inputGroup}>
            <label htmlFor="user-role">User Role</label>
            <select
              id="user-role"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="system_admin">System Admin</option>
              <option value="clinic_admin">Clinic Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="lab_manager">Lab Manager</option>
              <option value="lab_technician">Lab Technician</option>
            </select>
          </div> */}

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
        <p>or</p>
        <SocialLogin />
      </section>
    </div>
  );
}

export default RegisterForm;
