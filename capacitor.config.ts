import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.daytimeblues.fuyuki',
  appName: 'Fuyuki Warlock Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Haptics: {
      enabled: true,
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
    },
  },
  android: {
    backgroundColor: '#000000',
  },
};

export default config;
