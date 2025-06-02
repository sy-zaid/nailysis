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

  // Patient-specific fields
  const [date_of_birth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [emergency_contact, setEmergencyContact] = useState("");

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

    // Patient-specific validations
    if (!date_of_birth) {
      toast.warning("Date of birth is required.");
      setLoading(false);
      return;
    }

    if (!gender) {
      toast.warning("Gender is required.");
      setLoading(false);
      return;
    }

    if (!address.trim()) {
      toast.warning("Address is required.");
      setLoading(false);
      return;
    }

    if (!emergency_contact.trim()) {
      toast.warning("Emergency contact is required.");
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
      return toast.warning("Enter a valid phone number. 03001234567");
    }

    // Emergency contact validation
    if (!phoneRegex.test(emergency_contact)) {
      return toast.warning(
        "Enter a valid emergency contact number. 03001234567"
      );
    }

    if (password.length < 8) {
      return toast.warning("Password must be at least 8 characters long.");
    }

    // Debugging: Log form data
    console.log({
      first_name,
      last_name,
      email,
      password,
      phone,
      role,
      date_of_birth,
      gender,
      address,
      emergency_contact,
    });

    try {
      const response = await api.post(route, {
        first_name,
        last_name,
        email,
        password,
        confirmPassword,
        phone,
        role,
        date_of_birth,
        gender,
        address,
        emergency_contact,
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
        toast.error("Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form}>
      <section className={`${styles.main} ${styles.scrollablediv}`}>
        <h2>Create Your Account</h2>
        <form className="form-container" role="form" onSubmit={handleSubmit}>
          <div className={styles.inputRow}>
            <div className={`${styles.inputGroup} ${styles.halfWidth}`}>
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
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
                id="last_name"
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

          {/* Patient-specific fields */}
          <div className={styles.inputGroup}>
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              value={date_of_birth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          {/* Gender Radio Buttons */}
          <div className={styles.inputGroup}>
            <label>Gender</label>
            <div className={styles.radioGroup}>
              <label htmlFor="male">
                <input
                  id="male"
                  type="radio"
                  name="gender"
                  value="M"
                  checked={gender === "M"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Male
              </label>
              <label htmlFor="female">
                <input
                  id="female"
                  type="radio"
                  name="gender"
                  value="F"
                  checked={gender === "F"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Female
              </label>
              <label htmlFor="other">
                <input
                  id="other"
                  type="radio"
                  name="gender"
                  value="O"
                  checked={gender === "O"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Other
              </label>
              <label htmlFor="preferNotToSay">
                <input
                  id="preferNotToSay"
                  type="radio"
                  name="gender"
                  value="P"
                  checked={gender === "P"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                Prefer Not to Say
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              required
              style={{
                all: "unset",
                display: "block",
                width: "98%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem",
                lineHeight: "1.5",
                backgroundColor: "#fff",
                color: "#000",
                overflowY: "none",
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="emergency_contact">Emergency Contact</label>
            <input
              type="tel"
              id="emergency_contact"
              value={emergency_contact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Enter emergency contact number"
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
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "16px" }}
          >
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
            <button
              type="button"
              className={styles.registerButton}
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Login
            </button>
          </div>
        </form>
        {/* <p>or</p>
        <SocialLogin /> */}
      </section>
    </div>
  );
}

export default RegisterForm;