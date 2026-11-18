// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Адреса сайту — єдине місце, звідки її беруть canonical, og:url, og:image,
  // sitemap.xml і robots.txt (пункт 5.1 плану). Змінився домен — міняй тут.
  site: 'https://yourturkiyeguide-astro.vercel.app',

  // Тексти турів (src/content/tours/*.md) виводяться як написані: без автозаміни
  // лапок, тире й трикрапок, яку Markdown робить за замовчуванням
  markdown: {
    smartypants: false,
  },

  // Старі адреси розділів (пункт 6.6) — щоб збережені посилання й закладки не вели на 404
  redirects: {
    '/excursions/excursions': '/excursions',
    '/services/services': '/services',
  },

  vite: {
    build: {
      // Браузери, під які мініфікується CSS. Без цього мініфікатор прибирав
      // -webkit-backdrop-filter, і в Safari до 18 (iOS 17 і старіші) зникало
      // розмиття під шапкою та картками.
      cssTarget: ['chrome100', 'edge100', 'firefox100', 'safari15', 'ios15'],
    },
  },
});
