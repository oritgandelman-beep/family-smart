/* ================= v7: cloud sync · events · study plan · exam material · flashcards · parents space =================
   Loaded after app.js. app.js keeps all existing logic (import, matching, approvals); this file adds to it through small hooks. */

/* ---------- state extension (also applied after restore / reset) ---------- */
function v7Normalize(st) {
  st.events = st.events || {};
  st.materials = st.materials || {};
  st.pendingItems = st.pendingItems || {};
  st.cardsets = st.cardsets || {};
  st.cardprog = st.cardprog || {};
  st.cardprog.kid1 = st.cardprog.kid1 || {};
  st.cardprog.kid2 = st.cardprog.kid2 || {};
  st.family = st.family || {};
  ['msgs', 'shop', 'appts'].forEach(k => { st.family[k] = st.family[k] || {}; });
  st.syncStatus = st.syncStatus || {};
  st.names = st.names || {};
  for (const k in st.profiles || {}) if (st.profiles[k].mathGroup === undefined) st.profiles[k].mathGroup = '';
  // older one-time manual items move into the events list (same ids, so their checkmarks stay)
  if (st.added && st.added.length) {
    for (const a of st.added) if (!st.events[a.id]) st.events[a.id] = { id:a.id, title:a.title, type:a.type, owner:a.owner, date:a.date, start:a.start || '', end:a.end || '', place:'', note:a.details || '', repeat:'none', days:[], until:'', exdates:[], deleted:false, createdBy:a.addedBy || '', createdAt:Date.now() };
    st.added = [];
  }
  return st;
}
S = v7Normalize(S);
const KID_IDS = ['kid1', 'kid2'];
const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const nowTxt = ts => { const d = new Date(ts); return `${d.getDate()}.${d.getMonth() + 1} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

/* =====================================================================================
   1. CLOUD SYNC (the page's own database – works for the owner and invited editors)
   Every slice of state is one document "st/<name>" holding {m: {...}}. Changes go up as
   merge-updates of only the keys that changed, so two devices editing different items never
   overwrite each other. Nothing is ever removed remotely: deletions are flags (deleted:true, '').
   School events are one document each in "school_events".
   ===================================================================================== */
const CLOUD = { mode:'connecting', db:null, user:null, readOnly:false, synced:{}, schoolSynced:{}, q:{}, schoolQ:Promise.resolve(), err:'',
  backend:'', locked:false, canRead:() => true, canWrite:() => true, schoolWrite:true };
const SLICES = {
  done:      { get:() => S.done, put:v => { S.done = v; } },
  prep:      { get:() => S.prep, put:v => { S.prep = v; } },
  decisions: { get:() => S.reviewDecisions, put:v => { S.reviewDecisions = v; } },
  overrides: { get:() => S.overrides, put:v => { S.overrides = v; } },
  profiles:  { get:() => S.profiles, put:v => { S.profiles = v; S = normalizeState(S); v7Normalize(S); } },
  schedule:  { get:() => S.schedule, put:v => { S.schedule = v; KID_IDS.forEach(k => { S.schedule[k] = S.schedule[k] || {}; }); } },
  settings:  { get:() => ({ showSamples:S.showSamples }), put:v => { if ('showSamples' in v) S.showSamples = v.showSamples; } },
  requests:  { get:() => Object.fromEntries(S.requests.map(r => [r.id, r])), put:v => { S.requests = Object.values(v); } },
  events:    { get:() => S.events, put:v => { S.events = v; } },
  materials: { get:() => S.materials, put:v => { S.materials = v; } },
  pending:   { get:() => S.pendingItems, put:v => { S.pendingItems = v; } },
  cardsets:  { get:() => S.cardsets, put:v => { S.cardsets = v; } },
  prog_kid1: { get:() => S.cardprog.kid1, put:v => { S.cardprog.kid1 = v; } },
  prog_kid2: { get:() => S.cardprog.kid2, put:v => { S.cardprog.kid2 = v; } },
  names:     { get:() => S.names, put:v => { S.names = v; } },
  fmsg:      { get:() => S.family.msgs, put:v => { S.family.msgs = v; } },
  shop:      { get:() => S.family.shop, put:v => { S.family.shop = v; } },
  appts:     { get:() => S.family.appts, put:v => { S.family.appts = v; } },
  schoolmeta:{ get:() => S.school ? { importedAt:S.school.importedAt, fileName:S.school.fileName, coveredMonths:S.school.coveredMonths, firstRun:S.school.firstRun, runs:S.school.runs } : {},
               put:v => { if (v && v.importedAt) S.school = { ...(S.school || { events:[] }), ...v }; } },
  sync:      { get:() => S.syncStatus, put:v => { S.syncStatus = v; }, pageNeverWrites:true },
};
const OR_MERGE = { done:true, prep:true };  // progress is never lost when two devices are merged
const sclone = x => x === undefined ? undefined : JSON.parse(JSON.stringify(x));
function stable(x) {
  if (Array.isArray(x)) return '[' + x.map(stable).join(',') + ']';
  if (x && typeof x === 'object') return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + stable(x[k])).join(',') + '}';
  return JSON.stringify(x === undefined ? null : x);
}
const isObj = x => x && typeof x === 'object' && !Array.isArray(x);
function patchOf(prev, cur) {          // keys added or changed (nested); removed keys are not sent
  const out = {}; let any = false;
  for (const k in cur) {
    const a = prev ? prev[k] : undefined, b = cur[k];
    if (isObj(a) && isObj(b)) { const p = patchOf(a, b); if (p) { out[k] = p; any = true; } }
    else if (stable(a) !== stable(b)) { out[k] = sclone(b); any = true; }
  }
  return any ? out : null;
}
function unionInto(rem, loc, orMerge) { // cloud wins on conflicts; local-only keys are added
  const out = sclone(rem) || {};
  for (const k in loc) {
    if (!(k in out)) out[k] = sclone(loc[k]);
    else if (isObj(out[k]) && isObj(loc[k])) out[k] = unionInto(out[k], loc[k], orMerge);
    else if (orMerge) {
      if (Array.isArray(out[k]) && Array.isArray(loc[k])) out[k] = Array.from({ length:Math.max(out[k].length, loc[k].length) }, (_, i) => !!(out[k][i] || loc[k][i]));
      else if (loc[k] === true) out[k] = true;
    }
  }
  return out;
}
function enqueue(key, fn) {
  CLOUD.q[key] = (CLOUD.q[key] || Promise.resolve()).then(fn).catch(cloudError);
}
function cloudError(e) {
  const code = e && e.code;
  if (code === 'permission-denied' && window.FSWeb) { CLOUD.err = 'אין הרשאה'; window.FSWeb.recheck(); }
  else if (code === 'invalid_argument' || code === 'not_granted') { CLOUD.readOnly = true; CLOUD.err = 'אין הרשאת כתיבה'; }
  else if (code === 'revoked') { CLOUD.mode = 'local'; CLOUD.err = 'הגישה לענן הופסקה'; }
  else if (code === 'quota_exceeded' || code === 'resource-exhausted') CLOUD.err = 'מקום האחסון בענן מלא';
  else CLOUD.err = 'בעיית חיבור זמנית';
  softRender();
}
function writeSlice(name, cur, patch) {
  const ref = CLOUD.db.doc('st/' + name);
  enqueue(name, () => (patch ? ref.update({ m:patch, at:Date.now() }) : ref.set({ m:cur, at:Date.now() }))
    .catch(e => (e && e.code === 'invalid_argument' && patch) ? ref.set({ m:cur, at:Date.now() }) : Promise.reject(e)));
}
function cloudPush() {
  if (CLOUD.mode !== 'cloud' || CLOUD.readOnly) return;
  for (const name in SLICES) {
    const def = SLICES[name]; if (def.pageNeverWrites || !CLOUD.canWrite(name)) continue;
    const cur = sclone(def.get()) || {}, prev = CLOUD.synced[name];
    if (prev === undefined) { if (!Object.keys(cur).length) continue; CLOUD.synced[name] = cur; writeSlice(name, cur, null); continue; }
    const p = patchOf(prev, cur); if (!p) continue;
    CLOUD.synced[name] = cur; writeSlice(name, cur, p);
  }
  if (CLOUD.schoolWrite && S.school && S.school.events) for (const e of S.school.events) {
    const js = stable(e); if (CLOUD.schoolSynced[e.id] === js) continue;
    CLOUD.schoolSynced[e.id] = js;
    const body = sclone(e);
    CLOUD.schoolQ = CLOUD.schoolQ.then(() => CLOUD.db.doc('school_events/' + e.id).set(body)).catch(cloudError);
  }
}
// local school-event id → cloud id (same event imported separately on two devices)
function mapIds(local, remote) {
  const byId = new Set(remote.map(r => r.id)), map = {};
  for (const e of local) {
    if (byId.has(e.id)) continue;
    const c = remote.filter(r => r.fp === e.fp && r.date === e.date && r.grade === e.grade);
    if (c.length === 1) map[e.id] = c[0].id;
  }
  return map;
}
function remap(name, obj, idMap) {
  if (!Object.keys(idMap).length || !['done', 'prep', 'decisions', 'overrides', 'materials'].includes(name)) return obj;
  const out = {};
  for (const k in obj) {
    let nk = k;
    if (name === 'prep') { const [id, kid] = k.split('|'); if (idMap[id]) nk = idMap[id] + '|' + kid; }
    else if (idMap[k]) nk = idMap[k];
    out[nk] = obj[k];
  }
  return out;
}
let softT = null;
const FORM_KINDS = new Set(['evedit', 'request', 'add', 'block', 'matedit', 'card', 'appt']);
function softRender() {
  clearTimeout(softT);
  softT = setTimeout(() => {
    CACHE = null;
    const theme = ui.user ? (USERS[ui.user].kid || 'parent') : 'none';
    if (!ui.user || theme !== document.documentElement.dataset.kid || (window.FSWeb && window.FSWeb.gateHTML())) { render(); return; }
    document.getElementById('app').innerHTML = shellHTML();
    if (ui.modal && !FORM_KINDS.has(ui.modal.kind)) renderModal();
  }, 60);
}
async function cloudStart() {
  let db = null, user = null;
  if (window.FSWeb) {
    // stand-alone web version: the family's own Firebase project (see web.js)
    const be = await window.FSWeb.start();
    if (!be) { CLOUD.mode = 'local'; softRender(); return; }
    db = be.db; Object.assign(CLOUD, { backend:'firebase', locked:true, canRead:be.canRead, canWrite:be.canWrite, schoolWrite:be.schoolWrite });
    ui.user = be.user; ui.kid = 'both'; ui.screen = 'cal'; ui.view = 'month';
  } else {
    try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
    if (!db) { CLOUD.mode = 'local'; softRender(); return; }
    try { user = await window.claude.use('user'); } catch (e) { user = null; }
    try { if (user && user.can) { const w = await user.can('data.write'); if (w === false) CLOUD.readOnly = true; } } catch (e) {}
  }
  CLOUD.db = db; CLOUD.user = user;
  try {
    const remote = {};
    for (const name in SLICES) { if (!CLOUD.canRead(name)) continue; const snap = await db.doc('st/' + name).get(); remote[name] = snap.exists ? (snap.data().m || {}) : undefined; }
    const ses = await db.collection('school_events').get();
    const rEvents = ses.docs.map(d => d.data());
    const localEvents = (S.school && S.school.events) || [];
    let merged = false; try { merged = localStorage.getItem('familysmart.cloudMerged') === '1'; } catch (e) {}
    const idMap = rEvents.length && localEvents.length && !merged ? mapIds(localEvents, rEvents) : {};
    if (rEvents.length) {
      // cloud events + local events the cloud does not have yet (e.g. an upload that was interrupted), never duplicating an event the cloud already holds
      const have = new Set(rEvents.map(r => r.id)), extra = localEvents.filter(e => !have.has(idMap[e.id] || e.id) && !rEvents.some(r => r.fp === e.fp && r.date === e.date && r.grade === e.grade));
      S.school = { ...(S.school || {}), ...(remote.schoolmeta || {}), importedAt:(remote.schoolmeta && remote.schoolmeta.importedAt) || (S.school && S.school.importedAt) || new Date().toISOString(),
        events:[...rEvents, ...extra].sort((a, b) => a.date < b.date ? -1 : 1) };
    }
    for (const name in SLICES) {
      if ((name === 'schoolmeta' && rEvents.length) || !CLOUD.canRead(name)) continue;
      const def = SLICES[name], rem = remote[name];
      if (def.pageNeverWrites) { if (rem) def.put(sclone(rem)); continue; }
      const loc = remap(name, sclone(def.get()) || {}, idMap);
      const fin = rem === undefined ? (CLOUD.canWrite(name) ? loc : {}) : (merged || CLOUD.readOnly || !CLOUD.canWrite(name) ? sclone(rem) : unionInto(rem, loc, !!OR_MERGE[name]));
      def.put(fin);
    }
    S = v7Normalize(normalizeState(S));
    CLOUD.synced = {}; for (const name in remote) if (remote[name] !== undefined) CLOUD.synced[name] = sclone(remote[name]);
    rEvents.forEach(e => { CLOUD.schoolSynced[e.id] = stable(e); });
    CLOUD.mode = 'cloud';
    try { localStorage.setItem('familysmart.cloudMerged', '1'); } catch (e) {}
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    cloudPush();
    cloudSubscribe();
  } catch (e) { CLOUD.mode = 'local'; CLOUD.err = 'לא הצלחתי להתחבר לענן'; if (e && e.code === 'permission-denied' && window.FSWeb) window.FSWeb.recheck(); }
  softRender();
}
function cloudSubscribe() {
  for (const name in SLICES) {
    if (!CLOUD.canRead(name)) continue;
    CLOUD.db.doc('st/' + name).onSnapshot(snap => {
      if (!snap.exists) return;
      const m = snap.data().m || {};
      if (stable(m) === stable(CLOUD.synced[name])) return;
      CLOUD.synced[name] = sclone(m);
      SLICES[name].put(sclone(m));
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      softRender();
    }, cloudError);
  }
  CLOUD.db.collection('school_events').onSnapshot(qs => {
    let changed = false;
    const map = new Map(((S.school && S.school.events) || []).map(e => [e.id, e]));
    qs.docs.forEach(d => { const e = d.data(), js = stable(e); if (CLOUD.schoolSynced[e.id] !== js) { CLOUD.schoolSynced[e.id] = js; map.set(e.id, e); changed = true; } });
    if (!changed) return;
    S.school = { ...(S.school || { importedAt:new Date().toISOString() }), events:[...map.values()].sort((a, b) => a.date < b.date ? -1 : 1) };
    softRender();
  }, cloudError);
}
function cloudChip() {
  const [cls, txt] = CLOUD.mode === 'cloud' ? (CLOUD.readOnly ? ['ro', 'צפייה בלבד'] : (CLOUD.err ? ['warn', 'בעיית סנכרון'] : ['ok', 'מסונכרן']))
    : CLOUD.mode === 'connecting' ? ['wait', 'מתחבר…'] : ['local', 'רק במכשיר הזה'];
  return `<button class="cloud ${cls}" data-action="cloudinfo" aria-label="מצב שמירה: ${txt}"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/></svg><span>${txt}</span></button>`;
}

/* =====================================================================================
   2. EVENTS: one-time or weekly, for the family or one child; edit / remove
   ===================================================================================== */
function customEvents() {
  const out = [];
  for (const ev of Object.values(S.events || {})) {
    if (!ev || ev.deleted || !ev.date || !ev.title) continue;
    const occ = ds => ({ id:`cev|${ev.id}|${ds}`, seriesId:ev.id, source:'custom', type:TYPES[ev.type] ? ev.type : 'event', owner:ev.owner || 'family', date:ds,
      start:ev.start || null, end:ev.start ? (ev.end || null) : null, title:ev.title, place:ev.place || '', note:ev.note || '',
      details:[ev.place ? 'מקום: ' + ev.place : '', ev.note || ''].filter(Boolean).join(' · '), repeat:ev.repeat, addedBy:ev.createdBy });
    if (ev.repeat === 'weekly') {
      const days = ev.days && ev.days.length ? ev.days.map(Number) : [parse(ev.date).getDay()];
      for (let off = -60; off <= 200; off++) {
        const d = addDays(TODAY, off), ds = iso(d);
        if (ds < ev.date || (ev.until && ds > ev.until) || !days.includes(d.getDay()) || (ev.exdates || []).includes(ds)) continue;
        out.push(occ(ds));
      }
    } else out.push(occ(ev.date));
  }
  return out;
}
function evEditSheet(m) {
  const ev = m.id ? S.events[m.id] : null, kidUser = USERS[ui.user].kid;
  const date = ev ? ev.date : (m.date || iso(ui.sel));
  const types = isParent() ? ['activity', 'event', 'homework', 'study', 'chore', 'rest', 'exam', 'quiz', 'project', 'alt'] : ['activity', 'homework', 'study', 'chore', 'rest', 'event'];
  const owner = ev ? ev.owner : (kidUser || 'family');
  const days = ev && ev.days && ev.days.length ? ev.days.map(Number) : [parse(date).getDay()];
  const rep = ev ? ev.repeat : 'none';
  return `<div class="sheet-top"><h2>${ev ? 'עריכת אירוע' : 'אירוע חדש'}</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <form class="f" id="evform" data-id="${ev ? H(ev.id) : ''}">
      <div class="field"><label for="ev-title">שם האירוע</label><input id="ev-title" name="title" required value="${H(ev ? ev.title : '')}" placeholder="למשל: אימון, תור לרופא, יום הולדת"></div>
      <div class="two">
        <div class="field"><label for="ev-type">סוג</label><select id="ev-type" name="type">${types.map(t => `<option value="${t}" ${(ev ? ev.type : 'event') === t ? 'selected' : ''}>${TYPES[t].label}</option>`).join('')}</select></div>
        ${isParent() ? `<div class="field"><label for="ev-owner">בלוח של</label><select id="ev-owner" name="owner"><option value="family" ${owner === 'family' ? 'selected' : ''}>כל המשפחה</option>${kidOptions(owner)}</select></div>` : `<input type="hidden" name="owner" value="${kidUser}">`}
      </div>
      <div class="field"><label for="ev-date">${rep === 'weekly' ? 'מתאריך' : 'תאריך'}</label><input id="ev-date" type="date" name="date" required value="${date}"></div>
      <div class="two">
        <div class="field"><label for="ev-start">משעה</label><input id="ev-start" type="time" name="start" value="${H(ev ? ev.start : '')}"></div>
        <div class="field"><label for="ev-end">עד שעה</label><input id="ev-end" type="time" name="end" value="${H(ev ? ev.end : '')}"></div>
      </div>
      <div class="field"><label for="ev-place">מקום</label><input id="ev-place" name="place" value="${H(ev ? ev.place : '')}"></div>
      <div class="field"><label for="ev-note">הערה</label><textarea id="ev-note" name="note">${H(ev ? ev.note : '')}</textarea></div>
      <fieldset class="field"><legend>חזרה</legend><div class="radios">
        <label><input type="radio" name="repeat" value="none" ${rep !== 'weekly' ? 'checked' : ''}> חד־פעמי</label>
        <label><input type="radio" name="repeat" value="weekly" ${rep === 'weekly' ? 'checked' : ''}> כל שבוע</label></div></fieldset>
      <fieldset class="field"><legend>באילו ימים (לאירוע שבועי)</legend><div class="checks">${DAYS.map((d, i) => `<label><input type="checkbox" name="days" value="${i}" ${days.includes(i) ? 'checked' : ''}> ${d}</label>`).join('')}</div></fieldset>
      <div class="field"><label for="ev-until">תאריך סיום לחזרה (לא חובה)</label><input id="ev-until" type="date" name="until" value="${H(ev ? ev.until : '')}"></div>
      <p class="err" id="ev-err" hidden></p>
      <button class="btn" type="submit">${I('check')}שמירה</button>
    </form>`;
}
function v7SaveEvent(f, fd) {
  const data = Object.fromEntries(fd), err = document.getElementById('ev-err');
  const fail = t => { err.textContent = t; err.hidden = false; };
  const title = (data.title || '').trim();
  if (!title) return fail('צריך לכתוב שם לאירוע.');
  if (data.start && data.end && data.end <= data.start) return fail('שעת הסיום צריכה להיות אחרי שעת ההתחלה.');
  const days = fd.getAll('days').map(Number);
  if (data.repeat === 'weekly' && !days.length) return fail('לאירוע שבועי צריך לבחור לפחות יום אחד.');
  if (data.until && data.until < data.date) return fail('תאריך הסיום צריך להיות אחרי תאריך ההתחלה.');
  const id = f.dataset.id || newId('e');
  const old = S.events[id] || {};
  const owner = isParent() ? data.owner : USERS[ui.user].kid;
  S.events[id] = { id, title, type:data.type, owner, date:data.date, start:data.start || '', end:data.start ? (data.end || '') : '', place:(data.place || '').trim(), note:(data.note || '').trim(),
    repeat:data.repeat === 'weekly' ? 'weekly' : 'none', days:data.repeat === 'weekly' ? days : [], until:data.repeat === 'weekly' ? (data.until || '') : '', exdates:old.exdates || [], deleted:false,
    createdBy:old.createdBy || ui.user, createdAt:old.createdAt || Date.now(), updatedBy:ui.user, updatedAt:Date.now() };
  ui.hidden.delete(data.type);
  ui.modal = null; save(); render(); toast(f.dataset.id ? 'האירוע עודכן' : 'האירוע נוסף ללוח');
}
function customControls(e) {
  if (e.source !== 'custom') return '';
  const ev = S.events[e.seriesId]; if (!ev) return '';
  const mine = isParent() || ev.owner === USERS[ui.user].kid;
  if (!mine) return '';
  const c = ui.confirmDel === e.id;
  return `<div class="card soft-card"><h3>${ev.repeat === 'weekly' ? `אירוע שבועי · ${ev.days.map(d => DSHORT[d]).join(' ')}${ev.until ? ` · עד ${dm(ev.until)}` : ' · ללא תאריך סיום'}` : 'אירוע חד־פעמי'}</h3>
    <div class="actions"><button class="btn soft" data-action="ev-edit" data-sid="${H(ev.id)}">${I('edit')}עריכה</button>
      ${c ? `<span class="inline-confirm"><b>למחוק?</b><button class="btn danger" data-action="ev-del" data-sid="${H(ev.id)}" data-scope="all">${ev.repeat === 'weekly' ? 'את כל הסדרה' : 'כן, למחוק'}</button>${ev.repeat === 'weekly' ? `<button class="btn danger" data-action="ev-del" data-sid="${H(ev.id)}" data-scope="one" data-date="${e.date}">רק ב־${dm(e.date)}</button>` : ''}<button class="btn ghost" data-action="ev-del-no">לא</button></span>`
        : `<button class="btn ghost" data-action="ev-del-ask" data-id="${H(e.id)}">${I('trash')}מחיקה</button>`}</div></div>`;
}

/* =====================================================================================
   3. PERSONAL STUDY PLAN – spreads the prep steps over the days before each exam,
      shorter on long-training days. Ticking a plan item ticks the same prep step.
   ===================================================================================== */
const STEP_MIN = { exam:[30, 45, 45, 60, 30], project:[20, 45, 60, 45, 20] };
function trainingByDay(base, k) {
  const m = {};
  for (const e of base) {
    if (e.type !== 'activity' || !e.start || !e.end) continue;
    if (!(e.owner === k || e.owner === 'family')) continue;
    const mins = toMin(e.end) - toMin(e.start); if (mins <= 0) continue;
    const d = m[e.date] || (m[e.date] = { mins:0, start:e.start, end:e.end });
    d.mins += mins; if (e.start < d.start) d.start = e.start; if (e.end > d.end) d.end = e.end;
  }
  return m;
}
function dayCapacity(ds, tr) {
  const dow = parse(ds).getDay();
  if (tr) return tr.mins >= 180 ? 20 : tr.mins >= 60 ? 30 : 40;
  return dow === 5 ? 45 : dow === 6 ? 30 : 50;
}
function slotTime(ds, tr, k) {
  const dow = parse(ds).getDay();
  if (dow >= 5) return '11:00';
  if (tr) return toMin(tr.start) >= toMin('16:30') ? '15:30' : fromMin(Math.min(toMin(tr.end) + 60, 21 * 60));
  const sch = (S.schedule[k] || {})[dow];
  return sch && sch.end ? fromMin(Math.min(toMin(sch.end) + 90, 20 * 60)) : '16:00';
}
function planEvents(base) {
  const out = [];
  if (!ui.user) return out;
  for (const k of KID_IDS) {
    const exams = base.filter(e => ['exam', 'quiz', 'project', 'alt'].includes(e.type) && e.source === 'school' && e.date > TODAY_ISO && diffDays(TODAY_ISO, e.date) <= 21
      && e.status !== 'cancelled' && e.status !== 'missing' && kidSees(e, k) && !pendingFor({ ...e, owners:[k] }, k)).sort((a, b) => a.date.localeCompare(b.date));
    if (!exams.length) continue;
    const tr = trainingByDay(base, k), used = {};
    for (const e of exams) {
      const proj = e.type === 'project' || e.type === 'alt';
      const names = proj ? PREP_STEPS.project : PREP_STEPS.exam, mins = proj ? STEP_MIN.project : STEP_MIN.exam;
      const st = (S.prep || {})[prepKey(e, k)] || [];
      const todo = names.map((n, i) => i).filter(i => !st[i]);
      if (!todo.length) continue;
      const firstDay = new Date().getHours() < 20 ? 0 : 1;
      const days = []; for (let off = firstDay; ; off++) { const ds = iso(addDays(TODAY, off)); if (ds >= e.date) break; days.push(ds); }
      if (!days.length) continue;
      const lastStep = todo[todo.length - 1], rest = todo.slice(0, -1);
      const place = (i, ds) => {
        const cap = dayCapacity(ds, tr[ds]), before = used[ds] || 0, left = Math.max(cap - before, 0);
        const m = Math.max(Math.min(mins[i], left || 20), 15), over = before + m > cap;
        used[ds] = before + m;
        const start = fromMin(Math.min(toMin(slotTime(ds, tr[ds], k)) + before + (before ? 10 : 0), 22 * 60));
        out.push({ id:`plan|${e.id}|${k}|${i}`, source:'plan', type:'study', owner:k, date:ds, start, end:fromMin(Math.min(toMin(start) + m, 23 * 60 + 30)),
          title:`${names[i]} · ${e.title}`, subjects:e.subjects, minutes:m, examId:e.id, planRef:{ key:prepKey(e, k), i }, light:!!tr[ds],
          details:`הכנה ל${e.title} (${dm(e.date)}) · ${m} דק׳${tr[ds] ? ' · יום אימון – משימה קצרה' : ''}${m < mins[i] ? ' · קוצר כדי לא להעמיס' : ''}${over ? ' · נשאר מעט זמן עד המבחן – כדאי להתחיל מוקדם' : ''}` });
      };
      let di = 0;
      for (const i of rest) {
        while (di < days.length - 1 && dayCapacity(days[di], tr[days[di]]) - (used[days[di]] || 0) < 15) di++;
        place(i, days[Math.min(di, days.length - 1)]);
        if (dayCapacity(days[di], tr[days[di]]) - (used[days[di]] || 0) < 15 && di < days.length - 1) di++;
      }
      place(lastStep, days[days.length - 1]);
    }
  }
  return out;
}

/* =====================================================================================
   4. EXAM CARD: material, resources, plan, flashcards
   ===================================================================================== */
const slotKey = e => `${e.date}|${e.grade || ''}|${e.kind || e.type}|${(e.subjects || []).join('+')}`;
const materialFor = e => (S.materials || {})[e.id] || (S.materials || {})[slotKey(e)] || null;
const SRC_LABEL = { mashov:'אומת מול משוב', parent:'נמסר על ידי הורה', unverified:'לא אומת' };
function examExtras(e) {
  if (!EXAMISH.includes(e.type) || isOff(e)) return '';
  const m = materialFor(e), k = (e.owners || [])[0];
  const sets = Object.values(S.cardsets || {}).filter(s => s && !s.deleted && (s.examId === e.id || s.examSlot === slotKey(e)) && (e.owners || []).includes(s.kid));
  let mat;
  if (!m) mat = `<p class="muted small" style="margin:0">אין עדיין חומר מאומת למבחן הזה. כשתגיע הודעה מהמורה, או שהורה יוסיף חומר, הוא יופיע כאן.</p>`;
  else {
    const msg = m.msg || {};
    mat = `<span class="tag ${m.source === 'mashov' ? 'sure' : 'moved'}">${SRC_LABEL[m.source] || 'לא אומת'}</span>
      ${msg.date || msg.summary ? `<div class="xrow"><b>הודעת המורה${msg.date ? ` · ${H(msg.date)}` : ''}</b>${msg.summary ? `<div class="small">${H(msg.summary)}</div>` : ''}
        <div class="small">${msg.link ? `<a href="${H(msg.link)}" target="_blank" rel="noopener">פתיחת ההודעה ↗</a>` : '<span class="muted">קישור להודעה: עדיין לא נמסר</span>'}</div></div>` : ''}
      ${(m.files || []).length ? `<div class="xrow"><b>קבצים מצורפים</b><ul class="xlist">${m.files.map(f => `<li>${f.url ? `<a href="${H(f.url)}" target="_blank" rel="noopener">${H(f.name)} ↗</a>` : `${H(f.name)} <span class="muted small">(הקובץ עצמו עוד לא הועלה לכאן)</span>`}</li>`).join('')}</ul></div>` : ''}
      <div class="xrow"><b>נושאים</b>${(m.topics || []).length ? `<div class="tchips">${m.topics.map(t => `<span>${H(t)}</span>`).join('')}</div>` : '<span class="muted small">לא נמסרו נושאים</span>'}${m.topicsNote ? `<div class="small muted">${H(m.topicsNote)}</div>` : ''}</div>
      <div class="xrow"><b>עמודים</b>${(m.pages || []).length ? `<div class="small">${m.pages.map(H).join(' · ')}</div>` : '<span class="muted small">לא נמסרו עמודים</span>'}</div>
      ${m.groupNote ? `<div class="callout warn small">${H(m.groupNote)}</div>` : ''}
      ${(m.resources || []).length ? `<div class="xrow"><b>חומרי הסבר ותרגול נוספים</b><ul class="xlist">${m.resources.map(r => `<li><a href="${H(r.url)}" target="_blank" rel="noopener">${H(r.title)} ↗</a> <span class="muted small">· ${H(r.source)}</span></li>`).join('')}</ul></div>` : ''}
      ${m.note ? `<div class="small muted">${H(m.note)}</div>` : ''}`;
  }
  const plan = allEvents().filter(x => x.source === 'plan' && x.examId === e.id && (isParent() || x.owner === USERS[ui.user].kid)).sort((a, b) => a.date.localeCompare(b.date));
  const planHTML = e.date <= TODAY_ISO ? '' : `<div class="card soft-card"><h3>תוכנית הכנה אישית</h3>
    ${plan.length ? `<p class="small muted" style="margin:0">לפי הזמן שנשאר והאימונים. בימי אימון ארוך – משימה קצרה. סימון כאן מסמן גם את שלב ההכנה.</p>
      <div class="rows">${plan.map(p => rowHTML(p)).join('')}</div>`
      : (e.source === 'school' && (e.owners || []).some(kk => pendingFor(e, kk)) ? '<p class="small muted" style="margin:0">התוכנית תיבנה אחרי שהורה יאשר שהמבחן שייך לילד.</p>'
        : diffDays(TODAY_ISO, e.date) > 21 ? '<p class="small muted" style="margin:0">התוכנית תיבנה 3 שבועות לפני המבחן.</p>' : '<p class="small muted" style="margin:0">כל שלבי ההכנה כבר סומנו. כל הכבוד!</p>')}</div>`;
  const cards = sets.length ? `<div class="actions">${sets.map(s => `<button class="btn" data-action="card-start" data-set="${H(s.id)}">${I('study')}תרגול בכרטיסיות · ${s.cards.length} שאלות</button>`).join('')}</div>` : '';
  return `<div class="card soft-card"><div class="panel-head"><h3>חומר למבחן</h3>${isParent() ? `<button class="btn soft" data-action="mat-edit" data-id="${H(e.id)}">${I('edit')}עריכת חומר</button>` : ''}</div>${mat}</div>${planHTML}${cards}`;
}
function v7EventExtras(e) { return examExtras(e) + customControls(e); }
function matEditSheet(m) {
  const e = findEvent(m.id); if (!e) return '';
  const cur = materialFor(e) || {}, msg = cur.msg || {};
  const lines = a => (a || []).join('\n');
  return `<div class="sheet-top"><h2>חומר למבחן</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <p class="small muted" style="margin:0">${H(e.title)} · ${longDate(parse(e.date))}. כתבו רק מה שנמסר בפועל. בלי לנחש נושאים או עמודים.</p>
    <form class="f" id="matform" data-id="${H(e.id)}">
      <div class="two"><div class="field"><label for="mt-date">תאריך הודעת המורה</label><input id="mt-date" name="msgdate" value="${H(msg.date || '')}" placeholder="23.10"></div>
        <div class="field"><label for="mt-src">מקור</label><select id="mt-src" name="source"><option value="parent" ${cur.source !== 'mashov' && cur.source !== 'unverified' ? 'selected' : ''}>נמסר על ידי הורה</option><option value="mashov" ${cur.source === 'mashov' ? 'selected' : ''}>אומת מול משוב</option><option value="unverified" ${cur.source === 'unverified' ? 'selected' : ''}>לא אומת</option></select></div></div>
      <div class="field"><label for="mt-link">קישור להודעה (לא חובה)</label><input id="mt-link" name="msglink" value="${H(msg.link || '')}" dir="ltr"></div>
      <div class="field"><label for="mt-sum">תקציר ההודעה</label><textarea id="mt-sum" name="msgsum">${H(msg.summary || '')}</textarea></div>
      <div class="field"><label for="mt-files">קבצים – שורה לכל קובץ: שם | קישור</label><textarea id="mt-files" name="files">${H((cur.files || []).map(f => f.name + (f.url ? ' | ' + f.url : '')).join('\n'))}</textarea></div>
      <div class="field"><label for="mt-topics">נושאים – שורה לכל נושא</label><textarea id="mt-topics" name="topics">${H(lines(cur.topics))}</textarea></div>
      <div class="field"><label for="mt-pages">עמודים – שורה לכל טווח</label><textarea id="mt-pages" name="pages">${H(lines(cur.pages))}</textarea></div>
      <div class="field"><label for="mt-res">חומרים נוספים – שורה לכל אחד: כותרת | קישור | מקור</label><textarea id="mt-res" name="resources">${H((cur.resources || []).map(r => [r.title, r.url, r.source].join(' | ')).join('\n'))}</textarea></div>
      <div class="field"><label for="mt-group">הערה על הקבצות (לא חובה)</label><input id="mt-group" name="groupNote" value="${H(cur.groupNote || '')}"></div>
      <button class="btn" type="submit">${I('check')}שמירה</button>
    </form>`;
}
function v7SaveMaterial(f, fd) {
  const d = Object.fromEntries(fd), split = s => (s || '').split('\n').map(x => x.trim()).filter(Boolean);
  const e = findEvent(f.dataset.id); if (!e) return;
  const prev = materialFor(e) || {};
  S.materials[e.id] = { msg:{ date:(d.msgdate || '').trim(), link:(d.msglink || '').trim(), summary:(d.msgsum || '').trim() },
    files:split(d.files).map(l => { const [name, url] = l.split('|').map(x => x.trim()); return { name, url:url || '' }; }),
    topics:split(d.topics), pages:split(d.pages), topicsNote:prev.topicsNote || '',
    resources:split(d.resources).map(l => { const [title, url, source] = l.split('|').map(x => x.trim()); return { title, url:url || '', source:source || '' }; }).filter(r => r.url),
    groupNote:(d.groupNote || '').trim(), note:prev.note || '', source:d.source, updatedBy:ui.user, updatedAt:Date.now() };
  ui.modal = { kind:'event', id:e.id }; save(); render(); toast('החומר נשמר');
}

/* =====================================================================================
   5. FLASHCARDS – one question at a time, checked against a verified key
   ===================================================================================== */
function practiceHTML() {
  const kids = isParent() ? KID_IDS : [USERS[ui.user].kid];
  const sets = Object.values(S.cardsets || {}).filter(s => s && !s.deleted && kids.includes(s.kid));
  const card = s => {
    const prog = (S.cardprog[s.kid] || {}), ok = s.cards.filter(c => prog[c.id] && prog[c.id].last === 'ok').length, wrong = s.cards.filter(c => prog[c.id] && prog[c.id].last === 'wrong').length;
    return `<div class="card fcset" style="${tv(s.color || 'exam')}"><div class="panel-head"><h3>${ICO(s.color || 'exam')} ${H(s.title)}</h3>${isParent() ? `<span class="kb ${s.kid}">${KIDS[s.kid].initial}</span>` : ''}</div>
      <div class="small muted">${H(s.subject)}${s.examLabel ? ' · ' + H(s.examLabel) : ''}</div>
      <div class="small">${H(s.sourceNote || '')}</div>
      <div class="prep-bar"><div class="progress" role="progressbar" aria-valuenow="${ok}" aria-valuemin="0" aria-valuemax="${s.cards.length}" aria-label="תשובות נכונות"><i style="width:${Math.round(ok / s.cards.length * 100)}%"></i></div><span class="val">${ok} מתוך ${s.cards.length} נכון</span></div>
      <div class="actions"><button class="btn" data-action="card-start" data-set="${H(s.id)}">${I('study')}${ok || wrong ? 'להמשיך' : 'להתחיל'}</button>${wrong ? `<button class="btn soft" data-action="card-start" data-set="${H(s.id)}" data-mode="mistakes">חזרה על ${plural(wrong, 'טעות אחת', 'טעויות')}</button>` : ''}</div></div>`;
  };
  const notes = [];
  for (const k of kids) {
    const p = profile(k);
    if (k === 'kid2' && !p.mathGroup) notes.push(`<div class="callout warn small"><b>מתמטיקה ל${H(NM('kid2'))}:</b> הנושאים למבחן נמסרו לפי הקבצות, ו"מסלול רגיל" לא מספיק כדי לדעת איזו הקבצה. כשתבחרו בהגדרות את ההקבצה של ${H(NM('kid2'))}, אפשר יהיה להכין ערכה מתאימה.</div>`);
  }
  return `<div class="screen-head"><h1>תרגול בכרטיסיות</h1><p>שאלה אחת בכל פעם, עם בדיקה, תשובה נכונה והסבר. ההתקדמות נשמרת לכל ילד בנפרד.${isParent() ? ' הורים יכולים לנסות – התשובות של הורה לא נשמרות בהתקדמות של הילד.' : ''}</p></div>
    ${notes.join('')}
    ${sets.length ? `<div class="grid2">${sets.map(card).join('')}</div>` : '<div class="empty">עדיין אין ערכות. ערכות נבנות רק מחומר מבחן מאומת.</div>'}
    <p class="small muted">השאלות כאן נכתבו לפי החומר שנמסר, ואינן שאלות רשמיות של המורה.</p>`;
}
function cardStart(setId, mode) {
  const s = S.cardsets[setId]; if (!s) return;
  const kid = s.kid, prog = S.cardprog[kid] || {};
  let order = s.cards.map(c => c.id);
  if (mode === 'mistakes') order = order.filter(id => prog[id] && prog[id].last === 'wrong');
  if (!order.length) { toast('אין טעויות לחזור עליהן'); return; }
  ui.card = { setId, kid, order, i:0, ans:null, alt:false, mode, score:{ ok:0, wrong:0 } };
  ui.modal = { kind:'card' }; renderModal();
}
function cardSheet() {
  const st = ui.card, s = st && S.cardsets[st.setId];
  if (!s) return '';
  if (st.i >= st.order.length) {
    const wrongIds = st.order.filter(id => ((S.cardprog[st.kid] || {})[id] || {}).last === 'wrong');
    return `<div class="sheet-top"><h2>סיום סבב</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
      <div class="fc-done"><b>${st.score.ok}</b><span>תשובות נכונות מתוך ${st.score.ok + st.score.wrong} שנבדקו</span></div>
      <div class="actions">${wrongIds.length ? `<button class="btn" data-action="card-start" data-set="${H(s.id)}" data-mode="mistakes">חזרה על ${plural(wrongIds.length, 'הטעות', 'הטעויות')}</button>` : ''}<button class="btn soft" data-action="close">סיום</button></div>`;
  }
  const c = s.cards.find(x => x.id === st.order[st.i]);
  const a = st.ans;
  let body;
  if (c.type === 'choice') body = `<div class="fc-opts">${c.options.map((o, i) => {
    const cls = a ? (i === c.answer ? ' right' : (a.given === i ? ' wrong' : '')) : '';
    return `<button class="fc-opt${cls}" data-action="card-choice" data-v="${i}" ${a ? 'disabled' : ''}>${H(o)}</button>`; }).join('')}</div>`;
  else if (c.type === 'number') body = `<form class="f" id="cardnum"><div class="field"><label for="fc-num">התשובה שלך</label><input id="fc-num" name="v" inputmode="decimal" autocomplete="off" ${a ? 'disabled' : ''} value="${a ? H(a.given) : ''}"></div>${a ? '' : '<button class="btn" type="submit">בדיקה</button>'}</form>`;
  else body = `<form class="f" id="cardopen"><div class="field"><label for="fc-open">התשובה שלך</label><textarea id="fc-open" name="v" ${a ? 'disabled' : ''}>${a ? H(a.given) : ''}</textarea></div>${a ? '' : '<button class="btn" type="submit">להשוואה עם תשובה לדוגמה</button>'}</form>`;
  let fb = '';
  if (a && c.type !== 'open') fb = `<div class="callout ${a.ok ? 'ok' : 'no'}"><b>${a.ok ? 'נכון! 🎉' : 'לא נכון.'}</b> ${a.ok ? '' : `התשובה הנכונה: <b>${H(c.type === 'choice' ? c.options[c.answer] : c.answer + (c.unit || ''))}</b>`}
      <div style="margin-top:6px">${H(st.alt ? c.explain2 : c.explain)}</div></div>`;
  if (a && c.type === 'open') fb = `<div class="callout"><b>תשובה לדוגמה</b><div style="white-space:pre-line;margin-top:4px">${H(c.model)}</div></div>
      <div class="card soft-card"><h3>בדיקה עצמית</h3><p class="small muted" style="margin:0">אין כאן ציון אוטומטי – בדיקה של תשובה פתוחה לפי מילים לא אמינה. סמנו מה מופיע בתשובה שלכם:</p>
      <div class="checks" style="flex-direction:column;align-items:stretch">${c.rubric.map((r, i) => `<label><input type="checkbox" name="rb" value="${i}"> ${H(r)}</label>`).join('')}</div></div>`;
  return `<div class="sheet-top"><span class="chip" style="${tv(s.color || 'exam')}">${ICO(s.color || 'exam')}${H(s.title)}</span><span class="small muted">${st.i + 1} / ${st.order.length}</span><button class="icon-btn" data-action="close" aria-label="סגירה" style="margin-inline-start:auto">${I('x')}</button></div>
    <h2 class="fc-q">${H(c.q)}</h2>
    ${body}${fb}
    <div class="actions">
      ${a && c.type !== 'open' ? `<button class="btn soft" data-action="card-alt">${st.alt ? 'להסבר הראשון' : 'הסבר בדרך אחרת'}</button>` : ''}
      ${a && !a.ok && c.type !== 'open' ? `<button class="btn ghost" data-action="card-retry">ניסיון חוזר</button>` : ''}
      ${a ? `<button class="btn" data-action="card-next">${st.i + 1 < st.order.length ? 'לשאלה הבאה' : 'סיום'}</button>` : ''}
    </div>
    ${isParent() ? '<p class="small muted" style="margin:0">מצב הורה – התשובות לא נשמרות בהתקדמות של הילד.</p>' : ''}`;
}
function cardRecord(ok, given) {
  const st = ui.card, s = S.cardsets[st.setId], c = s.cards.find(x => x.id === st.order[st.i]);
  st.ans = { ok, given }; st.alt = false;
  if (ok === true) st.score.ok++; else if (ok === false) st.score.wrong++;
  if (!isParent() && USERS[ui.user].kid === st.kid && ok !== null) {
    const p = S.cardprog[st.kid][c.id] || { tries:0, correct:0 };
    S.cardprog[st.kid][c.id] = { tries:p.tries + 1, correct:p.correct + (ok ? 1 : 0), last:ok ? 'ok' : 'wrong', at:Date.now() };
    save();
  }
  renderModal();
}

/* =====================================================================================
   6. PARENTS SPACE – family messages, shopping list, appointments & doctor notes
   ===================================================================================== */
function familyHTML() {
  const live = o => Object.values(o || {}).filter(x => x && !x.deleted);
  const msgs = live(S.family.msgs).sort((a, b) => b.at - a.at);
  const shop = live(S.family.shop).sort((a, b) => (a.bought - b.bought) || (a.at - b.at));
  const appts = live(S.family.appts).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
  const up = appts.filter(a => a.date >= TODAY_ISO), past = appts.filter(a => a.date < TODAY_ISO);
  const apptRow = a => `<div class="review"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="kb ${a.kid}">${KIDS[a.kid] ? KIDS[a.kid].initial : '•'}</span><b>${H(a.title)}</b><span class="small">${longDate(parse(a.date))}${a.time ? ` · <span class="tm" dir="ltr">${H(a.time)}</span>` : ''}</span></div>
      ${a.place ? `<div class="small">מקום: ${H(a.place)}</div>` : ''}${a.notes ? `<div class="small" style="white-space:pre-line">${H(a.notes)}</div>` : ''}
      <div class="actions"><button class="btn soft" data-action="appt-edit" data-id="${H(a.id)}">${I('edit')}עריכה</button><button class="btn ghost" data-action="fam-del" data-list="appts" data-id="${H(a.id)}">${I('trash')}מחיקה</button></div></div>`;
  const pend = Object.values(S.pendingItems || {}).filter(p => p && p.status === 'open').length;
  return `<div class="screen-head"><h1>מרחב ההורים</h1><p>משותף ל${H(NM('par1'))} ול${H(NM('par2'))}. כל מה שנכתב כאן נשמר ומסתנכרן בין המכשירים שלכם.</p></div>
    ${syncCard()}
    ${pend || approvalItems().count ? `<div class="callout warn" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px"><b>${plural(pend + approvalItems().count, 'פריט אחד ממתין', 'פריטים ממתינים')} לאישור שלכם.</b><button class="btn" data-action="screen" data-screen="approve">${I('approve')}לאישורים</button></div>` : ''}
    <div class="grid2">
      <div class="card"><h3>הודעות משפחתיות</h3>
        <form class="f inline-form" id="msgform"><div class="field"><label for="fm-text">הודעה חדשה</label><textarea id="fm-text" name="text" required placeholder="למשל: מחר אני אוסף/ת מהאימון"></textarea></div><button class="btn" type="submit">${I('plus')}שליחה</button></form>
        ${msgs.length ? msgs.map(m => `<div class="review"><div class="small muted">${H(USERS[m.by] ? USERS[m.by].name : '')} · ${nowTxt(m.at)}</div><div style="white-space:pre-line">${H(m.text)}</div><div class="actions"><button class="btn ghost" data-action="fam-del" data-list="msgs" data-id="${H(m.id)}">${I('trash')}מחיקה</button></div></div>`).join('') : '<div class="empty">אין עדיין הודעות.</div>'}
      </div>
      <div class="card"><h3>רשימת קניות</h3>
        <form class="f inline-form" id="shopform"><div class="field"><label for="sh-text">מה לקנות?</label><input id="sh-text" name="text" required placeholder="למשל: מחברות משבצות"></div><button class="btn" type="submit">${I('plus')}הוספה</button></form>
        <div class="rows">${shop.length ? shop.map(s => `<div class="shop-row${s.bought ? ' bought' : ''}"><label><input type="checkbox" data-shop="${H(s.id)}" ${s.bought ? 'checked' : ''}> <span>${H(s.text)}</span></label>${s.bought ? '<span class="tag sure">נקנה</span>' : ''}<button class="icon-btn" data-action="fam-del" data-list="shop" data-id="${H(s.id)}" aria-label="מחיקה">${I('trash')}</button></div>`).join('') : '<div class="empty">הרשימה ריקה.</div>'}</div>
        ${shop.some(s => s.bought) ? `<button class="btn ghost" data-action="shop-clear">ניקוי מה שנקנה</button>` : ''}
      </div>
    </div>
    <div class="card" style="margin-top:14px"><div class="panel-head"><h3>תורים ופתקי רופא</h3><button class="btn" data-action="appt-edit">${I('plus')}תור או פתק חדש</button></div>
      ${up.length ? `<h4 class="small">קרובים</h4>${up.map(apptRow).join('')}` : '<div class="empty">אין תורים קרובים.</div>'}
      ${past.length ? `<details class="fold"><summary>תורים קודמים (${past.length})</summary><div class="fold-body">${past.map(apptRow).join('')}</div></details>` : ''}
    </div>
    <p class="small muted" style="margin-top:12px">שימו לב: מי שיש לו גישה לאפליקציה רואה גם את מרחב ההורים. הוא לא מוגן בנפרד.</p>`;
}
function apptSheet(m) {
  const a = m.id ? S.family.appts[m.id] : null;
  return `<div class="sheet-top"><h2>${a ? 'עריכת תור / פתק' : 'תור או פתק חדש'}</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <form class="f" id="apptform" data-id="${a ? H(a.id) : ''}">
      <div class="field"><label for="ap-title">מה זה?</label><input id="ap-title" name="title" required value="${H(a ? a.title : '')}" placeholder="למשל: רופאת עיניים"></div>
      <div class="two"><div class="field"><label for="ap-kid">של מי</label><select id="ap-kid" name="kid">${kidOptions(a && a.kid)}</select></div>
        <div class="field"><label for="ap-date">תאריך</label><input id="ap-date" type="date" name="date" required value="${H(a ? a.date : iso(TODAY))}"></div></div>
      <div class="two"><div class="field"><label for="ap-time">שעה</label><input id="ap-time" type="time" name="time" value="${H(a ? a.time : '')}"></div>
        <div class="field"><label for="ap-place">מקום</label><input id="ap-place" name="place" value="${H(a ? a.place : '')}"></div></div>
      <div class="field"><label for="ap-notes">הערות / פתק רופא</label><textarea id="ap-notes" name="notes">${H(a ? a.notes : '')}</textarea></div>
      <button class="btn" type="submit">${I('check')}שמירה</button>
    </form>`;
}
function syncCard() {
  const s = S.syncStatus || {};
  const ran = s.lastRun ? nowTxt(s.lastRun) : null;
  const res = !s.result ? ['warn', 'הבדיקה היומית לא פעילה'] : s.result === 'none' ? ['ok', 'נבדק – לא נמצא חדש'] : s.result === 'new' ? ['ok', 'נבדק – נמצאו עדכונים'] : s.result === 'login' ? ['no', 'נדרשת התחברות מחדש'] : ['no', 'הבדיקה נכשלה'];
  return `<div class="card" style="margin-bottom:14px"><div class="panel-head"><h3>עדכון יומי ממשוב ומהגיליון</h3><span class="tag ${res[0] === 'ok' ? 'sure' : res[0] === 'no' ? 'cancel' : 'moved'}">${res[1]}</span></div>
    ${ran ? `<div class="small">בדיקה אחרונה: ${ran}${s.message ? ` · ${H(s.message)}` : ''}</div>` : `<div class="small">עדיין לא בוצעה אף בדיקה אוטומטית. כרגע אין חיבור מורשה למשוב, וגם הגיליון חסום לקריאה מהסביבה שלי. לכן לא הפעלתי בדיקה מתוזמנת. ההסבר המלא נמצא בסיכום שקיבלת.</div>`}
  </div>`;
}

/* =====================================================================================
   7. SETTINGS / APPROVAL / DAY SHEET / MORE-MENU additions
   ===================================================================================== */
function v7SettingsExtra() {
  const grp = k => { const p = profile(k); const o = [['', 'לא ידוע – לא לנחש'], ['א1', 'א1'], ['א2', 'א2'], ['א החדשה', 'א החדשה'], ['ב׳', 'ב׳']];
    return `<div class="field"><label for="pg-${k}">הקבצה במתמטיקה – ${KIDS[k].name}</label><select id="pg-${k}" data-prof2="mathGroup" data-kid="${k}">${o.map(([v, l]) => `<option value="${v}" ${p.mathGroup === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>`; };
  return `<div class="grid2" style="margin-top:14px">
    <div class="card"><h3>הקבצות במתמטיקה</h3><p class="small muted" style="margin:0">"מסלול רגיל" קובע רק אילו מבחנים שייכים לילד. הוא לא אומר באיזו הקבצה הוא לומד (א1 / א2 / א החדשה / ב׳). בחרו רק לפי מה שהמורה מסרה.</p>${grp('kid1')}${grp('kid2')}</div>
    ${namesCard()}
    ${CLOUD.backend === 'firebase' ? (window.FSWeb ? window.FSWeb.settingsHTML() : '') : `<div class="card"><h3>שמירה ושיתוף</h3>
      <div class="small" style="line-height:1.7">${CLOUD.mode === 'cloud' ? (CLOUD.readOnly ? 'מחובר לענן במצב צפייה בלבד: אפשר לראות, אבל שינויים לא נשמרים.' : 'הנתונים נשמרים בענן של האפליקציה ומסתנכרנים בין המכשירים של מי שמורשה לערוך.') : 'כרגע הנתונים נשמרים רק במכשיר הזה.'}</div>
      ${window.FSWeb ? '' : `<ul class="small" style="line-height:1.7;margin:0;padding-inline-start:18px">
        <li>כרגע רק את יכולה לפתוח את הקישור.</li>
        <li>כדי ש${H(NM('par2'))} יוכל לראות ולערוך: תפריט השיתוף של הדף ← הזמנה לפי מייל כעורך.</li>
        <li>קישור ציבורי: כל מי שמחזיק בו יכול לצפות, כולל מרחב ההורים ופתקי הרופא. מבקרים דרך קישור ציבורי לא יכולים לשמור שינויים, וקישור ציבורי מבטל גם את הרשאות העריכה של מי שהוזמן במייל מחוץ לארגון.</li>
      </ul>`}</div>`}</div>`;
}
function namesCard() {
  const f = (k, l) => `<div class="field"><label for="nm-${k}">${l}</label><input id="nm-${k}" name="${k}" value="${H((S.names || {})[k] || '')}" placeholder="${H(NAME_DEFAULTS[k])}" maxlength="20" autocomplete="off"></div>`;
  return `<div class="card"><h3>שמות במשפחה</h3><p class="small muted" style="margin:0">השמות נשמרים רק בנתונים של המשפחה, לא בקוד של האפליקציה.</p>
    <form class="f" id="namesform"><div class="two">${f('kid1', 'הבת')}${f('kid2', 'הבן')}</div><div class="two">${f('par1', 'הורה מנהל/ת')}${f('par2', 'הורה שני/ה')}</div>
    <div class="actions"><button class="btn" type="submit">${I('check')}שמירת השמות</button></div></form></div>`;
}
function v7ApproveExtra() {
  const items = Object.values(S.pendingItems || {}).filter(p => p && p.status === 'open');
  const mk = schoolEvents().filter(e => e.kind === 'makeup' && e.status !== 'cancelled').flatMap(e => KID_IDS.filter(k => !decided(e, k) && FSCore.matchKid(e, profile(k)).result === 'yes').map(k => ({ e, k })));
  return `${items.length ? `<div class="card" style="margin-bottom:14px"><h3>פריטים שצריך לשייך (${items.length})</h3>
      ${items.map(p => `<div class="review"><b>${H(p.title)}</b><div class="small">${p.due ? `הגשה עד ${longDate(parse(p.due))}` : ''}${p.file ? ` · ${H(p.file)}` : ''}</div><div class="small muted">${H(p.note || '')}</div>
        <form class="f two" id="pendform" data-id="${H(p.id)}"><div class="field"><label for="pd-kid-${H(p.id)}">של מי</label><select id="pd-kid-${H(p.id)}" name="kid"><option value="">לבחור…</option>${kidOptions()}</select></div>
          <div class="field"><label for="pd-sub-${H(p.id)}">מקצוע</label><input id="pd-sub-${H(p.id)}" name="subject" placeholder="למשל: היסטוריה"></div>
          <div class="actions"><button class="btn" type="submit">${I('check')}שיוך ושמירה ביומן</button><button class="btn ghost" type="button" data-action="pend-dismiss" data-id="${H(p.id)}">לא רלוונטי</button></div></form></div>`).join('')}</div>` : ''}
    ${mk.length ? `<details class="fold" style="margin-bottom:14px"><summary>מועדי ב׳ – לא מאושרים אוטומטית (${mk.length})</summary><div class="fold-body">
      <p class="small muted">מועד ב׳ רלוונטי רק למי שהחסיר את המבחן או צריך לשפר. עד שתאשרי, הוא מסומן "ממתין" ולא מקבל תזכורות.</p>
      ${mk.map(({ e, k }) => `<div class="review"><div><span class="kb ${k}" style="display:inline-grid">${KIDS[k].initial}</span> <b>${H(e.title)}</b> · ${dm(e.date)}</div><div class="actions"><button class="btn" data-action="decide-review" data-id="${H(e.id)}" data-kid="${k}" data-val="yes">רלוונטי ל${KIDS[k].name}</button><button class="btn ghost" data-action="decide-review" data-id="${H(e.id)}" data-kid="${k}" data-val="no">לא רלוונטי</button></div></div>`).join('')}
    </div></details>` : ''}`;
}
function daySheet(m) {
  const ds = m.date, list = dayItems(ds), d = parse(ds);
  const n = list.filter(e => e.type !== 'holiday').length;
  return `<div class="dayhead"><div><span class="eyebrow">${ds === TODAY_ISO ? 'היום' : whenLabel(diffDays(TODAY_ISO, ds)).replace('בעוד', 'בעוד')}</span><h2>יום ${DAYS[d.getDay()]}, ${d.getDate()} ב${MONTHS[d.getMonth()]}</h2>
      <span class="small">${n ? plural(n, 'אירוע אחד', 'אירועים') : 'אין אירועים'}</span></div><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <div class="rows">${list.length ? list.map(itemRow).join('') : '<div class="empty">יום פנוי.</div>'}</div>
    <div class="actions"><button class="btn" data-action="ev-new" data-date="${ds}">${I('plus')}אירוע ביום הזה</button><button class="btn soft" data-action="openday" data-date="${ds}">לתצוגת יום</button></div>`;
}
function moreSheet() {
  const items = [['schedule', 'מערכת שעות וחוגים', 'clock'], ['import', 'לוח מבחנים', 'table'], ['library', 'ספריית לימודים', 'search'], ['settings', 'הגדרות', 'gear']];
  return `<div class="sheet-top"><h2>עוד</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <div class="rows">${items.map(([s, l, ic]) => `<button class="more-item" data-action="screen-more" data-screen="${s}">${I(ic)}<span>${l}</span></button>`).join('')}</div>`;
}
function cloudInfoSheet() {
  return `<div class="sheet-top"><h2>איפה הנתונים נשמרים</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    ${CLOUD.mode === 'cloud' ? `<div class="callout ${CLOUD.readOnly ? 'warn' : 'ok'}">${CLOUD.readOnly ? 'מחובר לענן, אבל ההרשאה שלך היא צפייה בלבד. שינויים לא יישמרו.' : 'מסונכרן: כל שינוי נשמר בענן של המשפחה ומופיע גם במכשירים המחוברים האחרים.'}</div>`
      : `<div class="callout warn">${window.FSWeb ? (window.FSWeb.configured() ? 'המכשיר עדיין לא מחובר למשפחה, ולכן השינויים נשמרים רק בו.' : 'שמירה בענן עוד לא הופעלה באתר הזה, ולכן השינויים נשמרים רק במכשיר הזה.') : 'כרגע אין חיבור לענן, ולכן השינויים נשמרים רק בדפדפן הזה. בדרך כלל זה קורה כשפותחים את הקובץ מחוץ לאתר של Claude, או בלי להיות מחוברים.'}</div>`}
    ${CLOUD.backend === 'firebase' ? `<p class="small" style="margin:0">מחובר/ת בתור: <b>${H(USERS[ui.user] ? USERS[ui.user].name : '')}</b></p>` : ''}
    ${CLOUD.err ? `<p class="small">${H(CLOUD.err)}</p>` : ''}
    <p class="small muted" style="margin:0">גיבוי מקומי נשמר תמיד גם בדפדפן (הגדרות ← גיבויים במכשיר הזה).</p>`;
}
const V7_SHEETS = { evedit:evEditSheet, matedit:matEditSheet, card:cardSheet, appt:apptSheet, day:daySheet, more:moreSheet, cloudinfo:cloudInfoSheet };
const V7_SCREENS = { practice:practiceHTML, family:familyHTML };

/* ---------- actions ---------- */
Object.assign(actions, {
  pick: el => { const d = parse(el.dataset.date); ui.sel = d; if (d.getMonth() !== ui.cursor.getMonth()) ui.cursor = new Date(d.getFullYear(), d.getMonth(), 1); ui.modal = { kind:'day', date:el.dataset.date }; render(); },
  add: () => { ui.modal = { kind:'evedit', date:iso(ui.sel) }; renderModal(); },
  'ev-new': el => { ui.modal = { kind:'evedit', date:el.dataset.date }; renderModal(); },
  'ev-edit': el => { ui.modal = { kind:'evedit', id:el.dataset.sid }; renderModal(); },
  'ev-del-ask': el => { ui.confirmDel = el.dataset.id; renderModal(); },
  'ev-del-no': () => { ui.confirmDel = null; renderModal(); },
  'ev-del': el => {
    const ev = S.events[el.dataset.sid]; if (!ev) return;
    if (el.dataset.scope === 'one') ev.exdates = [...(ev.exdates || []), el.dataset.date];
    else ev.deleted = true;
    ev.updatedBy = ui.user; ev.updatedAt = Date.now();
    ui.confirmDel = null; ui.modal = null; save(); render(); toast(el.dataset.scope === 'one' ? 'האירוע הוסר מהיום הזה' : 'האירוע נמחק');
  },
  toggle: el => {
    const e = findEvent(el.dataset.id); if (!e) return;
    if (e.planRef) {
      const n = e.planRef.key ? Math.max(5, ((S.prep[e.planRef.key] || []).length)) : 5;
      const st = Array.from({ length:n }, (_, i) => !!((S.prep[e.planRef.key] || [])[i]));
      st[e.planRef.i] = !st[e.planRef.i]; S.prep[e.planRef.key] = st;
      save(); render(); if (st[e.planRef.i]) toast(st.every(Boolean) ? 'הכנה מלאה – כל הכבוד!' : 'יפה! עוד צעד בהכנה');
      return;
    }
    const now = !isDone(e); S.done[e.id] = now; save(); render(); if (now) toast('כל הכבוד! סומן כבוצע');
  },
  'mat-edit': el => { ui.modal = { kind:'matedit', id:el.dataset.id }; renderModal(); },
  'card-start': el => cardStart(el.dataset.set, el.dataset.mode),
  'card-choice': el => { const st = ui.card, c = S.cardsets[st.setId].cards.find(x => x.id === st.order[st.i]); const v = +el.dataset.v; cardRecord(v === c.answer, v); },
  'card-alt': () => { ui.card.alt = !ui.card.alt; renderModal(); },
  'card-retry': () => { ui.card.ans = null; ui.card.alt = false; renderModal(); },
  'card-next': () => { ui.card.i++; ui.card.ans = null; ui.card.alt = false; renderModal(); },
  'appt-edit': el => { ui.modal = { kind:'appt', id:el.dataset.id || null }; renderModal(); },
  'fam-del': el => { const it = S.family[el.dataset.list][el.dataset.id]; if (!it) return; it.deleted = true; save(); render(); toast('נמחק'); },
  'shop-clear': () => { Object.values(S.family.shop).forEach(s => { if (s && s.bought) s.deleted = true; }); save(); render(); },
  'pend-dismiss': el => { const p = S.pendingItems[el.dataset.id]; if (!p) return; p.status = 'dismissed'; p.decidedBy = ui.user; save(); render(); toast('סומן כלא רלוונטי'); },
  more: () => { ui.modal = { kind:'more' }; renderModal(); },
  'screen-more': el => { ui.modal = null; ui.screen = el.dataset.screen; render(); window.scrollTo(0, 0); },
  cloudinfo: () => { ui.modal = { kind:'cloudinfo' }; renderModal(); },
});
const _login = actions.login;
actions.login = el => { if (CLOUD.locked) return; ui.view = 'month'; _login(el); };
// In the web version each device belongs to one family member, so "switch user" shows the connection details instead.
const _logout = actions.logout;
actions.logout = el => { if (CLOUD.locked) { ui.modal = { kind:'cloudinfo' }; renderModal(); return; } _logout(el); };
['restore-yes', 'reset-yes'].forEach(n => { const f = actions[n]; actions[n] = el => { f(el); S = v7Normalize(S); save(); render(); }; });

document.addEventListener('submit', ev => {
  const f = ev.target, fd = new FormData(f), d = Object.fromEntries(fd);
  if (f.id === 'evform') v7SaveEvent(f, fd);
  if (f.id === 'namesform') { S.names = { ...(S.names || {}) }; for (const k in NAME_DEFAULTS) S.names[k] = String(d[k] || '').trim().slice(0, 20); save(); render(); toast('השמות נשמרו'); }
  if (f.id === 'matform') v7SaveMaterial(f, fd);
  if (f.id === 'cardnum') {
    const st = ui.card, c = S.cardsets[st.setId].cards.find(x => x.id === st.order[st.i]);
    const v = parseFloat(String(d.v || '').replace(',', '.').replace(/[^\d.\-]/g, ''));
    if (isNaN(v)) { toast('צריך לכתוב מספר'); return; }
    cardRecord(Math.abs(v - c.answer) <= (c.tol || 1e-9), String(d.v));
  }
  if (f.id === 'cardopen') { if (!(d.v || '').trim()) { toast('כדאי לכתוב תשובה לפני ההשוואה'); return; } cardRecord(null, d.v); }
  if (f.id === 'msgform') { const id = newId('m'); S.family.msgs[id] = { id, text:d.text.trim(), by:ui.user, at:Date.now(), deleted:false }; save(); render(); toast('ההודעה נשמרה'); }
  if (f.id === 'shopform') { const id = newId('s'); S.family.shop[id] = { id, text:d.text.trim(), bought:false, by:ui.user, at:Date.now(), deleted:false }; save(); render(); }
  if (f.id === 'apptform') {
    const id = f.dataset.id || newId('a'), old = S.family.appts[id] || {};
    S.family.appts[id] = { id, title:d.title.trim(), kid:d.kid, date:d.date, time:d.time || '', place:(d.place || '').trim(), notes:(d.notes || '').trim(), by:old.by || ui.user, at:old.at || Date.now(), updatedBy:ui.user, deleted:false };
    ui.modal = null; save(); render(); toast('נשמר');
  }
  if (f.id === 'pendform') {
    const p = S.pendingItems[f.dataset.id]; if (!p) return;
    if (!d.kid) { toast('צריך לבחור של מי העבודה'); return; }
    const eid = newId('e');
    S.events[eid] = { id:eid, title:p.title + (d.subject ? ` (${d.subject.trim()})` : ''), type:'project', owner:d.kid, date:p.due, start:'', end:'', place:'', note:[p.file, p.note].filter(Boolean).join(' · '),
      repeat:'none', days:[], until:'', exdates:[], deleted:false, createdBy:ui.user, createdAt:Date.now() };
    p.status = 'assigned'; p.kid = d.kid; p.subject = (d.subject || '').trim(); p.eventId = eid; p.decidedBy = ui.user;
    save(); render(); toast(`שויך ל${KIDS[d.kid].name} ונוסף ליומן`);
  }
});
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.dataset.prof2) { S.profiles[el.dataset.kid][el.dataset.prof2] = el.value; save(); render(); toast('נשמר'); }
  if (el.dataset.shop) { const s = S.family.shop[el.dataset.shop]; if (s) { s.bought = el.checked; save(); render(); } }
});

render();
cloudStart();
