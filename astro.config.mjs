import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mountain.fcuemba.org/',
  base: process.env.SITE_BASE ?? '/',
  output: 'static',
  integrations: [sitemap()],
});
