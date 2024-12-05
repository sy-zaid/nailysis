import React from "react";
import styles from "./SocialLogin.module.css";

function SocialLogin() {
  return (
    <div className={styles.socialLogin}>
      <button className={`${styles.socialButton} ${styles.googleButton}`}>
        <img src="google.png" alt="Google" className={styles.socialIcon} />
        <span>Continue With Google</span>
      </button>
      <button className={`${styles.socialButton} ${styles.facebookButton}`}>
        <img src="facebook.png" alt="Facebook" className={styles.socialIcon} />
        <span>Continue With Facebook</span>
      </button>
    </div>
  );
}

export default SocialLogin;
