/* گلاریس — تعاملات صفحه */

/* ---------- منوی موبایل ---------- */
const header = document.querySelector('.site-header');
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

/* ---------- فیلتر نمونه کارها ---------- */
const tabs = document.querySelectorAll('.tab');
const works = document.querySelectorAll('.work');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    const filter = tab.dataset.filter;
    works.forEach((work) => {
      const show = filter === 'all' || work.dataset.cat === filter;
      work.classList.toggle('is-hidden', !show);
    });
  });
});

/* ---------- نمایان شدن نرم بخش‌ها ---------- */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-in'));
}

/* ---------- هایلایت منو بر اساس بخش ---------- */
const navLinks = [...document.querySelectorAll('.nav__list a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => spy.observe(section));
}
