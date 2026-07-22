// Theme toggle, smooth scrolling and reveal-on-scroll
(function(){
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  const saved = localStorage.getItem('theme');

  if (saved) body.setAttribute('data-theme', saved);
  if (toggle) toggle.textContent = body.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';

  toggle && toggle.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, {threshold: 0.12});

  document.querySelectorAll('section, .project, .hero, header .brand').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
