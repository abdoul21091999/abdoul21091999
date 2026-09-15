'use strict';

/* =========================================================
   نظام إدارة رسوم المدرسة — تطبيق يعمل بالكامل من المتصفح
   يخزّن كل البيانات في localStorage، لا حاجة لخادم أو اتصال إنترنت.
   ========================================================= */

const STORAGE_KEY = 'sfm_school_fees_v1';
const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

/* ---------------- أدوات مساعدة عامة ---------------- */
function uid(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function currentMonth() { return new Date().toISOString().slice(0, 7); }
function currentSchoolYear() {
  const d = new Date();
  const y = d.getFullYear();
  return d.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}
function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}
function fmtMoney(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('en-US') + ' ' + escapeHtml(state.settings.currency);
}
function fmtDate(d) {
  if (!d) return '—';
  const date = new Date(d + 'T00:00:00');
  if (isNaN(date)) return d;
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
function monthLabel(m) {
  if (!m) return '—';
  const [y, mm] = m.split('-');
  return `${ARABIC_MONTHS[parseInt(mm, 10) - 1] || mm} ${y}`;
}
function lastNMonths(n) {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < n; i++) {
    out.push(d.toISOString().slice(0, 7));
    d.setMonth(d.getMonth() - 1);
  }
  return out;
}

/* ---------------- حالة البيانات ---------------- */
function defaultState() {
  return {
    settings: {
      schoolName: 'اسم المدرسة',
      schoolYear: currentSchoolYear(),
      currency: 'FCFA',
      defaultRegistrationFee: 0,
      receiptPrefix: 'REC',
      nextReceiptNumber: 1,
      address: '',
      phone: ''
    },
    classes: [],
    students: [],
    payments: []
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    return {
      settings: { ...base.settings, ...(parsed.settings || {}) },
      classes: Array.isArray(parsed.classes) ? parsed.classes : [],
      students: Array.isArray(parsed.students) ? parsed.students : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : []
    };
  } catch (e) {
    console.error('تعذر تحميل البيانات المحفوظة', e);
    return defaultState();
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------------- حسابات الرسوم ---------------- */
function getClass(id) { return state.classes.find(c => c.id === id); }
function getStudent(id) { return state.students.find(s => s.id === id); }
function className(id) { const c = getClass(id); return c ? c.name : '—'; }

function studentPayments(studentId, type) {
  return state.payments.filter(p => p.studentId === studentId && (!type || p.type === type));
}
function registrationFee(student) {
  return student.registrationFee != null ? Number(student.registrationFee) : Number(state.settings.defaultRegistrationFee) || 0;
}
function registrationPaid(student) {
  return studentPayments(student.id, 'registration').reduce((s, p) => s + Number(p.amount), 0);
}
function registrationBalance(student) {
  return Math.max(0, registrationFee(student) - registrationPaid(student));
}
function registrationStatus(student) {
  const fee = registrationFee(student);
  if (fee <= 0) return 'paid';
  const paid = registrationPaid(student);
  if (paid >= fee) return 'paid';
  if (paid > 0) return 'partial';
  return 'unpaid';
}
function monthlyFeeFor(student) {
  if (student.monthlyFeeOverride != null && student.monthlyFeeOverride !== '') return Number(student.monthlyFeeOverride);
  const cls = getClass(student.classId);
  return cls ? Number(cls.monthlyFee) || 0 : 0;
}
function monthPaid(student, month) {
  return state.payments
    .filter(p => p.studentId === student.id && p.type === 'monthly' && p.month === month)
    .reduce((s, p) => s + Number(p.amount), 0);
}
function monthStatus(student, month) {
  const fee = monthlyFeeFor(student);
  if (fee <= 0) return 'paid';
  const paid = monthPaid(student, month);
  if (paid >= fee) return 'paid';
  if (paid > 0) return 'partial';
  return 'unpaid';
}
function isEnrolledInMonth(student, month) {
  const regMonth = (student.registrationDate || '').slice(0, 7);
  if (regMonth && month < regMonth) return false;
  if (student.leaveDate) {
    const leaveMonth = student.leaveDate.slice(0, 7);
    if (month > leaveMonth) return false;
  }
  return true;
}
function statusBadge(status) {
  const map = {
    paid: ['badge--paid', 'مسدد'],
    partial: ['badge--partial', 'جزئي'],
    unpaid: ['badge--unpaid', 'غير مسدد']
  };
  const [cls, label] = map[status] || ['badge--muted', status];
  return `<span class="badge ${cls}">${label}</span>`;
}
function nextReceiptNumber() {
  const n = state.settings.nextReceiptNumber || 1;
  state.settings.nextReceiptNumber = n + 1;
  return `${state.settings.receiptPrefix || 'REC'}-${String(n).padStart(5, '0')}`;
}

/* ---------------- تنقّل بين الأقسام ---------------- */
const sections = {
  dashboard: { title: 'لوحة التحكم', render: renderDashboard },
  students: { title: 'الطلاب', render: renderStudents },
  classes: { title: 'الأقسام الدراسية', render: renderClasses },
  payments: { title: 'سجل الدفعات', render: renderPayments },
  report: { title: 'التقرير الشهري', render: renderReport },
  backup: { title: 'النسخ الاحتياطي', render: renderBackup },
  settings: { title: 'الإعدادات', render: renderSettings }
};

function navigate(name) {
  Object.keys(sections).forEach(key => {
    document.getElementById('section-' + key).classList.toggle('active', key === name);
  });
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.section === name));
  document.getElementById('page-title').textContent = sections[name].title;
  sections[name].render();
  closeSidebar();
}

function refreshCurrentSection() {
  const active = document.querySelector('.nav-link.active');
  const name = active ? active.dataset.section : 'dashboard';
  sections[name].render();
  renderBrand();
}

function renderBrand() {
  document.getElementById('brand-name').textContent = state.settings.schoolName || 'اسم المدرسة';
  document.getElementById('brand-year').textContent = state.settings.schoolYear || '';
}

/* ---------------- نافذة منبثقة عامة ---------------- */
function openModal(html, opts) {
  const container = document.getElementById('modal-container');
  container.className = 'modal' + (opts && opts.wide ? ' modal--wide' : '');
  container.innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-container').innerHTML = '';
}
function toast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (type ? ' toast--' + type : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), 2600);
}
function confirmAction(msg, onYes) {
  openModal(`
    <div class="modal__header"><h3>تأكيد</h3><button class="modal__close" onclick="closeModal()">✕</button></div>
    <div class="modal__body"><p>${escapeHtml(msg)}</p></div>
    <div class="modal__footer">
      <button class="btn btn--ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn--danger" id="confirm-yes-btn">تأكيد</button>
    </div>
  `);
  document.getElementById('confirm-yes-btn').addEventListener('click', () => { closeModal(); onYes(); });
}

/* ================= لوحة التحكم ================= */
function renderDashboard() {
  const el = document.getElementById('section-dashboard');
  const month = currentMonth();
  const activeStudents = state.students.filter(s => s.status !== 'inactive');

  const totalCollectedAll = state.payments.reduce((s, p) => s + Number(p.amount), 0);
  const collectedThisMonth = state.payments
    .filter(p => (p.date || '').slice(0, 7) === month)
    .reduce((s, p) => s + Number(p.amount), 0);

  const outstandingRegistration = activeStudents.reduce((s, st) => s + registrationBalance(st), 0);

  const enrolledThisMonth = activeStudents.filter(st => isEnrolledInMonth(st, month));
  const outstandingMonthly = enrolledThisMonth.reduce((s, st) => {
    const fee = monthlyFeeFor(st);
    const paid = monthPaid(st, month);
    return s + Math.max(0, fee - paid);
  }, 0);

  const unpaidThisMonthCount = enrolledThisMonth.filter(st => monthStatus(st, month) === 'unpaid').length;

  const recent = [...state.payments].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).slice(0, 8);

  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card stat-card--primary">
        <span class="stat-card__icon">👨‍🎓</span>
        <div class="stat-card__label">عدد الطلاب النشطين</div>
        <div class="stat-card__value">${activeStudents.length}</div>
      </div>
      <div class="stat-card stat-card--accent">
        <span class="stat-card__icon">💰</span>
        <div class="stat-card__label">إجمالي المحصّل (${monthLabel(month)})</div>
        <div class="stat-card__value">${fmtMoney(collectedThisMonth)}</div>
      </div>
      <div class="stat-card stat-card--warn">
        <span class="stat-card__icon">📌</span>
        <div class="stat-card__label">متبقٍ من رسوم التسجيل</div>
        <div class="stat-card__value">${fmtMoney(outstandingRegistration)}</div>
      </div>
      <div class="stat-card stat-card--danger">
        <span class="stat-card__icon">⏰</span>
        <div class="stat-card__label">متبقٍ من الرسوم الشهرية (هذا الشهر)</div>
        <div class="stat-card__value">${fmtMoney(outstandingMonthly)}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card__header">
          <h3>آخر الدفعات</h3>
          <button class="btn btn--outline btn--sm" data-nav="payments">عرض الكل</button>
        </div>
        <div class="card__body">
          ${recent.length === 0 ? emptyState('💳', 'لا توجد دفعات مسجّلة بعد') : `
          <div class="table-wrap"><table>
            <thead><tr><th>الطالب</th><th>النوع</th><th>المبلغ</th><th>التاريخ</th></tr></thead>
            <tbody>
              ${recent.map(p => {
                const st = getStudent(p.studentId);
                return `<tr>
                  <td>${escapeHtml(st ? st.name : 'محذوف')}</td>
                  <td>${p.type === 'registration' ? 'رسوم تسجيل' : 'رسوم شهرية — ' + monthLabel(p.month)}</td>
                  <td>${fmtMoney(p.amount)}</td>
                  <td>${fmtDate(p.date)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table></div>`}
        </div>
      </div>

      <div class="card">
        <div class="card__header"><h3>تنبيهات سريعة</h3></div>
        <div class="card__body">
          <p style="margin-bottom:12px">عدد الطلاب الذين لم يسددوا رسوم شهر <strong>${monthLabel(month)}</strong>:</p>
          <div class="stat-card stat-card--danger" style="margin-bottom:14px">
            <div class="stat-card__value">${unpaidThisMonthCount}</div>
          </div>
          <button class="btn btn--outline" style="width:100%" data-nav="report">فتح التقرير الشهري</button>
          <hr style="margin:16px 0;border:none;border-top:1px solid var(--color-border)">
          <p style="margin-bottom:10px">إجمالي المحصّل منذ البداية:</p>
          <strong style="font-size:18px">${fmtMoney(totalCollectedAll)}</strong>
        </div>
      </div>
    </div>
  `;
  el.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.nav)));
}
function emptyState(icon, text) {
  return `<div class="empty-state"><div class="empty-state__icon">${icon}</div><div>${escapeHtml(text)}</div></div>`;
}

/* ================= الأقسام الدراسية ================= */
function renderClasses() {
  const el = document.getElementById('section-classes');
  el.innerHTML = `
    <div class="toolbar">
      <button class="btn btn--primary" id="add-class-btn">＋ إضافة قسم دراسي</button>
    </div>
    <div class="card">
      <div class="card__body" style="padding:0">
        ${state.classes.length === 0 ? emptyState('🏫', 'لم تُضِف أي قسم دراسي بعد') : `
        <div class="table-wrap"><table>
          <thead><tr><th>اسم القسم</th><th>الرسم الشهري</th><th>عدد الطلاب</th><th></th></tr></thead>
          <tbody>
            ${state.classes.map(c => {
              const count = state.students.filter(s => s.classId === c.id).length;
              return `<tr>
                <td><strong>${escapeHtml(c.name)}</strong></td>
                <td>${fmtMoney(c.monthlyFee)}</td>
                <td>${count}</td>
                <td class="row-actions">
                  <button class="btn btn--outline btn--sm" data-edit="${c.id}">تعديل</button>
                  <button class="btn btn--danger btn--sm" data-del="${c.id}">حذف</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>`}
      </div>
    </div>
  `;
  document.getElementById('add-class-btn').addEventListener('click', () => classForm());
  el.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => classForm(getClass(b.dataset.edit))));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    const c = getClass(b.dataset.del);
    const count = state.students.filter(s => s.classId === c.id).length;
    confirmAction(count ? `هذا القسم يضم ${count} طالبًا. سيتم إلغاء ارتباطهم بالقسم. هل تريد المتابعة؟` : `هل تريد حذف قسم "${c.name}"؟`, () => {
      state.classes = state.classes.filter(x => x.id !== c.id);
      state.students.forEach(s => { if (s.classId === c.id) s.classId = ''; });
      save(); toast('تم حذف القسم', 'success'); renderClasses();
    });
  }));
}
function classForm(existing) {
  const isEdit = !!existing;
  openModal(`
    <div class="modal__header"><h3>${isEdit ? 'تعديل قسم دراسي' : 'إضافة قسم دراسي'}</h3><button class="modal__close" onclick="closeModal()">✕</button></div>
    <div class="modal__body">
      <div class="field" style="margin-bottom:14px">
        <label>اسم القسم *</label>
        <input id="cf-name" value="${escapeHtml(existing ? existing.name : '')}" placeholder="مثال: السنة الثالثة أ">
      </div>
      <div class="field">
        <label>الرسم الشهري (${escapeHtml(state.settings.currency)})</label>
        <input id="cf-fee" type="number" min="0" value="${existing ? existing.monthlyFee : ''}" placeholder="0">
      </div>
    </div>
    <div class="modal__footer">
      <button class="btn btn--ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn--primary" id="cf-save">${isEdit ? 'حفظ التعديلات' : 'إضافة'}</button>
    </div>
  `);
  document.getElementById('cf-save').addEventListener('click', () => {
    const name = document.getElementById('cf-name').value.trim();
    const fee = Number(document.getElementById('cf-fee').value) || 0;
    if (!name) { toast('يرجى إدخال اسم القسم', 'error'); return; }
    if (isEdit) {
      existing.name = name; existing.monthlyFee = fee;
    } else {
      state.classes.push({ id: uid('cls'), name, monthlyFee: fee });
    }
    save(); closeModal(); toast('تم الحفظ بنجاح', 'success'); renderClasses();
  });
}

/* ================= الطلاب ================= */
let studentFilters = { q: '', classId: '', status: '' };

function renderStudents() {
  const el = document.getElementById('section-students');
  const month = currentMonth();

  let list = [...state.students];
  if (studentFilters.q) {
    const q = studentFilters.q.toLowerCase();
    list = list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.phone || '').includes(q));
  }
  if (studentFilters.classId) list = list.filter(s => s.classId === studentFilters.classId);
  if (studentFilters.status) list = list.filter(s => registrationStatus(s) === studentFilters.status || monthStatus(s, month) === studentFilters.status);

  list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));

  el.innerHTML = `
    <div class="toolbar">
      <div class="field" style="flex:1;min-width:200px">
        <label>بحث</label>
        <input id="sf-q" placeholder="اسم الطالب أو رقم الهاتف" value="${escapeHtml(studentFilters.q)}">
      </div>
      <div class="field">
        <label>القسم الدراسي</label>
        <select id="sf-class">
          <option value="">كل الأقسام</option>
          ${state.classes.map(c => `<option value="${c.id}" ${studentFilters.classId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>حالة السداد</label>
        <select id="sf-status">
          <option value="">الكل</option>
          <option value="paid" ${studentFilters.status === 'paid' ? 'selected' : ''}>مسدد</option>
          <option value="partial" ${studentFilters.status === 'partial' ? 'selected' : ''}>جزئي</option>
          <option value="unpaid" ${studentFilters.status === 'unpaid' ? 'selected' : ''}>غير مسدد</option>
        </select>
      </div>
      <button class="btn btn--primary" id="add-student-btn" style="align-self:flex-end">＋ طالب جديد</button>
    </div>

    <div class="card">
      <div class="card__body" style="padding:0">
        ${list.length === 0 ? emptyState('👨‍🎓', 'لا يوجد طلاب مطابقون') : `
        <div class="table-wrap"><table>
          <thead><tr>
            <th>الطالب</th><th>القسم</th><th>الهاتف</th>
            <th>رسوم التسجيل</th><th>الشهر الحالي</th><th></th>
          </tr></thead>
          <tbody>
            ${list.map(s => `
              <tr>
                <td><strong>${escapeHtml(s.name)}</strong>${s.status === 'inactive' ? ' <span class="badge badge--muted">غير نشط</span>' : ''}</td>
                <td>${escapeHtml(className(s.classId))}</td>
                <td>${escapeHtml(s.phone || '—')}</td>
                <td>${statusBadge(registrationStatus(s))}</td>
                <td>${statusBadge(monthStatus(s, month))}</td>
                <td class="row-actions">
                  <button class="btn btn--outline btn--sm" data-view="${s.id}">التفاصيل</button>
                  <button class="btn btn--primary btn--sm" data-pay="${s.id}">دفعة</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table></div>`}
      </div>
    </div>
  `;

  document.getElementById('sf-q').addEventListener('input', e => { studentFilters.q = e.target.value; renderStudents(); });
  document.getElementById('sf-class').addEventListener('change', e => { studentFilters.classId = e.target.value; renderStudents(); });
  document.getElementById('sf-status').addEventListener('change', e => { studentFilters.status = e.target.value; renderStudents(); });
  document.getElementById('add-student-btn').addEventListener('click', () => studentForm());
  el.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => studentDetail(b.dataset.view)));
  el.querySelectorAll('[data-pay]').forEach(b => b.addEventListener('click', () => paymentForm(b.dataset.pay)));
}

function studentForm(existing) {
  const isEdit = !!existing;
  openModal(`
    <div class="modal__header"><h3>${isEdit ? 'تعديل بيانات الطالب' : 'تسجيل طالب جديد'}</h3><button class="modal__close" onclick="closeModal()">✕</button></div>
    <div class="modal__body">
      <div class="field" style="margin-bottom:14px">
        <label>الاسم الكامل *</label>
        <input id="sf-name" value="${escapeHtml(existing ? existing.name : '')}" placeholder="اسم الطالب">
      </div>
      <div class="field-row" style="margin-bottom:14px">
        <div class="field">
          <label>القسم الدراسي</label>
          <select id="sf-class-id">
            <option value="">— بدون —</option>
            ${state.classes.map(c => `<option value="${c.id}" ${existing && existing.classId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>رقم هاتف ولي الأمر</label>
          <input id="sf-phone" value="${escapeHtml(existing ? existing.phone || '' : '')}" placeholder="77 000 00 00">
        </div>
      </div>
      <div class="field-row" style="margin-bottom:14px">
        <div class="field">
          <label>اسم ولي الأمر</label>
          <input id="sf-parent" value="${escapeHtml(existing ? existing.parentName || '' : '')}">
        </div>
        <div class="field">
          <label>تاريخ التسجيل</label>
          <input id="sf-regdate" type="date" value="${existing ? existing.registrationDate || todayISO() : todayISO()}">
        </div>
      </div>
      <div class="field-row" style="margin-bottom:14px">
        <div class="field">
          <label>رسوم التسجيل (${escapeHtml(state.settings.currency)})</label>
          <input id="sf-regfee" type="number" min="0" value="${existing && existing.registrationFee != null ? existing.registrationFee : state.settings.defaultRegistrationFee}">
        </div>
        <div class="field">
          <label>رسم شهري خاص (اختياري)</label>
          <input id="sf-monthlyfee" type="number" min="0" value="${existing && existing.monthlyFeeOverride != null ? existing.monthlyFeeOverride : ''}" placeholder="يُستخدم رسم القسم إن ترك فارغًا">
        </div>
      </div>
      ${isEdit ? `
      <div class="field">
        <label>الحالة</label>
        <select id="sf-status">
          <option value="active" ${existing.status !== 'inactive' ? 'selected' : ''}>نشط</option>
          <option value="inactive" ${existing.status === 'inactive' ? 'selected' : ''}>غير نشط (منسحب)</option>
        </select>
      </div>` : ''}
    </div>
    <div class="modal__footer">
      ${isEdit ? '<button class="btn btn--danger" id="sf-delete" style="margin-inline-end:auto">حذف الطالب</button>' : ''}
      <button class="btn btn--ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn--primary" id="sf-save">${isEdit ? 'حفظ التعديلات' : 'تسجيل الطالب'}</button>
    </div>
  `, { wide: true });

  document.getElementById('sf-save').addEventListener('click', () => {
    const name = document.getElementById('sf-name').value.trim();
    if (!name) { toast('يرجى إدخال اسم الطالب', 'error'); return; }
    const data = {
      name,
      classId: document.getElementById('sf-class-id').value,
      phone: document.getElementById('sf-phone').value.trim(),
      parentName: document.getElementById('sf-parent').value.trim(),
      registrationDate: document.getElementById('sf-regdate').value || todayISO(),
      registrationFee: Number(document.getElementById('sf-regfee').value) || 0,
      monthlyFeeOverride: document.getElementById('sf-monthlyfee').value === '' ? null : Number(document.getElementById('sf-monthlyfee').value)
    };
    if (isEdit) {
      Object.assign(existing, data);
      existing.status = document.getElementById('sf-status').value;
    } else {
      state.students.push({ id: uid('stu'), status: 'active', ...data });
    }
    save(); closeModal(); toast('تم حفظ بيانات الطالب', 'success'); refreshCurrentSection();
  });

  if (isEdit) {
    document.getElementById('sf-delete').addEventListener('click', () => {
      confirmAction(`هل تريد حذف الطالب "${existing.name}" وكل سجل دفعاته؟ لا يمكن التراجع عن هذا الإجراء.`, () => {
        state.students = state.students.filter(s => s.id !== existing.id);
        state.payments = state.payments.filter(p => p.studentId !== existing.id);
        save(); closeModal(); toast('تم حذف الطالب', 'success'); refreshCurrentSection();
      });
    });
  }
}

function studentDetail(id) {
  const s = getStudent(id);
  if (!s) return;
  const month = currentMonth();
  const payments = studentPayments(id).sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));

  openModal(`
    <div class="modal__header">
      <h3>${escapeHtml(s.name)}</h3>
      <button class="modal__close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal__body">
      <div class="stat-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:18px">
        <div class="stat-card stat-card--warn">
          <div class="stat-card__label">متبقٍ من رسوم التسجيل</div>
          <div class="stat-card__value">${fmtMoney(registrationBalance(s))}</div>
        </div>
        <div class="stat-card stat-card--primary">
          <div class="stat-card__label">حالة شهر ${monthLabel(month)}</div>
          <div class="stat-card__value">${statusBadge(monthStatus(s, month))}</div>
        </div>
      </div>
      <p><strong>القسم:</strong> ${escapeHtml(className(s.classId))} &nbsp; | &nbsp; <strong>الهاتف:</strong> ${escapeHtml(s.phone || '—')}</p>
      <p><strong>ولي الأمر:</strong> ${escapeHtml(s.parentName || '—')} &nbsp; | &nbsp; <strong>تاريخ التسجيل:</strong> ${fmtDate(s.registrationDate)}</p>
      <hr style="margin:16px 0;border:none;border-top:1px solid var(--color-border)">
      <h4 style="margin-bottom:10px">سجل الدفعات</h4>
      ${payments.length === 0 ? emptyState('💳', 'لا توجد دفعات مسجّلة') : `
      <div class="table-wrap"><table>
        <thead><tr><th>النوع</th><th>المبلغ</th><th>التاريخ</th><th></th></tr></thead>
        <tbody>
          ${payments.map(p => `
            <tr>
              <td>${p.type === 'registration' ? 'تسجيل' : 'شهرية — ' + monthLabel(p.month)}</td>
              <td>${fmtMoney(p.amount)}</td>
              <td>${fmtDate(p.date)}</td>
              <td><button class="btn btn--outline btn--sm" data-print="${p.id}">🖨️ إيصال</button></td>
            </tr>`).join('')}
        </tbody>
      </table></div>`}
    </div>
    <div class="modal__footer">
      <button class="btn btn--outline" id="sd-edit">تعديل البيانات</button>
      <button class="btn btn--primary" id="sd-pay">＋ تسجيل دفعة</button>
    </div>
  `, { wide: true });

  document.getElementById('sd-edit').addEventListener('click', () => studentForm(s));
  document.getElementById('sd-pay').addEventListener('click', () => paymentForm(s.id));
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => printReceipt(b.dataset.print)));
}

/* ================= الدفعات ================= */
function paymentForm(studentId) {
  const students = [...state.students].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  if (students.length === 0) { toast('يرجى تسجيل طالب أولًا', 'error'); return; }
  const preselect = studentId || students[0].id;

  openModal(`
    <div class="modal__header"><h3>تسجيل دفعة</h3><button class="modal__close" onclick="closeModal()">✕</button></div>
    <div class="modal__body">
      <div class="field" style="margin-bottom:14px">
        <label>الطالب *</label>
        <select id="pf-student">
          ${students.map(s => `<option value="${s.id}" ${s.id === preselect ? 'selected' : ''}>${escapeHtml(s.name)} — ${escapeHtml(className(s.classId))}</option>`).join('')}
        </select>
      </div>
      <div class="field-row" style="margin-bottom:14px">
        <div class="field">
          <label>نوع الدفعة *</label>
          <select id="pf-type">
            <option value="registration">رسوم تسجيل</option>
            <option value="monthly">رسوم شهرية</option>
          </select>
        </div>
        <div class="field" id="pf-month-wrap">
          <label>الشهر</label>
          <input id="pf-month" type="month" value="${currentMonth()}">
        </div>
      </div>
      <div class="field-row" style="margin-bottom:14px">
        <div class="field">
          <label>المبلغ (${escapeHtml(state.settings.currency)}) *</label>
          <input id="pf-amount" type="number" min="0" placeholder="0">
        </div>
        <div class="field">
          <label>تاريخ الدفع</label>
          <input id="pf-date" type="date" value="${todayISO()}">
        </div>
      </div>
      <div class="field">
        <label>ملاحظة (اختياري)</label>
        <input id="pf-note" placeholder="مثال: دفعة نقدية">
      </div>
    </div>
    <div class="modal__footer">
      <button class="btn btn--ghost" onclick="closeModal()">إلغاء</button>
      <button class="btn btn--primary" id="pf-save">تسجيل الدفعة</button>
    </div>
  `);

  const typeSel = document.getElementById('pf-type');
  const monthWrap = document.getElementById('pf-month-wrap');
  const amountInput = document.getElementById('pf-amount');
  const studentSel = document.getElementById('pf-student');

  function prefillAmount() {
    const st = getStudent(studentSel.value);
    if (!st) return;
    if (typeSel.value === 'registration') amountInput.value = registrationBalance(st) || '';
    else {
      const fee = monthlyFeeFor(st);
      const paid = monthPaid(st, document.getElementById('pf-month').value || currentMonth());
      amountInput.value = Math.max(0, fee - paid) || '';
    }
  }
  typeSel.addEventListener('change', () => { monthWrap.style.display = typeSel.value === 'monthly' ? '' : 'none'; prefillAmount(); });
  studentSel.addEventListener('change', prefillAmount);
  document.getElementById('pf-month').addEventListener('change', prefillAmount);
  monthWrap.style.display = typeSel.value === 'monthly' ? '' : 'none';
  prefillAmount();

  document.getElementById('pf-save').addEventListener('click', () => {
    const amount = Number(amountInput.value);
    if (!amount || amount <= 0) { toast('يرجى إدخال مبلغ صحيح', 'error'); return; }
    const payment = {
      id: uid('pay'),
      studentId: studentSel.value,
      type: typeSel.value,
      month: typeSel.value === 'monthly' ? (document.getElementById('pf-month').value || currentMonth()) : null,
      amount,
      date: document.getElementById('pf-date').value || todayISO(),
      note: document.getElementById('pf-note').value.trim(),
      receiptNo: nextReceiptNumber()
    };
    state.payments.push(payment);
    save();
    closeModal();
    toast('تم تسجيل الدفعة بنجاح', 'success');
    refreshCurrentSection();
    printReceipt(payment.id, true);
  });
}

let paymentFilters = { q: '', type: '' };

function renderPayments() {
  const el = document.getElementById('section-payments');
  let list = [...state.payments];
  if (paymentFilters.type) list = list.filter(p => p.type === paymentFilters.type);
  if (paymentFilters.q) {
    const q = paymentFilters.q.toLowerCase();
    list = list.filter(p => {
      const st = getStudent(p.studentId);
      return st && st.name.toLowerCase().includes(q);
    });
  }
  list.sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));

  el.innerHTML = `
    <div class="toolbar">
      <div class="field" style="flex:1;min-width:200px">
        <label>بحث باسم الطالب</label>
        <input id="pyf-q" value="${escapeHtml(paymentFilters.q)}" placeholder="اسم الطالب">
      </div>
      <div class="field">
        <label>نوع الدفعة</label>
        <select id="pyf-type">
          <option value="">الكل</option>
          <option value="registration" ${paymentFilters.type === 'registration' ? 'selected' : ''}>رسوم تسجيل</option>
          <option value="monthly" ${paymentFilters.type === 'monthly' ? 'selected' : ''}>رسوم شهرية</option>
        </select>
      </div>
      <button class="btn btn--primary" id="pyf-add" style="align-self:flex-end">＋ تسجيل دفعة</button>
    </div>
    <div class="card">
      <div class="card__body" style="padding:0">
        ${list.length === 0 ? emptyState('💳', 'لا توجد دفعات مطابقة') : `
        <div class="table-wrap"><table>
          <thead><tr><th>رقم الإيصال</th><th>الطالب</th><th>النوع</th><th>المبلغ</th><th>التاريخ</th><th></th></tr></thead>
          <tbody>
            ${list.map(p => {
              const st = getStudent(p.studentId);
              return `<tr>
                <td>${escapeHtml(p.receiptNo || '—')}</td>
                <td>${escapeHtml(st ? st.name : 'محذوف')}</td>
                <td>${p.type === 'registration' ? 'رسوم تسجيل' : 'شهرية — ' + monthLabel(p.month)}</td>
                <td>${fmtMoney(p.amount)}</td>
                <td>${fmtDate(p.date)}</td>
                <td class="row-actions">
                  <button class="btn btn--outline btn--sm" data-print="${p.id}">🖨️ إيصال</button>
                  <button class="btn btn--danger btn--sm" data-del="${p.id}">حذف</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table></div>`}
      </div>
    </div>
  `;
  document.getElementById('pyf-q').addEventListener('input', e => { paymentFilters.q = e.target.value; renderPayments(); });
  document.getElementById('pyf-type').addEventListener('change', e => { paymentFilters.type = e.target.value; renderPayments(); });
  document.getElementById('pyf-add').addEventListener('click', () => paymentForm());
  el.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => printReceipt(b.dataset.print)));
  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    confirmAction('هل تريد حذف هذه الدفعة؟ لا يمكن التراجع عن هذا الإجراء.', () => {
      state.payments = state.payments.filter(p => p.id !== b.dataset.del);
      save(); toast('تم حذف الدفعة', 'success'); refreshCurrentSection();
    });
  }));
}

function printReceipt(paymentId) {
  const p = state.payments.find(x => x.id === paymentId);
  if (!p) return;
  const st = getStudent(p.studentId);
  const area = document.getElementById('print-area');
  area.innerHTML = `
    <div class="receipt">
      <h2>${escapeHtml(state.settings.schoolName)}</h2>
      <div class="sub">${escapeHtml(state.settings.address || '')} ${state.settings.phone ? ' — ' + escapeHtml(state.settings.phone) : ''}</div>
      <div class="sub">السنة الدراسية: ${escapeHtml(state.settings.schoolYear)}</div>
      <hr>
      <table>
        <tr><td>رقم الإيصال</td><td>${escapeHtml(p.receiptNo || '—')}</td></tr>
        <tr><td>اسم الطالب</td><td>${escapeHtml(st ? st.name : '—')}</td></tr>
        <tr><td>القسم الدراسي</td><td>${escapeHtml(st ? className(st.classId) : '—')}</td></tr>
        <tr><td>نوع الرسوم</td><td>${p.type === 'registration' ? 'رسوم تسجيل' : 'رسوم شهرية — ' + monthLabel(p.month)}</td></tr>
        <tr><td>تاريخ الدفع</td><td>${fmtDate(p.date)}</td></tr>
        ${p.note ? `<tr><td>ملاحظة</td><td>${escapeHtml(p.note)}</td></tr>` : ''}
        <tr class="total-row"><td>المبلغ المدفوع</td><td>${fmtMoney(p.amount)}</td></tr>
      </table>
      <div class="sign">
        <span>توقيع المستلم: ..............................</span>
        <span>${fmtDate(todayISO())}</span>
      </div>
    </div>
  `;
  window.print();
}

/* ================= التقرير الشهري ================= */
let reportMonth = currentMonth();

function renderReport() {
  const el = document.getElementById('section-report');
  const students = state.students.filter(s => s.status !== 'inactive' && isEnrolledInMonth(s, reportMonth));

  let paid = 0, partial = 0, unpaid = 0, totalCollected = 0, totalDue = 0;
  const rows = students.map(s => {
    const fee = monthlyFeeFor(s);
    const amountPaid = monthPaid(s, reportMonth);
    const status = monthStatus(s, reportMonth);
    if (status === 'paid') paid++; else if (status === 'partial') partial++; else unpaid++;
    totalCollected += amountPaid;
    totalDue += fee;
    return { s, fee, amountPaid, status };
  }).sort((a, b) => a.s.name.localeCompare(b.s.name, 'ar'));

  const monthOptions = lastNMonths(18);

  el.innerHTML = `
    <div class="toolbar">
      <div class="field">
        <label>اختر الشهر</label>
        <select id="rp-month">
          ${monthOptions.map(m => `<option value="${m}" ${m === reportMonth ? 'selected' : ''}>${monthLabel(m)}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn--outline" id="rp-export">⬇️ تصدير CSV</button>
    </div>

    <div class="stat-grid">
      <div class="stat-card stat-card--accent"><div class="stat-card__label">مسدد بالكامل</div><div class="stat-card__value">${paid}</div></div>
      <div class="stat-card stat-card--warn"><div class="stat-card__label">سداد جزئي</div><div class="stat-card__value">${partial}</div></div>
      <div class="stat-card stat-card--danger"><div class="stat-card__label">غير مسدد</div><div class="stat-card__value">${unpaid}</div></div>
      <div class="stat-card stat-card--primary"><div class="stat-card__label">المحصّل / المستحق</div><div class="stat-card__value">${fmtMoney(totalCollected)} / ${fmtMoney(totalDue)}</div></div>
    </div>

    <div class="card">
      <div class="card__header"><h3>تفاصيل شهر ${monthLabel(reportMonth)}</h3></div>
      <div class="card__body" style="padding:0">
        ${rows.length === 0 ? emptyState('📅', 'لا يوجد طلاب مسجّلون لهذا الشهر') : `
        <div class="table-wrap"><table>
          <thead><tr><th>الطالب</th><th>القسم</th><th>الرسم الشهري</th><th>المدفوع</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td>${escapeHtml(r.s.name)}</td>
                <td>${escapeHtml(className(r.s.classId))}</td>
                <td>${fmtMoney(r.fee)}</td>
                <td>${fmtMoney(r.amountPaid)}</td>
                <td>${statusBadge(r.status)}</td>
                <td>${r.status !== 'paid' ? `<button class="btn btn--primary btn--sm" data-pay="${r.s.id}">تحصيل</button>` : ''}</td>
              </tr>`).join('')}
          </tbody>
        </table></div>`}
      </div>
    </div>
  `;

  document.getElementById('rp-month').addEventListener('change', e => { reportMonth = e.target.value; renderReport(); });
  document.getElementById('rp-export').addEventListener('click', () => exportReportCSV(rows));
  el.querySelectorAll('[data-pay]').forEach(b => b.addEventListener('click', () => {
    const studentId = b.dataset.pay;
    paymentForm(studentId);
    setTimeout(() => {
      const typeSel = document.getElementById('pf-type');
      const monthInput = document.getElementById('pf-month');
      if (typeSel) { typeSel.value = 'monthly'; typeSel.dispatchEvent(new Event('change')); }
      if (monthInput) { monthInput.value = reportMonth; monthInput.dispatchEvent(new Event('change')); }
    }, 0);
  }));
}

function exportReportCSV(rows) {
  const header = ['اسم الطالب', 'القسم', 'الرسم الشهري', 'المدفوع', 'الحالة'];
  const statusLabel = { paid: 'مسدد', partial: 'جزئي', unpaid: 'غير مسدد' };
  const lines = [header.join(',')];
  rows.forEach(r => {
    lines.push([r.s.name, className(r.s.classId), r.fee, r.amountPaid, statusLabel[r.status]]
      .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  });
  downloadFile(`تقرير-${reportMonth}.csv`, '﻿' + lines.join('\n'), 'text/csv;charset=utf-8');
}

/* ================= النسخ الاحتياطي ================= */
function renderBackup() {
  const el = document.getElementById('section-backup');
  el.innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card__header"><h3>تصدير نسخة احتياطية</h3></div>
        <div class="card__body">
          <p style="color:var(--color-text-muted);margin-bottom:16px">احفظ نسخة كاملة من بيانات المدرسة (الطلاب، الأقسام، الدفعات) في ملف JSON يمكن استيراده لاحقًا.</p>
          <button class="btn btn--primary" id="bk-export">⬇️ تنزيل نسخة احتياطية (JSON)</button>
        </div>
      </div>
      <div class="card">
        <div class="card__header"><h3>استيراد نسخة احتياطية</h3></div>
        <div class="card__body">
          <p style="color:var(--color-text-muted);margin-bottom:16px">استيراد ملف نسخة احتياطية سابق. سيتم <strong>استبدال</strong> كل البيانات الحالية.</p>
          <input type="file" id="bk-import" accept="application/json">
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="card__header"><h3>تصدير قوائم CSV</h3></div>
      <div class="card__body" style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn--outline" id="bk-export-students">⬇️ قائمة الطلاب (CSV)</button>
        <button class="btn btn--outline" id="bk-export-payments">⬇️ سجل الدفعات (CSV)</button>
      </div>
    </div>
  `;

  document.getElementById('bk-export').addEventListener('click', () => {
    downloadFile(`نسخة-احتياطية-${todayISO()}.json`, JSON.stringify(state, null, 2), 'application/json');
  });
  document.getElementById('bk-import').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== 'object') throw new Error('bad');
        confirmAction('سيتم استبدال كل البيانات الحالية بالبيانات المستوردة. هل تريد المتابعة؟', () => {
          state = {
            settings: { ...defaultState().settings, ...(parsed.settings || {}) },
            classes: Array.isArray(parsed.classes) ? parsed.classes : [],
            students: Array.isArray(parsed.students) ? parsed.students : [],
            payments: Array.isArray(parsed.payments) ? parsed.payments : []
          };
          save();
          toast('تم استيراد البيانات بنجاح', 'success');
          renderBrand();
          refreshCurrentSection();
        });
      } catch (err) {
        toast('الملف غير صالح', 'error');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });
  document.getElementById('bk-export-students').addEventListener('click', () => {
    const header = ['الاسم', 'القسم', 'الهاتف', 'ولي الأمر', 'تاريخ التسجيل', 'رسوم التسجيل', 'المدفوع', 'المتبقي', 'الحالة'];
    const statusLabel = { paid: 'مسدد', partial: 'جزئي', unpaid: 'غير مسدد' };
    const lines = [header.join(',')];
    state.students.forEach(s => {
      lines.push([s.name, className(s.classId), s.phone || '', s.parentName || '', s.registrationDate || '',
        registrationFee(s), registrationPaid(s), registrationBalance(s), statusLabel[registrationStatus(s)]]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    });
    downloadFile(`قائمة-الطلاب-${todayISO()}.csv`, '﻿' + lines.join('\n'), 'text/csv;charset=utf-8');
  });
  document.getElementById('bk-export-payments').addEventListener('click', () => {
    const header = ['رقم الإيصال', 'الطالب', 'النوع', 'الشهر', 'المبلغ', 'التاريخ', 'ملاحظة'];
    const lines = [header.join(',')];
    state.payments.forEach(p => {
      const st = getStudent(p.studentId);
      lines.push([p.receiptNo || '', st ? st.name : 'محذوف', p.type === 'registration' ? 'تسجيل' : 'شهرية',
        p.month ? monthLabel(p.month) : '', p.amount, p.date, p.note || '']
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    });
    downloadFile(`سجل-الدفعات-${todayISO()}.csv`, '﻿' + lines.join('\n'), 'text/csv;charset=utf-8');
  });
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ================= الإعدادات ================= */
function renderSettings() {
  const el = document.getElementById('section-settings');
  const s = state.settings;
  el.innerHTML = `
    <div class="card" style="max-width:640px">
      <div class="card__header"><h3>إعدادات المدرسة</h3></div>
      <div class="card__body">
        <div class="field" style="margin-bottom:14px">
          <label>اسم المدرسة</label>
          <input id="st-name" value="${escapeHtml(s.schoolName)}">
        </div>
        <div class="field-row" style="margin-bottom:14px">
          <div class="field">
            <label>السنة الدراسية</label>
            <input id="st-year" value="${escapeHtml(s.schoolYear)}">
          </div>
          <div class="field">
            <label>العملة</label>
            <input id="st-currency" value="${escapeHtml(s.currency)}">
          </div>
        </div>
        <div class="field-row" style="margin-bottom:14px">
          <div class="field">
            <label>العنوان</label>
            <input id="st-address" value="${escapeHtml(s.address || '')}">
          </div>
          <div class="field">
            <label>رقم الهاتف</label>
            <input id="st-phone" value="${escapeHtml(s.phone || '')}">
          </div>
        </div>
        <div class="field-row" style="margin-bottom:14px">
          <div class="field">
            <label>رسوم التسجيل الافتراضية</label>
            <input id="st-regfee" type="number" min="0" value="${s.defaultRegistrationFee}">
          </div>
          <div class="field">
            <label>بادئة رقم الإيصال</label>
            <input id="st-prefix" value="${escapeHtml(s.receiptPrefix)}">
          </div>
        </div>
        <button class="btn btn--primary" id="st-save">حفظ الإعدادات</button>
      </div>
    </div>

    <div class="card" style="max-width:640px;margin-top:18px;border-color:var(--color-danger)">
      <div class="card__header"><h3 style="color:var(--color-danger)">منطقة الخطر</h3></div>
      <div class="card__body">
        <p style="color:var(--color-text-muted);margin-bottom:14px">حذف كل البيانات (الطلاب، الأقسام، الدفعات) نهائيًا. يُستحسن تصدير نسخة احتياطية أولًا.</p>
        <button class="btn btn--danger" id="st-reset">🗑️ حذف كل البيانات</button>
      </div>
    </div>
  `;
  document.getElementById('st-save').addEventListener('click', () => {
    s.schoolName = document.getElementById('st-name').value.trim() || 'اسم المدرسة';
    s.schoolYear = document.getElementById('st-year').value.trim();
    s.currency = document.getElementById('st-currency').value.trim() || 'FCFA';
    s.address = document.getElementById('st-address').value.trim();
    s.phone = document.getElementById('st-phone').value.trim();
    s.defaultRegistrationFee = Number(document.getElementById('st-regfee').value) || 0;
    s.receiptPrefix = document.getElementById('st-prefix').value.trim() || 'REC';
    save();
    renderBrand();
    toast('تم حفظ الإعدادات', 'success');
  });
  document.getElementById('st-reset').addEventListener('click', () => {
    confirmAction('هل أنت متأكد من حذف كل البيانات نهائيًا؟ هذا الإجراء لا يمكن التراجع عنه.', () => {
      state = defaultState();
      save();
      renderBrand();
      refreshCurrentSection();
      toast('تم حذف كل البيانات', 'success');
    });
  });
}

/* ================= الشريط الجانبي (جوال) ================= */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
}

/* ================= تهيئة التطبيق ================= */
function init() {
  renderBrand();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navigate(link.dataset.section));
  });
  document.getElementById('menu-toggle').addEventListener('click', openSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeSidebar);
  document.getElementById('quick-payment-btn').addEventListener('click', () => paymentForm());
  document.getElementById('quick-student-btn').addEventListener('click', () => studentForm());
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  navigate('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
