import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-init.js';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
            const data = doc.data();
            reviews.push({
                ...data,
                timestampValue: data.timestamp && data.timestamp.toDate ? data.timestamp.toDate().getTime() : 0,
            });
        });

        reviews.sort((a, b) => b.rating - a.rating || b.timestampValue - a.timestampValue);
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
              <div class="reviews-reviewer-avatar">${review.name.charAt(0).toUpperCase()}</div>
              <div class="reviews-reviewer-details">
                <h4>${escapeHtml(review.name)}</h4>
                <div class="reviews-date">${review.date || ''}</div>
              </div>
            </div>
            <div class="reviews-meta">
              <div class="reviews-rating">${renderStars(review.rating)}</div>
              ${tour ? `<a href="${tour.href}" class="reviews-category-badge">${escapeHtml(tour.title)}</a>` : ''}
            </div>
          </div>
          <div class="reviews-text">${escapeHtml(review.text)}</div>
        </div>
      `;
        }).join('');
    } catch (error) {
        console.error('Ошибка загрузки отзывов для главной:', error);
    }
}