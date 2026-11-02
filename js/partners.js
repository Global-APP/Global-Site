const DEFAULT_ACCENT = "#0330ef";

const JOIN_CARD = {
  name: "Quer ser parceiro?",
  description: "Entre no servidor de suporte e fale com a gente para colocar a sua comunidade aqui.",
  invite: LINKS.support,
  letter: "+",
  label: "Falar com a gente"
};

const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const VIDEO_PATTERN = /\.(mp4|webm)$/i;

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

function createIcon({ name, icon, letter = name[0].toUpperCase(), accent = DEFAULT_ACCENT }) {
  const placeholder = document.createElement("i");
  placeholder.className = "initial partner__icon";
  placeholder.style.setProperty("--tint", accent);
  placeholder.textContent = letter;

  if (!icon) return placeholder;

  const wrapper = document.createElement("span");
  const media = createMedia(icon);

  wrapper.className = "avatar partner__icon";
  media.addEventListener("error", () => wrapper.replaceWith(placeholder));
  wrapper.append(media);

  return wrapper;
}

function createCard(partner, index) {
  const { name, description, invite, accent = DEFAULT_ACCENT, button, label = "Entrar no servidor" } = partner;
  const card = document.createElement("article");

  card.className = "partner";
  card.style.setProperty("--accent", accent);
  if (button) card.style.setProperty("--button", button);
  card.style.setProperty("--delay", `${index * 0.12}s`);
  card.innerHTML = `
    <div class="partner__banner"></div>
    <div class="partner__body">
      <h3 class="partner__name">${escapeHtml(name)}</h3>
      <p class="partner__text">${escapeHtml(description)}</p>
      <a class="partner__join" href="${escapeHtml(invite)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>
    </div>`;

  card.querySelector(".partner__body").prepend(createIcon(partner));
  return card;
}

function renderPartners() {
  const scene = $("#partners-scene");
  const cards = [...PARTNERS, JOIN_CARD].map(createCard);

  scene.append(...cards);
}

function initSceneTilt() {
  const stage = $("#partners-stage");
  const scene = $("#partners-scene");

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

function initCardTilt() {
  const scene = $("#partners-scene");

  const reset = (card) => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  scene.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".partner");
    if (!card || event.pointerType !== "mouse") return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    card.style.setProperty("--rx", `${y * -10}deg`);
    card.style.setProperty("--ry", `${x * 12}deg`);
  });

  scene.addEventListener("pointerout", (event) => {
    const card = event.target.closest(".partner");
    if (card && !card.contains(event.relatedTarget)) reset(card);
  });
}

renderPartners();
initSceneTilt();
initCardTilt();
