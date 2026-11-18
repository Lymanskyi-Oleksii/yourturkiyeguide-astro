// Генерує зменшені копії фото (пункти 3.1 і 3.4 плану)
//   thumbs/ — 240 px завширшки, мініатюри галерей (для всіх фото в папках турів)
//   medium/ — 800 px завширшки, картки й карусель маршруту
//             (лише для фото, на які є посилання в src/)
// Запускається автоматично перед `npm run build` (скрипт prebuild).
// Вручну: node scripts/make-image-variants.mjs
// Готові файли повторно не генеруються, якщо оригінал не змінився.
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';
import sharp from 'sharp';

const PUBLIC = 'public';
const IMG_ROOT = join(PUBLIC, 'assets', 'img');
const IMAGE_RE = /\.(webp|jpe?g|png)$/i;
// Іконки маленькі, зменшувати їх не треба
const SKIP_FOLDERS = new Set(['icon']);
const VARIANT_DIRS = new Set(['thumbs', 'medium']);

// На Windows sharp тримає файл відкритим, тому працюємо з буфером
sharp.cache(false);

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

// Шлях варіанта: /assets/img/hello/1.webp → /assets/img/hello/thumbs/1.webp
function variantPath(file, kind) {
  return join(dirname(file), kind, file.slice(dirname(file).length + 1));
}

async function makeVariant(src, kind, width) {
  const out = variantPath(src, kind);
  if ((await mtime(out)) >= (await mtime(src))) return false;

  const input = await readFile(src);
  const buffer = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 75, force: false })
    .jpeg({ quality: 75, mozjpeg: true, force: false })
    .png({ force: false })
    .toBuffer();

  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buffer);
  return true;
}

// Усі фото в папках турів: public/assets/img/<папка>/<файл>
async function galleryImages() {
  const result = [];
  for (const entry of await readdir(IMG_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || SKIP_FOLDERS.has(entry.name) || VARIANT_DIRS.has(entry.name)) continue;
    const folder = join(IMG_ROOT, entry.name);
    for (const file of await readdir(folder, { withFileTypes: true })) {
      if (file.isFile() && IMAGE_RE.test(file.name)) result.push(join(folder, file.name));
    }
  }
  return result;
}

// Фото, на які є прямі посилання в src/ (картки, карусель, портрет)
async function referencedImages() {
  const found = new Set();
  for (const name of await readdir('src', { recursive: true })) {
    if (!/\.(astro|ts|js|json|md)$/i.test(name)) continue;
    const text = await readFile(join('src', name), 'utf8');
    for (const [url] of text.matchAll(/\/assets\/img\/[\w\-./]+?\.(?:webp|jpe?g|png)/gi)) {
      const parts = url.split('/');
      if (parts.some((p) => VARIANT_DIRS.has(p) || SKIP_FOLDERS.has(p))) continue;
      found.add(join(PUBLIC, ...posix.normalize(url).split('/').filter(Boolean)));
    }
  }
  const existing = [];
  for (const file of found) {
    if (await mtime(file)) existing.push(file);
    else console.warn(`Не знайдено файл: ${file}`);
  }
  return existing;
}

let created = 0;
for (const file of await galleryImages()) {
  if (await makeVariant(file, 'thumbs', 240)) created++;
}
for (const file of await referencedImages()) {
  if (await makeVariant(file, 'medium', 800)) created++;
}
console.log(`Зменшені копії фото: створено ${created}, решта вже актуальні`);
