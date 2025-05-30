import React from "react";

import LoginForm from "../components/Form/LoginForm";
import Picture from "../components/Picture/Picture";
import styles from "../components/Form/Form.module.css";

const Login = ({ LoginEndpoint = "/token" }) => {
  console.log("API ADDRESS", import.meta.env.VITE_API_URL);
  return (
    <div className={styles.container}>
      <Picture />
      <LoginForm route={LoginEndpoint} />
    </div>
  );
};

export default Login;
