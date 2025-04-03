// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    client: './dist/client',
    server: './dist/server',
    serverEntry: 'entry.mjs'
  },
  vite: {
    build: {
      cssCodeSplit: false
    }
  }
});