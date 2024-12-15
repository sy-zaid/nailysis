import React from "react";
import Picture from "../Picture/Picture";
import Form from "../Form/Form";
import styles from "./Container.module.css";

function Container() {
  return (
    <div className={styles.container}>
      <Picture />
      <Form route="/api/user/register/" method="register"/>
    </div>
  );
}

export default Container;
