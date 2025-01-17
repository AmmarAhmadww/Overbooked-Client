import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter for routing
import "./index.css";
import App from "./App"; // Import the main App component

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Router>  
      <App /> 
    </Router>
  </StrictMode>
);
