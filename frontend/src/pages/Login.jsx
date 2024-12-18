import React from "react";

import LoginForm from "../components/Form/LoginForm";
import Picture from "../components/Picture/Picture";
import styles from "../components/Container/Container.module.css";

const Login = ({ LoginEndpoint = "/api/token/" }) => {
  return (
    <div className={styles.container}>
      <Picture />
      <LoginForm route={LoginEndpoint} />
    </div>
  );
};

export default Login;
