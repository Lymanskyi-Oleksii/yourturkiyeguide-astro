// Шляхи до зменшених копій фото, які генерує scripts/make-image-variants.mjs
//   thumbs — 240 px завширшки (мініатюри галерей)
//   medium — 800 px завширшки (картки, карусель маршруту, портрети)
export type ImageVariant = 'thumbs' | 'medium';

// /assets/img/hello/1.webp → /assets/img/hello/thumbs/1.webp
// Зовнішні адреси та файли поза /assets/img/ повертаються без змін
export function imageVariant(src: string, kind: ImageVariant): string {
    if (!src.startsWith('/assets/img/') || src.includes('/icon/')) return src;
    const slash = src.lastIndexOf('/');
    return `${src.slice(0, slash)}/${kind}${src.slice(slash)}`;
}
