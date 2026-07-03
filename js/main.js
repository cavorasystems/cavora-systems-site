(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(pointer: coarse)').matches;

  addEventListener('load', () => document.body.classList.remove('is-loading'));
  setTimeout(() => document.body.classList.remove('is-loading'), 1500);
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  const clips = [$('#clip1'), $('#clip2'), $('#clip3')];
  const panels = [$('#panel-1'), $('#panel-2'), $('#panel-3')];
  const panelLogo = $('#panel-logo');
  const bar = $('#progress-bar');
  const cue = $('#scroll-indicator');
  const DUR = [10.05, 8.06, 6.06];           // actual clip lengths
  const TOTAL = DUR[0] + DUR[1] + DUR[2];
  const XFADE = 0.8;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const show = (el, on) => el && el.classList.toggle('visible', on);

  /* ─────────────────────────── DESKTOP: scroll-scrub ─────────────────────────── */
  function initScrub() {
    // Switch all clips to full preload now that we know this is a pointer device
    clips.forEach((v) => { v.preload = 'auto'; try { v.load(); } catch (e) {} });

    const SCRUB_VH = 500;
    let ticking = false;

    function update() {
      ticking = false;
      const scrollY = window.scrollY;
      const scrollMax = document.documentElement.scrollHeight - innerHeight;
      const heroH = innerHeight * (SCRUB_VH / 100);
      if (bar) bar.style.width = (scrollY / scrollMax * 100) + '%';
      if (cue) cue.style.opacity = scrollY > 80 ? '0' : '1';

      const p = clamp(scrollY / heroH, 0, 1);
      const t = p * TOTAL;

      // crossfaded opacities
      const e1 = DUR[0], e2 = DUR[0] + DUR[1];
      let o1, o2, o3;
      if (t <= e1 - XFADE) { o1 = 1; o2 = 0; o3 = 0; }
      else if (t <= e1) { const x = (t - (e1 - XFADE)) / XFADE; o1 = 1 - x; o2 = x; o3 = 0; }
      else if (t <= e2 - XFADE) { o1 = 0; o2 = 1; o3 = 0; }
      else if (t <= e2) { const x = (t - (e2 - XFADE)) / XFADE; o1 = 0; o2 = 1 - x; o3 = x; }
      else { o1 = 0; o2 = 0; o3 = 1; }
      clips[0].style.opacity = o1; clips[1].style.opacity = o2; clips[2].style.opacity = o3;
      // As the logo reveals, dissolve clip3 (it ends on its own logo) so the crisp lockup stands alone.
      const lp = clamp((p - 0.85) / 0.10, 0, 1);
      if (lp > 0) clips[2].style.opacity = o3 * (1 - lp);

      seek(clips[0], t);
      seek(clips[1], clamp(t - DUR[0], 0, DUR[1]));
      seek(clips[2], clamp(t - DUR[0] - DUR[1], 0, DUR[2]));

      show(panels[0], p <= 0.22);
      show(panels[1], p >= 0.26 && p <= 0.52);
      show(panels[2], p >= 0.56 && p <= 0.80);
      const logo = p >= 0.85;
      show(panelLogo, logo);
      if (logo) panels.forEach((pn) => pn.classList.remove('visible'));
    }
    function seek(v, time) {
      if (v.readyState < 1) return;
      const c = clamp(time, 0, v.duration || 999);
      if (Math.abs(v.currentTime - c) > 0.05) { try { v.currentTime = c; } catch (e) {} }
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  }

  /* ─────────────────────────── MOBILE: auto montage ─────────────────────────── */
  // iOS Safari blocks programmatic currentTime seeking during scroll, so instead of
  // scrubbing we play the three clips in sequence (muted, inline) and time the panels
  // to playback. The hero collapses to one viewport; the rest of the page scrolls normally.
  function initMontage() {
    document.body.classList.add('mobile-hero');
    let i = 0;
    function play(idx) {
      i = idx;
      clips.forEach((v, k) => { v.style.opacity = k === idx ? 1 : 0; if (k !== idx) { try { v.pause(); } catch (e) {} } });
      // panels follow the clip
      show(panels[0], idx === 0); show(panels[1], idx === 1);
      show(panels[2], idx === 2); show(panelLogo, false);
      const v = clips[idx];
      try { v.currentTime = 0; v.play().catch(() => {}); } catch (e) {}
    }
    clips.forEach((v, idx) => {
      v.addEventListener('ended', () => {
        if (idx < clips.length - 1) play(idx + 1);
        else { panels[2].classList.remove('visible'); revealLogo(); } // hold on logo
      });
    });
    function revealLogo() {
      clips[2].style.transition = 'opacity 1s var(--ease)';
      clips[2].style.opacity = 0;      // dissolve the clip's own logo so ours stands alone
      show(panelLogo, true);
    }
    // near the end of the last clip, swap panel-3 → logo for a smooth reveal
    clips[2].addEventListener('timeupdate', () => {
      if (clips[2].currentTime > DUR[2] - 1.6) { panels[2].classList.remove('visible'); revealLogo(); }
    });
    // progress bar still tracks page scroll on mobile
    addEventListener('scroll', () => {
      const sMax = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.width = (window.scrollY / sMax * 100) + '%';
      if (cue) cue.style.opacity = window.scrollY > 60 ? '0' : '1';
    }, { passive: true });

    play(0);
    // autoplay fallback: kick playback on first interaction if the browser blocked it
    const kick = () => { if (clips[i].paused) clips[i].play().catch(() => {}); document.removeEventListener('touchstart', kick); };
    document.addEventListener('touchstart', kick, { passive: true, once: true });
  }

  if (isMobile) initMontage(); else initScrub();

  /* ─────────────────────────── reveals ─────────────────────────── */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    }), { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('in-view'));

  /* ─────────────────────────── nav + menu ─────────────────────────── */
  const nav = $('#main-nav');
  addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', window.scrollY > 24), { passive: true });
  const toggle = $('#nav-toggle'), menu = $('#mobile-menu');
  if (toggle && menu) {
    const close = () => { document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); };
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-hidden', String(!open));
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', close));
    addEventListener('keydown', (e) => e.key === 'Escape' && close());
  }

  /* ─────────────────────────── custom cursor (desktop) ─────────────────────────── */
  const dot = $('#cursor-dot');
  if (dot && matchMedia('(pointer: fine)').matches) {
    let x = innerWidth / 2, y = innerHeight / 2, dx = x, dy = y;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.classList.add('active'); });
    addEventListener('mouseleave', () => dot.classList.remove('active'));
    (function follow() { dx += (x - dx) * 0.2; dy += (y - dy) * 0.2; dot.style.left = dx + 'px'; dot.style.top = dy + 'px'; requestAnimationFrame(follow); })();
    $$('a, button, .service-card, .why-list li').forEach((el) => {
      el.addEventListener('mouseenter', () => dot.classList.add('hover'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hover'));
    });
  }
})();
