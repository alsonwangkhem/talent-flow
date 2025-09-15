import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Setup MSW worker for browser (development environment)
export const worker = setupWorker(...handlers);
