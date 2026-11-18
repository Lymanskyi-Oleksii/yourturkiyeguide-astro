// robots.txt генерується при збиранні, щоб адреса sitemap бралася з `site` в astro.config.mjs
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
    const body = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${new URL('/sitemap.xml', site).href}`,
        '',
    ].join('\n');
    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
