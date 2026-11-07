/* Interactions for the portfolio page: theme, nav, reveal, counters, resume, contact */
(function () {
  "use strict";

  const fa = (n) => Number(n).toLocaleString("fa-IR", { useGrouping: false });
  const root = document.documentElement;

  /* ---------- theme ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("ak-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = storedTheme || (prefersDark ? "dark" : "light");

  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("ak-theme", next);
  });

  /* ---------- sticky header ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
  });

  /* ---------- reveal on scroll ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- counters ---------- */
  const counters = document.querySelectorAll("[data-count]");

  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fa(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = fa(el.dataset.count)));
  }

  /* ---------- skill bars ---------- */
  const bars = document.querySelectorAll(".bar span[data-value]");

  if ("IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.width = entry.target.dataset.value + "%";
          barObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((el) => barObserver.observe(el));
  } else {
    bars.forEach((el) => (el.style.width = el.dataset.value + "%"));
  }

  /* ---------- active nav link ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = Array.from(document.querySelectorAll("#mainNav a"));

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            )
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- resume modal ---------- */
  const modal = document.getElementById("resumeModal");
  const resumeBtn = document.getElementById("resumeBtn");
  const resumeClose = document.getElementById("resumeClose");
  let lastFocused = null;

  const openModal = () => {
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    resumeClose.focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  resumeBtn.addEventListener("click", openModal);
  resumeClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    if (e.key === "Tab" && modal.classList.contains("is-open")) {
      const focusables = modal.querySelectorAll("button, a[href]");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  document.getElementById("printResume").addEventListener("click", () => {
    document.body.style.overflow = "";
    window.print();
    document.body.style.overflow = "hidden";
  });

  /* ---------- contact form ---------- */
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  let toastTimer = null;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-open"), 4200);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || "پروژه جدید از وب‌سایت";
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast("لطفاً نام، ایمیل و متن پیام را کامل کنید.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showToast("ایمیل وارد‌شده معتبر نیست.");
      form.email.focus();
      return;
    }

    const body = `${message}\n\n— ${name}\n${email}`;
    const mailto =
      "mailto:mohammadhossein.aghaei@gmail.com" +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    showToast("در حال باز کردن برنامه ایمیل…");
    window.location.href = mailto;
  });

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  try {
    const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
    }).format(new Date());
    yearEl.textContent = parts;
  } catch (_) {
    /* keep the static fallback */
  }
})();
