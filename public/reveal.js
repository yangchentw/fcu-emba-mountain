const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');

if (motionQuery.matches && 'IntersectionObserver' in window) {
  const elements = document.querySelectorAll('.reveal');
  elements.forEach((element) => element.classList.add('is-pending'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((element) => observer.observe(element));
}
