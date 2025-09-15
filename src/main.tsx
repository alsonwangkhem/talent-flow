import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initializeMSW } from "./features/shared/services/msw";
import { dataPersistence } from "./features/shared/services/dataPersistence";

// Initialize MSW and data persistence
async function initializeApp() {
  try {
    // Initialize MSW 
    await initializeMSW();

    // Initialize data persistence (seeds IndexedDB if empty)
    await dataPersistence.initializeData();

    // Start the app after everything is initialized
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // Still render the app even if initialization fails
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

initializeApp();
