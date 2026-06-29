/* ============================================================
   script.js — Portfolio interactivity
   Features:
   1. Typed text carousel (hero section)
   2. Mobile hamburger navigation
   3. Scroll-reveal animations (IntersectionObserver)
   4. Skill bar animations triggered on scroll
   5. Project category filtering
   6. Contact form validation (submit + real-time blur)
   7. Back-to-top button
   8. Active nav link highlight on scroll
   9. Footer year auto-update
   ============================================================ */

/* ── 1. Typed text effect ───────────────────────────────── */
const phrases = [
  'Full-Stack Developer',
  'AI Integration Builder',
  'CS Student @ MUJ',
  'Problem Solver',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;

const typedEl = document.getElementById('typed-text');

function typeLoop() {
  if (!typedEl) return;

  const current = phrases[phraseIdx];

  if (deleting) {
    typedEl.textContent = current.slice(0, --charIdx);
  } else {
    typedEl.textContent = current.slice(0, ++charIdx);
  }

  let delay = deleting ? 50 : 80;

  if (!deleting && charIdx === current.length) {
    delay    = 2000;          // pause at end of phrase
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting  = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay     = 300;          // brief pause before next phrase
  }

  setTimeout(typeLoop, delay);
}

typeLoop();


/* ── 2. Mobile hamburger navigation ────────────────────── */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.getElementById('nav-menu');
const navEl     = document.querySelector('nav');

function closeNav() {
  navMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close when a nav link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close when clicking outside the nav
document.addEventListener('click', e => {
  if (!navEl.contains(e.target)) {
    closeNav();
  }
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});


/* ── 3 & 4. Scroll-reveal + skill bar animations ───────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Fade + slide the section in
      entry.target.classList.add('visible');

      // Animate any skill bars inside this section
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ── 5. Project category filtering ─────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state on buttons
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.removeAttribute('aria-pressed');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.dataset.filter;

    // Show / hide cards
    projectCards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.split(' ').includes(filter);
      card.setAttribute('aria-hidden', String(!show));
    });
  });
});


/* ── 6. Contact form validation ─────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

/**
 * Validates a single field and toggles the error state.
 * @param {string} inputId   - id of the <input> or <textarea>
 * @param {string} groupId   - id of the wrapping .form-group div
 * @param {function} checkFn - returns true if value is valid
 * @returns {boolean}
 */
function validateField(inputId, groupId, checkFn) {
  const input = document.getElementById(inputId);
  const group = document.getElementById(groupId);
  const valid = checkFn(input.value.trim());
  group.classList.toggle('has-error', !valid);
  return valid;
}

// Field rules
const fieldRules = [
  {
    inputId: 'name',
    groupId: 'group-name',
    check:   v => v.length >= 2,
  },
  {
    inputId: 'email',
    groupId: 'group-email',
    check:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  {
    inputId: 'message',
    groupId: 'group-message',
    check:   v => v.length >= 10,
  },
];

// Real-time validation on blur (when user leaves each field)
fieldRules.forEach(({ inputId, groupId, check }) => {
  const input = document.getElementById(inputId);
  if (input) {
    input.addEventListener('blur', () => validateField(inputId, groupId, check));
  }
});

// Full validation on submit
contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const allValid = fieldRules.every(({ inputId, groupId, check }) =>
    validateField(inputId, groupId, check)
  );

  if (allValid) {
    // ── Replace this block with a real fetch() / EmailJS call ──
    formSuccess.style.display = 'block';
    contactForm.reset();

    // Clear any leftover error states after reset
    fieldRules.forEach(({ groupId }) => {
      document.getElementById(groupId).classList.remove('has-error');
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 5000);
  }
});


/* ── 7. Back-to-top button ──────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 8. Active nav link on scroll ───────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navAnchors.forEach(a => a.removeAttribute('aria-current'));

      const activeLink = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.setAttribute('aria-current', 'page');
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => navObserver.observe(s));


/* ── 9. Footer year ─────────────────────────────────────── */
const footerYear = document.getElementById('footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}
