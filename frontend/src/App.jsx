import React from "react";

// Importing the Container component from the components directory
import Container from "./components/Container/Container";

// Importing the Form component from the components directory
import Form from "./components/Form/Form";

// Importing the main CSS file for styling the app
import "./App.css";

// Defining the main App component
function App() {
  return (
    // Rendering the Container component as the outer wrapper
    <Container>
      {/* Rendering the Form component inside the Container */}
      <Form />
    </Container>
  );
}

// Exporting the App component as the default export
export default App;

