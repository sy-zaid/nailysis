// Importing StrictMode from React to enable additional checks and warnings in development mode
import { StrictMode } from 'react';

// Importing the createRoot function to initialize React's root rendering API
import { createRoot } from 'react-dom/client';

// Importing the global CSS file for styling
import './index.css';

// Importing the main App component of the application
import App from './App.jsx';

// Creating a root container and rendering the React app
createRoot(document.getElementById('root')) // Locates the root div in the HTML
  .render(
    <StrictMode>
      {/* Wrapping the App component with StrictMode for enhanced checks */}
      <App />
    </StrictMode>,
  );
