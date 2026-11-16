

/* Premium interaction layer: staggered reveals, link feedback, scroll progress */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let progressTicking = false;
  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progress.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, value))));
    progressTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!progressTicking) {
      window.requestAnimationFrame(updateProgress);
      progressTicking = true;
    }
  }, { passive: true });
  updateProgress();

  const revealGroups = document.querySelectorAll('.expertise-grid,.case-grid,.timeline,.impact-grid,.stat-strip');
  revealGroups.forEach(group => {
    const items = group.querySelectorAll(':scope > .reveal, :scope > article, :scope > div');
    items.forEach((item, index) => {
      item.style.setProperty('--reveal-delay', String(Math.min(index * 85, 425)) + 'ms');
      if (!item.classList.contains('reveal')) item.classList.add('reveal');
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('pointerenter', () => el.classList.add('is-hovered'));
      el.addEventListener('pointerleave', () => el.classList.remove('is-hovered'));
    });
  }
})();

const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));
