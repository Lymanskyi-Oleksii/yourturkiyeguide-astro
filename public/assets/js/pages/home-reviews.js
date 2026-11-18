import { esc } from './review-utils.js';
import { getVerifiedReviews } from './reviews-data.js';

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="reviews-star ${i <= rating ? 'active' : ''}" style="cursor:default;">★</span>`;
    }
    return stars;
}

export async function renderTopReviews(containerId, categoryTours, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // Спільний запит із cards-rating.js: колекція читається один раз на сторінку
        // Копія масиву, щоб сортування не змінювало спільний кеш
        const reviews = [...await getVerifiedReviews()];

        reviews.sort((a, b) => b.rating - a.rating || b.time - a.time);
        const top = reviews.slice(0, count);

        if (top.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = top.map((review) => {
            const tour = categoryTours[review.category];
            return `
        <div class="reviews-card">
          <div class="reviews-header">
            <div class="reviews-reviewer-info">
              <div class="reviews-reviewer-avatar">${esc(review.initial)}</div>
              <div class="reviews-reviewer-details">
                <h4>${esc(review.name)}</h4>
                <div class="reviews-date">${esc(review.date)}</div>
              </div>
            </div>
            <div class="reviews-meta">
              <div class="reviews-rating">${renderStars(review.rating)}</div>
              ${tour ? `<a href="${tour.href}" class="reviews-category-badge">${esc(tour.title)}</a>` : ''}
            </div>
          </div>
          <div class="reviews-text">${esc(review.text)}</div>
        </div>
      `;
        }).join('');
    } catch (error) {
        console.error('Ошибка загрузки отзывов для главной:', error);
    }
}