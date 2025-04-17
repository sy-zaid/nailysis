import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { toast } from "react-toastify";

import styles from "./Form.module.css";

/**
 * LoginForm Component
 *
 * This component renders a login form that allows users to enter their email and password.
 * On successful login, it stores authentication tokens in localStorage and navigates the user
 * to the appropriate dashboard based on their role.
 *
 * @param {Object} props - Component props
 * @param {string} props.route - API endpoint for authentication
 *
 * @returns {JSX.Element} LoginForm component
 */
function LoginForm({ route }) {
  // State to manage email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Tracks form submission state

  const navigate = useNavigate();

  /**
   * Handles form submission.
   * Sends login request to the server, decodes the JWT token, stores tokens in localStorage,
   * and redirects the user to their respective dashboard.
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email && !password) {
      toast.error("Email & Password are required.");
      setLoading(false);
      return;
    }
    if (!email) {
      toast.error("Email is required.");
      setLoading(false);
      return;
    }
    if (!password) {
      toast.error("Password is required.");
      setLoading(false);
      return;
    }

    try {
      // API call to authenticate user
      const response = await api.post(route, { email, password });
      const { access, refresh } = response.data;

      // Decode access token to extract user role
      const decodedToken = jwtDecode(access);
      const curUserRole = decodedToken.role || decodedToken.user_role || null;

      console.log(curUserRole); // Debugging output

      // Store authentication tokens and role in localStorage
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
      localStorage.setItem("role", curUserRole);

      // Navigate to the respective dashboard based on user role
      switch (curUserRole) {
        case "system_admin":
          navigate("/system-admin-dashboard");
          break;
        case "clinic_admin":
          navigate("/clinic-admin");
          break;
        case "doctor":
          navigate("/doctor-dashboard");
          break;
        case "patient":
          navigate("/patient-dashboard");
          break;
        case "lab_admin":
          navigate("/lab-admin-dashboard");
          break;
        case "lab_technician":
          navigate("/lab-technician-dashboard");
          break;
        default:
          navigate("/login"); // Redirect to login on unknown role
          break;
      }
      toast.success("Login Successful!", {
        className: "custom-toast",
      });

    } catch (error) {
      console.error(error); // Display error message
      if (error.response && error.response.status === 401) {
        toast.error("Incorrect email or password.", {
          className: "custom-toast",
        });
      } else {
        toast.error ("Network Error");
      }
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginForm;
