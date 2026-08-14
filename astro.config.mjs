import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fcumountain.eu.org/',
  base: process.env.SITE_BASE ?? '/',
  output: 'static',
  integrations: [sitemap()],
});
