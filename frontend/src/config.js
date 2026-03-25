/**
 * Centralized API configuration.
 * 
 * The base URL is read from the VITE_API_URL environment variable,
 * which is set in .env.development (localhost) and .env.production (deployed).
 * 
 * Fallback to localhost:5000 if the env var is not defined.
 * 
 * NOTE: After changing .env files, you must restart the dev server
 * (npm run dev) for the changes to take effect.
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default BASE_URL;
