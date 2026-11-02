const JOIN_CARD = {
  name: "Quer ser parceiro?",
  description: "Entre no servidor de suporte e fale com a gente para colocar a sua comunidade aqui.",
  invite: LINKS.support,
  letter: "+",
  label: "Falar com a gente"
};

function createCard(partner, index) {
  const { name, description, invite, icon, letter, accent = BRAND_COLOR, button, label = "Entrar no servidor" } = partner;
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

  const avatar = createAvatar({ name, source: icon, letter, accent, className: "partner__icon" });
  card.querySelector(".partner__body").prepend(avatar);

  return card;
}

function renderPartners() {
  const scene = $("#partners-scene");
  const cards = [...PARTNERS, JOIN_CARD].map(createCard);

  scene.append(...cards);
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
initSceneTilt($("#partners-stage"), $("#partners-scene"));
initCardTilt();
