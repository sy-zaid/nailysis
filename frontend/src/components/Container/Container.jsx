import React from "react";
import Picture from "../Picture/Picture";
import Form from "../Form/Form";
import styles from "./Container.module.css";

function Container({ registrationEndpoint = "/api/user/register/" }) {
  return (
    <div className={styles.container}>
      <Picture />
      <Form route={registrationEndpoint} method="register"/>
    </div>
  );
}


export default Container;
