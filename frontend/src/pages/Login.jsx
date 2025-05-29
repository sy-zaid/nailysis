import React from "react";

import LoginForm from "../components/Form/LoginForm";
import Picture from "../components/Picture/Picture";
import styles from "../components/Form/Form.module.css"

const Login = ({ LoginEndpoint = "api/token/" }) => {
  console.log("API URL is:", import.meta.env.VITE_API_URL);
  return (
    <div className={styles.container}>
      <Picture />
      <LoginForm route={LoginEndpoint} />
    </div>
  );
};

export default Login;
