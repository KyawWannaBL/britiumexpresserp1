import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.britium.express', // Matches your screenshot
  appName: 'Britium Express',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;