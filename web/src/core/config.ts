/**
 * Application configuration
 */

export const config = {
  // Cloud Functions URL
  // Local: http://localhost:5001/<project-id>/us-central1
  // Production: https://us-central1-<project-id>.cloudfunctions.net
  apiUrl: import.meta.env.VITE_FUNCTIONS_URL || 'http://localhost:5001',
  appName: import.meta.env.VITE_APP_NAME || 'Enterprise App',
} as const;
