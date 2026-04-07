/**
 * Mobile app configuration
 */

import Constants from 'expo-constants';

export const config = {
  // Cloud Functions URL
  // Local: http://localhost:5001/<project-id>/us-central1
  // Production: https://us-central1-<project-id>.cloudfunctions.net
  apiUrl: Constants.expoConfig?.extra?.functionsUrl || 'http://localhost:5001',
  appName: Constants.expoConfig?.name || 'Enterprise App',
} as const;
