// Progressive enhancement: no content depends on an animation completing.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;
const entrance = document.querySelector('.entrance');
const skipEntrance = document.querySelector('.entrance-skip');
const replayEntrance = document.querySelector('.entrance-replay');
const scene = document.querySelector('.arch-frame');
const hero = document.querySelector('.hero');
const roomPhoto = document.querySelector('.room-photo');
const progress = document.querySelector('.reading-progress');
const header = document.querySelector('.header');
const playing = new Set();
let entranceTimer;
let revealObserver;
let frame = 0;
let sceneFrame = 0;
let replaying = false;
let sceneVisible = true;
let roomVisible = false;

function animate(element, keyframes, options) {
  if (!element || motionPreference.matches || !element.animate) return;
  const animation = element.animate(keyframes, {
    duration: 850, easing: 'cubic-bezier(.16,1,.3,1)', ...options
  });
  playing.add(animation);
  const release = () => playing.delete(animation);
  animation.finished.then(release, release);
}

function animateHero(delay = 0) {
  document.querySelectorAll('.title-line > *').forEach((line, index) => {
    animate(line, [{transform: 'translateY(108%)'}, {transform: 'translateY(0)'}],
      {duration: 1100, delay: delay + index * 120, fill: 'backwards'});
  });
  document.querySelectorAll('.invitation > :not(h1), .arch-label, .scene-signature, .doorplate').forEach((item, index) => {
    animate(item, [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'translateY(0)'}],
      {delay: delay + 100 + index * 40, fill: 'backwards'});
  });
  animate(scene, [{opacity: .2, transform: 'translateY(32px) scale(.94)'}, {opacity: 1, transform: 'none'}],
    {duration: 1300, delay, fill: 'backwards'});
}

function finishEntrance() {
  clearTimeout(entranceTimer);
  if (entrance.hidden) return;
  const restoreFocus = replaying || document.activeElement === skipEntrance;
  entrance.hidden = true;
  root.classList.remove('is-entering');
  playing.forEach(animation => animation.cancel());
  playing.clear();
  if (restoreFocus) {
    const destination = motionPreference.matches ? document.querySelector('.hero-menu-link') : replayEntrance;
    destination.focus({preventScroll: true});
  }
  replaying = false;
}

function playEntrance({replay = false} = {}) {
  if (motionPreference.matches || document.hidden || !entrance.hidden) return;
  replaying = replay;
  entrance.hidden = false;
  root.classList.add('is-entering');
  // Bounded independently of images, fonts and animation events.
  entranceTimer = setTimeout(finishEntrance, 1650);
  if (!replay) animateHero(480);
}

let alreadyWelcomed = false;
try {
  alreadyWelcomed = sessionStorage.getItem('cosette-welcomed') === '1';
  sessionStorage.setItem('cosette-welcomed', '1');
} catch { /* Private browsing must not prevent access to the site. */ }

replayEntrance.hidden = motionPreference.matches;
skipEntrance.addEventListener('click', finishEntrance);
replayEntrance.addEventListener('click', () => playEntrance({replay: true}));
// Never cover keyboard focus, interrupt scrolling or block a deep link.
document.addEventListener('keydown', event => {
  if (!entrance.hidden && event.key !== 'Shift') finishEntrance();
}, {capture: true});
document.addEventListener('focusin', event => {
  if (!entrance.hidden && !entrance.contains(event.target)) finishEntrance();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) finishEntrance();
});
window.addEventListener('wheel', finishEntrance, {passive: true});
window.addEventListener('touchstart', finishEntrance, {passive: true});
window.addEventListener('hashchange', finishEntrance);
window.addEventListener('pagehide', finishEntrance);

function observeReveals() {
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      revealObserver.unobserve(entry.target);
      // Don't animate a link target the visitor has just focused.
      if (entry.target.contains(document.activeElement) || entry.target.closest('section') === document.activeElement) return;
      const siblings = [...entry.target.parentElement.children];
      const stagger = entry.target.matches('.hours-card, .dish') ? siblings.indexOf(entry.target) % 3 * 85 : 0;
      animate(entry.target,
        [{opacity: .12, transform: 'translateY(28px)'}, {opacity: 1, transform: 'translateY(0)'}],
        {delay: stagger, fill: 'backwards'});
    });
  }, {threshold: .12});
  document.querySelectorAll('.section-top > div, .room-photo, .room-footnote, .menu-heading, .menu-masthead, .dish, .menu-aside, .menu-rituals, .hours-heading, .hours-card, .hours-bottom, .name-meaning, .name-story, .name-ending, .visit-heading, .postcard-message, .postcard-address, .visit-reserve').forEach(element => {
    if (element.getBoundingClientRect().top >= window.innerHeight) revealObserver.observe(element);
  });
}

function updateScroll() {
  frame = 0;
  const scrollable = root.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0})`;
  header.classList.toggle('has-scrolled', window.scrollY > 24);
  if (motionPreference.matches) return;
  // A small photographic drift; never move text or change scroll behavior.
  if (sceneVisible) {
    hero.style.setProperty('--scene-drift', `${Math.min(22, Math.max(0, -hero.getBoundingClientRect().top * .045))}px`);
  }
  if (roomVisible) {
    const distance = roomPhoto.getBoundingClientRect().top + roomPhoto.offsetHeight / 2 - window.innerHeight / 2;
    roomPhoto.style.setProperty('--room-drift', `${Math.max(-16, Math.min(16, distance * -.035))}px`);
  }
}
function scheduleScroll() {
  if (!frame) frame = requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', scheduleScroll, {passive: true});
window.addEventListener('resize', scheduleScroll, {passive: true});
if ('IntersectionObserver' in window) {
  const visiblePhotos = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === hero) sceneVisible = entry.isIntersecting;
      if (entry.target === roomPhoto) roomVisible = entry.isIntersecting;
    });
    scheduleScroll();
  });
  visiblePhotos.observe(hero);
  visiblePhotos.observe(roomPhoto);
}

function resetScene() {
  cancelAnimationFrame(sceneFrame);
  sceneFrame = 0;
  scene.style.removeProperty('--tilt-x');
  scene.style.removeProperty('--tilt-y');
}
scene.addEventListener('pointermove', event => {
  if (motionPreference.matches || !finePointer.matches || !entrance.hidden) return;
  if (sceneFrame) return;
  sceneFrame = requestAnimationFrame(() => {
    sceneFrame = 0;
    const bounds = scene.getBoundingClientRect();
    scene.style.setProperty('--tilt-x', `${-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 2}deg`);
    scene.style.setProperty('--tilt-y', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 2}deg`);
  });
});
scene.addEventListener('pointerleave', resetScene);
finePointer.addEventListener('change', resetScene);
motionPreference.addEventListener('change', () => {
  finishEntrance();
  playing.forEach(animation => animation.cancel());
  playing.clear();
  revealObserver?.disconnect();
  resetScene();
  hero.style.removeProperty('--scene-drift');
  roomPhoto.style.removeProperty('--room-drift');
  replayEntrance.hidden = motionPreference.matches;
  observeReveals();
  scheduleScroll();
});

if (!alreadyWelcomed && !window.location.hash && window.scrollY < 20) playEntrance();
else if (!window.location.hash && window.scrollY < 20) animateHero();
observeReveals();
scheduleScroll();
