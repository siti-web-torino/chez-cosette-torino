import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../site.js', import.meta.url), 'utf8');

// A small browser boundary for preference/lifecycle regressions. Layout and
// navigation are checked separately in the real browser, not simulated here.
function mount({reduced = false, welcomed = false, hash = '', scrollY = 0, storageBlocked = false, observers = true, webAnimations = true} = {}) {
  const animations = [];
  const timers = new Map();
  const frames = new Map();
  let sequence = 0;
  const document = new EventTarget();
  class Element extends EventTarget {
    hidden = false;
    style = {values: new Map(), setProperty(key, value) {this.values.set(key, value);}, removeProperty(key) {this.values.delete(key);}};
    classList = {values: new Set(), add(key) {this.values.add(key);}, remove(key) {this.values.delete(key);}, toggle(key, enabled) {enabled ? this.values.add(key) : this.values.delete(key);}};
    scrollHeight = 8000;
    offsetHeight = 500;
    parentElement = {children: [this]};
    getBoundingClientRect() {return {top: 1000, left: 0, width: 400, height: 500};}
    contains(element) {return element === this;}
    closest() {return null;}
    matches() {return false;}
    focus() {document.activeElement = this;}
    animate() {
      const animation = {cancelled: false, finished: new Promise(() => {}), cancel() {this.cancelled = true;}};
      animations.push(animation);
      return animation;
    }
  }
  if (!webAnimations) Element.prototype.animate = undefined;
  const selectors = ['.entrance', '.entrance-skip', '.entrance-replay', '.arch-frame', '.hero', '.room-photo', '.reading-progress', '.header', '.hero-menu-link'];
  const elements = new Map(selectors.map(selector => [selector, new Element()]));
  elements.get('.entrance').hidden = true;
  const lines = [new Element(), new Element()];
  const reveal = new Element();
  document.documentElement = new Element();
  document.activeElement = new Element();
  document.hidden = false;
  document.querySelector = selector => elements.get(selector);
  document.querySelectorAll = selector => selector.startsWith('.title-line') ? lines : selector.startsWith('.invitation') ? [new Element(), new Element()] : [reveal];
  const preference = Object.assign(new EventTarget(), {matches: reduced});
  const pointer = Object.assign(new EventTarget(), {matches: true});
  const window = Object.assign(new EventTarget(), {innerHeight: 800, scrollY, location: {hash}, matchMedia: query => query.includes('reduced') ? preference : pointer});
  class Observer {observe() {} unobserve() {} disconnect() {}}
  if (observers) window.IntersectionObserver = Observer;
  vm.runInNewContext(source, {
    document, window, IntersectionObserver: observers ? Observer : undefined,
    sessionStorage: {
      getItem() {if (storageBlocked) throw Error('Storage unavailable'); return welcomed ? '1' : null;},
      setItem() {if (storageBlocked) throw Error('Storage unavailable');}
    },
    setTimeout(callback) {timers.set(++sequence, callback); return sequence;},
    clearTimeout(id) {timers.delete(id);},
    requestAnimationFrame(callback) {frames.set(++sequence, callback); return sequence;},
    cancelAnimationFrame(id) {frames.delete(id);}
  });
  const fire = (target, type, values = {}) => target.dispatchEvent(Object.assign(new Event(type), values));
  return {
    document, window, animations, elements, preference, fire,
    entrance: elements.get('.entrance'), replay: elements.get('.entrance-replay'),
    finish() {for (const callback of [...timers.values()]) callback();},
    flushFrame() {for (const callback of [...frames.values()]) callback(); frames.clear();},
    reduce(value) {preference.matches = value; fire(preference, 'change');}
  };
}

test('the first welcome always ends without waiting for an asset', () => {
  const page = mount();
  assert.equal(page.entrance.hidden, false);
  page.finish();
  assert.equal(page.entrance.hidden, true);
  assert.ok(page.animations.every(animation => animation.cancelled));
});

test('a repeated visit, deep link or restored scroll position skips the curtain', () => {
  for (const options of [{welcomed: true}, {hash: '#tavola'}, {scrollY: 500}]) {
    assert.equal(mount(options).entrance.hidden, true);
  }
  assert.equal(mount({hash: '#tavola'}).animations.length, 0);
});

test('reduced motion skips the intro, hero animation and pointer effects', () => {
  const page = mount({reduced: true});
  assert.equal(page.entrance.hidden, true);
  assert.equal(page.replay.hidden, true);
  assert.equal(page.animations.length, 0);
  page.fire(page.elements.get('.arch-frame'), 'pointermove', {clientX: 30, clientY: 40});
  page.flushFrame();
  assert.equal(page.elements.get('.arch-frame').style.values.size, 0);
});

test('changing the motion preference cancels work and updates replay availability', () => {
  const page = mount();
  page.reduce(true);
  assert.equal(page.entrance.hidden, true);
  assert.equal(page.replay.hidden, true);
  assert.ok(page.animations.every(animation => animation.cancelled));
  page.reduce(false);
  assert.equal(page.replay.hidden, false);
  assert.equal(page.entrance.hidden, true);
});

test('keyboard, wheel, touch and backgrounding dismiss the curtain immediately', () => {
  for (const type of ['keydown', 'wheel', 'touchstart', 'visibilitychange']) {
    const page = mount();
    if (type === 'visibilitychange') page.document.hidden = true;
    page.fire(type === 'wheel' || type === 'touchstart' ? page.window : page.document, type, {key: 'Tab'});
    assert.equal(page.entrance.hidden, true, type);
  }
});

test('replay and skip preserve a usable focus destination', () => {
  const page = mount({welcomed: true});
  page.fire(page.replay, 'click');
  assert.equal(page.entrance.hidden, false);
  page.fire(page.elements.get('.entrance-skip'), 'click');
  assert.equal(page.entrance.hidden, true);
  assert.equal(page.document.activeElement, page.replay);
});

test('blocked storage and missing optional browser APIs do not break the page', () => {
  for (const options of [{storageBlocked: true}, {observers: false}, {webAnimations: false}]) {
    const page = mount(options);
    page.finish();
    assert.equal(page.entrance.hidden, true);
  }
});

test('the HTML has no loading gate and all internal links have destinations', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /class="entrance" hidden/);
  assert.match(html, /class="entrance-replay"[^>]* hidden/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), id);
  const css = readFileSync(new URL('../creative.css', import.meta.url), 'utf8');
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /html:not\(\.js\) \.header nav\{/);
});
