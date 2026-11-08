const navigation = document.querySelector('#main-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = [...navigation.querySelectorAll('a')];
const mobileNavigation = window.matchMedia('(max-width: 820px)');
document.documentElement.classList.add('js');
document.querySelector('.header').classList.add('navigation-ready');

function closeNavigation({restoreFocus = false} = {}) {
  const wasOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (restoreFocus && wasOpen) navToggle.focus();
}
navToggle.addEventListener('click', event => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
  if (open && event.detail === 0) navLinks[0]?.focus();
});
navLinks.forEach(link => link.addEventListener('click', () => {
  const wasOpen = navToggle.getAttribute('aria-expanded') === 'true';
  closeNavigation();
  if (wasOpen) {
    const destination = document.getElementById(link.hash.slice(1));
    destination?.setAttribute('tabindex', '-1');
    destination?.focus({preventScroll: true});
  }
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeNavigation({restoreFocus: true});
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeNavigation();
});
document.addEventListener('focusin', event => {
  if (!event.target.closest('.header')) closeNavigation();
});
mobileNavigation.addEventListener('change', () => closeNavigation());

if ('IntersectionObserver' in window) {
  const sectionStates = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => sectionStates.set(entry.target.id, entry.isIntersecting));
    const activeLink = navLinks.find(link => sectionStates.get(link.hash.slice(1)));
    navLinks.forEach(link => {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-16% 0px -62% 0px', threshold: 0});
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
