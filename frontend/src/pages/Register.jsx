import React from "react";

import RegisterForm from "../components/Form/RegisterForm";
import Picture from "../components/Picture/Picture";
import styles from "../components/Container/Container.module.css";

const Register = ({ registrationEndpoint = "/api/user/register/" }) => {
  return (
    <div className={styles.container}>
      <Picture />
      <RegisterForm route={registrationEndpoint} />
    </div>
  );
};

export default Register;
