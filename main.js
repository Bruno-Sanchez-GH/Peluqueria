const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".hero-dot"));

if (slides.length && dots.length) {
  let currentIndex = 0;
  let autoPlay = null;

  const setActiveSlide = (index) => {
    const previousIndex = currentIndex;

    slides.forEach((slide, slideIndex) => {
      slide.classList.remove("is-active", "is-next", "is-prev");

      if (slideIndex === index) {
        slide.classList.add("is-active");
      } else if (slideIndex === previousIndex && index !== previousIndex) {
        slide.classList.add("is-prev");
      } else {
        slide.classList.add("is-next");
      }
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });

    currentIndex = index;
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    setActiveSlide(nextIndex);
  };

  const restartAutoPlay = () => {
    window.clearInterval(autoPlay);
    autoPlay = window.setInterval(nextSlide, 5000);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index);
      restartAutoPlay();
    });
  });

  const hero = document.querySelector(".hero-slider");

  if (hero) {
    hero.addEventListener("mouseenter", () => window.clearInterval(autoPlay));
    hero.addEventListener("mouseleave", restartAutoPlay);
    hero.addEventListener("touchstart", () => window.clearInterval(autoPlay), { passive: true });
    hero.addEventListener("touchend", restartAutoPlay, { passive: true });
  }

  currentIndex = 0;
  setActiveSlide(0);
  restartAutoPlay();
}

const cutTitle = document.querySelector(".js-cut-title");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (cutTitle) {
  let hasAnimated = false;
  let cutTimer = null;
  let morphTimer = null;
  let finishTimer = null;

  const playCutAnimation = () => {
    if (hasAnimated) {
      return;
    }

    hasAnimated = true;

    if (prefersReducedMotion) {
      cutTitle.classList.add("is-morphing", "is-finished");
      return;
    }

    window.requestAnimationFrame(() => {
      cutTitle.classList.add("is-cutting");
    });

    // La secuencia se divide en corte, separacion y recomposicion del nuevo mensaje.
    cutTimer = window.setTimeout(() => {
      cutTitle.classList.add("is-morphing");
    }, 620);

    morphTimer = window.setTimeout(() => {
      cutTitle.classList.remove("is-cutting");
    }, 1400);

    finishTimer = window.setTimeout(() => {
      cutTitle.classList.add("is-finished");
    }, 1700);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playCutAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    observer.observe(cutTitle);
  } else {
    playCutAnimation();
  }

  window.addEventListener("pagehide", () => {
    window.clearTimeout(cutTimer);
    window.clearTimeout(morphTimer);
    window.clearTimeout(finishTimer);
  });
}

const revealElements = Array.from(
  document.querySelectorAll(
    ".section-heading, .trust-strip article, .info-card, .service-card, .price-card, .gallery-card, .testimonial-card, .location-panel, .contact-panel, .transformation-shell"
  )
);

if (revealElements.length) {
  revealElements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
      element.style.removeProperty("--reveal-delay");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }
}
