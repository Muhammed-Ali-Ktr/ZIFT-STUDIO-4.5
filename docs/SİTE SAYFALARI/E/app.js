// ============================================================
// YKS KONU TAKİP - APP.JS
// ============================================================

// ---- State ----
let state = {
  completed: {},   // { topicKey: true }
  stars: {},       // { topicKey: 1-5 }
  topicStats: {},  // { topicKey: { wrong: number, blank: number } }
  activity: {},    // { 'YYYY-MM-DD': count }
  calendarNotes: {}, // { 'YYYY-MM-DD': [ 'not 1', 'not 2' ] }
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
    // Eski kayıtlarda olmayabilecek alanları garanti altına al
    if (!state.topicStats) state.topicStats = {};
    if (!state.activity) state.activity = {};
    if (!state.calendarNotes) state.calendarNotes = {};
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

// Dashboard takviminde kullanılmak üzere yardımcılar
function formatDateKey(d) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatDateLabel(d) {
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
    // Günlük aktivite kaydı (streak ve trend için)
    const today = new Date().toISOString().slice(0,10);
    if (!state.activity) state.activity = {};
    state.activity[today] = (state.activity[today] || 0) + 1;
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

  // Filtre select kutularını doldur
  if (examId === 'tyt') {
    const sel = document.getElementById('tytFilterSubject');
    if (sel && sel.options.length === 1) {
      YKS_DATA[examId].subjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.label;
        sel.appendChild(opt);
      });
    }
  } else if (examId === 'ayt') {
    const sel = document.getElementById('aytFilterSubject');
    if (sel && sel.options.length === 1) {
      YKS_DATA[examId].subjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.label;
        sel.appendChild(opt);
      });
    }
  }
}

// ---- Arama & Filtreleme ----
function applyFilters(examId) {
  const searchInput = document.getElementById(examId === 'tyt' ? 'tytSearch' : 'aytSearch');
  const select = document.getElementById(examId === 'tyt' ? 'tytFilterSubject' : 'aytFilterSubject');
  const search = (searchInput?.value || '').toLowerCase();
  const selected = select ? select.value : '';

  const subjects = YKS_DATA[examId].subjects;
  subjects.forEach(subj => {
    const card = document.getElementById(`subj-card-${subj.id}`);
    if (!card) return;
    const matchSubject = !selected || selected === subj.id;
    let anyMatch = false;
    card.querySelectorAll('.topic-item').forEach(item => {
      const name = item.querySelector('.topic-name')?.textContent.toLowerCase() || '';
      const match = (!search || name.includes(search)) && matchSubject;
      item.style.display = match ? '' : 'none';
      if (match) anyMatch = true;
    });
    card.style.display = anyMatch ? '' : 'none';
  });
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
  container.innerHTML = '';

  ['tyt','ayt'].forEach(examId => {
    YKS_DATA[examId].subjects.forEach(subj => {
      const prog = getSubjectProgress(examId, subj.id, subj.topics);
      const row = document.createElement('div');
      row.className = 'dash-subj-row';
      row.dataset.exam = examId;
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

  renderDashboardExtras();
  // Mevcut filtreyi yeniden uygula
  setSubjectFilter(currentSubjectFilter);
}

function animateArc(id, pct, circumference) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = (pct / 100) * circumference;
  el.setAttribute('stroke-dasharray', `${target} ${circumference - target}`);
}

// ---- Ders Bazlı Filtreleme ----
let currentSubjectFilter = 'all';

function setSubjectFilter(filter) {
  currentSubjectFilter = filter;
  const rows = document.querySelectorAll('.dash-subj-row');
  rows.forEach(row => {
    const exam = row.dataset.exam;
    row.style.display = (filter === 'all' || filter === exam) ? '' : 'none';
  });
  const chips = document.querySelectorAll('.dash-filter-chip');
  chips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
}

// ---- YKS Takvim & Notlar ----
const EXAM_DATES = [
  { id: 'tyt', label: 'TYT', date: '2026-06-20' },
  { id: 'ayt', label: 'AYT', date: '2026-06-21' }
];

let calCurrentYear = new Date().getFullYear();
let calCurrentMonth = new Date().getMonth(); // 0-11
let calSelectedDate = new Date();

function initCalendar() {
  renderCalendar();
  renderCalendarNotesForSelected();
}

function changeCalendarMonth(delta) {
  calCurrentMonth += delta;
  if (calCurrentMonth < 0) {
    calCurrentMonth = 11;
    calCurrentYear -= 1;
  } else if (calCurrentMonth > 11) {
    calCurrentMonth = 0;
    calCurrentYear += 1;
  }
  renderCalendar();
}

function renderCalendar() {
  const monthLabel = document.getElementById('calendarMonthLabel');
  const grid = document.getElementById('calendarGrid');
  const countdownEl = document.getElementById('calendarCountdown');
  if (!monthLabel || !grid || !countdownEl) return;

  const firstDay = new Date(calCurrentYear, calCurrentMonth, 1);
  const startWeekDay = (firstDay.getDay() + 6) % 7; // Pazartesi=0
  const daysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();

  monthLabel.textContent = firstDay.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }).toUpperCase();

  grid.innerHTML = '';
  ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].forEach(d => {
    const wd = document.createElement('div');
    wd.className = 'cal-weekday';
    wd.textContent = d;
    grid.appendChild(wd);
  });

  // Boş hücreler
  for (let i = 0; i < startWeekDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-cell empty';
    grid.appendChild(empty);
  }

  const todayKey = formatDateKey(new Date());
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(calCurrentYear, calCurrentMonth, day);
    const key = formatDateKey(d);
    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    const exam = EXAM_DATES.find(e => e.date === key);
    if (exam) {
      cell.classList.add(exam.id === 'tyt' ? 'exam-tyt' : 'exam-ayt');
    }
    if (key === todayKey) {
      cell.classList.add('today');
    }

    cell.innerHTML = `
      <div class="cal-day-number">${day}</div>
      ${exam ? `<div style="font-size:0.7rem; margin-top:2px;">${exam.label}</div>` : ''}
    `;

    // Not varsa işaret
    if (state.calendarNotes && state.calendarNotes[key] && state.calendarNotes[key].length) {
      const dot = document.createElement('div');
      dot.className = 'cal-note-dot';
      cell.appendChild(dot);
    }

    cell.onclick = () => {
      calSelectedDate = d;
      renderCalendarSelection();
      renderCalendarNotesForSelected();
    };

    grid.appendChild(cell);
  }

  renderCalendarSelection();
  renderExamCountdown(countdownEl);
}

function renderCalendarSelection() {
  const label = document.getElementById('calendarSelectedDate');
  if (!label) return;
  label.textContent = `Seçili gün: ${formatDateLabel(calSelectedDate)}`;
}

function renderExamCountdown(el) {
  const today = new Date();
  const upcoming = EXAM_DATES
    .map(e => ({ ...e, dateObj: new Date(e.date + 'T00:00:00') }))
    .filter(e => e.dateObj >= today)
    .sort((a,b) => a.dateObj - b.dateObj);

  if (!upcoming.length) {
    el.textContent = 'Tüm sınav günleri geçti.';
    return;
  }

  const next = upcoming[0];
  const diffMs = next.dateObj - today;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  el.textContent = `${next.label} sınavına kalan gün: ${days}`;
}

function saveCalendarNote() {
  const textarea = document.getElementById('calendarNoteInput');
  if (!textarea) return;
  const text = textarea.value.trim();
  if (!text) {
    showToast('Lütfen boş olmayan bir not yaz 💗');
    return;
  }
  const key = formatDateKey(calSelectedDate);
  if (!state.calendarNotes) state.calendarNotes = {};
  if (!state.calendarNotes[key]) state.calendarNotes[key] = [];
  state.calendarNotes[key].push(text);
  saveState();
  textarea.value = '';
  renderCalendar();
  renderCalendarNotesForSelected();
  showToast('📒 Not kaydedildi');
}

function renderCalendarNotesForSelected() {
  const list = document.getElementById('calendarNotesList');
  if (!list) return;
  const key = formatDateKey(calSelectedDate);
  list.innerHTML = '';
  const notes = (state.calendarNotes && state.calendarNotes[key]) || [];
  if (!notes.length) {
    list.innerHTML = '<li>Bu gün için henüz not yok. Küçük bir satır bile çok şey değiştirir 💕</li>';
    return;
  }
  notes.forEach((note, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${note}`;
    list.appendChild(li);
  });
}

function exportCalendarNotesPDF() {
  if (!state.calendarNotes || !Object.keys(state.calendarNotes).length) {
    showToast('Henüz kaydedilmiş takvim notu yok.');
    return;
  }
  const win = window.open('', '_blank');
  if (!win) {
    alert('Açılır pencere engellendi. Lütfen tarayıcıdan izin ver.');
    return;
  }
  const doc = win.document;
  doc.write('<html><head><title>YKS Takvim Notları</title>');
  doc.write('<meta charset="UTF-8">');
  doc.write('<style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;padding:20px;color:#111;}h1{font-size:20px;margin-bottom:10px;}h2{font-size:16px;margin-top:16px;margin-bottom:4px;}ul{margin:0 0 8px 18px;padding:0;font-size:13px;}li{margin-bottom:3px;}</style>');
  doc.write('</head><body>');
  doc.write('<h1>YKS Takvim Notları</h1>');

  const dates = Object.keys(state.calendarNotes).sort();
  dates.forEach(dateKey => {
    const d = new Date(dateKey + 'T00:00:00');
    const label = formatDateLabel(d);
    const notes = state.calendarNotes[dateKey] || [];
    if (!notes.length) return;
    doc.write(`<h2>${label}</h2><ul>`);
    notes.forEach(n => {
      doc.write(`<li>${n}</li>`);
    });
    doc.write('</ul>');
  });

  doc.write('<p style="margin-top:20px;font-size:12px;color:#555;">Bu sayfayı tarayıcından "Yazdır" diyerek PDF olarak kaydedebilirsin.</p>');
  doc.write('</body></html>');
  doc.close();
  win.focus();
  win.print();
}

function renderDashboardExtras() {
  // Sadece takvim alanını tazeleyelim
  initCalendar();
}

// ---- Modal ----
function openModal(examId, subjectId, topic, tab) {
  const key = topicKey(examId, subjectId, topic);
  currentModalTopic = { examId, subjectId, topic, key };

  document.getElementById('modalTitle').textContent = topic;
  updateModalStars(state.stars[key] || 0);
  updateModalCompleteBtn(!!state.completed[key]);

  // Yanlış / Boş alanlarını doldur
  const stats = (state.topicStats && state.topicStats[key]) || { wrong: 0, blank: 0 };
  const wrongEl = document.getElementById('modalWrong');
  const blankEl = document.getElementById('modalBlank');
  if (wrongEl) wrongEl.value = stats.wrong || 0;
  if (blankEl) blankEl.value = stats.blank || 0;

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

function saveTopicStats() {
  if (!currentModalTopic) return;
  const key = currentModalTopic.key;
  const wrong = parseInt(document.getElementById('modalWrong').value || '0', 10);
  const blank = parseInt(document.getElementById('modalBlank').value || '0', 10);
  if (!state.topicStats) state.topicStats = {};
  state.topicStats[key] = { wrong: Math.max(0, wrong), blank: Math.max(0, blank) };
  saveState();
  showToast('📉 Yanlış / boş bilgisi kaydedildi');
  renderDashboard(); // analizleri güncelle
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

  // Arama & filtreleme dinleyicileri
  const tytSearch = document.getElementById('tytSearch');
  const tytFilter = document.getElementById('tytFilterSubject');
  const aytSearch = document.getElementById('aytSearch');
  const aytFilter = document.getElementById('aytFilterSubject');
  if (tytSearch) tytSearch.addEventListener('input', () => applyFilters('tyt'));
  if (tytFilter) tytFilter.addEventListener('change', () => applyFilters('tyt'));
  if (aytSearch) aytSearch.addEventListener('input', () => applyFilters('ayt'));
  if (aytFilter) aytFilter.addEventListener('change', () => applyFilters('ayt'));

  // Home stats
  updateHomeStats();

  // Dashboard ek alanları ilk açılışta da hazırla
  renderDashboardExtras();

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
