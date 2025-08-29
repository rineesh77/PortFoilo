// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle with persistence (uses Bootstrap color modes via data-bs-theme)
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('rt_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
}
themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', next);
  localStorage.setItem('rt_theme', next);
  themeBtn.innerHTML = next === 'dark' ? '<i class="bi bi-sun"></i> Theme' : '<i class="bi bi-moon-stars"></i> Theme';
});
// Initialize icon state
(function(){
  const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
  themeBtn.innerHTML = current === 'dark' ? '<i class="bi bi-sun"></i> Theme' : '<i class="bi bi-moon-stars"></i> Theme';
})();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }});
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Copy code
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-target');
    const codeEl = document.getElementById(id);
    try {
      await navigator.clipboard.writeText(codeEl.textContent);
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(()=> btn.textContent = 'Copy', 1200);
    } catch(err){
      alert('Copy failed. Select and copy manually.');
    }
  });
});

// Full‑Stack simulation
const simulateBtn = document.getElementById('simulateFlow');
const steps = [...document.querySelectorAll('.step')];
const flowLog = document.getElementById('flowLog');
simulateBtn.addEventListener('click', () => {
  steps.forEach(s => s.classList.remove('active'));
  flowLog.textContent = '// Simulating GET /api/posts\n';
  const seq = [
    { i:0, msg:'Client → Server: GET /api/posts' },
    { i:1, msg:'Server: Validate request, check auth, build query' },
    { i:2, msg:'DB: SELECT * FROM posts ORDER BY created_at DESC' },
    { i:1, msg:'Server → Client: 200 OK, JSON payload' },
    { i:0, msg:'Client: Render posts to the UI' },
  ];
  seq.forEach((step, idx) => {
    setTimeout(() => {
      steps[step.i].classList.add('active');
      flowLog.textContent += '> ' + step.msg + '\n';
      setTimeout(()=> steps[step.i].classList.remove('active'), 900);
    }, idx * 950);
  });
});

// CSS Hue Playground
const hue = document.getElementById('hue');
const savedHue = localStorage.getItem('rt_hue');
if (savedHue) { hue.value = savedHue; root.style.setProperty('--accent-hue', savedHue); }
hue.addEventListener('input', (e) => {
  root.style.setProperty('--accent-hue', e.target.value);
  localStorage.setItem('rt_hue', e.target.value);
});

// To‑Do App
const key = 'rt_todos';
const listEl = document.getElementById('todoList');
const inputEl = document.getElementById('todoInput');
let todos = JSON.parse(localStorage.getItem(key) || '[]');
function save(){ localStorage.setItem(key, JSON.stringify(todos)); }
function render(){
  listEl.innerHTML = '';
  todos.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (t.done ? ' done' : '');
    item.innerHTML = `
      <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="Done">
      <span>${t.text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>
      <button class="btn btn-sm btn-outline-danger" aria-label="Delete">
        <i class="bi bi-trash"></i>
      </button>`;
    // toggle
    item.children[0].addEventListener('change', () => { t.done = !t.done; save(); render(); });
    // delete
    item.children[2].addEventListener('click', () => { todos.splice(i, 1); save(); render(); });
    listEl.appendChild(item);
  });
}
document.getElementById('todoForm').addEventListener('submit', e => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if(!text) return;
  todos.push({ text, done: false });
  inputEl.value = '';
  save(); render();
});
document.getElementById('clearAll').addEventListener('click', () => { todos = []; save(); render(); });
render();

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if(window.scrollY > 500){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Option B helper: update labels/icons on "Show code" buttons =====
document.querySelectorAll('.code-toggle').forEach(btn => {
  const targetSel = btn.getAttribute('data-bs-target');
  const target = document.querySelector(targetSel);
  if (!target) return;

  const showText = btn.getAttribute('data-show-text') || 'Show code';
  const hideText = btn.getAttribute('data-hide-text') || 'Hide code';

  const update = () => {
    const open = target.classList.contains('show');
    btn.innerHTML = open
      ? `<i class="bi bi-chevron-up"></i> ${hideText}`
      : `<i class="bi bi-chevron-down"></i> ${showText}`;
  };

  // Initial state
  update();

  // Update on collapse show/hide
  target.addEventListener('shown.bs.collapse', update);
  target.addEventListener('hidden.bs.collapse', update);
});