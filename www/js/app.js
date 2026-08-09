const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

const saved = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', saved);

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    // Futuro: abrir categoria
    alert(card.dataset.cat);
  });
});
