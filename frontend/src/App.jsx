import React from "react";
import Container from "./components/Container/Container";
import Form from "./components/Form/Form";
import LoginForm from "./components/pages/login"; // Ensure this path is correct
import "./App.css";

function App() {
  const renderPage = () => {
    // Get the current path
    const path = window.location.pathname;

    switch (path) {
      case "/components/pages/login":
        return <LoginForm />;
      case "/signup":
        return (
          <Container>
            <Form />
          </Container>
        );
      case "/":
      default:
        return (
          <Container>
            <Form />
          </Container>
        );
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
