const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Kinetic word-reveal (hero name)
const heroName = document.getElementById('heroName');
if (heroName) {
  const words = heroName.textContent.trim().split(/\s+/);
  heroName.innerHTML = words
    .map((word, i) => `<span class="kw"><span class="kw__i" style="--kw-delay:${i * 0.08}s">${word}</span></span>`)
    .join(' ');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => heroName.classList.add('is-in'));
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll-reveal animation
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Back to top button
const backToTop = document.getElementById('backToTop');
function updateBackToTop() {
  backToTop.classList.toggle('is-visible', window.scrollY > 600);
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scrollspy nav highlighting + sliding indicator
const navAnchorLinks = Array.from(navLinks.querySelectorAll('a[href^="#"]'));
const spySections = navAnchorLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const navIndicator = document.getElementById('navIndicator');

function moveNavIndicator(link) {
  if (!navIndicator || !link) return;
  const linkRect = link.getBoundingClientRect();
  const parentRect = navLinks.getBoundingClientRect();
  navIndicator.style.left = (linkRect.left - parentRect.left) + 'px';
  navIndicator.style.width = linkRect.width + 'px';
  navIndicator.style.opacity = '1';
}

if ('IntersectionObserver' in window && spySections.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = navAnchorLinks.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchorLinks.forEach((a) => a.classList.remove('is-active'));
        link.classList.add('is-active');
        moveNavIndicator(link);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  spySections.forEach((section) => spyObserver.observe(section));
}

window.addEventListener('resize', () => {
  const activeLink = navAnchorLinks.find((a) => a.classList.contains('is-active'));
  if (activeLink) moveNavIndicator(activeLink);
});

// Cursor-tracked glow on cards
if (!prefersReducedMotion) {
  document.querySelectorAll('.glass-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });
  });
}

// Click-to-load video embed
const videoEmbed = document.getElementById('videoEmbed');
if (videoEmbed) {
  videoEmbed.addEventListener('click', () => {
    const videoId = videoEmbed.dataset.videoId;
    const videoTitle = videoEmbed.dataset.videoTitle || 'video';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = videoTitle;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    videoEmbed.innerHTML = '';
    videoEmbed.appendChild(iframe);
  }, { once: true });
}
