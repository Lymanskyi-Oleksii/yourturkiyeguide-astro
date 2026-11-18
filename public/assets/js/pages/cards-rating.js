import { getVerifiedReviews } from './reviews-data.js';

async function loadCardRatings() {
  const cards = document.querySelectorAll('.card-rating');
  if (cards.length === 0) return;

  let reviews;
  try {
    // Один запит на всі картки замість окремого на кожну
    reviews = await getVerifiedReviews();
  } catch (error) {
    console.error('Ошибка загрузки рейтингов:', error);
    return;
  }

  // Групуємо оцінки за категорією
  const byCategory = new Map();
  for (const review of reviews) {
    const list = byCategory.get(review.category) || [];
    list.push(review.rating);
    byCategory.set(review.category, list);
  }

  for (const card of cards) {
    const ratings = byCategory.get(card.dataset.category);

    if (!ratings || ratings.length === 0) {
      // Додаємо клас для новинки
      card.classList.add('is-new');
      card.textContent = 'Новинка';
      continue;
    }

    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    const avg = (total / ratings.length).toFixed(1);
    const starsCount = Math.round(avg);

    card.innerHTML = `
      <span class="stars">${'★'.repeat(starsCount)}${'☆'.repeat(5 - starsCount)}</span>
      <span class="rating-text">${avg}</span>
    `;
  }
}

// Модуль виконується відкладено, тож DOM може бути вже готовий
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCardRatings);
} else {
  loadCardRatings();
}
