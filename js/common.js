const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCompact = () => matchMedia("(max-width: 960px)").matches;

const LINKS = {
  invite: "https://web.fluxer.app/oauth2/authorize?client_id=1562253521942745089&scope=bot&permissions=22527189434367169",
  support: "https://fluxer.gg/hDYAW1OU",
  github: "https://github.com/Global-APP/global",
  issues: "https://github.com/Global-APP/global/issues"
};

function initLinks() {
  $$("[data-link]").forEach((anchor) => {
    anchor.href = LINKS[anchor.dataset.link];
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  });
}

function initTheme() {
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem("global-theme");
    if (saved) root.dataset.theme = saved;
  } catch {}

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("global-theme", theme);
    } catch {}
  };

  const switchTheme = (originX, originY) => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      applyTheme(next);
      return;
    }

    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      const radius = Math.hypot(
        Math.max(originX, innerWidth - originX),
        Math.max(originY, innerHeight - originY)
      );

      root.animate(
        { clipPath: [`circle(0 at ${originX}px ${originY}px)`, `circle(${radius}px at ${originX}px ${originY}px)`] },
        { duration: 900, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  $$("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const { left, top, width, height } = button.getBoundingClientRect();
      switchTheme(left + width / 2, top + height / 2);
    });
  });
}

function initMenu() {
  const menu = $("#menu");

  $("[data-menu-open]").addEventListener("click", () => menu.showModal());
  $("[data-menu-close]").addEventListener("click", () => menu.close());
  $$("a", menu).forEach((link) => link.addEventListener("click", () => menu.close()));
}

function initReveal() {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  $$(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 100}ms`;
    reveal.observe(element);
  });
}

const BRAND_COLOR = "#0330ef";
const VIDEO_PATTERN = /\.(mp4|webm)$/i;

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function animateNumber(element, target, duration, from = 0) {
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (target - from) * (1 - (1 - progress) ** 3);

    element.textContent = Math.round(value).toLocaleString("pt-BR");
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function createMedia(source) {
  if (!VIDEO_PATTERN.test(source)) {
    const image = new Image();

    image.alt = "";
    image.src = source;
    return image;
  }

  const video = document.createElement("video");

  Object.assign(video, { src: source, autoplay: true, loop: true, muted: true, playsInline: true });
  return video;
}

function createAvatar({ name, source, letter = name[0].toUpperCase(), accent = BRAND_COLOR, className = "" }) {
  const placeholder = document.createElement("i");

  placeholder.className = `initial ${className}`.trim();
  placeholder.style.setProperty("--tint", accent);
  placeholder.textContent = letter;

  if (!source) return placeholder;

  const wrapper = document.createElement("span");
  const media = createMedia(source);

  wrapper.className = `avatar ${className}`.trim();
  media.addEventListener("error", () => wrapper.replaceWith(placeholder));
  wrapper.append(media);

  return wrapper;
}

function initSceneTilt(stage, scene) {
  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;

    const { left, top, width, height } = stage.getBoundingClientRect();
    scene.style.setProperty("--tilt-x", (event.clientY - top) / height - 0.5);
    scene.style.setProperty("--tilt-y", (event.clientX - left) / width - 0.5);
  });

  stage.addEventListener("pointerleave", () => {
    scene.style.setProperty("--tilt-x", 0);
    scene.style.setProperty("--tilt-y", 0);
  });
}

initLinks();
initTheme();
initMenu();
initReveal();
