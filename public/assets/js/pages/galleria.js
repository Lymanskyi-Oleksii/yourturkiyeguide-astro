let currentIndex = 0;
let isFullscreen = false;
let userHasInteracted = false;
// Змінні для запобігання подвійних спрацювань
let preventClick = false;
let savedScrollY = 0;
let clickTimeout = null;

// Покращені мобільні змінні
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Покращена система свайпів
let swipeData = {
  startX: 0,
  startY: 0,
  startTime: 0,
  isSwiping: false,
  isDragging: false,
  minDistance: isMobile ? 25 : 50,
  maxTime: 1000,
  minVelocity: isMobile ? 0.2 : 0.3,
  debounceTime: 300,
  lastSwipeTime: 0
};

// Debounce функція
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Функція для запобігання подвійних кліків
function preventDoubleAction(callback, delay = 300) {
  return function(...args) {
    if (preventClick) return;

    preventClick = true;
    callback.apply(this, args);

    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      preventClick = false;
    }, delay);
  };
}

function createImageElement(src, alt = '', onLoad = null, onError = null) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.draggable = false;

  img.addEventListener('contextmenu', (e) => e.preventDefault());

  if (onLoad) {
    img.onload = onLoad;
  }

  if (onError) {
    img.onerror = onError;
  }

  return img;
}

function showError(message) {
  const errorElement = document.querySelector('.photo-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

function createThumbnails() {
  const container = document.querySelector('.photo-thumbnails');
  if (!container) return;

  container.innerHTML = '';

  gallerySlides.forEach((slide, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.className = `photo-thumbnail ${index === 0 ? 'active' : ''}`;
    thumbnail.setAttribute('data-index', index);

    // Створюємо захищену функцію зміни слайду
    const safeChangeSlide = preventDoubleAction((idx, elem) => {
      if (!swipeData.isDragging && !swipeData.isSwiping) {
        changeSlide(idx, elem);
      }
    });

    // Використовуємо тільки один тип події залежно від пристрою
    if (isMobile) {
      // На мобільних - тільки touch події
      let touchStartTime = 0;
      let hasMoved = false;

      thumbnail.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        touchStartTime = Date.now();
        hasMoved = false;
      }, { passive: true });

      thumbnail.addEventListener('touchmove', (e) => {
        hasMoved = true;
      }, { passive: true });

      thumbnail.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const touchDuration = Date.now() - touchStartTime;

        // Якщо це був короткий тап без руху
        if (!hasMoved && touchDuration < 500) {
          safeChangeSlide(index, thumbnail);
        }
      });
    } else {
      // На десктопі - тільки click
      thumbnail.addEventListener('click', (e) => {
        e.stopPropagation();
        safeChangeSlide(index, thumbnail);
      });
    }

    const img = createImageElement(
        slide.image,
        slide.title || `Зображення ${index + 1}`,
        () => {
          const placeholder = thumbnail.querySelector('.photo-thumbnail-placeholder');
          if (placeholder) {
            placeholder.remove();
          }
        },
        () => {
          const placeholder = document.createElement('div');
          placeholder.className = 'photo-thumbnail-placeholder';
          placeholder.innerHTML = `
            <span>❌</span>
            <span>Помилка</span>
          `;
          thumbnail.innerHTML = '';
          thumbnail.appendChild(placeholder);
        }
    );

    const placeholder = document.createElement('div');
    placeholder.className = 'photo-thumbnail-placeholder';
    placeholder.innerHTML = `
      <span>📷</span>
      <span>Завантаження...</span>
    `;

    thumbnail.appendChild(placeholder);
    thumbnail.appendChild(img);
    container.appendChild(thumbnail);
  });
}

function changeSlide(index, element) {
  if (index < 0 || index >= gallerySlides.length) return;

  const now = Date.now();
  if (now - swipeData.lastSwipeTime < swipeData.debounceTime) return;

  currentIndex = index;
  const slide = gallerySlides[index];
  const mainDisplay = document.querySelector('.main-photo-display');

  if (!mainDisplay) return;

  mainDisplay.innerHTML = `
    <div class="photo-placeholder">
      <span>📷</span>
      <span>Завантаження зображення...</span>
    </div>
  `;

  const img = createImageElement(
      slide.image,
      slide.title || `Зображення ${index + 1}`,
      () => {
        mainDisplay.innerHTML = '';
        mainDisplay.appendChild(img);

        // Додаємо обробник з захистом від подвійних кліків
        const safeOpenFullscreen = preventDoubleAction(() => {
          if (!swipeData.isDragging && !swipeData.isSwiping) {
            openFullscreen();
          }
        });

        img.addEventListener('click', safeOpenFullscreen);
      },
      () => {
        mainDisplay.innerHTML = `
          <div class="photo-placeholder">
            <span>❌</span>
            <span>Не вдалося завантажити зображення</span>
            <small style="margin-top: 10px; opacity: 0.7;">${slide.image}</small>
          </div>
        `;
        showError(`Не вдалося завантажити зображення: ${slide.title || 'Зображення ' + (index + 1)}`);
      }
  );

  // Оновлюємо активну мініатюру
  document.querySelectorAll('.photo-thumbnail').forEach(thumb => {
    thumb.classList.remove('active');
  });
  if (element) {
    element.classList.add('active');
  }

  // Оновлюємо лічильник та прогрес
  updateCounter();

  // Оновлюємо повноекранний режим якщо активний
  if (isFullscreen) {
    updateFullscreenContent();
  }

  // Прокручуємо до активної мініатюри на мобільних
  if (element && isMobile && userHasInteracted) {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }, 100);
  }

  swipeData.lastSwipeTime = now;
}

function updateCounter() {
  const counter = document.querySelector('.photo-counter');
  const progressBar = document.querySelector('.photo-progress');

  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${gallerySlides.length}`;
  }
  if (progressBar) {
    progressBar.style.width = `${((currentIndex + 1) / gallerySlides.length) * 100}%`;
  }
}

function nextSlide() {
  const nextIndex = (currentIndex + 1) % gallerySlides.length;
  const nextThumbnail = document.querySelectorAll('.photo-thumbnail')[nextIndex];
  changeSlide(nextIndex, nextThumbnail);
}

function prevSlide() {
  const prevIndex = (currentIndex - 1 + gallerySlides.length) % gallerySlides.length;
  const prevThumbnail = document.querySelectorAll('.photo-thumbnail')[prevIndex];
  changeSlide(prevIndex, prevThumbnail);
}

function openFullscreen() {
  const overlay = document.querySelector('.photo-fullscreen-overlay');
  if (!overlay) return;

  isFullscreen = true;

  savedScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';

  updateFullscreenContent();
  overlay.classList.add('active');

  const floatingBtn = document.querySelector('.floating-booking-btn');
  if (floatingBtn) floatingBtn.style.display = 'none';
}

function closeFullscreen() {
  const overlay = document.querySelector('.photo-fullscreen-overlay');
  if (!overlay) return;

  isFullscreen = false;

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, savedScrollY);

  overlay.classList.remove('active');

  const floatingBtn = document.querySelector('.floating-booking-btn');
  if (floatingBtn) floatingBtn.style.display = '';
}

function updateFullscreenContent() {
  const slide = gallerySlides[currentIndex];
  const fullscreenMain = document.querySelector('.photo-fullscreen-main');

  if (!fullscreenMain) return;

  fullscreenMain.innerHTML = `
    <div class="photo-placeholder">
      <span>📷</span>
      <span>Завантаження зображення...</span>
    </div>
  `;

  const img = createImageElement(
      slide.image,
      slide.title || `Зображення ${currentIndex + 1}`,
      () => {
        fullscreenMain.innerHTML = '';
        fullscreenMain.appendChild(img);
      },
      () => {
        fullscreenMain.innerHTML = `
          <div class="photo-placeholder">
            <span>❌</span>
            <span>Не вдалося завантажити зображення</span>
          </div>
        `;
      }
  );

  const fullscreenCounter = document.querySelector('.photo-fullscreen-counter');
  if (fullscreenCounter) {
    fullscreenCounter.textContent = `${currentIndex + 1} / ${gallerySlides.length}`;
  }
}

function navigateFullscreen(direction) {
  if (direction === 1) {
    nextSlide();
  } else {
    prevSlide();
  }
}

function resetGallery() {
  const firstThumbnail = document.querySelectorAll('.photo-thumbnail')[0];
  changeSlide(0, firstThumbnail);

  if (isFullscreen) {
    closeFullscreen();
  }
}

function handleSwipe(startX, startY, endX, endY, startTime, endTime) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const deltaTime = endTime - startTime;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const velocity = distance / deltaTime;

  // Перевірки валідності свайпу
  if (distance < swipeData.minDistance) return null;
  if (deltaTime > swipeData.maxTime) return null;
  if (velocity < swipeData.minVelocity) return null;

  // Реагуємо тільки на горизонтальний свайп — вертикальний лишаємо для звичайного скролу сторінки
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left';
  }

  return null;
}

// Функція додавання візуального фідбеку
function addSwipeFeedback(direction) {
  const gallery = document.querySelector('.vertical-display');
  if (gallery) {
    gallery.classList.add(`swipe-${direction}`);
    setTimeout(() => {
      gallery.classList.remove(`swipe-${direction}`);
    }, 200);
  }
}

// Обробка тач-подій для свайпів
function handleTouchStart(e) {
  // Ігноруємо свайпи по кнопках та мініатюрах
  if (e.target.closest('button') ||
      e.target.closest('.photo-close-button') ||
      e.target.closest('.photo-fullscreen-nav') ||
      e.target.closest('.photo-thumbnail')) {
    return;
  }

  const touch = e.touches[0];
  swipeData.startX = touch.clientX;
  swipeData.startY = touch.clientY;
  swipeData.startTime = Date.now();
  swipeData.isSwiping = true;
  swipeData.isDragging = false;
}

function handleTouchMove(e) {
  if (!swipeData.isSwiping) return;

  // Ігноруємо свайпи по кнопках та мініатюрах
  if (e.target.closest('button') ||
      e.target.closest('.photo-close-button') ||
      e.target.closest('.photo-fullscreen-nav') ||
      e.target.closest('.photo-thumbnail')) {
    return;
  }

  const touch = e.touches[0];
  const deltaX = Math.abs(touch.clientX - swipeData.startX);
  const deltaY = Math.abs(touch.clientY - swipeData.startY);

  if (deltaX > 10 || deltaY > 10) {
    swipeData.isDragging = true;
  }

  // Блокуємо скрол для активних жестів
  if ((deltaX > deltaY && deltaX > 20) || isFullscreen) {
    e.preventDefault();
  }
}

function handleTouchEnd(e) {
  if (!swipeData.isSwiping) {
    swipeData.isDragging = false;
    return;
  }

  // Додаткова перевірка на thumbnail
  if (e.target.closest('.photo-thumbnail')) {
    swipeData.isSwiping = false;
    swipeData.isDragging = false;
    return;
  }

  // Ігноруємо свайпи по кнопках
  if (e.target.closest('button') ||
      e.target.closest('.photo-close-button') ||
      e.target.closest('.photo-fullscreen-nav')) {
    swipeData.isSwiping = false;
    swipeData.isDragging = false;
    return;
  }

  // Перевіряємо чи був реальний рух
  if (!swipeData.isDragging) {
    swipeData.isSwiping = false;
    return;
  }

  const touch = e.changedTouches[0];
  const endTime = Date.now();

  // Додаткова перевірка на мінімальний час свайпу
  const swipeDuration = endTime - swipeData.startTime;
  if (swipeDuration < 50) { // Занадто швидкий рух
    swipeData.isSwiping = false;
    swipeData.isDragging = false;
    return;
  }

  const swipeDirection = handleSwipe(
      swipeData.startX,
      swipeData.startY,
      touch.clientX,
      touch.clientY,
      swipeData.startTime,
      endTime
  );

  if (swipeDirection) {
    addSwipeFeedback(swipeDirection);

    switch (swipeDirection) {
      case 'left':
        debouncedNextSlide();
        break;
      case 'right':
        debouncedPrevSlide();
        break;
    }
  }

  swipeData.isSwiping = false;
  swipeData.isDragging = false;
}

function showHelp() {
  const helpText = `
Клавіатурні скорочення:
- ↑/↓ - Навігація по слайдах
- ←/→ - Навігація в повноекранному режимі
- Enter - Повноекранний режим
- Escape - Вихід/Скидання
- H - Ця довідка

Мобільне управління:
- Тап по мініатюрі - Перехід до слайду
- Тап по головному зображенню - Повноекранний режим
- Свайп вліво/вправо - Навігація
- Свайп вгору/вниз - Навігація (крім повноекранного режиму)
  `;

  alert(helpText);
}

// Клавіатурна навігація з debounce
// Покращені debounced функції
const debouncedPrevSlide = debounce(() => {
  const prevIndex = (currentIndex - 1 + gallerySlides.length) % gallerySlides.length;
  const prevThumbnail = document.querySelectorAll('.photo-thumbnail')[prevIndex];
  changeSlide(prevIndex, prevThumbnail);
}, 250);

const debouncedNextSlide = debounce(() => {
  const nextIndex = (currentIndex + 1) % gallerySlides.length;
  const nextThumbnail = document.querySelectorAll('.photo-thumbnail')[nextIndex];
  changeSlide(nextIndex, nextThumbnail);
}, 250);

document.addEventListener('keydown', (e) => {
  // Ігноруємо, якщо фокус на інпуті
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }

  if (isFullscreen) {
    switch(e.key) {
      case 'Escape':
        e.preventDefault();
        closeFullscreen();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        debouncedPrevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        debouncedNextSlide();
        break;
    }
  } else {
    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        debouncedPrevSlide();
        break;
      case 'ArrowDown':
        e.preventDefault();
        debouncedNextSlide();
        break;
      case 'Enter':
        e.preventDefault();
        openFullscreen();
        break;
      case 'Escape':
        e.preventDefault();
        resetGallery();
        break;
      case 'h':
      case 'H':
        e.preventDefault();
        showHelp();
        break;
    }
  }
});

// Запобігання zoom на подвійний тап
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
});

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {

  createThumbnails();

  const firstThumbnail = document.querySelectorAll('.photo-thumbnail')[0];
  changeSlide(0, firstThumbnail);

  ['click', 'keydown', 'touchstart', 'wheel'].forEach(event => {
    window.addEventListener(event, () => {
      userHasInteracted = true;
    }, { once: true });
  });

  // Обробник кліку по overlay для закриття
  const overlay = document.querySelector('.photo-fullscreen-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeFullscreen();
      }
    });

    // Додаємо обробники тач-подій до overlay
    overlay.addEventListener('touchstart', handleTouchStart, { passive: true });
    overlay.addEventListener('touchmove', handleTouchMove, { passive: false });
    overlay.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  // Додаємо обробники тач-подій до основної галереї
  const verticalGallery = document.querySelector('.vertical-display');
  if (verticalGallery) {
    verticalGallery.addEventListener('touchstart', handleTouchStart, { passive: true });
    verticalGallery.addEventListener('touchmove', handleTouchMove, { passive: false });
    verticalGallery.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
});

// Додаткова оптимізація: пауза при зміні вкладки
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Можна додати логіку паузи анімацій
  }
});

// Обробка помилок
window.addEventListener('error', function(e) {
  console.error('Gallery error:', e.error);
  showError('Сталася помилка в галереї. Перевірте консоль для деталей.');
});

// Обробка зміни орієнтації на мобільних
window.addEventListener('orientationchange', function() {
  if (isMobile) {
    setTimeout(() => {
      if (isFullscreen) {
        updateFullscreenContent();
      }
      updateCounter();
    }, 500);
  }
});

// Cleanup функції для видалення обробників подій
function cleanup() {
  const verticalGallery = document.querySelector('.vertical-display');
  if (verticalGallery) {
    verticalGallery.removeEventListener('touchstart', handleTouchStart);
    verticalGallery.removeEventListener('touchmove', handleTouchMove);
    verticalGallery.removeEventListener('touchend', handleTouchEnd);
  }

  const overlay = document.querySelector('.photo-fullscreen-overlay');
  if (overlay) {
    overlay.removeEventListener('touchstart', handleTouchStart);
    overlay.removeEventListener('touchmove', handleTouchMove);
    overlay.removeEventListener('touchend', handleTouchEnd);
  }

}

// Експорт функцій для зовнішнього використання
window.GalleryAPI = {
  nextSlide,
  prevSlide,
  changeSlide,
  openFullscreen,
  closeFullscreen,
  resetGallery,
  cleanup,
  getCurrentSlide: () => currentIndex,
  getTotalSlides: () => gallerySlides.length,
  isFullscreen: () => isFullscreen,
  isMobile: () => isMobile,
  getSwipeSensitivity: () => swipeData.minDistance
};

// Додаткові налаштування для мобільних пристроїв
if (isMobile) {
  // Збільшуємо час debounce для мобільних
  swipeData.debounceTime = 400;

  // Збільшуємо мінімальну відстань для свайпу
  swipeData.minDistance = 30;

  // Зменшуємо максимальний час свайпу
  swipeData.maxTime = 800;
}
