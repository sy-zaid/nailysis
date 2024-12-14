import React from "react";
import Container from "../components/Container/Container";
import Form from "../components/Form/Form";

const Signup = () => {
  return (
    <Container>
      <Form route="/api/user/signup" method="signup"/>
    </Container>
  );
};

export default Signup;
