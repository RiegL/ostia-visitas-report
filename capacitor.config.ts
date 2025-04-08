
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ostia.visitas.report',
  appName: 'Ostia Visitas Report',
  webDir: 'dist',
  server: {
    url: 'https://1744b9b4-e596-4119-a259-33547dd416fa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
