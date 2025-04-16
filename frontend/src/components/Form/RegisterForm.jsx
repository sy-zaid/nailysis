import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { toast } from "react-toastify";

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

    // ----- VALIDATIONS
    if (!first_name.trim()) {
      toast.warning("First name is required.");
      setLoading(false);
      return;
    }
  
    if (!last_name.trim()) {
      toast.warning("Last name is required.");
      setLoading(false);
      return;
    }
  
    if (!email.trim()) {
      toast.warning("Email is required.");
      setLoading(false);
      return;
    }
  
    if (!phone.trim()) {
      toast.warning("Phone number is required.");
      setLoading(false);
      return;
    }
  
    if (!password) {
      toast.warning("Password is required.");
      setLoading(false);
      return;
    }
  
    if (!confirmPassword) {
      toast.warning("Please confirm your password.");
      setLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Email regex pattern (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone number regex (only digits, 10 to 15 digits for flexibility)
    const phoneRegex = /^\d{10,15}$/;

    const nameRegex = /^[A-Za-z]+$/;

    if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
      toast.warning("Names should only contain letters");
      return;
    }

    // Email validation
    if (!emailRegex.test(email)) {
      return toast.warning("Enter a valid email address. name@example.com");
    }

    // Phone validation
    if (!phoneRegex.test(phone)) {
      return toast.warning("Enter a valid phone number. 0300-1234567");
    }

    if (password.length < 8) {
      return toast.warning("Password must be at least 8 characters long.");
    }


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
      toast.success("Registration Successful!", {
        className: "custom-toast",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.error || "User Already Exists", {
          className: "custom-toast",
        });
      } else {
        toast.error("Network Error")
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <section className={`${styles.main} ${styles.scrollablediv}`}>
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
