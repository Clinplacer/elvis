/* ═══════════════════════════════════════════════════
   SHARED.JS — Elvis Kidagisa Site
   • Injects header.html + footer.html via fetch
   • Scroll reveal observer
   • Reading progress bar
════════════════════════════════════════════════════ */

// ── INJECT HEADER & FOOTER ──
async function injectPartial(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error('fetch failed');
    el.innerHTML = await res.text();
    // Re-run any inline scripts in the injected HTML
    el.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  } catch(e) {
    // Silently fail on file:// protocol; the page still renders
    console.warn('Partial not loaded (works best via local server):', file);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    injectPartial('header-include', 'header.html'),
    injectPartial('footer-include', 'footer.html'),
  ]);
  initScrollReveal();
  initProgressBar();
});

// ── SCROLL REVEAL ──
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── READING PROGRESS ──
function initProgressBar() {
  window.addEventListener('scroll', () => {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (Math.min(pct, 1) * 100) + '%';
  }, { passive: true });
}