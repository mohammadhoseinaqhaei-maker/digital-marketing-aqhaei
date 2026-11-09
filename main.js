/* کلاریس — تعاملات صفحه */

/* ---------- منوی موبایل ---------- */
const header = document.getElementById('siteHeader');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');

function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'باز کردن منو');
}

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'بستن منو' : 'باز کردن منو');
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.addEventListener('click', (event) => {
  if (!nav.classList.contains('is-open')) return;
  if (header.contains(event.target)) return;
  closeMenu();
});

/* ---------- سایه هدر در اسکرول ---------- */
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- فیلتر گالری ---------- */
const chips = document.querySelectorAll('.chip');
const gallery = document.querySelector('.gallery');
const galleryItems = document.querySelectorAll('.gallery__item');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;

    chips.forEach((item) => {
      const active = item === chip;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });

    gallery.classList.toggle('is-filtered', filter !== 'all');

    galleryItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('is-hidden', !show);
    });
  });
});

/* ---------- نمایش تدریجی بخش‌ها ---------- */
const revealTargets = document.querySelectorAll(
  '.hero__content > *, .hero__media, .features, .feature, .service-card, .gallery__item, .step, .cta__inner, .testimonial, .service-detail__card, .stat, .value-card, .team-card, .price-card, .package, .info-card, .booking-form, .story__figure'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 5, 4) * 60}ms`;
    observer.observe(el);
  });
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- فرم درخواست نوبت ---------- */
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

if (bookingForm && formSuccess) {
  const summary = formSuccess.querySelector('[data-summary]');

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const data = new FormData(bookingForm);
    const service = bookingForm.service;
    const serviceText = service.options[service.selectedIndex].text;

    if (summary) {
      summary.textContent = `${data.get('name')}، درخواست شما برای «${serviceText}» ثبت شد.`;
    }

    formSuccess.classList.add('is-visible');
    bookingForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
