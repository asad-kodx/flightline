import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ionicframework.controltechionic546641',
  appName: 'Flightline',
  webDir: 'www',
  ios: {
    // ... additional configuration
    handleApplicationNotifications: false
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: false
    },
    SplashScreen: {
      launchShowDuration: 13000,
      launchAutoHide: true,
      backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      showSpinner: false
    }
  }
};

export default config;
