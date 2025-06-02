import React from "react";
import styles from "../components/Form/Form.module.css"
import RegisterForm from "../components/Form/RegisterForm";
import Picture from "../components/Picture/Picture";

const Register = ({ registrationEndpoint = "user/register/" }) => {
  return (
    <div className={styles.container}>
      <Picture />
      <RegisterForm route={registrationEndpoint} />
    </div>
  );
};

export default Register;
