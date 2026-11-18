// Одноразове зменшення оригіналів фото (пункт 3.2 плану)
// Запуск: node scripts/resize-images.mjs public/assets/img
// Перед запуском закомітьте поточний стан, щоб було куди повернутися.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.argv[2];
const MAX = 2560;

if (!root) {
  console.error('Вкажіть папку: node scripts/resize-images.mjs public/assets/img');
  process.exit(1);
}

// На Windows sharp тримає файл відкритим, тому працюємо з буфером
sharp.cache(false);

for (const name of await readdir(root, { recursive: true })) {
  if (!/\.(webp|jpe?g|png)$/i.test(name)) continue;
  // Згенеровані варіанти не чіпаємо
  if (/(^|[\/])(thumbs|medium)[\/]/.test(name)) continue;
  const file = join(root, name);
  const input = await readFile(file);
  const { width, height } = await sharp(input).metadata();
  if (Math.max(width, height) <= MAX) continue;

  // Оригінали вже стиснуті, тому записуємо результат лише якщо він легший
  let out = null;
  for (const quality of [80, 70]) {
    const candidate = await sharp(input)
      .rotate()                                      // врахувати орієнтацію з EXIF
      .resize({ width: MAX, height: MAX, fit: 'inside' })
      .webp({ quality, force: false })
      .jpeg({ quality, mozjpeg: true, force: false })
      .png({ force: false })
      .toBuffer();
    if (candidate.length < input.length) { out = candidate; break; }
  }

  if (!out) {
    console.log(`${name}: ${width}×${height} — пропущено, зменшений файл не легший`);
    continue;
  }
  await writeFile(file, out);
  console.log(`${name}: ${width}×${height} → не більше ${MAX} (${Math.round(input.length / 1024)} → ${Math.round(out.length / 1024)} КБ)`);
}
