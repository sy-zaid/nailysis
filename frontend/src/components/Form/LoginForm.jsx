import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

import styles from "./Form.module.css";

function LoginForm({ route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await api.post(route, { email, password });
      const { access, refresh } = response.data;

      const decodedToken = jwtDecode(access);
      const curUserRole = decodedToken.role || decodedToken.user_role || null;

      console.log(curUserRole);

      // Save tokens and role to localStorage
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
      localStorage.setItem("role", curUserRole);

      if (curUserRole == "system_admin") {
        navigate("/system-admin-dashboard");
      } else if (curUserRole == "clinic_admin") {
        navigate("/clinic-admin-dashboard");
      } else if (curUserRole == "doctor") {
        navigate("/doctor-dashboard");
      } else if (curUserRole == "patient") {
        navigate("/patient-dashboard");
      } else if (curUserRole == "lab_admin") {
        navigate("/lab-admin-dashboard");
      } else if (curUserRole == "lab_technician") {
        navigate("/lab-technician-dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <section className={styles.main}>
        <h2>Login to your account</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginForm;
