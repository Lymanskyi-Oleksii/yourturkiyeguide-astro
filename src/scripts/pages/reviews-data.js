// Спільне джерело схвалених відгуків (пункт 3.5 плану)
// Читає колекцію один раз на сторінку і кілька хвилин тримає результат
// у sessionStorage, щоб при переходах між сторінками не читати базу знову.
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-init.js';
import { normalizeReview } from './review-utils.js';

const KEY = 'reviewsCache:v1';
const TTL = 5 * 60 * 1000;
let pending = null;

export function getVerifiedReviews() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY));
    if (cached && Date.now() - cached.at < TTL && Array.isArray(cached.items)) {
      return Promise.resolve(cached.items);
    }
  } catch { /* кеш недоступний — просто читаємо з бази */ }

  if (!pending) {
    pending = getDocs(query(collection(db, 'reviews'), where('verified', '==', true)))
      .then((snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...normalizeReview(d.data()) }));
        try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), items })); } catch { /* немає місця або заборонено */ }
        return items;
      })
      .catch((error) => {
        // Наступний виклик спробує ще раз
        pending = null;
        throw error;
      });
  }
  return pending;
}
