function highlightActiveLinks() {
  const normalize = (path) => path.replace(/\/$/, '') || '/';
  const currentPath = normalize(window.location.pathname);
  const firstSegment = (path) => path.split('/').filter(Boolean)[0] || '';
  const currentSection = firstSegment(currentPath);


  document.querySelectorAll('.mobile-menu a.active, header nav a.active, .sub-menu a.active').forEach((el) => {
    el.classList.remove('active');
    const parentLi = el.closest('li');
    if (parentLi) parentLi.classList.remove('active-parent');
  });

  function markExact(links) {
    links.forEach((link) => {
      const linkPath = normalize(link.pathname);
      // Активний, якщо шлях співпадає точно АБО поточна сторінка є дочірньою (наприклад
      // /excursions/personalised/stambul повинна активувати пункт /excursions/personalised)
      if (linkPath === currentPath || currentPath.startsWith(linkPath + '/')) {
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
}

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveLinks();
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    highlightActiveLinks();
  }
});