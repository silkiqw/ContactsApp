import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.contactsapp',
  appName: 'Kontakte-App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Contacts: {
      permissions: {
        contacts: 'granted'
      }
    }
  }
};

export default config;