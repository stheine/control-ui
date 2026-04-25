import {defineConfig} from 'vite';
import fqdn           from 'fqdn-multi';
import react          from '@vitejs/plugin-react';

import appConfig      from './config.js';

const {
  scheme,
  serverPort,
} = appConfig;
const hostName = await fqdn();

const port = serverPort + 1;

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    host:         '0.0.0.0',
    port,
    strictPort:   true,
  },
  assetsInclude: ['**/*.md'],
  root: 'src',
  build: {
    outDir:      '../dist',
    // minify:      'terser',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~/node_modules/': '/node_modules/',
      // '@swinfra/react-components-2/': '/users/jhaeckerbeck/github/react-components-2/',
    },
  },
  optimizeDeps: {
    // include: ['/users/jhaeckerbeck/github/*'],
  },
});
