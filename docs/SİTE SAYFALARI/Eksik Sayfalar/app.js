// ============================================================
// YKS KONU TAKİP - APP.JS
// ============================================================

// ---- State ----
let state = {
  completed: {},   // { topicKey: true }
  stars: {},       // { topicKey: 1-5 }
};

// ---- Modal State ----
let currentModalTopic = null;

// ---- Audio ----
const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

function playCompleteSound() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.4);
}

// ---- LocalStorage ----
function loadState() {
  try {
    const saved = localStorage.getItem('yks_tracker_v2');
    if (saved) state = JSON.parse(saved);
  } catch(e) { console.error('State load error', e); }
}

function saveState() {
  localStorage.setItem('yks_tracker_v2', JSON.stringify(state));
}

// ---- Helpers ----
function topicKey(examId, subjectId, topicName) {
  return `${examId}__${subjectId}__${topicName}`;
}

function getSubjectTopics(subjectId, topics) {
  let done = 0;
  topics.forEach(t => {
    const k = Object.keys(state.completed).find(key => key.includes(`__${subjectId}__`) && key.endsWith(`__${t}`));
    // Better: build the key from subjectId
    if (state.completed[`tyt__${subjectId}__${t}`] || state.completed[`ayt__${subjectId}__${t}`]) done++;
  });
  return { total: topics.length, done };
}

function getExamProgress(examId) {
  let total = 0, done = 0;
  YKS_DATA[examId].subjects.forEach(subj => {
    total += subj.topics.length;
    subj.topics.forEach(t => {
      if (state.completed[topicKey(examId, subj.id, t)]) done++;
    });
  });
  return { total, done, pct: total > 0 ? Math.round(done / total * 100) : 0 };
}

function getSubjectProgress(examId, subjectId, topics) {
  const done = topics.filter(t => state.completed[topicKey(examId, subjectId, t)]).length;
  return { total: topics.length, done, pct: topics.length > 0 ? Math.round(done / topics.length * 100) : 0 };
}

function getGlobalProgress() {
  const tyt = getExamProgress('tyt');
  const ayt = getExamProgress('ayt');
  const total = tyt.total + ayt.total;
  const done = tyt.done + ayt.done;
  return { total, done, pct: total > 0 ? Math.round(done / total * 100) : 0 };
}

// ---- Toast ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ---- Ripple ----
function addRipple(e, el) {
  const r = document.createElement('span');
  r.className = 'ripple';
  const rect = el.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left) + 'px';
  r.style.top = (e.clientY - rect.top) + 'px';
  el.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

// ---- Page Navigation ----
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'home') updateHomeStats();
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ---- BUILD SUBJECT CARDS ----
function buildSubjectCard(examId, subject, delay = 0) {
  const { id: subjectId, label, icon, color, topics } = subject;
  const prog = getSubjectProgress(examId, subjectId, topics);

  const card = document.createElement('div');
  card.className = 'subject-card';
  card.id = `subj-card-${subjectId}`;
  card.style.animationDelay = delay + 'ms';

  card.innerHTML = `
    <div class="subject-header" onclick="toggleSubject('${subjectId}')">
      <span class="subject-icon">${icon}</span>
      <div class="subject-info">
        <div class="subject-name">${label}</div>
        <div class="subject-progress-text">${prog.done} / ${prog.total} konu tamamlandı</div>
      </div>
      <div class="subject-bar-wrap">
        <div class="subject-bar">
          <div class="subject-bar-fill" id="bar-${subjectId}" style="background: linear-gradient(90deg, ${color}, ${color}99); width: ${prog.pct}%"></div>
        </div>
        <div class="subject-pct" id="pct-${subjectId}">${prog.pct}%</div>
      </div>
      <span class="subject-chevron">▼</span>
    </div>
    <div class="topics-grid" id="grid-${subjectId}">
      ${topics.map((topic, i) => buildTopicItem(examId, subjectId, topic, color, i)).join('')}
    </div>
  `;
  return card;
}

function buildTopicItem(examId, subjectId, topic, color, index) {
  const key = topicKey(examId, subjectId, topic);
  const isCompleted = !!state.completed[key];
  const starCount = state.stars[key] || 0;

  const starsHtml = [1,2,3,4,5].map(n =>
    `<span class="star ${n <= starCount ? 'active' : ''}" 
      onclick="setStar('${examId}','${subjectId}','${escapeQ(topic)}', ${n}, event)"
      title="${n} yıldız">⭐</span>`
  ).join('');

  return `
    <div class="topic-item ${isCompleted ? 'completed' : ''}" 
      id="topic-${key}" 
      style="animation-delay: ${index * 30}ms">
      <div class="topic-top">
        <span class="topic-name">${topic}</span>
        <span class="topic-complete-badge">✅</span>
      </div>
      <div class="topic-stars">${starsHtml}</div>
      <div class="topic-actions">
        <button class="topic-btn btn-complete ${isCompleted ? 'done' : ''}" 
          onclick="toggleComplete('${examId}','${subjectId}','${escapeQ(topic)}', event)">
          ${isCompleted ? '✅ Tamamlandı' : '☐ Tamamla'}
        </button>
        <button class="topic-btn btn-video"
          onclick="openModal('${examId}','${subjectId}','${escapeQ(topic)}', 'video')">
          📺 Video
        </button>
        <button class="topic-btn btn-pdf"
          onclick="openModal('${examId}','${subjectId}','${escapeQ(topic)}', 'pdf')">
          📄 PDF
        </button>
      </div>
    </div>
  `;
}

function escapeQ(str) {
  return str.replace(/'/g, "\\'");
}

// ---- Toggle Subject Accordion ----
function toggleSubject(subjectId) {
  const card = document.getElementById(`subj-card-${subjectId}`);
  card.classList.toggle('open');
}

// ---- Toggle Complete ----
function toggleComplete(examId, subjectId, topic, event) {
  if (event) { event.stopPropagation(); addRipple(event, event.currentTarget); }
  const key = topicKey(examId, subjectId, topic);
  const wasCompleted = !!state.completed[key];
  if (wasCompleted) {
    delete state.completed[key];
  } else {
    state.completed[key] = true;
    playCompleteSound();
    showToast('✅ Konu tamamlandı: ' + topic);
  }
  saveState();
  refreshTopicItem(examId, subjectId, topic, key);
  refreshSubjectProgress(examId, subjectId);
  refreshExamProgress(examId);
  updateHomeStats();
}

function refreshTopicItem(examId, subjectId, topic, key) {
  const el = document.getElementById('topic-' + key);
  if (!el) return;
  const isCompleted = !!state.completed[key];
  el.classList.toggle('completed', isCompleted);
  const btn = el.querySelector('.btn-complete');
  if (btn) {
    btn.textContent = isCompleted ? '✅ Tamamlandı' : '☐ Tamamla';
    btn.classList.toggle('done', isCompleted);
  }
}

function setStar(examId, subjectId, topic, n, event) {
  event.stopPropagation();
  const key = topicKey(examId, subjectId, topic);
  const current = state.stars[key] || 0;
  state.stars[key] = current === n ? 0 : n;
  saveState();
  // Update stars in DOM
  const el = document.getElementById('topic-' + key);
  if (el) {
    const stars = el.querySelectorAll('.topic-stars .star');
    stars.forEach((s, i) => {
      s.classList.toggle('active', i < state.stars[key]);
    });
  }
  // Modal stars
  if (currentModalTopic && currentModalTopic.key === key) {
    updateModalStars(state.stars[key]);
  }
}

// ---- Refresh Progress ----
function refreshSubjectProgress(examId, subjectId) {
  const subj = YKS_DATA[examId].subjects.find(s => s.id === subjectId);
  if (!subj) return;
  const prog = getSubjectProgress(examId, subjectId, subj.topics);
  const bar = document.getElementById('bar-' + subjectId);
  const pct = document.getElementById('pct-' + subjectId);
  const card = document.getElementById('subj-card-' + subjectId);
  if (bar) bar.style.width = prog.pct + '%';
  if (pct) pct.textContent = prog.pct + '%';
  if (card) {
    const info = card.querySelector('.subject-progress-text');
    if (info) info.textContent = `${prog.done} / ${prog.total} konu tamamlandı`;
  }
}

function refreshExamProgress(examId) {
  const prog = getExamProgress(examId);
  const arc = document.getElementById(`${examId}OverallArc`);
  const pct = document.getElementById(`${examId}OverallPct`);
  if (arc) arc.setAttribute('stroke-dasharray', `${prog.pct} ${100 - prog.pct}`);
  if (pct) pct.textContent = prog.pct + '%';
}

// ---- Home Stats ----
function updateHomeStats() {
  const global = getGlobalProgress();
  const tyt = getExamProgress('tyt');
  const ayt = getExamProgress('ayt');

  setText('homeTotalTopics', global.total);
  setText('homeCompletedTopics', global.done);
  setText('homePercent', '%' + global.pct);

  setWidth('tytHomeProgress', tyt.pct + '%');
  setWidth('aytHomeProgress', ayt.pct + '%');
  setText('tytHomePercent', '%' + tyt.pct);
  setText('aytHomePercent', '%' + ayt.pct);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function setWidth(id, val) {
  const el = document.getElementById(id);
  if (el) el.style.width = val;
}

// ---- Render Subjects ----
function renderSubjects(examId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  YKS_DATA[examId].subjects.forEach((subj, i) => {
    const card = buildSubjectCard(examId, subj, i * 50);
    container.appendChild(card);
  });
  refreshExamProgress(examId);
}

// ---- Dashboard ----
function renderDashboard() {
  const global = getGlobalProgress();
  const tyt = getExamProgress('tyt');
  const ayt = getExamProgress('ayt');

  setText('dashTotal', global.total);
  setText('dashCompleted', global.done);
  setText('dashRemaining', global.total - global.done);
  setText('dashPercent', '%' + global.pct);
  setText('dashTytPct', tyt.pct + '%');
  setText('dashAytPct', ayt.pct + '%');

  // Animate arcs (circumference 50*2*PI ≈ 314)
  animateArc('dashTytArc', tyt.pct, 314);
  animateArc('dashAytArc', ayt.pct, 314);

  // Subject rows
  const container = document.getElementById('dashSubjectsProgress');
  container.innerHTML = '<h3 style="font-family:\'Syne\',sans-serif;font-size:1rem;font-weight:700;margin-bottom:1rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;">Ders Bazlı İlerleme</h3>';

  ['tyt','ayt'].forEach(examId => {
    YKS_DATA[examId].subjects.forEach(subj => {
      const prog = getSubjectProgress(examId, subj.id, subj.topics);
      const row = document.createElement('div');
      row.className = 'dash-subj-row';
      row.innerHTML = `
        <span class="dash-subj-icon">${subj.icon}</span>
        <span class="dash-subj-name">${subj.label}</span>
        <span class="dash-subj-exam">${examId.toUpperCase()}</span>
        <div class="dash-subj-bar">
          <div class="dash-subj-bar-fill" style="background: linear-gradient(90deg, ${subj.color}, ${subj.color}88); width: ${prog.pct}%"></div>
        </div>
        <span class="dash-subj-pct" style="color:${subj.color}">${prog.pct}%</span>
      `;
      container.appendChild(row);
    });
  });
}

function animateArc(id, pct, circumference) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = (pct / 100) * circumference;
  el.setAttribute('stroke-dasharray', `${target} ${circumference - target}`);
}

// ---- Modal ----
function openModal(examId, subjectId, topic, tab) {
  const key = topicKey(examId, subjectId, topic);
  currentModalTopic = { examId, subjectId, topic, key };

  document.getElementById('modalTitle').textContent = topic;
  updateModalStars(state.stars[key] || 0);
  updateModalCompleteBtn(!!state.completed[key]);

  // Video section
  const videoDiv = document.getElementById('modalVideo');
  const searchQuery = encodeURIComponent(topic + ' konu anlatımı');
  videoDiv.innerHTML = `
    <div class="modal-video-placeholder">
      <span>📺</span>
      <span>YouTube'da "${topic}" için arama yapın</span>
      <a href="https://www.youtube.com/results?search_query=${searchQuery}" target="_blank" rel="noopener" 
        style="color: var(--accent1); font-weight:600; font-size:0.85rem; text-decoration:none; padding: 0.5rem 1rem; background: rgba(110,231,247,0.1); border-radius: 8px; border: 1px solid rgba(110,231,247,0.2); transition: all 0.3s; display:inline-block"
        onmouseover="this.style.background='rgba(110,231,247,0.2)'" 
        onmouseout="this.style.background='rgba(110,231,247,0.1)'">
        🔗 YouTube'da Aç
      </a>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateModalStars(count) {
  const stars = document.getElementById('modalStars');
  if (!stars || !currentModalTopic) return;
  const { examId, subjectId, topic } = currentModalTopic;
  stars.innerHTML = [1,2,3,4,5].map(n =>
    `<span class="star ${n <= count ? 'active' : ''}" 
      onclick="setStar('${examId}','${subjectId}','${escapeQ(topic)}', ${n}, event)"
      title="${n} yıldız">⭐</span>`
  ).join('');
}

function updateModalCompleteBtn(isDone) {
  const btn = document.getElementById('modalCompleteBtn');
  if (!btn) return;
  btn.textContent = isDone ? '✅ Tamamlandı (Geri Al)' : '☐ Tamamlandı İşaretle';
  btn.classList.toggle('done', isDone);
}

function toggleCompleteFromModal() {
  if (!currentModalTopic) return;
  const { examId, subjectId, topic } = currentModalTopic;
  toggleComplete(examId, subjectId, topic, null);
  updateModalCompleteBtn(!!state.completed[currentModalTopic.key]);
}

function openPDF() {
  if (!currentModalTopic) return;
  const q = encodeURIComponent(currentModalTopic.topic + ' konu özeti pdf');
  window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener');
}

function closeTopicModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  currentModalTopic = null;
}

function closeModal(event) {
  if (event.target === document.getElementById('modalOverlay')) {
    closeTopicModal();
  }
}

// ---- Reset ----
function confirmReset() {
  document.getElementById('confirmOverlay').classList.add('open');
}
function cancelReset() {
  document.getElementById('confirmOverlay').classList.remove('open');
}
function doReset() {
  state = { completed: {}, stars: {} };
  saveState();
  cancelReset();
  renderSubjects('tyt', 'tytSubjects');
  renderSubjects('ayt', 'aytSubjects');
  updateHomeStats();
  renderDashboard();
  showToast('🗑️ Tüm veriler sıfırlandı');
}

// ---- Theme ----
function initTheme() {
  const saved = localStorage.getItem('yks_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeToggle').querySelector('.theme-icon').textContent =
    saved === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('yks_theme', next);
  document.getElementById('themeToggle').querySelector('.theme-icon').textContent =
    next === 'dark' ? '🌙' : '☀️';
}

// ---- Hamburger ----
function initHamburger() {
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });
}

// ---- Scroll Navbar ----
function initScrollNavbar() {
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (window.scrollY > 40) {
      nb.style.background = 'rgba(10,10,15,0.95)';
    } else {
      nb.style.background = '';
    }
  }, { passive: true });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  initHamburger();
  initScrollNavbar();

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Render subject pages
  renderSubjects('tyt', 'tytSubjects');
  renderSubjects('ayt', 'aytSubjects');

  // Home stats
  updateHomeStats();

  // Default page
  showPage('home');

  // Keyboard close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeTopicModal();
      cancelReset();
    }
  });

  // Animate progress fills on home after small delay
  setTimeout(() => {
    const tyt = getExamProgress('tyt');
    const ayt = getExamProgress('ayt');
    setWidth('tytHomeProgress', tyt.pct + '%');
    setWidth('aytHomeProgress', ayt.pct + '%');
  }, 300);
});
