import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Form from "../components/Form/Form";


const Login = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.picture}>
          <img src="/pic.png" alt="illustration" />
        </div>
        <div className={styles.form}>
          <section className={styles.main}>
            <h2>Welcome Back!</h2>
            <form route="/api/token/" method="login">
              <div className={styles.inputGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="username"
                  id="username"
                  placeholder="Enter your username"
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
              {/* <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
                type="submit"
                className={styles.loginButton}
              >
                Login
              </button> */}
            </form>
            <p>or</p>
            <div className={styles.socialLogin}>
              <button
                className={`${styles.socialButton} ${styles.googleButton}`}
              >
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
    </div>
  );
};

export default Login;
