const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const home = document.getElementById('home');
const categoryView = document.getElementById('category');
const catContent = document.getElementById('cat-content');
const title = document.getElementById('title');
const back = document.getElementById('back');
const addForm = document.getElementById('add-form');
const newItem = document.getElementById('new-item');

let currentCat = null;

const data = JSON.parse(localStorage.getItem('rotina-data') || '{}');

const templates = {
  casa: [
    { text: 'Lavar louça', done: false },
    { text: 'Limpar banheiro', done: false },
    { text: 'Varrer/aspirar', done: false },
    { text: 'Lavar roupa', done: false },
    { text: 'Tirar lixo', done: false }
  ],
  trabalho: [
    { text: 'Reunião 09:00', done: false, meta: '09:00' },
    { text: 'Entregar relatório', done: false },
    { text: 'Responder e-mails', done: false }
  ],
  lazer: [
    { text: 'Jogar 30 min', done: false },
    { text: 'Assistir série', done: false },
    { text: 'Sair pra caminhar', done: false }
  ],
  leitura: [
    { text: 'Ler 20 páginas', done: false, meta: 'páginas' },
    { text: 'Terminar capítulo', done: false },
    { text: 'Anotar trechos', done: false }
  ],
  saude: [
    { text: 'Treino de força', done: false },
    { text: 'Beber 2L água', done: false },
    { text: 'Medir peso', done: false }
  ],
  financas: [
    { text: 'Pagar contas', done: false },
    { text: 'Registrar gastos', done: false },
    { text: 'Revisar orçamento', done: false }
  ]
};

const names = {
  casa: 'Casa',
  trabalho: 'Trabalho',
  lazer: 'Lazer',
  leitura: 'Leitura',
  saude: 'Saúde',
  financas: 'Finanças'
};

const saved = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', saved);
toggle.onclick = () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
};

function save() {
  localStorage.setItem('rotina-data', JSON.stringify(data));
}

function getList(cat) {
  if (!data[cat]) data[cat] = [...(templates[cat] || [])];
  return data[cat];
}

function renderList(cat) {
  const list = getList(cat);
  let html = '';

  if (cat === 'saude') {
    const metrics = data.saudeMetrics || { peso: 70, ganho: 0, perda: 0 };
    html += `
      <div class="metrics">
        <div class="metric"><div class="value">${metrics.peso} kg</div><div class="label">Peso atual</div></div>
        <div class="metric"><div class="value">+${metrics.ganho} kg</div><div class="label">Ganho</div></div>
        <div class="metric"><div class="value">-${metrics.perda} kg</div><div class="label">Perda</div></div>
        <div class="metric"><div class="value">Água</div><div class="label">2L / dia</div></div>
      </div>`;
  }

  html += '<ul class="list">';
  list.forEach((item, i) => {
    html += `
      <li class="item ${item.done ? 'done' : ''}">
        <input type="checkbox" ${item.done ? 'checked' : ''} data-i="${i}">
        <span>${item.text}</span>
        ${item.meta ? `<span class="meta">${item.meta}</span>` : ''}
      </li>`;
  });
  html += '</ul>';
  catContent.innerHTML = html;

  catContent.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.onchange = () => {
      const i = +cb.dataset.i;
      list[i].done = cb.checked;
      save();
      renderList(cat);
    };
  });
}

function openCat(cat) {
  currentCat = cat;
  title.textContent = names[cat];
  home.classList.add('hidden');
  categoryView.classList.remove('hidden');
  back.classList.remove('hidden');
  renderList(cat);
}

function goHome() {
  currentCat = null;
  title.textContent = '✦ Rotina';
  categoryView.classList.add('hidden');
  home.classList.remove('hidden');
  back.classList.add('hidden');
}

document.querySelectorAll('.card').forEach(card => {
  card.onclick = () => openCat(card.dataset.cat);
});

back.onclick = goHome;

addForm.onsubmit = e => {
  e.preventDefault();
  if (!currentCat) return;
  const text = newItem.value.trim();
  if (!text) return;
  getList(currentCat).push({ text, done: false });
  save();
  newItem.value = '';
  renderList(currentCat);
};
