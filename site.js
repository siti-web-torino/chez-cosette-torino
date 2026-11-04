// Entrées discrètes. Le contenu reste visible sans JavaScript ni animation.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
  const playing = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const animation = entry.target.animate(
        [{opacity: .4, transform: 'translateY(10px)'}, {opacity: 1, transform: 'translateY(0)'}],
        {duration: 500, easing: 'cubic-bezier(.22,.61,.36,1)'}
      );
      playing.add(animation);
      const release = () => playing.delete(animation);
      animation.finished.then(release, release);
    });
  }, {threshold: .1});
  document.querySelectorAll('.section-top, .menu-heading, .hours-heading, .hours-card, .name-pages, .visit-heading').forEach(element => {
    if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    playing.forEach(animation => animation.cancel());
    playing.clear();
  });
}
