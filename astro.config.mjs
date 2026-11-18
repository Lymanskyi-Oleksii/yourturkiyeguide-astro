// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Адреса сайту — єдине місце, звідки її беруть canonical, og:url, og:image,
  // sitemap.xml і robots.txt (пункт 5.1 плану). Змінився домен — міняй тут.
  site: 'https://yourturkiyeguide-astro.vercel.app',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
