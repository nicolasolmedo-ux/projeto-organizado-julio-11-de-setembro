const STORAGE_KEY = "saudeinga_v2";
let solicitacoes = loadData();

const $ = (id) => document.getElementById(id);

function loadData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitacoes));
}

function gerarProtocolo() {
  let protocolo;
  do {
    protocolo = `FS-${Math.floor(100000 + Math.random() * 900000)}`;
  } while (solicitacoes.some(item => item.protocolo === protocolo));
  return protocolo;
}

function estimarTempo(item, index) {
  const base = item.prioridade === "Urgente" ? 15 :
              item.prioridade === "Alta" ? 35 :
              item.prioridade === "Normal" ? 60 : 90;
  return `${base + index * 10} min`;
}

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function updateDashboard() {
  const total = solicitacoes.length;
  const consultas = solicitacoes.filter(x => x.tipo === "Consulta").length;
  const exames = solicitacoes.filter(x => x.tipo === "Exame").length;
  const prioridades = solicitacoes.filter(x => ["Alta","Urgente"].includes(x.prioridade)).length;

  $("total").textContent = total;
  $("consultas").textContent = consultas;
  $("exames").textContent = exames;
  $("prioridades").textContent = prioridades;

  $("heroTotal").textContent = total;
  $("heroConsultas").textContent = consultas;
  $("heroExames").textContent = exames;
  $("heroPrioridades").textContent = prioridades;

  const percent = total ? Math.min(100, Math.round((prioridades / total) * 100)) : 0;
  $("queuePercent").textContent = `${percent}%`;
  $("queueProgress").style.width = `${percent}%`;
}

function priorityClass(priority) {
  return priority === "Urgente" ? "priority urgent" : "priority";
}

function renderTable() {
  const search = $("filterInput").value.trim().toLowerCase();
  const type = $("filterType").value;
  const priority = $("filterPriority").value;

  const filtered = solicitacoes.filter(item => {
    const matchesSearch = !search ||
      item.protocolo.toLowerCase().includes(search) ||
      item.especialidade.toLowerCase().includes(search);
    return matchesSearch &&
      (!type || item.tipo === type) &&
      (!priority || item.prioridade === priority);
  });

  if (!filtered.length) {
    $("queueBody").innerHTML = `<tr><td colspan="6">Nenhuma solicitação encontrada.</td></tr>`;
    return;
  }

  $("queueBody").innerHTML = filtered.map((item, index) => `
    <tr>
      <td><b>${esc(item.protocolo)}</b></td>
      <td>${esc(item.tipo)}</td>
      <td>${esc(item.especialidade)}</td>
      <td><span class="${priorityClass(item.prioridade)}">${esc(item.prioridade)}</span></td>
      <td><span class="status">${esc(item.status)}</span></td>
      <td>${estimarTempo(item, index)}</td>
    </tr>
  `).join("");
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function refresh() {
  updateDashboard();
  renderTable();
}

$("requestForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    protocolo: gerarProtocolo(),
    nome: $("nome").value.trim(),
    tipo: $("tipo").value,
    especialidade: $("especialidade").value.trim(),
    prioridade: $("prioridade").value,
    observacao: $("observacao").value.trim(),
    status: "Aguardando regulação",
    data: new Date().toLocaleString("pt-BR")
  };

  solicitacoes.unshift(item);
  saveData();
  refresh();

  $("registerResult").classList.remove("hidden");
  $("registerResult").innerHTML = `
    <h3>✓ Solicitação registrada</h3>
    <p>Use o protocolo abaixo para fazer a consulta.</p>
    <div class="protocol">${esc(item.protocolo)}</div>
    <small>Este protocolo é válido apenas neste navegador.</small>
  `;

  $("requestForm").reset();
  showToast("Protocolo gerado com sucesso.");
  $("registerResult").scrollIntoView({ behavior: "smooth", block: "center" });
});

function consultarProtocolo() {
  const protocol = $("protocolInput").value.trim().toUpperCase();

  if (!protocol) {
    $("searchResult").innerHTML = `<div class="consulta-result"><b>Digite um protocolo.</b><p>Ex.: FS-123456</p></div>`;
    return;
  }

  const item = solicitacoes.find(x => x.protocolo === protocol);

  if (!item) {
    $("searchResult").innerHTML = `<div class="consulta-result"><b>Protocolo não encontrado.</b><p>Confira o número e tente novamente.</p></div>`;
    return;
  }

  const index = solicitacoes.indexOf(item);
  $("searchResult").innerHTML = `
    <div class="consulta-result">
      <span class="status">${esc(item.status)}</span>
      <h3 style="margin:12px 0">${esc(item.protocolo)}</h3>
      <p><b>Tipo:</b> ${esc(item.tipo)}</p>
      <p><b>Serviço:</b> ${esc(item.especialidade)}</p>
      <p><b>Prioridade:</b> <span class="${priorityClass(item.prioridade)}">${esc(item.prioridade)}</span></p>
      <p><b>Tempo estimado:</b> ${estimarTempo(item, index)}</p>
      <p><b>Registrado em:</b> ${esc(item.data)}</p>
    </div>
  `;
}

$("searchBtn").addEventListener("click", consultarProtocolo);
$("protocolInput").addEventListener("keydown", e => {
  if (e.key === "Enter") consultarProtocolo();
});

["filterInput","filterType","filterPriority"].forEach(id => {
  $(id).addEventListener("input", renderTable);
  $(id).addEventListener("change", renderTable);
});

$("clearDataBtn").addEventListener("click", () => {
  if (!solicitacoes.length) {
    showToast("Não há dados para limpar.");
    return;
  }
  if (confirm("Apagar todas as solicitações de teste deste navegador?")) {
    solicitacoes = [];
    saveData();
    refresh();
    $("searchResult").innerHTML = "";
    $("registerResult").classList.add("hidden");
    showToast("Dados de teste apagados.");
  }
});

$("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("saudeinga_theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

if (localStorage.getItem("saudeinga_theme") === "dark") {
  document.body.classList.add("dark-mode");
}

$("menuBtn").addEventListener("click", () => {
  const nav = $("mainNav");
  const open = nav.classList.toggle("open");
  $("menuBtn").setAttribute("aria-expanded", open);
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => $("mainNav").classList.remove("open"));
});

refresh();
