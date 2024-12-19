import React from "react";

import LoginForm from "../components/Form/LoginForm";
import Picture from "../components/Picture/Picture";


const Login = ({ LoginEndpoint = "/api/token/" }) => {
  return (
    <div >
      <Picture />
      <LoginForm route={LoginEndpoint} />
    </div>
  );
};

export default Login;
