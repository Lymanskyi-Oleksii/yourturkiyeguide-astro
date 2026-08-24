document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 0;
  let isAutoPlay = true;
  let autoPlayInterval;

  const slides = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.indicator');
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const autoPlayIcon = document.getElementById('autoPlayIcon');
  const autoPlayText = document.getElementById('autoPlayText');

  const totalSlides = slides.length;


  // Покращені змінні для свайпів
  let swipeData = {
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwiping: false,
    isDragging: false,
    minDistance: 30,
    maxTime: 1000,
    minVelocity: 0.3,
    debounceTime: 300,
    lastSwipeTime: 0
  };

  // Адаптивна чутливість
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    swipeData.minDistance = 25;
    swipeData.minVelocity = 0.2;
  }

  if (!carouselWrapper || slides.length === 0 || indicators.length === 0) {
    console.warn('⚠️ Не знайдено елементи для каруселі');
    return;
  }

  // 🔄 Оновлення стану слайдів
  function updateCarousel() {
    slides.forEach((slide, index) => {
      slide.className = 'carousel-item';
      if (index === currentSlide) {
        slide.classList.add('active');
      } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
        slide.classList.add('prev');
      } else if (index === (currentSlide + 1) % totalSlides) {
        slide.classList.add('next');
      } else {
        slide.classList.add('hidden');
      }
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }

  // Debounce функція для запобігання швидких повторних викликів
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

  function nextSlide() {
    const now = Date.now();
    if (now - swipeData.lastSwipeTime < swipeData.debounceTime) return;

    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
    resetAutoPlay();
    swipeData.lastSwipeTime = now;
  }

  function prevSlide() {
    const now = Date.now();
    if (now - swipeData.lastSwipeTime < swipeData.debounceTime) return;

    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
    resetAutoPlay();
    swipeData.lastSwipeTime = now;
  }

  function goToSlide(index) {
    const now = Date.now();
    if (now - swipeData.lastSwipeTime < swipeData.debounceTime) return;

    currentSlide = index;
    updateCarousel();
    resetAutoPlay();
    swipeData.lastSwipeTime = now;
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (isAutoPlay) {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function resetAutoPlay() {
    if (isAutoPlay) startAutoPlay();
  }

  function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    updateAutoPlayButton();
    if (isAutoPlay) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }

  function updateAutoPlayButton() {
    if (!autoPlayIcon || !autoPlayText) return;
    if (isAutoPlay) {
      autoPlayIcon.innerHTML = `
        <div class="pause-bars">
          <div class="pause-bar"></div>
          <div class="pause-bar"></div>
        </div>`;
      autoPlayText.textContent = 'Пауза';
    } else {
      autoPlayIcon.innerHTML = '<div class="play-triangle"></div>';
      autoPlayText.textContent = 'Авто';
    }
  }

  // Покращена функція обробки свайпу
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

    // Визначення напрямку (пріоритет горизонтальним жестам)
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      return deltaX > 0 ? 'right' : 'left';
    }

    return null; // Ігноруємо вертикальні та діагональні жести
  }

  // Функція додавання візуального фідбеку
  function addSwipeFeedback(direction) {
    carouselWrapper.classList.add(`swipe-${direction}`);
    setTimeout(() => {
      carouselWrapper.classList.remove(`swipe-${direction}`);
    }, 200);
  }

  // 🎯 Події миші
  carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
  carouselWrapper.addEventListener('mouseleave', () => {
    if (isAutoPlay) startAutoPlay();
  });

  // 📱 Покращені свайпи
  carouselWrapper.addEventListener('touchstart', (e) => {
    // Ігноруємо кліки по кнопках та індикаторах
    if (e.target.closest('button') || e.target.closest('.indicator')) {
      return;
    }

    const touch = e.touches[0];
    swipeData.startX = touch.clientX;
    swipeData.startY = touch.clientY;
    swipeData.startTime = Date.now();
    swipeData.isSwiping = true;
    swipeData.isDragging = false;

    stopAutoPlay();
  }, { passive: true });

  carouselWrapper.addEventListener('touchmove', (e) => {
    if (!swipeData.isSwiping) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - swipeData.startX);
    const deltaY = Math.abs(touch.clientY - swipeData.startY);

    // Визначаємо, чи це горизонтальний жест
    if (deltaX > 10 || deltaY > 10) {
      swipeData.isDragging = true;
    }

    // Блокуємо скрол тільки для горизонтальних жестів
    if (deltaX > deltaY && deltaX > 15) {
      e.preventDefault();
    }
  }, { passive: false });

  carouselWrapper.addEventListener('touchend', (e) => {
    if (!swipeData.isSwiping || !swipeData.isDragging) {
      swipeData.isSwiping = false;
      resetAutoPlay();
      return;
    }

    const touch = e.changedTouches[0];
    const endTime = Date.now();

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

      if (swipeDirection === 'left') {
        nextSlide();
      } else if (swipeDirection === 'right') {
        prevSlide();
      }
    }

    swipeData.isSwiping = false;
    swipeData.isDragging = false;
    resetAutoPlay();
  }, { passive: true });

  // ⌨️ Клавіатура з debounce
  const debouncedPrevSlide = debounce(prevSlide, 200);
  const debouncedNextSlide = debounce(nextSlide, 200);

  document.addEventListener('keydown', (e) => {
    // Ігноруємо, якщо фокус на інпуті
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Перевіряємо, чи каруселька видима на екрані
    if (!carouselWrapper.offsetParent) {
      return; // Каруселька не видима
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        debouncedPrevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        debouncedNextSlide();
        break;
      case ' ':
        e.preventDefault();
        toggleAutoPlay();
        break;
    }
  });

  // 🖱 Клік на слайд — перейти до нього
  slides.forEach((slide, index) => {
    slide.addEventListener('click', (e) => {
      // Запобігаємо клікам після свайпу
      if (swipeData.isDragging) {
        e.preventDefault();
        return;
      }

      if (!slide.classList.contains('active')) {
        goToSlide(index);
      }
    });
  });

  // Обробники для кнопок управління
  const prevButton = document.querySelector('.carousel-controls .control-btn:first-child');
  const nextButton = document.querySelector('.carousel-controls .control-btn:last-child');

  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextSlide();
    });
  }

  // Обробники для індикаторів
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(index);
    });
  });

  // Додаткова оптимізація: пауза при зміні вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else if (isAutoPlay) {
      startAutoPlay();
    }
  });

  // Пауза автоплею, коли карусель поза зоною видимості
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (isAutoPlay) startAutoPlay();
      } else {
        stopAutoPlay();
      }
    });
  }, { threshold: 0.3 });

  visibilityObserver.observe(carouselWrapper);

  // Обробка зміни орієнтації на мобільних
  window.addEventListener('orientationchange', () => {
    if (isMobile) {
      setTimeout(() => {
        updateCarousel();
      }, 500);
    }
  });

  // Експорт функцій для другої каруселі через інший namespace
  window.CarouselAPI = {
    nextSlide,
    prevSlide,
    goToSlide,
    toggleAutoPlay,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides,
    isAutoPlay: () => isAutoPlay
  };

  // Додаємо глобальні функції з префіксом для другої каруселі
  window.carouselPrevSlide = prevSlide;
  window.carouselNextSlide = nextSlide;
  window.carouselGoToSlide = goToSlide;
  window.toggleAutoPlay = toggleAutoPlay;

  // 🟢 Ініціалізація
  updateAutoPlayButton();
  updateCarousel();
  startAutoPlay();
});
