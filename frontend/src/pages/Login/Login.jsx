import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const login = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.picture}>
        <img src="/pic.png" alt="illustration" />
      </div>
      <div className={styles.form}>
        <section className={styles.main}>
          <h2>Welcome Back!</h2>
          <form>
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <h5 className={styles.forgotPassword}>Forgot Password?</h5>
            <button
              onClick={() => navigate("/dashboard")}
              type="submit"
              className={styles.loginButton}
              required
            >
              Login
            </button>
          </form>
          <p>or</p>
          <div className={styles.socialLogin}>
            <button className={`${styles.socialButton} ${styles.googleButton}`}>
              <img
                src="/google.png"
                alt="Google"
                className={styles.socialIcon}
              />
              Continue With Google
            </button>
            <button
              className={`${styles.socialButton} ${styles.facebookButton}`}
            >
              <img
                src="/facebook.png"
                alt="Facebook"
                className={styles.socialIcon}
              />
              Continue With Facebook
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default login;
