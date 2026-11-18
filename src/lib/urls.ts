// Повна адреса сторінки для canonical і sitemap.
// Посилання на сайті пишуться без кінцевої скісної риски (/about, а не /about/),
// тож і канонічна адреса без неї — інакше пошуковик бачить дві різні адреси.
export function canonicalUrl(pathname: string, site: URL | undefined): string {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    return new URL(clean, site).href;
}
