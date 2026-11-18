// Карта сайту без додаткових залежностей: список сторінок береться
// з файлів у src/pages і з колекції турів, тож нова сторінка потрапить у sitemap автоматично.
import type { APIRoute } from 'astro';
import { canonicalUrl } from '../lib/urls';
import { getTours, tourHref } from '../data/tours';

// Ключі виду './excursions/group.astro'
const pageFiles = Object.keys(import.meta.glob('./**/*.astro'));

function toPath(file: string): string {
    const path = file
        .replace(/^\./, '')
        .replace(/\.astro$/, '')
        .replace(/\/index$/, '/');
    return path === '' ? '/' : path;
}

export const GET: APIRoute = async ({ site }) => {
    // Сторінки турів будуються з одного шаблону [section]/[slug].astro — беремо їх з колекції
    const tourPaths = (await getTours()).map(tourHref);
    const urls = pageFiles
        // 404 і сам шаблон [section]/[slug] окремими адресами не потрапляють
        .filter((file) => !file.endsWith('/404.astro') && !file.includes('['))
        .map(toPath)
        .concat(tourPaths)
        .sort()
        .map((path) => `  <url><loc>${canonicalUrl(path, site)}</loc></url>`);

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
    ].join('\n');
    return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
