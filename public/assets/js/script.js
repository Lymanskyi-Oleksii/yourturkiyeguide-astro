function highlightActiveLinks() {
  const normalize = (path) => path.replace(/\/$/, '') || '/';
  const currentPath = normalize(window.location.pathname);
  const firstSegment = (path) => path.split('/').filter(Boolean)[0] || '';
  const currentSection = firstSegment(currentPath);

  console.log('[highlight] запуск, currentPath =', currentPath, ', section =', currentSection);

  document.querySelectorAll('.mobile-menu a.active, header nav a.active, .sub-menu a.active').forEach((el) => {
    console.log('[highlight] знімаю active з', el.getAttribute('href'));
    el.classList.remove('active');
    const parentLi = el.closest('li');
    if (parentLi) parentLi.classList.remove('active-parent');
  });

  function markExact(links) {
    links.forEach((link) => {
      const linkPath = normalize(link.pathname);
      if (linkPath === currentPath) {
        console.log('[highlight] EXACT match →', link.getAttribute('href'));
        link.classList.add('active');
        const parentLi = link.closest('li');
        if (parentLi) parentLi.classList.add('active-parent');
      }
    });
  }

  function markSection(links) {
    links.forEach((link) => {
      const linkSection = firstSegment(normalize(link.pathname));
      if (linkSection && linkSection === currentSection) {
        console.log('[highlight] SECTION match →', link.getAttribute('href'), '(section:', linkSection, ')');
        link.classList.add('active');
        const parentLi = link.closest('li');
        if (parentLi) parentLi.classList.add('active-parent');
      }
    });
  }

  if (currentPath === '/') {
    document.querySelectorAll('a[href="/"]').forEach((link) => link.classList.add('active'));
  }

  markSection(document.querySelectorAll('header nav > ul > li > a'));
  markSection(document.querySelectorAll('.mobile-menu a'));
  markExact(document.querySelectorAll('.sub-menu a'));

  const activeCount = document.querySelectorAll('.mobile-menu a.active').length;
  console.log('[highlight] ГОТОВО. Активних іконок у .mobile-menu:', activeCount);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[event] DOMContentLoaded');
  highlightActiveLinks();
});

window.addEventListener('pageshow', (event) => {
  console.log('[event] pageshow, persisted =', event.persisted);
  if (event.persisted) {
    highlightActiveLinks();
  }
});