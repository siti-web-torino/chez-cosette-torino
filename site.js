// Una sola entrata per gruppo: niente animazioni annidate sui testi o sulle foto.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
  const pending = new Set();
  const playing = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      pending.delete(element);
      element.classList.remove('motion-pending');
      const animation = element.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 520, easing: 'cubic-bezier(.22,.61,.36,1)' }
      );
      playing.add(animation);
      const release = () => playing.delete(animation);
      animation.finished.then(release, release);
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  // Gli elementi già visibili al caricamento restano fermi, anche entrando da un'ancora.
  const viewportHeight = window.innerHeight;
  const targets = [...document.querySelectorAll('.section-top, .room-copy, .menu-heading, .hours-heading, .hours-list article')]
    .filter(element => element.getBoundingClientRect().top >= viewportHeight);
  for (const element of targets) {
    pending.add(element);
    element.classList.add('motion-pending');
    observer.observe(element);
  }

  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    pending.forEach(element => element.classList.remove('motion-pending'));
    pending.clear();
    playing.forEach(animation => animation.cancel());
    playing.clear();
  });
}
