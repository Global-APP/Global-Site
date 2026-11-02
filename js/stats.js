const STATS_URL = "https://api.globalbot.site/stats";
const REFRESH_MS = 60_000;

const formatNumber = (value) => Number(value).toLocaleString("pt-BR");

let lastRanking = "";

function setStatus(message) {
  $("#stats-status").textContent = message;
}

function updateCounters(data) {
  $$("[data-stat]").forEach((element) => {
    const target = Number(data[element.dataset.stat]) || 0;

    animateNumber(element, target, 1200, Number(element.dataset.value) || 0);
    element.dataset.value = target;
  });
}

function createRankItem(entry, index) {
  const item = document.createElement("li");

  item.className = "rank";
  item.style.setProperty("--delay", `${index * 0.12}s`);
  item.innerHTML = `
    <b class="rank__position">${index + 1}</b>
    <span class="rank__name">${escapeHtml(entry.nome)}</span>
    <span class="rank__total">${formatNumber(entry.mensagens)} <small>mensagens</small></span>`;

  const avatar = createAvatar({ name: entry.nome, source: entry.avatar ?? entry.icone, className: "rank__avatar" });
  item.querySelector(".rank__position").after(avatar);

  return item;
}

function renderRanking(list, entries) {
  if (entries.length === 0) {
    const empty = document.createElement("li");

    empty.className = "ranking__empty";
    empty.textContent = "Ainda sem dados por aqui.";
    list.replaceChildren(empty);
    return;
  }

  list.replaceChildren(...entries.map(createRankItem));
}

function renderStats(data) {
  updateCounters(data);

  const snapshot = JSON.stringify([data.topUsuarios, data.topServidores]);
  if (snapshot === lastRanking) return;

  lastRanking = snapshot;
  renderRanking($("#ranking-users"), data.topUsuarios ?? []);
  renderRanking($("#ranking-servers"), data.topServidores ?? []);
}

async function loadStats() {
  try {
    const response = await fetch(STATS_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Resposta ${response.status}`);

    const data = await response.json();
    const updatedAt = new Date(data.atualizadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    renderStats(data);
    setStatus(`Atualizado às ${updatedAt}`);
  } catch {
    setStatus("Não foi possível carregar as estatísticas agora. Tente de novo em instantes.");
  }
}

initSceneTilt($("#stats-stage"), $("#stats-scene"));
loadStats();
setInterval(() => {
  if (!document.hidden) loadStats();
}, REFRESH_MS);
