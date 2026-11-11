import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-init.js';
import { esc, normalizeReview } from './review-utils.js';

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
        const q = query(collection(db, 'reviews'), where('verified', '==', true));
        const snapshot = await getDocs(q);

        const reviews = [];
        snapshot.forEach((doc) => {
            // Дата обчислюється з timestamp, усі поля приводяться до безпечного вигляду
            reviews.push(normalizeReview(doc.data()));
        });

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