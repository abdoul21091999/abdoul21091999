/* Gestion de l'école coranique (daara) — application hors connexion, données dans le navigateur. */
(() => {
  "use strict";

  // ---------- Stockage ----------
  const KEY = "daara-db-v1";
  const blank = () => ({
    settings: {
      schoolName: "", director: "", phone: "", address: "", currency: "FCFA", defaultFee: 5000,
      lang: "ar", direction: "fatiha", codePrefix: "DAARA", codeSeq: 0, receiptSeq: 0, lastBackup: null, setupDone: false,
    },
    classes: [], students: [], sessions: [], absences: [], payments: [],
  });
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const d = JSON.parse(raw);
      const b = blank();
      return { ...b, ...d, settings: { ...b.settings, ...(d.settings || {}) } };
    } catch (e) { return blank(); }
  }
  let db = load();
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { alert("Erreur d'enregistrement / خطأ في الحفظ: " + e.message); }
  }

  // ---------- Utilitaires ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const L = () => db.settings.lang;
  const t = (k) => (I18N[L()] && I18N[L()][k]) || I18N.fr[k] || k;
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const today = () => iso(new Date());
  const curYM = () => today().slice(0, 7);
  const addDays = (s, n) => { const d = new Date(s + "T12:00:00"); d.setDate(d.getDate() + n); return iso(d); };
  const addMonths = (ym, n) => { const [y, m] = ym.split("-").map(Number); const d = new Date(y, m - 1 + n, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };
  const locale = () => (L() === "ar" ? "ar-u-nu-latn" : "fr-FR");
  const fmtDate = (s) => (s ? new Date(s + "T12:00:00").toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" }) : t("none"));
  const fmtMonth = (ym) => new Date(ym + "-15T12:00:00").toLocaleDateString(locale(), { month: "long", year: "numeric" });
  const money = (n) => `<span class="num">${Math.round(n || 0).toLocaleString("fr-FR")} ${esc(db.settings.currency)}</span>`;
  const surahName = (n) => (L() === "ar" ? SURAH_AR[n - 1] : `${SURAH_FR[n - 1]}`);
  const surahOptions = (sel) => SURAH_AR.map((_, i) => `<option value="${i + 1}" ${+sel === i + 1 ? "selected" : ""}>${i + 1}. ${esc(SURAH_AR[i])} — ${esc(SURAH_FR[i])}</option>`).join("");
  const initials = (name) => (name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const waPhone = (p) => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("00")) d = d.slice(2); if (d.length === 9) d = "221" + d; return d; };

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // ---------- Requêtes métier ----------
  const byId = (arr, id) => arr.find((x) => x.id === id);
  const student = (id) => byId(db.students, id);
  const klass = (id) => byId(db.classes, id);
  const activeStudents = () => db.students.filter((s) => s.status !== "archived");
  const feeOf = (s) => (s.fee === "" || s.fee == null ? +db.settings.defaultFee || 0 : +s.fee);
  const startYM = (s) => (s.enrolled || today()).slice(0, 7);
  const paidFor = (sid, ym) => db.payments.filter((p) => p.studentId === sid && p.month === ym).reduce((a, p) => a + +p.amount, 0);
  function monthStatus(s, ym) {
    const fee = feeOf(s);
    if (ym < startYM(s)) return null;
    if (!fee) return "exempt";
    const p = paidFor(s.id, ym);
    return p >= fee ? "paid" : p > 0 ? "partial" : "unpaid";
  }
  function arrears(s, upTo = curYM()) {
    const fee = feeOf(s);
    if (!fee || s.status === "archived") return 0;
    let total = 0;
    for (let m = startYM(s); m <= upTo; m = addMonths(m, 1)) total += Math.max(0, fee - paidFor(s.id, m));
    return total;
  }
  const isAbsentOn = (sid, d) => db.absences.some((a) => a.studentId === sid && a.from <= d && (a.to || a.from) >= d);
  const studentSessions = (sid) => db.sessions.filter((x) => x.studentId === sid).sort((a, b) => (b.date + b.created).localeCompare(a.date + a.created));
  const hizbCount = (s) => (s.hizbs || []).length;
  const pct = (s) => Math.round((hizbCount(s) / 60) * 100);
  const lastSessionDate = (sid) => db.sessions.filter((x) => x.studentId === sid).reduce((m, x) => (x.date > m ? x.date : m), "");
  // Numéro de hizb affiché selon le sens de mémorisation choisi.
  const hizbLabel = (n) => (db.settings.direction === "nas" ? 61 - n : n);
  function nextCode() {
    db.settings.codeSeq = (+db.settings.codeSeq || 0) + 1;
    return `${db.settings.codePrefix || "DAARA"}-${today().slice(2, 4)}-${String(db.settings.codeSeq).padStart(3, "0")}`;
  }
  const statusChip = (st) => (st ? `<span class="chip chip-${st}">${t(st)}</span>` : `<span class="muted">${t("none")}</span>`);
  const sessionLabel = (x) => {
    const range = x.fromSurah
      ? `${esc(surahName(x.fromSurah))} ${x.fromAyah || ""}${x.toSurah ? ` → ${x.toSurah !== x.fromSurah ? esc(surahName(x.toSurah)) + " " : ""}${x.toAyah || ""}` : ""}`
      : "";
    const hz = x.hizb ? `${t("hizb")} ${hizbLabel(x.hizb)}` : "";
    return [range, hz].filter(Boolean).join(" · ");
  };

  // ---------- Fenêtre modale ----------
  const modal = $("#modal");
  let modalSubmit = null;
  function openModal(title, body, onSubmit, opts = {}) {
    $("#modal-title").textContent = title;
    $("#modal-body").innerHTML = body;
    $("#modal-save").style.display = onSubmit ? "" : "none";
    $("#modal-save").textContent = opts.saveLabel || t("save");
    $("#modal-cancel").textContent = onSubmit ? t("cancel") : t("close");
    modalSubmit = onSubmit;
    modal.showModal();
    const first = $("#modal-body input:not([type=hidden]), #modal-body select, #modal-body textarea");
    if (first && !opts.noFocus) first.focus();
  }
  $("#modal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!modalSubmit) return modal.close();
    const fd = Object.fromEntries(new FormData($("#modal-form")).entries());
    if (modalSubmit(fd) !== false) { modal.close(); persist(); render(); }
  });
  $("#modal-cancel").addEventListener("click", () => modal.close());

  const field = (label, html, cls = "") => `<label class="field ${cls}"><span>${label}</span>${html}</label>`;
  const input = (name, val = "", type = "text", extra = "") => `<input name="${name}" type="${type}" value="${esc(val)}" ${extra}>`;
  const select = (name, options, val) => `<select name="${name}">${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(val ?? "") ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  const classOptions = (withNone = true) => [...(withNone ? [["", t("unassigned")]] : []), ...db.classes.map((c) => [c.id, c.name])];
  const studentOptions = () => [["", t("pickStudent")], ...activeStudents().sort((a, b) => a.name.localeCompare(b.name)).map((s) => [s.id, `${s.name} (${s.code})`])];

  // ---------- Formulaires ----------
  function studentForm(s) {
    const isNew = !s;
    s = s || { enrolled: today(), gender: "m", fee: "", classId: state.classFilter || "" };
    openModal(isNew ? t("addStudent") : t("editStudent"), `
      <div class="grid2">
        ${field(t("fullName") + " *", input("name", s.name, "text", "required autocomplete=off"), "span2")}
        ${field(t("gender"), select("gender", [["m", t("male")], ["f", t("female")]], s.gender))}
        ${field(t("dob"), input("dob", s.dob, "date"))}
        ${field(t("region"), input("region", s.region))}
        ${field(t("enrolled"), input("enrolled", s.enrolled, "date"))}
        ${field(t("classe"), select("classId", classOptions(), s.classId))}
        ${field(`${t("monthlyFee")} (${esc(db.settings.currency)})`, input("fee", s.fee, "number", `min=0 step=100 placeholder="${esc(db.settings.defaultFee)}"`))}
        ${field(t("guardianName"), input("guardianName", s.guardianName))}
        ${field(t("guardianPhone"), input("guardianPhone", s.guardianPhone, "tel", 'placeholder="77 123 45 67"'))}
        <label class="check span2"><input type="checkbox" name="boarding" ${s.boarding ? "checked" : ""}> ${t("boarding")}</label>
        ${field(t("notes"), `<textarea name="notes" rows="2">${esc(s.notes)}</textarea>`, "span2")}
      </div>`, (fd) => {
      if (!fd.name.trim()) { toast(t("required")); return false; }
      const data = {
        name: fd.name.trim(), gender: fd.gender, dob: fd.dob, region: fd.region.trim(), enrolled: fd.enrolled || today(),
        classId: fd.classId, fee: fd.fee === "" ? "" : +fd.fee, guardianName: fd.guardianName.trim(),
        guardianPhone: fd.guardianPhone.trim(), boarding: !!fd.boarding, notes: fd.notes.trim(),
      };
      if (isNew) db.students.push({ id: uid(), code: nextCode(), status: "active", hizbs: [], currentSurah: "", created: new Date().toISOString(), ...data });
      else Object.assign(s, data);
      toast(t("saved"));
    });
  }

  function classForm(c) {
    const isNew = !c;
    c = c || {};
    openModal(isNew ? t("addClass") : t("editClass"), `
      <div class="grid2">
        ${field(t("className") + " *", input("name", c.name, "text", "required"), "span2")}
        ${field(t("teacher"), input("teacher", c.teacher))}
        ${field(t("teacherPhone"), input("teacherPhone", c.teacherPhone, "tel"))}
        ${field(t("room"), input("room", c.room))}
        ${field(t("level"), input("level", c.level))}
        ${field(t("schedule"), input("schedule", c.schedule, "text", 'placeholder="06:00–08:00, 16:00–18:00"'))}
        ${field(t("target"), input("target", c.target, "number", "min=0 step=0.5"))}
      </div>`, (fd) => {
      if (!fd.name.trim()) { toast(t("required")); return false; }
      const data = { name: fd.name.trim(), teacher: fd.teacher.trim(), teacherPhone: fd.teacherPhone.trim(), room: fd.room.trim(), level: fd.level.trim(), schedule: fd.schedule.trim(), target: fd.target };
      if (isNew) db.classes.push({ id: uid(), ...data }); else Object.assign(c, data);
      toast(t("saved"));
    });
  }

  function sessionForm(sid, x) {
    const isNew = !x;
    const s = sid ? student(sid) : null;
    const cur = +(s && s.currentSurah) || 1;
    x = x || { date: state.hifzDate || today(), type: "new", fromSurah: cur, toSurah: cur, quality: "good" };
    openModal(t("addSession") + (s ? ` — ${s.name}` : ""), `
      <div class="grid2">
        ${s ? `<input type="hidden" name="studentId" value="${esc(s.id)}">` : field(t("student") + " *", select("studentId", studentOptions(), ""), "span2")}
        ${field(t("sessionType"), select("type", [["new", t("t_new")], ["revision", t("t_revision")], ["validation", t("t_validation")]], x.type))}
        ${field(t("date"), input("date", x.date, "date"))}
        ${field(t("fromSurah"), `<select name="fromSurah" data-ayah="fromAyah">${surahOptions(x.fromSurah)}</select>`)}
        ${field(t("fromAyah"), input("fromAyah", x.fromAyah, "number", `min=1 max=${SURAH_AYAHS[(x.fromSurah || 1) - 1]}`))}
        ${field(t("toSurah"), `<select name="toSurah" data-ayah="toAyah">${surahOptions(x.toSurah || x.fromSurah)}</select>`)}
        ${field(t("toAyah"), input("toAyah", x.toAyah, "number", `min=1 max=${SURAH_AYAHS[(x.toSurah || x.fromSurah || 1) - 1]}`))}
        ${field(t("quality"), select("quality", [["excellent", t("q_excellent")], ["good", t("q_good")], ["weak", t("q_weak")]], x.quality))}
        ${field(t("hizb"), select("hizb", [["", t("none")], ...HIZB_START.map((h, i) => [i + 1, `${t("hizb")} ${hizbLabel(i + 1)} — ${surahName(h[0])} ${h[1]}`])], x.hizb || ""))}
        <label class="check span2"><input type="checkbox" name="markHizb" ${x.type === "validation" ? "checked" : ""}> ${t("markHizb")}</label>
        ${field(t("note"), `<textarea name="note" rows="2">${esc(x.note)}</textarea>`, "span2")}
      </div>`, (fd) => {
      if (!fd.studentId) { toast(t("pickStudent")); return false; }
      const fs = +fd.fromSurah, ts = +fd.toSurah || fs;
      const fa = +fd.fromAyah || 1, ta = +fd.toAyah || SURAH_AYAHS[ts - 1];
      if (fa > SURAH_AYAHS[fs - 1] || ta > SURAH_AYAHS[ts - 1]) { toast(t("rangeError")); return false; }
      const hizb = +fd.hizb || hizbOf(ts, ta);
      const data = { studentId: fd.studentId, type: fd.type, date: fd.date || today(), fromSurah: fs, fromAyah: fa, toSurah: ts, toAyah: ta, quality: fd.quality, hizb, note: fd.note.trim() };
      if (isNew) db.sessions.push({ id: uid(), created: new Date().toISOString(), ...data }); else Object.assign(x, data);
      const st = student(fd.studentId);
      if (fd.type === "new") st.currentSurah = ts;
      if (fd.markHizb && hizb) { st.hizbs = st.hizbs || []; if (!st.hizbs.includes(hizb)) st.hizbs.push(hizb); }
      toast(t("saved"));
    });
    // Ajuste le maximum de versets selon la sourate choisie.
    $$("#modal-body select[data-ayah]").forEach((sel) => sel.addEventListener("change", () => {
      const inp = $(`#modal-body input[name=${sel.dataset.ayah}]`);
      inp.max = SURAH_AYAHS[+sel.value - 1];
      if (sel.name === "fromSurah") { const to = $("#modal-body select[name=toSurah]"); if (+to.value < +sel.value) { to.value = sel.value; to.dispatchEvent(new Event("change")); } }
    }));
    $("#modal-body select[name=type]").addEventListener("change", (e) => { $("#modal-body input[name=markHizb]").checked = e.target.value === "validation"; });
  }

  function paymentForm(sid, month) {
    const s = sid ? student(sid) : null;
    const ym = month || state.feesMonth || curYM();
    const rest = s ? Math.max(0, feeOf(s) - paidFor(s.id, ym)) : "";
    openModal(t("addPayment") + (s ? ` — ${s.name}` : ""), `
      <div class="grid2">
        ${s ? `<input type="hidden" name="studentId" value="${esc(s.id)}">` : field(t("student") + " *", select("studentId", studentOptions(), ""), "span2")}
        ${field(t("month"), input("month", ym, "month", "required"))}
        ${field(`${t("amount")} (${esc(db.settings.currency)}) *`, input("amount", rest || (s ? feeOf(s) : db.settings.defaultFee), "number", "min=1 step=50 required"))}
        ${field(t("method"), select("method", [["cash", t("m_cash")], ["wave", t("m_wave")], ["om", t("m_om")], ["other", t("m_other")]], "cash"))}
        ${field(t("date"), input("date", today(), "date"))}
        ${field(t("note"), input("note", ""), "span2")}
      </div>`, (fd) => {
      if (!fd.studentId || !(+fd.amount > 0)) { toast(t("required")); return false; }
      db.settings.receiptSeq = (+db.settings.receiptSeq || 0) + 1;
      const p = { id: uid(), studentId: fd.studentId, month: fd.month || ym, amount: +fd.amount, method: fd.method, date: fd.date || today(), note: fd.note.trim(), receiptNo: `R-${String(db.settings.receiptSeq).padStart(5, "0")}`, created: new Date().toISOString() };
      db.payments.push(p);
      persist();
      setTimeout(() => { if (confirm(`${t("saved")} — ${t("print")} ${t("receipt")} ?`)) printReceipt(p.id); }, 50);
    });
  }

  function absenceForm(sid) {
    const s = sid ? student(sid) : null;
    openModal(t("addAbsence") + (s ? ` — ${s.name}` : ""), `
      <div class="grid2">
        ${s ? `<input type="hidden" name="studentId" value="${esc(s.id)}">` : field(t("student") + " *", select("studentId", studentOptions(), ""), "span2")}
        ${field(t("from"), input("from", today(), "date", "required"))}
        ${field(t("to"), input("to", "", "date"))}
        ${field(t("reason"), input("reason", "", "text"), "span2")}
      </div>`, (fd) => {
      if (!fd.studentId || !fd.from) { toast(t("required")); return false; }
      if (fd.to && fd.to < fd.from) { toast(t("rangeError")); return false; }
      db.absences.push({ id: uid(), studentId: fd.studentId, from: fd.from, to: fd.to || fd.from, reason: fd.reason.trim() });
      toast(t("saved"));
    });
  }

  // ---------- Impression ----------
  function printHtml(html) {
    $("#print").innerHTML = html;
    document.body.classList.add("printing");
    setTimeout(() => { window.print(); document.body.classList.remove("printing"); }, 100);
  }
  const printHeader = () => `<div class="p-head"><img src="icons/icon.svg" alt=""><div><h1>${esc(db.settings.schoolName || t("appName"))}</h1>
      <div>${esc([db.settings.director, db.settings.phone, db.settings.address].filter(Boolean).join(" · "))}</div></div></div>`;
  const methodLabel = (m) => t({ cash: "m_cash", wave: "m_wave", om: "m_om" }[m] || "m_other");

  function printReceipt(pid) {
    const p = byId(db.payments, pid); if (!p) return;
    const s = student(p.studentId) || {};
    const rest = s.id ? Math.max(0, feeOf(s) - paidFor(s.id, p.month)) : 0;
    const one = (copy) => `<div class="receipt">${printHeader()}
      <h2>${t("receipt")} ${esc(p.receiptNo)} <small>${copy}</small></h2>
      <table class="p-table">
        <tr><th>${t("date")}</th><td>${fmtDate(p.date)}</td></tr>
        <tr><th>${t("received")}</th><td>${esc(s.guardianName || t("none"))}</td></tr>
        <tr><th>${t("forStudent")}</th><td>${esc(s.name)} (${esc(s.code)})</td></tr>
        <tr><th>${t("forMonth")}</th><td>${fmtMonth(p.month)}</td></tr>
        <tr><th>${t("amount")}</th><td><b>${money(p.amount)}</b></td></tr>
        <tr><th>${t("method")}</th><td>${methodLabel(p.method)}</td></tr>
        <tr><th>${t("remaining")}</th><td>${money(rest)}</td></tr>
      </table>
      <div class="p-sign"><span>${t("thanks")}</span><span>${t("signature")} : ____________</span></div></div>`;
    printHtml(one("") + `<div class="cut"></div>` + one("(copie)"));
  }

  function printReport(sid) {
    const s = student(sid); if (!s) return;
    const c = klass(s.classId);
    const sess = studentSessions(sid).slice(0, 12);
    const months = [...Array(6)].map((_, i) => addMonths(curYM(), -5 + i));
    const absN = db.absences.filter((a) => a.studentId === sid).length;
    printHtml(`${printHeader()}
      <h2>${t("reportTitle")}</h2>
      <table class="p-table">
        <tr><th>${t("fullName")}</th><td>${esc(s.name)} (${esc(s.code)})</td><th>${t("classe")}</th><td>${esc(c ? c.name : t("unassigned"))}</td></tr>
        <tr><th>${t("guardian")}</th><td>${esc(s.guardianName || t("none"))}</td><th>${t("teacher")}</th><td>${esc(c && c.teacher ? c.teacher : t("none"))}</td></tr>
        <tr><th>${t("progressPct")}</th><td><b>${hizbCount(s)} / 60 ${t("hizbs")} (${pct(s)}%)</b></td><th>${t("currentSurah")}</th><td>${s.currentSurah ? esc(surahName(+s.currentSurah)) : t("none")}</td></tr>
        <tr><th>${t("absences")}</th><td>${absN}</td><th>${t("arrears")}</th><td>${money(arrears(s))}</td></tr>
      </table>
      <h3>${t("hizbMap")}</h3>${hizbMap(s, false)}
      <h3>${t("sessionsLog")}</h3>
      <table class="p-table"><tr><th>${t("date")}</th><th>${t("sessionType")}</th><th>${t("progress")}</th><th>${t("quality")}</th><th>${t("note")}</th></tr>
      ${sess.map((x) => `<tr><td>${fmtDate(x.date)}</td><td>${t("t_" + x.type)}</td><td>${sessionLabel(x)}</td><td>${t("q_" + x.quality)}</td><td>${esc(x.note)}</td></tr>`).join("") || `<tr><td colspan=5>${t("noSessions")}</td></tr>`}</table>
      <h3>${t("payments")}</h3>
      <table class="p-table"><tr>${months.map((m) => `<th>${fmtMonth(m)}</th>`).join("")}</tr><tr>${months.map((m) => `<td>${statusChip(monthStatus(s, m))}</td>`).join("")}</tr></table>
      <div class="p-sign"><span>${t("generatedOn")} ${fmtDate(today())}</span><span>${t("signature")} : ____________</span></div>`);
  }

  function printFeesReport(ym, rows) {
    const exp = rows.reduce((a, r) => a + r.fee, 0), col = rows.reduce((a, r) => a + r.paid, 0);
    printHtml(`${printHeader()}<h2>${t("monthReport")} — ${fmtMonth(ym)}</h2>
      <p>${t("expected")} : <b>${money(exp)}</b> · ${t("collected")} : <b>${money(col)}</b> · ${t("rate")} : <b>${exp ? Math.round((col / exp) * 100) : 0}%</b></p>
      <table class="p-table"><tr><th>${t("code")}</th><th>${t("fullName")}</th><th>${t("classe")}</th><th>${t("due")}</th><th>${t("paid")}</th><th>${t("status")}</th><th>${t("arrears")}</th></tr>
      ${rows.map((r) => `<tr><td>${esc(r.s.code)}</td><td>${esc(r.s.name)}</td><td>${esc(r.cls)}</td><td>${money(r.fee)}</td><td>${money(r.paid)}</td><td>${statusChip(r.st)}</td><td>${money(r.arr)}</td></tr>`).join("")}</table>
      <div class="p-sign"><span>${t("generatedOn")} ${fmtDate(today())}</span><span>${t("signature")} : ____________</span></div>`);
  }

  function downloadCsv(name, rows) {
    const csv = "﻿" + rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    download(name, csv, "text/csv;charset=utf-8");
  }
  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---------- Composants ----------
  function hizbMap(s, interactive = true) {
    const set = new Set(s.hizbs || []);
    const order = [...Array(60)].map((_, i) => i + 1);
    if (db.settings.direction === "nas") order.reverse();
    return `<div class="hizb-map ${interactive ? "interactive" : ""}">${order.map((n) => {
      const [su, ay] = HIZB_START[n - 1];
      return `<button type="button" class="hz ${set.has(n) ? "on" : ""}" ${interactive ? `data-action="toggle-hizb" data-id="${esc(s.id)}" data-n="${n}"` : "disabled"} title="${esc(surahName(su))} ${ay}">${hizbLabel(n)}</button>`;
    }).join("")}</div>`;
  }
  const progressBar = (p) => `<div class="bar"><i style="width:${p}%"></i></div>`;
  const avatar = (s) => `<div class="avatar ${s.gender === "f" ? "f" : ""}">${esc(initials(s.name))}</div>`;
  const kpi = (label, value, tone = "") => `<div class="kpi ${tone}"><div class="kpi-v">${value}</div><div class="kpi-l">${label}</div></div>`;
  const empty = (msg, action = "") => `<div class="empty"><p>${msg}</p>${action}</div>`;
  const waLink = (phone, text = "") => `https://wa.me/${waPhone(phone)}${text ? "?text=" + encodeURIComponent(text) : ""}`;

  // ---------- Vues ----------
  const state = { tab: "progress", classFilter: "", search: "", showArchived: false, feesMonth: curYM(), feesStatus: "", hifzDate: today(), rollClass: "" };

  function viewDashboard() {
    const act = activeStudents();
    const m = curYM(), d = today(), weekAgo = addDays(d, -6);
    let expected = 0;
    act.forEach((s) => { if (startYM(s) <= m) expected += feeOf(s); });
    const collected = db.payments.filter((p) => p.month === m).reduce((a, p) => a + +p.amount, 0);
    const behind = act.map((s) => ({ s, arr: arrears(s) })).filter((x) => x.arr > 0).sort((a, b) => b.arr - a.arr);
    const absent = act.filter((s) => isAbsentOn(s.id, d));
    const weekSess = db.sessions.filter((x) => x.date >= weekAgo && x.date <= d);
    const avg = act.length ? (act.reduce((a, s) => a + hizbCount(s), 0) / act.length).toFixed(1) : 0;
    const khatm = act.filter((s) => hizbCount(s) === 60).length;
    const idle = act.filter((s) => { const l = lastSessionDate(s.id); return !l || l < addDays(d, -13); });
    const recent = [...db.sessions].sort((a, b) => (b.date + b.created).localeCompare(a.date + a.created)).slice(0, 8);

    if (!db.settings.setupDone && !db.students.length) {
      return `<section class="card welcome"><h2>${t("welcomeTitle")}</h2><p>${t("welcomeText")}</p>
        <div class="row"><a class="btn primary" href="#/settings">${t("start")}</a><button class="btn" data-action="demo">${t("tryDemo")}</button></div></section>`;
    }
    return `
      <section class="hello"><h2>${t("greeting")} 👋</h2><p class="muted">${esc(db.settings.schoolName)} — ${t("greetingSub")} · ${fmtDate(d)}</p></section>
      <section class="kpis">
        ${kpi(t("kpi_students"), act.length)}
        ${kpi(t("kpi_collected"), money(collected), "green")}
        ${kpi(t("kpi_expected"), money(expected))}
        ${kpi(t("kpi_behind"), behind.length, behind.length ? "red" : "")}
        ${kpi(t("kpi_absent"), absent.length, absent.length ? "amber" : "")}
        ${kpi(t("kpi_sessions"), weekSess.length)}
        ${kpi(t("kpi_hizbAvg"), `<span class="num">${avg} / 60</span>`)}
        ${kpi(t("kpi_khatm"), khatm, "green")}
      </section>
      <div class="cols">
        <section class="card"><div class="card-h"><h3>${t("classesState")}</h3><a href="#/classes">${t("seeAll")}</a></div>
          ${db.classes.length ? `<table class="tbl"><thead><tr><th>${t("classe")}</th><th>${t("teacher")}</th><th>${t("nav_students")}</th><th>${t("avgProgress")}</th><th>${t("kpi_sessions")}</th></tr></thead><tbody>
          ${db.classes.map((c) => {
            const st = act.filter((s) => s.classId === c.id);
            const a = st.length ? st.reduce((x, s) => x + pct(s), 0) / st.length : 0;
            const ws = weekSess.filter((x) => st.some((s) => s.id === x.studentId)).length;
            return `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.teacher || t("none"))}</td><td>${st.length}</td><td>${progressBar(a)}<small>${Math.round(a)}%</small></td><td>${ws}</td></tr>`;
          }).join("")}</tbody></table>` : empty(t("noClasses"))}
        </section>
        <section class="card"><div class="card-h"><h3>${t("recentSessions")}</h3><a href="#/hifz">${t("seeAll")}</a></div>
          ${recent.length ? `<ul class="list">${recent.map((x) => { const s = student(x.studentId); return s ? `<li><a href="#/student/${esc(s.id)}">${avatar(s)}<div><b>${esc(s.name)}</b><small>${t("t_" + x.type)} · ${sessionLabel(x)}</small></div><span class="chip q-${x.quality}">${t("q_" + x.quality)}</span></a></li>` : ""; }).join("")}</ul>` : empty(t("noSessions"))}
        </section>
        <section class="card"><div class="card-h"><h3>${t("kpi_behind")}</h3><a href="#/fees">${t("seeAll")}</a></div>
          ${behind.length ? `<ul class="list">${behind.slice(0, 6).map(({ s, arr }) => `<li><a href="#/student/${esc(s.id)}">${avatar(s)}<div><b>${esc(s.name)}</b><small>${esc(s.guardianName || "")}</small></div><span class="chip chip-unpaid">${money(arr)}</span></a></li>`).join("")}</ul>` : empty("✓")}
        </section>
        <section class="card"><div class="card-h"><h3>${t("toFollow")}</h3></div>
          ${idle.length || absent.length ? `<ul class="list">${[...absent.map((s) => [s, t("absent")]), ...idle.filter((s) => !absent.includes(s)).map((s) => [s, t("noSessions")])].slice(0, 6).map(([s, why]) => `<li><a href="#/student/${esc(s.id)}">${avatar(s)}<div><b>${esc(s.name)}</b><small>${why}</small></div></a></li>`).join("")}</ul>` : empty("✓")}
        </section>
      </div>`;
  }

  function filteredStudents() {
    const q = state.search.trim().toLowerCase();
    return db.students
      .filter((s) => (state.showArchived ? true : s.status !== "archived"))
      .filter((s) => !state.classFilter || (state.classFilter === "_none" ? !s.classId : s.classId === state.classFilter))
      .filter((s) => !q || [s.name, s.code, s.region, s.guardianName, s.guardianPhone].some((v) => String(v || "").toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  function studentRows() {
    const list = filteredStudents();
    if (!list.length) return empty(t("noStudents"));
    const m = curYM();
    return `<div class="count muted">${list.length} ${t("studentsCount")}</div><ul class="list big">${list.map((s) => {
      const c = klass(s.classId);
      return `<li class="${s.status === "archived" ? "dim" : ""}"><a href="#/student/${esc(s.id)}">${avatar(s)}
        <div class="grow"><b>${esc(s.name)}</b><small>${esc(s.code)} · ${esc(c ? c.name : t("unassigned"))}${s.region ? " · " + esc(s.region) : ""}</small>
        <div class="mini">${progressBar(pct(s))}<small>${hizbCount(s)}/60</small></div></div>
        ${statusChip(monthStatus(s, m))}</a></li>`;
    }).join("")}</ul>`;
  }
  function viewStudents() {
    return `<div class="toolbar">
        <input type="search" id="student-search" placeholder="${t("search")}" value="${esc(state.search)}">
        <select id="class-filter">${[["", t("all")], ...db.classes.map((c) => [c.id, c.name]), ["_none", t("unassigned")]].map(([v, l]) => `<option value="${esc(v)}" ${v === state.classFilter ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>
        <label class="check"><input type="checkbox" id="show-archived" ${state.showArchived ? "checked" : ""}> ${t("showArchived")}</label>
        <button class="btn primary" data-action="add-student">＋ ${t("addStudent")}</button>
        <button class="btn" data-action="export-students">${t("exportCsv")}</button>
      </div><div id="student-list">${studentRows()}</div>`;
  }

  function viewStudent(id) {
    const s = student(id);
    if (!s) return empty(t("studentNotFound"), `<a class="btn" href="#/students">${t("back")}</a>`);
    const c = klass(s.classId);
    const tabs = ["progress", "payments", "absences", "info"];
    const sess = studentSessions(id);
    let body = "";
    if (state.tab === "progress") {
      body = `<div class="card"><div class="card-h"><h3>${t("hizbMap")} — ${hizbCount(s)}/60 (${pct(s)}%)</h3>
          <span class="muted">${t("currentSurah")} : <b>${s.currentSurah ? esc(surahName(+s.currentSurah)) : t("none")}</b></span></div>
          <p class="muted small">${t("tapToToggle")}</p>${hizbMap(s)}</div>
        <div class="card"><div class="card-h"><h3>${t("sessionsLog")}</h3><button class="btn primary" data-action="add-session" data-id="${esc(id)}">＋ ${t("addSession")}</button></div>
          ${sess.length ? `<table class="tbl"><thead><tr><th>${t("date")}</th><th>${t("sessionType")}</th><th>${t("progress")}</th><th>${t("quality")}</th><th>${t("note")}</th><th></th></tr></thead><tbody>
          ${sess.map((x) => `<tr><td>${fmtDate(x.date)}</td><td>${t("t_" + x.type)}</td><td>${sessionLabel(x)}</td><td><span class="chip q-${x.quality}">${t("q_" + x.quality)}</span></td><td>${esc(x.note)}</td>
            <td class="actions"><button class="icon" data-action="edit-session" data-id="${esc(x.id)}" title="${t("edit")}">✎</button><button class="icon" data-action="del-session" data-id="${esc(x.id)}" title="${t("del")}">🗑</button></td></tr>`).join("")}</tbody></table>` : empty(t("noSessions"))}</div>`;
    } else if (state.tab === "payments") {
      const months = [];
      for (let m = curYM(), i = 0; i < 12 && m >= startYM(s); m = addMonths(m, -1), i++) months.push(m);
      const pays = db.payments.filter((p) => p.studentId === id).sort((a, b) => (b.date + b.created).localeCompare(a.date + a.created));
      body = `<div class="kpis small">${kpi(t("monthlyFee"), feeOf(s) ? money(feeOf(s)) : t("exempt"))}${kpi(t("totalPaid"), money(pays.reduce((a, p) => a + +p.amount, 0)), "green")}${kpi(t("arrears"), money(arrears(s)), arrears(s) ? "red" : "")}</div>
        <div class="card"><div class="card-h"><h3>${t("month")}</h3><button class="btn primary" data-action="add-payment" data-id="${esc(id)}">＋ ${t("addPayment")}</button></div>
          <div class="months">${months.map((m) => `<button class="month" data-action="add-payment" data-id="${esc(id)}" data-month="${m}"><small>${fmtMonth(m)}</small>${statusChip(monthStatus(s, m))}<small>${money(paidFor(id, m))}</small></button>`).join("")}</div></div>
        <div class="card"><h3>${t("payments")}</h3>
          ${pays.length ? `<table class="tbl"><thead><tr><th>${t("receiptNo")}</th><th>${t("date")}</th><th>${t("month")}</th><th>${t("amount")}</th><th>${t("method")}</th><th></th></tr></thead><tbody>
          ${pays.map((p) => `<tr><td>${esc(p.receiptNo)}</td><td>${fmtDate(p.date)}</td><td>${fmtMonth(p.month)}</td><td><b>${money(p.amount)}</b></td><td>${methodLabel(p.method)}</td>
            <td class="actions"><button class="icon" data-action="print-receipt" data-id="${esc(p.id)}" title="${t("receipt")}">🧾</button><button class="icon" data-action="del-payment" data-id="${esc(p.id)}" title="${t("del")}">🗑</button></td></tr>`).join("")}</tbody></table>` : empty(t("noPayments"))}</div>`;
    } else if (state.tab === "absences") {
      const abs = db.absences.filter((a) => a.studentId === id).sort((a, b) => b.from.localeCompare(a.from));
      body = `<div class="card"><div class="card-h"><h3>${t("absences")} (${abs.length})</h3><button class="btn primary" data-action="add-absence" data-id="${esc(id)}">＋ ${t("addAbsence")}</button></div>
        ${absTable(abs, false)}</div>`;
    } else {
      body = `<div class="card"><dl class="info">
        <dt>${t("code")}</dt><dd>${esc(s.code)}</dd><dt>${t("gender")}</dt><dd>${t(s.gender === "f" ? "female" : "male")}</dd>
        <dt>${t("dob")}</dt><dd>${fmtDate(s.dob)}</dd><dt>${t("region")}</dt><dd>${esc(s.region || t("none"))}</dd>
        <dt>${t("enrolled")}</dt><dd>${fmtDate(s.enrolled)}</dd><dt>${t("classe")}</dt><dd>${esc(c ? c.name : t("unassigned"))}</dd>
        <dt>${t("guardianName")}</dt><dd>${esc(s.guardianName || t("none"))}</dd><dt>${t("guardianPhone")}</dt><dd>${esc(s.guardianPhone || t("none"))}</dd>
        <dt>${t("monthlyFee")}</dt><dd>${feeOf(s) ? money(feeOf(s)) : t("exempt")}</dd><dt>${t("boarding")}</dt><dd>${s.boarding ? t("yes") : t("no")}</dd>
        <dt>${t("status")}</dt><dd>${t(s.status === "archived" ? "archived" : "active")}</dd><dt>${t("notes")}</dt><dd>${esc(s.notes || t("none"))}</dd></dl>
        <div class="row"><button class="btn" data-action="archive-student" data-id="${esc(id)}">${s.status === "archived" ? t("restore") : t("archive")}</button>
        <button class="btn danger" data-action="del-student" data-id="${esc(id)}">${t("del")}</button></div></div>`;
    }
    return `<a class="back" href="#/students">← ${t("back")}</a>
      <section class="card profile">${avatar(s)}<div class="grow"><h2>${esc(s.name)} ${s.status === "archived" ? `<span class="chip">${t("archived")}</span>` : ""}</h2>
        <p class="muted">${esc(s.code)} · ${esc(c ? c.name : t("unassigned"))}${c && c.teacher ? " · " + esc(c.teacher) : ""}</p>${progressBar(pct(s))}</div>
        <div class="row wrap">
          <button class="btn" data-action="edit-student" data-id="${esc(id)}">✎ ${t("edit")}</button>
          <button class="btn" data-action="print-report" data-id="${esc(id)}">🖨 ${t("report")}</button>
          ${s.guardianPhone ? `<a class="btn" href="tel:${esc(s.guardianPhone)}">📞 ${t("call")}</a><a class="btn green" target="_blank" rel="noopener" href="${esc(waLink(s.guardianPhone))}">💬 ${t("whatsapp")}</a>` : ""}
        </div></section>
      <nav class="tabs">${tabs.map((x) => `<button class="${state.tab === x ? "on" : ""}" data-action="tab" data-tab="${x}">${t(x)}</button>`).join("")}</nav>
      ${body}`;
  }

  function absTable(abs, withName = true) {
    if (!abs.length) return empty(t("noAbsences"));
    const days = (a) => Math.round((new Date((a.to || a.from) + "T12:00:00") - new Date(a.from + "T12:00:00")) / 864e5) + 1;
    return `<table class="tbl"><thead><tr>${withName ? `<th>${t("student")}</th>` : ""}<th>${t("from")}</th><th>${t("to")}</th><th>${t("daysCount")}</th><th>${t("reason")}</th><th></th></tr></thead><tbody>
      ${abs.map((a) => { const s = student(a.studentId); return `<tr>${withName ? `<td>${s ? `<a href="#/student/${esc(s.id)}">${esc(s.name)}</a>` : t("none")}</td>` : ""}<td>${fmtDate(a.from)}</td><td>${fmtDate(a.to)}</td><td>${days(a)}</td><td>${esc(a.reason)}</td>
        <td class="actions"><button class="icon" data-action="del-absence" data-id="${esc(a.id)}" title="${t("del")}">🗑</button></td></tr>`; }).join("")}</tbody></table>`;
  }

  function viewClasses() {
    const act = activeStudents();
    const unassigned = act.filter((s) => !s.classId);
    return `<div class="toolbar"><button class="btn primary" data-action="add-class">＋ ${t("addClass")}</button></div>
      ${db.classes.length ? `<div class="grid-cards">${db.classes.map((c) => {
        const st = act.filter((s) => s.classId === c.id);
        const a = st.length ? st.reduce((x, s) => x + pct(s), 0) / st.length : 0;
        return `<section class="card class-card"><div class="card-h"><h3>${esc(c.name)}</h3><span class="chip">${st.length} ${t("studentsCount")}</span></div>
          <p class="muted">${esc(c.teacher || t("none"))}${c.teacherPhone ? ` · <a href="tel:${esc(c.teacherPhone)}">${esc(c.teacherPhone)}</a>` : ""}</p>
          <p class="muted small">${[c.room, c.level, c.schedule].filter(Boolean).map(esc).join(" · ")}</p>
          <div>${t("avgProgress")} ${progressBar(a)} <small>${Math.round(a)}%</small></div>
          <div class="chips">${st.slice(0, 12).map((s) => `<a class="chip" href="#/student/${esc(s.id)}">${esc(s.name)}</a>`).join("")}${st.length > 12 ? `<span class="chip">+${st.length - 12}</span>` : ""}</div>
          <div class="row"><button class="btn" data-action="view-class" data-id="${esc(c.id)}">${t("nav_students")}</button><button class="btn" data-action="edit-class" data-id="${esc(c.id)}">✎ ${t("edit")}</button><button class="btn danger" data-action="del-class" data-id="${esc(c.id)}">${t("del")}</button></div></section>`;
      }).join("")}</div>` : empty(t("noClasses"))}
      ${unassigned.length ? `<section class="card"><h3>${t("unassigned")} (${unassigned.length})</h3><div class="chips">${unassigned.map((s) => `<a class="chip" href="#/student/${esc(s.id)}">${esc(s.name)}</a>`).join("")}</div></section>` : ""}`;
  }

  function viewHifz() {
    const d = state.hifzDate;
    const list = activeStudents().filter((s) => !state.classFilter || s.classId === state.classFilter).sort((a, b) => a.name.localeCompare(b.name));
    const dayS = db.sessions.filter((x) => x.date === d);
    return `<div class="toolbar">
        <input type="date" id="hifz-date" value="${esc(d)}">
        <select id="class-filter">${[["", t("all")], ...db.classes.map((c) => [c.id, c.name])].map(([v, l]) => `<option value="${esc(v)}" ${v === state.classFilter ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>
        <button class="btn primary" data-action="add-session">＋ ${t("addSession")}</button>
        <label class="field inline"><span>${t("direction")}</span>${select("direction", [["fatiha", t("dir_fatiha")], ["nas", t("dir_nas")]], db.settings.direction).replace("<select", '<select id="direction"')}</label>
      </div>
      <section class="card"><h3>${t("todaySessions")} — ${fmtDate(d)} (${dayS.filter((x) => list.some((s) => s.id === x.studentId)).length}/${list.length})</h3>
      ${list.length ? `<table class="tbl"><thead><tr><th>${t("student")}</th><th>${t("currentSurah")}</th><th>${t("progressPct")}</th><th>${t("sessionsLog")}</th><th></th></tr></thead><tbody>
        ${list.map((s) => {
          const ss = dayS.filter((x) => x.studentId === s.id);
          const abs = isAbsentOn(s.id, d);
          return `<tr class="${abs ? "dim" : ""}"><td><a href="#/student/${esc(s.id)}"><b>${esc(s.name)}</b></a>${abs ? ` <span class="chip chip-unpaid">${t("absent")}</span>` : ""}</td>
            <td>${s.currentSurah ? esc(surahName(+s.currentSurah)) : t("none")}</td><td>${progressBar(pct(s))}<small>${hizbCount(s)}/60</small></td>
            <td>${ss.map((x) => `<div><span class="chip q-${x.quality}">${t("t_" + x.type)}</span> <small>${sessionLabel(x)}</small></div>`).join("") || `<span class="muted">${t("none")}</span>`}</td>
            <td class="actions"><button class="btn small" data-action="add-session" data-id="${esc(s.id)}">＋</button></td></tr>`;
        }).join("")}</tbody></table>` : empty(t("noStudents"))}</section>`;
  }

  function viewAbsences() {
    const d = today();
    const act = activeStudents();
    const rollList = act.filter((s) => !state.rollClass || s.classId === state.rollClass).sort((a, b) => a.name.localeCompare(b.name));
    const now = db.absences.filter((a) => a.from <= d && (a.to || a.from) >= d && student(a.studentId));
    const all = [...db.absences].sort((a, b) => b.from.localeCompare(a.from));
    return `<div class="toolbar"><button class="btn primary" data-action="add-absence">＋ ${t("addAbsence")}</button></div>
      <section class="card"><div class="card-h"><h3>${t("rollCall")} — ${fmtDate(d)}</h3>
        <select id="roll-class">${[["", t("all")], ...db.classes.map((c) => [c.id, c.name])].map(([v, l]) => `<option value="${esc(v)}" ${v === state.rollClass ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></div>
        ${rollList.length ? `<div class="roll">${rollList.map((s) => `<button class="roll-item ${isAbsentOn(s.id, d) ? "absent" : ""}" data-action="roll-toggle" data-id="${esc(s.id)}">${avatar(s)}<span>${esc(s.name)}</span><em>${isAbsentOn(s.id, d) ? t("absent") : t("present")}</em></button>`).join("")}</div>` : empty(t("noStudents"))}
      </section>
      <section class="card"><h3>${t("absentNow")} (${now.length})</h3>${absTable(now)}</section>
      <section class="card"><h3>${t("allAbsences")}</h3>${absTable(all.slice(0, 100))}</section>`;
  }

  function feeRows() {
    const ym = state.feesMonth;
    return activeStudents()
      .filter((s) => startYM(s) <= ym)
      .filter((s) => !state.classFilter || s.classId === state.classFilter)
      .map((s) => ({ s, cls: (klass(s.classId) || {}).name || t("unassigned"), fee: feeOf(s), paid: paidFor(s.id, ym), st: monthStatus(s, ym), arr: arrears(s, ym) }))
      .filter((r) => !state.feesStatus || r.st === state.feesStatus)
      .sort((a, b) => a.s.name.localeCompare(b.s.name));
  }
  function viewFees() {
    const ym = state.feesMonth;
    const rows = feeRows();
    const exp = rows.reduce((a, r) => a + r.fee, 0);
    const col = rows.reduce((a, r) => a + r.paid, 0);
    const byMethod = {};
    db.payments.filter((p) => p.month === ym).forEach((p) => { byMethod[p.method] = (byMethod[p.method] || 0) + +p.amount; });
    return `<div class="toolbar">
        <input type="month" id="fees-month" value="${esc(ym)}">
        <select id="class-filter">${[["", t("all")], ...db.classes.map((c) => [c.id, c.name])].map(([v, l]) => `<option value="${esc(v)}" ${v === state.classFilter ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>
        <select id="fees-status">${[["", t("all")], ["paid", t("paid")], ["partial", t("partial")], ["unpaid", t("unpaid")], ["exempt", t("exempt")]].map(([v, l]) => `<option value="${v}" ${v === state.feesStatus ? "selected" : ""}>${l}</option>`).join("")}</select>
        <button class="btn primary" data-action="add-payment">＋ ${t("addPayment")}</button>
        <button class="btn" data-action="print-fees">🖨 ${t("print")}</button>
        <button class="btn" data-action="export-fees">${t("exportCsv")}</button>
      </div>
      <section class="kpis small">${kpi(t("expected"), money(exp))}${kpi(t("collected"), money(col), "green")}${kpi(t("remaining"), money(Math.max(0, exp - col)), exp > col ? "red" : "")}${kpi(t("rate"), `${exp ? Math.round((col / exp) * 100) : 0}%`)}
        ${Object.entries(byMethod).map(([m, v]) => kpi(methodLabel(m), money(v))).join("")}</section>
      <section class="card">${rows.length ? `<table class="tbl"><thead><tr><th>${t("student")}</th><th>${t("classe")}</th><th>${t("due")}</th><th>${t("paid")}</th><th>${t("status")}</th><th>${t("arrears")}</th><th></th></tr></thead><tbody>
        ${rows.map((r) => {
          const rest = Math.max(0, r.fee - r.paid);
          const msg = t("remindMsg").replace("{g}", r.s.guardianName || "").replace("{m}", fmtMonth(ym)).replace("{s}", r.s.name).replace("{r}", `${rest.toLocaleString("fr-FR")} ${db.settings.currency}`).replace("{school}", db.settings.schoolName || "");
          return `<tr><td><a href="#/student/${esc(r.s.id)}"><b>${esc(r.s.name)}</b></a><br><small class="muted">${esc(r.s.code)}</small></td><td>${esc(r.cls)}</td><td>${money(r.fee)}</td><td>${money(r.paid)}</td><td>${statusChip(r.st)}</td><td>${r.arr ? `<b class="red">${money(r.arr)}</b>` : "0"}</td>
          <td class="actions">${r.st !== "paid" && r.st !== "exempt" ? `<button class="btn small primary" data-action="add-payment" data-id="${esc(r.s.id)}" data-month="${ym}">${t("addPayment")}</button>${r.s.guardianPhone ? `<a class="btn small green" target="_blank" rel="noopener" href="${esc(waLink(r.s.guardianPhone, msg))}">💬 ${t("remind")}</a>` : ""}` : ""}</td></tr>`;
        }).join("")}</tbody></table>` : empty(t("noData"))}</section>`;
  }

  function viewSettings() {
    const st = db.settings;
    return `<section class="card"><h3>${t("schoolInfo")}</h3>
      <form id="settings-form" class="grid2">
        ${field(t("schoolName"), input("schoolName", st.schoolName, "text", 'placeholder="Daara ..."'), "span2")}
        ${field(t("director"), input("director", st.director))}
        ${field(t("phone"), input("phone", st.phone, "tel"))}
        ${field(t("address"), input("address", st.address), "span2")}
        ${field(t("defaultFee"), input("defaultFee", st.defaultFee, "number", "min=0 step=100"))}
        ${field(t("currency"), input("currency", st.currency))}
        ${field(t("code") + " (préfixe)", input("codePrefix", st.codePrefix))}
        ${field(t("language"), select("lang", [["ar", "العربية"], ["fr", "Français"]], st.lang))}
        ${field(t("direction"), select("direction", [["fatiha", t("dir_fatiha")], ["nas", t("dir_nas")]], st.direction), "span2")}
        <div class="span2"><button class="btn primary" type="submit">${t("save")}</button></div>
      </form></section>
      <section class="card"><h3>${t("backup")}</h3><p class="muted">${t("backupHint")}</p>
        <p>${t("lastBackup")} : <b>${st.lastBackup ? fmtDate(st.lastBackup) : t("never")}</b></p>
        <div class="row wrap"><button class="btn primary" data-action="export-json">⬇ ${t("exportData")}</button>
        <label class="btn">⬆ ${t("importData")}<input type="file" id="import-file" accept=".json,application/json" hidden></label>
        <button class="btn" data-action="demo">${t("demo")}</button>
        <button class="btn danger" data-action="reset">${t("reset")}</button></div>
        <p class="muted small">📱 ${t("install")}</p></section>`;
  }

  // ---------- Routeur ----------
  const routes = { dashboard: viewDashboard, students: viewStudents, student: viewStudent, classes: viewClasses, hifz: viewHifz, absences: viewAbsences, fees: viewFees, settings: viewSettings };
  let lastRoute = "";
  function render() {
    const [, name = "dashboard", arg] = (location.hash || "#/dashboard").split("/");
    const view = routes[name] || viewDashboard;
    if (name + arg !== lastRoute && name === "student") state.tab = "progress";
    lastRoute = name + arg;
    document.documentElement.lang = L();
    document.documentElement.dir = L() === "ar" ? "rtl" : "ltr";
    document.title = db.settings.schoolName || t("appName");
    $("#brand-name").textContent = db.settings.schoolName || t("appName");
    $("#lang-toggle").textContent = L() === "ar" ? "FR" : "ع";
    $$("#nav a").forEach((a) => {
      a.classList.toggle("on", a.dataset.route === (name === "student" ? "students" : name));
      $("span", a).textContent = t("nav_" + a.dataset.route);
    });
    $("#main").innerHTML = view(arg);
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });

  // ---------- Événements ----------
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const { action, id } = el.dataset;
    const ask = (k) => confirm(t(k));
    switch (action) {
      case "add-student": return studentForm();
      case "edit-student": return studentForm(student(id));
      case "del-student":
        if (!ask("confirmDelete")) return;
        db.students = db.students.filter((s) => s.id !== id);
        ["sessions", "absences", "payments"].forEach((k) => { db[k] = db[k].filter((x) => x.studentId !== id); });
        persist(); toast(t("deleted")); location.hash = "#/students"; return;
      case "archive-student": { const s = student(id); s.status = s.status === "archived" ? "active" : "archived"; break; }
      case "tab": state.tab = el.dataset.tab; break;
      case "toggle-hizb": {
        const s = student(id), n = +el.dataset.n;
        s.hizbs = s.hizbs || [];
        s.hizbs = s.hizbs.includes(n) ? s.hizbs.filter((x) => x !== n) : [...s.hizbs, n];
        break;
      }
      case "add-session": return sessionForm(id);
      case "edit-session": { const x = byId(db.sessions, id); return sessionForm(x.studentId, x); }
      case "del-session": if (!ask("confirmDelete")) return; db.sessions = db.sessions.filter((x) => x.id !== id); break;
      case "add-payment": return paymentForm(id, el.dataset.month);
      case "del-payment": if (!ask("confirmDelete")) return; db.payments = db.payments.filter((x) => x.id !== id); break;
      case "print-receipt": return printReceipt(id);
      case "print-report": return printReport(id);
      case "print-fees": return printFeesReport(state.feesMonth, feeRows());
      case "add-absence": return absenceForm(id);
      case "del-absence": if (!ask("confirmDelete")) return; db.absences = db.absences.filter((x) => x.id !== id); break;
      case "roll-toggle": {
        const d = today();
        if (isAbsentOn(id, d)) {
          // Présent : retire l'absence du jour (ou raccourcit une absence longue).
          db.absences = db.absences.flatMap((a) => {
            if (a.studentId !== id || !(a.from <= d && (a.to || a.from) >= d)) return [a];
            const parts = [];
            if (a.from < d) parts.push({ ...a, to: addDays(d, -1) });
            if ((a.to || a.from) > d) parts.push({ ...a, id: uid(), from: addDays(d, 1) });
            return parts;
          });
        } else db.absences.push({ id: uid(), studentId: id, from: d, to: d, reason: "" });
        break;
      }
      case "add-class": return classForm();
      case "edit-class": return classForm(klass(id));
      case "view-class": state.classFilter = id; state.search = ""; location.hash = "#/students"; return;
      case "del-class":
        if (!confirm(`${t("confirmDelete")}\n${t("classDelWarn")}`)) return;
        db.classes = db.classes.filter((c) => c.id !== id);
        db.students.forEach((s) => { if (s.classId === id) s.classId = ""; });
        break;
      case "export-students": {
        const rows = [[t("code"), t("fullName"), t("gender"), t("dob"), t("region"), t("enrolled"), t("classe"), t("guardianName"), t("guardianPhone"), t("monthlyFee"), t("hizbs"), t("arrears"), t("status")]];
        filteredStudents().forEach((s) => rows.push([s.code, s.name, t(s.gender === "f" ? "female" : "male"), s.dob, s.region, s.enrolled, (klass(s.classId) || {}).name || "", s.guardianName, s.guardianPhone, feeOf(s), hizbCount(s), arrears(s), t(s.status === "archived" ? "archived" : "active")]));
        return downloadCsv(`eleves-${today()}.csv`, rows);
      }
      case "export-fees": {
        const rows = [[t("code"), t("fullName"), t("classe"), t("due"), t("paid"), t("status"), t("arrears")]];
        feeRows().forEach((r) => rows.push([r.s.code, r.s.name, r.cls, r.fee, r.paid, r.st ? t(r.st) : "", r.arr]));
        return downloadCsv(`mensualites-${state.feesMonth}.csv`, rows);
      }
      case "export-json":
        db.settings.lastBackup = today(); persist();
        download(`sauvegarde-daara-${today()}.json`, JSON.stringify(db, null, 1), "application/json");
        break;
      case "demo": if (db.students.length && !ask("demoConfirm")) return; db = demoData(db.settings.lang); persist(); location.hash = "#/dashboard"; break;
      case "reset": if (!ask("resetConfirm")) return; { const lang = L(); db = blank(); db.settings.lang = lang; } persist(); location.hash = "#/dashboard"; break;
      default: return;
    }
    persist(); render();
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "student-search") { state.search = e.target.value; $("#student-list").innerHTML = studentRows(); }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    const set = { "class-filter": "classFilter", "fees-month": "feesMonth", "fees-status": "feesStatus", "hifz-date": "hifzDate", "roll-class": "rollClass" }[el.id];
    if (set) { state[set] = el.value || (set === "feesMonth" ? curYM() : set === "hifzDate" ? today() : ""); return render(); }
    if (el.id === "show-archived") { state.showArchived = el.checked; return render(); }
    if (el.id === "direction") { db.settings.direction = el.value; persist(); return render(); }
    if (el.id === "import-file" && el.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const d = JSON.parse(reader.result);
          if (!d || !Array.isArray(d.students) || !d.settings) throw new Error("bad");
          if (!confirm(t("importConfirm"))) return;
          const b = blank();
          db = { ...b, ...d, settings: { ...b.settings, ...d.settings } };
          persist(); toast(t("importOk")); render();
        } catch (err) { alert(t("importBad")); }
      };
      reader.readAsText(el.files[0]);
      el.value = "";
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "settings-form") return;
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    Object.assign(db.settings, { schoolName: fd.schoolName.trim(), director: fd.director.trim(), phone: fd.phone.trim(), address: fd.address.trim(), defaultFee: +fd.defaultFee || 0, currency: fd.currency.trim() || "FCFA", codePrefix: fd.codePrefix.trim() || "DAARA", lang: fd.lang, direction: fd.direction, setupDone: true });
    persist(); toast(t("saved")); render();
  });
  $("#lang-toggle").addEventListener("click", () => { db.settings.lang = L() === "ar" ? "fr" : "ar"; persist(); render(); });

  // ---------- Données de démonstration ----------
  function demoData(lang) {
    const d = blank();
    Object.assign(d.settings, { lang, schoolName: lang === "ar" ? "دارة الشيخ أحمد بمب للقرآن الكريم" : "Daara Serigne Ahmadou Bamba", director: "Serigne Moustapha Mbacké", phone: "77 000 00 00", address: "Touba, Sénégal", defaultFee: 5000, direction: "nas", setupDone: true });
    const cls = [["Halqa Amma", "Oustaz Ibrahima Diop", "Débutants"], ["Halqa Tabaraka", "Oustaz Cheikh Fall", "Intermédiaire"], ["Halqa Al-Baqara", "Serigne Modou Ndiaye", "Avancé"]]
      .map(([name, teacher, level]) => ({ id: uid(), name, teacher, level, room: "", schedule: "06:00–09:00 · 16:00–18:30", teacherPhone: "" }));
    d.classes = cls;
    const names = ["Aliou Ndiaye", "Moussa Diallo", "Fatou Sow", "Ibrahima Sarr", "Awa Mbaye", "Cheikh Gueye", "Mariama Ba", "Modou Faye", "Aminata Diop", "Serigne Thiam", "Khadija Seck", "Abdou Kane", "Ousmane Cissé", "Bineta Ndao", "Mamadou Lo", "Astou Niang"];
    const regions = ["Touba", "Diourbel", "Kaolack", "Thiès", "Louga", "Dakar", "Saint-Louis", "Fatick"];
    const rnd = (n) => Math.floor(Math.random() * n);
    const t0 = today();
    names.forEach((name, i) => {
      const c = cls[i % 3];
      const base = [4, 24, 48][i % 3] + rnd(6);
      // Tradition : mémorisation depuis An-Nas, donc les derniers hizb d'abord.
      const hizbs = [...Array(Math.min(60, base))].map((_, k) => 60 - k);
      d.settings.codeSeq++;
      const s = {
        id: uid(), code: `DAARA-${t0.slice(2, 4)}-${String(d.settings.codeSeq).padStart(3, "0")}`, name, gender: /Fatou|Awa|Mariama|Aminata|Khadija|Bineta|Astou/.test(name) ? "f" : "m",
        dob: `${2012 + rnd(6)}-0${1 + rnd(9)}-1${rnd(9)}`, region: regions[rnd(regions.length)], enrolled: addMonths(t0.slice(0, 7), -(3 + rnd(8))) + "-05",
        classId: c.id, fee: i % 7 === 0 ? 0 : "", guardianName: `${["Ousmane", "Mamadou", "Abdoulaye", "Babacar"][rnd(4)]} ${name.split(" ")[1]}`, guardianPhone: `77${rnd(10)} ${10 + rnd(89)} ${10 + rnd(89)} ${10 + rnd(89)}`,
        boarding: i % 3 === 0, notes: "", status: "active", hizbs, currentSurah: HIZB_START[Math.max(0, 60 - hizbs.length - 1)][0], created: new Date().toISOString(),
      };
      d.students.push(s);
      for (let k = 0; k < 8; k++) {
        const date = addDays(t0, -rnd(14));
        const su = +s.currentSurah || 78;
        d.sessions.push({ id: uid(), created: new Date().toISOString(), studentId: s.id, date, type: ["new", "revision", "new", "validation"][rnd(4)], fromSurah: su, fromAyah: 1 + rnd(5), toSurah: su, toAyah: Math.min(SURAH_AYAHS[su - 1], 6 + rnd(10)), quality: ["excellent", "good", "good", "weak"][rnd(4)], hizb: hizbOf(su, 1), note: "" });
      }
      for (let m = s.enrolled.slice(0, 7); m <= t0.slice(0, 7); m = addMonths(m, 1)) {
        if (!s.fee && s.fee !== "") continue;
        if (Math.random() < 0.8 || m < addMonths(t0.slice(0, 7), -1)) {
          const amount = Math.random() < 0.85 ? 5000 : 2500;
          d.settings.receiptSeq++;
          d.payments.push({ id: uid(), studentId: s.id, month: m, amount, method: ["cash", "wave", "om"][rnd(3)], date: m + "-0" + (1 + rnd(9)), note: "", receiptNo: `R-${String(d.settings.receiptSeq).padStart(5, "0")}`, created: new Date().toISOString() });
        }
      }
      if (i % 5 === 1) d.absences.push({ id: uid(), studentId: s.id, from: addDays(t0, -1), to: addDays(t0, 1), reason: i % 2 ? "Maladie" : "Voyage familial" });
    });
    return d;
  }

  render();
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
