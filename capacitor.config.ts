
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.407c2fef046743aaa79ac724c3353819',
  appName: 'particle-dance-symbiosis',
  webDir: 'dist',
  server: {
    url: 'https://407c2fef-0467-43aa-a79a-c724c3353819.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      signingType: null,
    }
  }
};

export default config;
