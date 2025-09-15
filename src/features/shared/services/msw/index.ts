import { worker } from "./browser";

// Initialize MSW
export const initializeMSW = async () => {
  // we need MSW in production too since there's no real backend provided
  try {
    await worker.start({
      onUnhandledRequest: "warn",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });

    console.log("🚀 MSW started successfully");
    console.log("📡 API endpoints are now mocked");

    if (import.meta.env.PROD) {
      console.log(
        "ℹ️ Running in production mode with MSW"
      );
    }
  } catch (error) {
    console.error("❌ Failed to start MSW:", error);
  }
};

// Export handlers for potential use in tests
export { handlers } from "./handlers";
