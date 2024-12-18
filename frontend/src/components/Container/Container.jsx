import React from "react";
import Picture from "../Picture/Picture";
import RegisterForm from "../Form/RegisterForm";
import styles from "./Container.module.css";

function Container({ registrationEndpoint = "/api/user/register/" }) {
  return (
    <div className={styles.container}>
      <Picture />
      <RegisterForm route={registrationEndpoint}/>
    </div>
  );
}


export default Container;
