// Карта сайту без додаткових залежностей: список сторінок береться
// з файлів у src/pages, тож нова сторінка потрапить у sitemap автоматично.
import type { APIRoute } from 'astro';
import { canonicalUrl } from '../lib/urls';

// Ключі виду './excursions/group.astro'
const pageFiles = Object.keys(import.meta.glob('./**/*.astro'));

function toPath(file: string): string {
    const path = file
        .replace(/^\./, '')
        .replace(/\.astro$/, '')
        .replace(/\/index$/, '/');
    return path === '' ? '/' : path;
}

export const GET: APIRoute = ({ site }) => {
    const urls = pageFiles
        // 404 і динамічні маршрути ([slug]) у карту сайту не потрапляють
        .filter((file) => !file.endsWith('/404.astro') && !file.includes('['))
        .map(toPath)
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
