const SERVERS = [
  "Vibecodou",
  "Queremos acordar tarde!",
  "Gateway",
  "Pudim HQ",
  "Família BR",
  "tuxgameplay.fun alpha",
  "Aurora Games",
  "Café com Código",
  "Global: Converse globalmente"
];

const PEOPLE = {
  mari: { name: "Mari", color: "#059669" },
  nico: { name: "Nico", color: "#2563eb" },
  luna: { name: "luna", tag: "luna#2041", color: "#e0306b" },
  theo: { name: "theo", tag: "theo#0969", color: "#7c3aed" },
  bia: { name: "bia", tag: "bia#7712", color: "#d97706" },
  rafa: { name: "rafa", tag: "rafa#3310", color: "#059669" },
  kai: { name: "kai", tag: "kai#0001", color: "#2563eb" },
  leo: { name: "léo", tag: "leo#8890", color: "#0891b2" },
  dani: { name: "dani", tag: "dani#5528", color: "#e0306b" },
  cadu: { name: "cadu", tag: "cadu#6074", color: "#7c3aed" }
};

const GLOBAL_BLUE = "#0330ef";
const GREEN = "#23c55e";

const ARRIVED_TEXT = "olha só, já chegou gente de outros servidores";

const MESSAGES = {
  morning: { kind: "local", author: "mari", text: "bom dia, galera" },
  morningRelay: { kind: "relay", author: "luna", role: "Conversador", accent: GREEN, server: "Família BR", text: "bom dia, família 😄" },
  arrived: { kind: "local", author: "nico", text: ARRIVED_TEXT },
  call: { kind: "relay", author: "theo", server: "Vibecodou", text: "alguém na call?" },
  callReply: { kind: "relay", author: "bia", server: "Pudim HQ", text: "eu vou, me dá 5 min", replyTo: { type: "bot" } },
  lively: { kind: "local", author: "mari", text: "kkkk o chat tá animado hoje" },
  sticker: { kind: "relay", author: "rafa", server: "tuxgameplay.fun alpha", sticker: { emoji: "😎", from: GLOBAL_BLUE, to: "#0a1a6e" } },
  welcome: { kind: "relay", author: "kai", accent: GLOBAL_BLUE, server: "Global: Converse globalmente", text: "bem-vindos ao Global 💙" },
  thanks: { kind: "relay", author: "leo", server: "Aurora Games", text: "valeu pela dica! já tô conectado aqui também", replyTo: { type: "member", author: "nico", text: ARRIVED_TEXT } },
  awake: { kind: "relay", author: "dani", server: "Queremos acordar tarde!", text: "acabei de acordar, que horas são?" },
  code: { kind: "relay", author: "cadu", server: "Café com Código", text: "bora codar? 💻", replyTo: { type: "bot" } }
};

const CHAT_SCRIPT = [
  MESSAGES.morning, MESSAGES.morningRelay, MESSAGES.arrived, MESSAGES.call, MESSAGES.callReply,
  MESSAGES.lively, MESSAGES.sticker, MESSAGES.welcome, MESSAGES.thanks, MESSAGES.awake, MESSAGES.code
];

const STICKERS = [
  { emoji: "😎", from: GLOBAL_BLUE, to: "#0a1a6e" },
  { emoji: "🔥", from: "#e0306b", to: "#7a1239" },
  { emoji: "👀", from: "#7c3aed", to: "#3b1a7a" },
  { emoji: "💙", from: "#059669", to: "#0b3b2c" },
  { emoji: "🫠", from: "#d97706", to: "#7a3f04" },
  { emoji: "🎉", from: "#0891b2", to: "#0a3d4a" }
];

const NETWORK_NODES = [
  { label: "Vibecodou", x: 90, y: 52 },
  { label: "Aurora Games", x: 316, y: 60 },
  { label: "Pudim HQ", x: 62, y: 206 },
  { label: "Família BR", x: 340, y: 214 },
  { label: "Café com Código", x: 200, y: 292 }
];

const formatTime = () => {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const botAvatar = (size = 40) =>
  `<span class="avatar" style="--size:${size}px"><img src="assets/icon.svg" alt=""></span>`;

const initial = (person, size = 22) =>
  `<i class="initial" style="--tint:${person.color};--size:${size}px">${person.name[0].toUpperCase()}</i>`;

function renderReply(replyTo) {
  if (!replyTo) return "";

  if (replyTo.type === "bot") {
    return `
      <div class="reply">
        <span class="reply__curve"></span>
        ${botAvatar(16)}
        <b class="reply__author reply__author--bot">Global</b>
        <span class="reply__text reply__text--muted">A mensagem contém mídia anexada</span>
      </div>`;
  }

  const person = PEOPLE[replyTo.author];
  return `
    <div class="reply">
      <span class="reply__curve"></span>
      ${initial(person, 16)}
      <b class="reply__author reply__author--member">@${person.name}</b>
      <span class="reply__text">${replyTo.text}</span>
    </div>`;
}

function renderEmbed(message, person) {
  const author = `${person.name} (@${person.tag})${message.role ? ` - ${message.role}` : ""}`;
  const content = message.sticker
    ? `<div class="sticker" style="--from:${message.sticker.from};--to:${message.sticker.to}">${message.sticker.emoji}</div>`
    : `<p class="embed__text">${message.text}</p>`;

  return `
    <div class="embed" style="--accent:${message.accent ?? "var(--neutral)"}">
      <div class="embed__author">${initial(person)}<span>${author}</span></div>
      ${content}
      <div class="embed__footer">${message.server}</div>
    </div>`;
}

function renderMessage(message) {
  const person = PEOPLE[message.author];

  if (message.kind === "local") {
    return `
      <div class="message">
        <div class="message__row">
          ${initial(person, 40)}
          <div class="message__body">
            <div class="message__meta"><strong>${person.name}</strong><small>Hoje às ${formatTime()}</small></div>
            <div class="message__text">${message.text}</div>
          </div>
        </div>
      </div>`;
  }

  const mention = message.replyTo?.type === "member"
    ? `<div class="message__mention">@${PEOPLE[message.replyTo.author].name}</div>`
    : "";

  return `
    <div class="message">
      ${renderReply(message.replyTo)}
      <div class="message__row">
        ${botAvatar()}
        <div class="message__body">
          <div class="message__meta">
            <strong class="message__bot-name">Global</strong>
            <em class="message__badge">BOT</em>
            <small>Hoje às ${formatTime()}</small>
          </div>
          ${mention}
          ${renderEmbed(message, person)}
        </div>
      </div>
    </div>`;
}

function buildGlobe() {
  const spin = $("#globe-spin");
  const radius = 200;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 6; i++) {
    const meridian = document.createElement("div");
    meridian.className = "globe__ring";
    meridian.style.transform = `rotateY(${i * 30}deg)`;
    fragment.append(meridian);
  }

  [-60, -30, 0, 30, 60].forEach((latitude) => {
    const angle = (latitude * Math.PI) / 180;
    const size = 2 * radius * Math.cos(angle);
    const parallel = document.createElement("div");

    parallel.className = "globe__ring";
    parallel.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      margin: ${-size / 2}px 0 0 ${-size / 2}px;
      transform: translateY(${radius * Math.sin(angle)}px) rotateX(90deg);
    `;
    fragment.append(parallel);
  });

  SERVERS.forEach((server, index) => {
    const tag = document.createElement("span");
    const yaw = (360 / SERVERS.length) * index;
    const pitch = index % 2 === 0 ? 18 - index * 3 : -(14 + index * 2);

    tag.className = "globe__tag";
    tag.classList.toggle("globe__tag--official", index === SERVERS.length - 1);
    tag.textContent = server;
    tag.style.transform = `rotateY(${yaw}deg) rotateX(${pitch}deg) translateZ(${radius + 8}px) translate(-50%, -50%)`;
    fragment.append(tag);
  });

  spin.append(fragment);
}

function startChat() {
  const feed = $("#chat-feed");
  let visible = false;
  let cursor = 0;

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(feed);

  const showNext = () => {
    if (!visible) {
      setTimeout(showNext, 600);
      return;
    }

    const typing = document.createElement("div");
    typing.className = "typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    feed.append(typing);

    setTimeout(() => {
      typing.remove();
      feed.insertAdjacentHTML("beforeend", renderMessage(CHAT_SCRIPT[cursor]));

      while (feed.scrollHeight > feed.clientHeight + 2 && feed.children.length > 1) {
        feed.firstElementChild.remove();
      }

      cursor = (cursor + 1) % CHAT_SCRIPT.length;
      setTimeout(showNext, 1700);
    }, 800);
  };

  showNext();
}

function renderNetwork() {
  const center = { x: 200, y: 160 };

  const links = NETWORK_NODES
    .map((node) => `<line class="network__link" x1="${node.x}" y1="${node.y}" x2="${center.x}" y2="${center.y}"/>`)
    .join("");

  const nodes = NETWORK_NODES
    .map(({ label, x, y }) => {
      const width = label.length * 7 + 26;
      return `
        <rect class="network__node" x="${x - width / 2}" y="${y - 15}" width="${width}" height="30" rx="8"/>
        <text class="network__label" x="${x}" y="${y + 4}">${label}</text>`;
    })
    .join("");

  return `
    <svg class="network" viewBox="0 0 400 330" aria-hidden="true">
      ${links}
      <circle class="network__pulse" cx="${center.x}" cy="${center.y}" r="30"/>
      <circle cx="${center.x}" cy="${center.y}" r="34" fill="${GLOBAL_BLUE}"/>
      <text class="network__label" x="${center.x}" y="${center.y + 5}" style="fill:#fff;font-size:13px;font-weight:800">Global</text>
      ${nodes}
    </svg>`;
}

function initFeaturePreviews() {
  const stack = $("#preview-stack");
  const features = $$(".feature");

  const previews = [
    `<div style="display:grid;gap:16px">${renderMessage(MESSAGES.call)}${renderMessage(MESSAGES.callReply)}</div>`,
    `<div class="vanish">${renderMessage(MESSAGES.callReply)}</div>
     <div class="sync">
       <div style="--delay:0s">Vibecodou</div>
       <div style="--delay:0.25s">Aurora Games</div>
       <div style="--delay:0.5s">Pudim HQ</div>
     </div>`,
    `<div class="sticker-grid">${STICKERS
      .map((s, i) => `<div class="sticker" style="--from:${s.from};--to:${s.to};--delay:${i * 0.25}s">${s.emoji}</div>`)
      .join("")}</div>`,
    renderNetwork()
  ];

  stack.innerHTML = previews.map((html) => `<div class="preview__item">${html}</div>`).join("");
  const items = $$(".preview__item", stack);

  const activate = (index) => {
    features.forEach((feature, i) => feature.classList.toggle("is-active", i === index));
    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
  };

  activate(0);

  const band = isCompact() ? "-58% 0px -22% 0px" : "-42% 0px -42% 0px";
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activate(Number(entry.target.dataset.feature));
    });
  }, { rootMargin: band });

  features.forEach((feature) => observer.observe(feature));
}

function initScrollEffects() {
  const links = $$(".sidebar__link");

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle("is-active", link.dataset.section === entry.target.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  $$(".page > section").forEach((section) => spy.observe(section));
}

function animateNumber(element, target, duration) {
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.round(target * (1 - (1 - progress) ** 3));
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = $$("[data-count]");

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    counters.forEach((counter) => animateNumber(counter, Number(counter.dataset.count), 1500));
    observer.disconnect();
  });

  observer.observe($("#demo-stage"));
}

function initTilt() {
  const stage = $("#demo-stage");
  const scene = $("#demo-scene");
  const globe = $("#globe-tilt");

  if (prefersReducedMotion) {
    scene.style.transform = "rotateX(8deg) rotateY(-12deg)";
    return;
  }

  const pointer = { x: 0, y: 0 };
  const stagePointer = { x: 0, y: 0 };
  const sceneAngle = { x: 12, y: -20 };
  const globeAngle = { x: 0, y: 0 };
  const visible = { stage: false, hero: true };

  const watch = (element, key) =>
    new IntersectionObserver(([entry]) => { visible[key] = entry.isIntersecting; }).observe(element);

  watch(stage, "stage");
  watch($("#inicio"), "hero");

  addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    pointer.x = event.clientX / innerWidth - 0.5;
    pointer.y = event.clientY / innerHeight - 0.5;
  });

  stage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const { left, top, width, height } = stage.getBoundingClientRect();
    stagePointer.x = (event.clientX - left) / width - 0.5;
    stagePointer.y = (event.clientY - top) / height - 0.5;
  });

  stage.addEventListener("pointerleave", () => {
    stagePointer.x = 0;
    stagePointer.y = 0;
  });

  const ease = (from, to, amount) => from + (to - from) * amount;

  const frame = () => {
    if (visible.stage) {
      const { top, height } = stage.getBoundingClientRect();
      const progress = Math.min(Math.max((innerHeight - top) / (innerHeight + height), 0), 1);
      const compact = isCompact();

      const targetY = compact ? -7 + progress * 7 : -24 + progress * 24 + stagePointer.x * 14;
      const targetX = compact ? 5 - progress * 4 : 12 - progress * 8 - stagePointer.y * 12;

      sceneAngle.y = ease(sceneAngle.y, targetY, 0.08);
      sceneAngle.x = ease(sceneAngle.x, targetX, 0.08);
      scene.style.transform = `rotateX(${sceneAngle.x}deg) rotateY(${sceneAngle.y}deg)`;
    }

    if (visible.hero) {
      globeAngle.x = ease(globeAngle.x, pointer.y * -18, 0.06);
      globeAngle.y = ease(globeAngle.y, pointer.x * 26, 0.06);
      globe.style.transform = `rotateX(${globeAngle.x + 10}deg) rotateY(${globeAngle.y}deg) rotateZ(-14deg)`;
    }

    requestAnimationFrame(frame);
  };

  frame();
}

function initCopyButtons() {
  $$("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = $(button.dataset.copy).textContent;

      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copiado!";
      } catch {
        button.textContent = "Selecione e copie";
      }

      setTimeout(() => { button.textContent = "Copiar"; }, 1800);
    });
  });
}

buildGlobe();
startChat();
initFeaturePreviews();
initScrollEffects();
initCounters();
initTilt();
initCopyButtons();
