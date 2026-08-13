import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mountain.fcuemba.org/',
  output: 'static',
  integrations: [sitemap()],
});
