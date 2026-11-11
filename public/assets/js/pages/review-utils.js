// Спільні утиліти для виводу відгуків (reviews.js і home-reviews.js)

// Екранує будь-яке значення для безпечної вставки в HTML
export function esc(value) {
  const div = document.createElement('div');
  div.textContent = String(value ?? '');
  return div.innerHTML;
}

// Приводить сирий документ Firestore до безпечного вигляду
export function normalizeReview(raw) {
  const name = String(raw.name ?? '').trim() || 'Гость';
  const ts = raw.timestamp?.toDate?.();
  return {
    name,
    initial: name.charAt(0).toUpperCase(),
    text: String(raw.text ?? ''),
    rating: Math.min(5, Math.max(0, Number(raw.rating) || 0)),
    category: String(raw.category ?? 'general'),
    date: ts ? ts.toLocaleDateString('ru-RU') : '',
    time: ts ? ts.getTime() : 0,
  };
}