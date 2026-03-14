// Global interactions for Vyomark website
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');

  const navbar = document.querySelector('.navbar');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.back-to-top');

  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 20);
    if (backToTop) backToTop.classList.toggle('show', y > 380);

    document.querySelectorAll('.parallax-layer').forEach((el, idx) => {
      const speed = Number(el.dataset.speed || (0.08 + idx * 0.04));
      el.style.transform = `translateY(${y * speed}px)`;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      const duration = 1600;
      let start = null;

      const animate = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        counter.textContent = Math.floor(target * eased) + (counter.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

  // Subtle 3D tilt on cards
  document.querySelectorAll('.tilt-card').forEach(card => {
    const limit = 9;
    const reset = () => card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rx = (0.5 - y) * (limit * 2);
      const ry = (x - 0.5) * (limit * 2);
      card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', reset);
    card.addEventListener('blur', reset);
  });
});
