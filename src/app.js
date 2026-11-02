document.documentElement.lang = 'he';
document.documentElement.dir = 'rtl';

/* ================= icons ================= */
const P = {
  exam:'<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  study:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  project:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  homework:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  activity:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  chore:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  event:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  holiday:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  quiz:'<path d="M9 4h6l1 3H8z"/><rect x="5" y="6" width="14" height="15" rx="2"/><path d="M9 12l2 2 4-4"/>',
  alt:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>',
  approve:'<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  makeup:'<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v4h4"/>',
  rest:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  prev:'<path d="M9 6l6 6-6 6"/>',
  next:'<path d="M15 6l-6 6 6 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  swap:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>',
};
const I = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.event}</svg>`;

/* ================= dates ================= */
const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = d => addDays(startOfDay(d), -d.getDay());
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = n => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const DSHORT = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
const longDate = d => `יום ${DAYS[d.getDay()]}, ${d.getDate()} ב${MONTHS[d.getMonth()]}`;
const dm = s => { const d = parse(s); return `${d.getDate()}.${d.getMonth() + 1}`; };
const TODAY = startOfDay(new Date());
const TODAY_ISO = iso(TODAY);

/* ================= family & types ================= */
const KIDS = {
  kid1: { get name() { return NM('kid1'); }, get initial() { return NM('kid1').charAt(0); } },
  kid2: { get name() { return NM('kid2'); }, get initial() { return NM('kid2').charAt(0); } },
};
const DEFAULT_PROFILES = {
  kid1: { grade:'', cls:null, tracks:{ math:'', english:'' }, scienceClass:null },
  kid2: { grade:'', cls:null, tracks:{ math:'', english:'' }, scienceClass:null },
};
const USERS = {
  kid1: { get name() { return NM('kid1'); }, role:'child', kid:'kid1' },
  kid2: { get name() { return NM('kid2'); }, role:'child', kid:'kid2' },
  par1: { get name() { return NM('par1'); }, role:'admin',  sub:'מנהלת ראשית' },
  par2: { get name() { return NM('par2'); }, role:'parent', sub:'הורה – מעקב וניהול' },
};
// school: set by the school sheet – kids can't ask to move it. month: shown in the monthly view.
const TYPES = {
  exam:     { label:'מבחן',               school:true,  doable:false, month:true  },
  quiz:     { label:'בוחן',               school:true,  doable:false, month:true  },
  project:  { label:'עבודה / פרויקט',     school:true,  doable:true,  month:true  },
  alt:      { label:'הערכה חלופית',       school:true,  doable:true,  month:true  },
  study:    { label:'הכנה למבחן',        school:false, doable:true,  month:false },
  homework: { label:'שיעורי בית',        school:false, doable:true,  month:false },
  activity: { label:'חוג / אימון',       school:false, doable:false, month:true  },
  chore:    { label:'האחריות שלי בבית',   school:false, doable:true,  month:false },
  event:    { label:'אירוע בית־ספרי',     school:true,  doable:false, month:true  },
  holiday:  { label:'חג / חופשה',         school:true,  doable:false, month:true  },
  makeup:   { label:'מועד ב׳',            school:true,  doable:false, month:true  },
  rest:     { label:'מנוחה וזמן פנוי',    school:false, doable:false, month:false },
};
const KIND2TYPE = { exam:'exam', quiz:'quiz', project:'project', alt:'alt', makeup:'makeup', holiday:'holiday', event:'event' };
const EXAMISH = ['exam','quiz','project','alt','makeup'];
const tv = t => `--bg-t:var(--${t}-bg);--fg-t:var(--${t}-fg);--dot-t:var(--${t}-dot);--ico-t:var(--${t}-ico,#171717)`;
const ICO = t => `<span class="ico">${I(t)}</span>`;
const gradeLabel = (g, c) => g ? `${g}׳${c ?? ''}` : 'לא הוגדרה';
// Names live in the family's saved data, never in the code (the code is public).
const NAME_DEFAULTS = { kid1:'הבת', kid2:'הבן', par1:'אמא', par2:'אבא' };
const NM = k => { try { return String((S.names || {})[k] || '').trim() || NAME_DEFAULTS[k] || ''; } catch (e) { return NAME_DEFAULTS[k] || ''; } };
const kidOptions = cur => ['kid1', 'kid2'].map(k => `<option value="${k}" ${cur === k ? 'selected' : ''}>${H(NM(k))}</option>`).join('');

/* ================= saved state (this device only) ================= */
const KEY = 'familysmart.proto.v1', BKEY = 'familysmart.backups', DATA_VERSION = 4;
const freshState = () => ({ dataVersion:DATA_VERSION, prep:{}, done:{}, added:[], requests:[], overrides:{}, view:'month', school:null, reviewDecisions:{}, profiles:null, schedule:{ kid1:{}, kid2:{} }, names:{}, showSamples:true });
// Up to 5 copies of the saved data, kept in this browser. Made automatically before every risky change.
function backupNow(reason) {
  try {
    const raw = localStorage.getItem(KEY); if (!raw) return;
    const list = JSON.parse(localStorage.getItem(BKEY) || '[]');
    list.unshift({ at:new Date().toISOString(), reason, data:raw });
    localStorage.setItem(BKEY, JSON.stringify(list.slice(0, 5)));
  } catch (e) {}
}
const listBackups = () => { try { return JSON.parse(localStorage.getItem(BKEY) || '[]'); } catch (e) { return []; } };
function normalizeState(x) {
  const st = { ...freshState(), ...x };
  st.profiles = st.profiles || JSON.parse(JSON.stringify(DEFAULT_PROFILES));
  st.schedule = st.schedule || {};
  for (const k in DEFAULT_PROFILES) { st.profiles[k] = { ...DEFAULT_PROFILES[k], ...(st.profiles[k] || {}) }; st.profiles[k].tracks = { ...DEFAULT_PROFILES[k].tracks, ...(st.profiles[k].tracks || {}) }; st.schedule[k] = st.schedule[k] || {}; }
  // Re-classify stored events with the current rules (e.g. "הערכה חלופית" became its own type). IDs, dates and history are kept.
  if (st.school && st.school.events) st.school.events.forEach(e => { const c = FSCore.classify(e.title, null); e.kind = c.kind; e.label = c.label; e.fp = FSCore.fingerprint(e); });
  return st;
}
let S = freshState(), upgraded = false;
try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const old = JSON.parse(raw);
    if ((old.dataVersion || 3) < DATA_VERSION) { backupNow(`לפני המעבר לגרסה ${DATA_VERSION}`); upgraded = true; }
    S = normalizeState(old);
  }
} catch (e) {}
S = normalizeState(S);
S.dataVersion = DATA_VERSION;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('לא הצלחתי לשמור במכשיר הזה (ייתכן שהאחסון מלא או חסום).'); } if (typeof cloudPush === 'function') cloudPush(); };

if (upgraded) save();
const ui = { confirmRestore:null, user:null, screen:'cal', view:S.view || 'month', cursor:TODAY, sel:TODAY, kid:'both', hidden:new Set(['makeup']), modal:null, schedKid:'kid1', preview:null, confirmReset:false };
const isParent = () => ui.user === 'par1' || ui.user === 'par2';
const profile = k => ({ ...S.profiles[k], name:KIDS[k].name });

/* ================= sample data (NOT from school) ================= */
function sampleSchool() {
  // Used only until a real exam calendar is imported.
  const W = startOfWeek(TODAY), at = off => iso(addDays(W, off));
  const list = [
    ['quiz','בוחן','ח',[2], 8,'בוחן במתמטיקה (דוגמה)','מתמטיקה'],
    ['project','עבודה','ח',[2],10,'עבודת חקר במדעים (דוגמה)','מדעים'],
    ['exam','מבחן','ח',[2],15,'מבחן באנגלית (דוגמה)','אנגלית'],
    ['exam','מבחן','ט',[3], 3,'מבחן בפיזיקה (דוגמה)','כימיה/פיזיקה'],
    ['project','עבודה','ט',[3], 9,'עבודה בהיסטוריה (דוגמה)','היסטוריה'],
    ['exam','מבחן','ט',[3],11,'מבחן בתנ״ך (דוגמה)','תנ״ך'],
  ];
  return list.map(([type, label, g, cls, off, title, subject]) => ({
    id:`sample|${g}|${type}|${at(off)}|${title}`, source:'sample', type, label, date:at(off), start:null, end:null, title,
    subjects:[subject], audience:[{ grade:g, classes:cls }], group:null, status:'active',
  }));
}
function samplePersonal(schoolList) {
  const out = [], W = startOfWeek(TODAY), at = off => addDays(W, off);
  const mk = o => { o.id = ['s', o.owner, o.type, o.date, o.start || '', o.title].join('|'); o.source = 'sample'; out.push(o); };
  const hw = { kid1:['אנגלית','מתמטיקה','מדעים','עברית','היסטוריה'], kid2:['מתמטיקה','ספרות','אנגלית','תנ״ך','היסטוריה'] };
  const txt = ['עמ׳ 42, תרגילים 1–6','קריאת פרק ומענה על שאלות','דף עבודה מהשיעור','סיכום של חצי עמוד','תרגול מהחוברת'];
  for (let off = -14; off <= 35; off++) {
    const d = at(off), dow = d.getDay(), ds = iso(d);
    if (dow === 0 || dow === 3) mk({ type:'chore', owner:'kid1', date:ds, start:'20:00', end:'20:20', title:'פריקת מדיח הכלים' });
    if (dow === 1 || dow === 4) mk({ type:'chore', owner:'kid2', date:ds, start:'20:30', end:'20:45', title:'הוצאת הזבל והמחזור' });
    if (dow === 5) for (const k of ['kid1','kid2']) mk({ type:'rest', owner:k, date:ds, start:'14:00', end:'17:00', title:'זמן פנוי', details:'זמן למנוחה, חברים ותחביבים' });
    if (dow <= 4 && off >= -7 && off <= 27) for (const k of ['kid1','kid2']) {
      const subj = hw[k][(off + 14 + (k === 'kid2' ? 2 : 0)) % 5];
      mk({ type:'homework', owner:k, date:ds, start:'15:30', end:'16:30', title:`שיעורי בית ב${subj}`, subjects:[subj], details:txt[(off + 15) % 5] });
    }
  }
  // study prep only for the sample exams (the real calendar gets automatic study plans in a later stage)
  for (const e of schoolList.filter(x => x.source === 'sample' && (x.type === 'exam' || x.type === 'quiz'))) {
    for (const k of Object.keys(KIDS)) {
      if (!kidSees(e, k)) continue;
      for (const back of [2, 1]) {
        const d = addDays(parse(e.date), -back); if (d.getDay() >= 5) continue;
        mk({ type:'study', owner:k, date:iso(d), start:'19:00', end:'20:00', title:`חזרה למבחן ב${e.subjects[0]}`, subjects:e.subjects, details:'הצעה לדוגמה' });
      }
    }
  }
  return out;
}

/* ================= school events, schedule, everything ================= */
function schoolEvents() {
  if (!S.school) return sampleSchool();
  return S.school.events.map(e => ({
    id:e.id, source:'school', kind:e.kind, grade:e.grade, type:KIND2TYPE[e.kind] || 'event', label:e.label, date:e.date, start:null, end:null,
    title:e.title, subjects:e.subjects, audience:e.audience, group:e.group, status:e.status, lastChange:e.lastChange,
    history:e.history, where:e.where, details:e.note || '', firstSeen:e.firstSeen, possibleMoveTo:e.possibleMoveTo, possibleMoveFrom:e.possibleMoveFrom, warn:e.warn,
  }));
}
// 'yes' | 'no' | 'review' (a parent's decision overrides 'review')
function kidResult(e, k) {
  if (e.owner) return e.owner === k || e.owner === 'family' ? 'yes' : 'no';
  const d = (S.reviewDecisions[e.id] || {})[k];
  if (d) return d;
  return FSCore.matchKid(e, profile(k)).result;
}
const kidSees = (e, k) => kidResult(e, k) === 'yes';

function scheduleEvents() {
  const out = [];
  for (const k of Object.keys(KIDS)) {
    const sch = S.schedule[k] || {};
    for (let off = -35; off <= 150; off++) {
      const d = addDays(TODAY, off), dow = d.getDay(), day = sch[dow];
      if (!day || !day.blocks) continue;
      for (const b of day.blocks) out.push({
        id:`sch|${k}|${b.id}|${iso(d)}`, source:'schedule', type:'activity', owner:k, date:iso(d), start:b.start, end:b.end,
        title:b.title, details:[b.place, b.notes].filter(Boolean).join(' · '), blockKind:b.kind,
      });
    }
  }
  return out;
}

let CACHE = null;
function allEvents() {
  if (CACHE) return CACHE;
  const school = schoolEvents();
  const base = [...school, ...(S.showSamples ? samplePersonal(school) : []), ...scheduleEvents(), ...S.added, ...(typeof customEvents === 'function' ? customEvents() : [])]
    .map(e => S.overrides[e.id] && e.source !== 'school' ? { ...e, ...S.overrides[e.id] } : e);
  CACHE = base;   // planEvents reads the list built so far
  const list = typeof planEvents === 'function' ? base.concat(planEvents(base)) : base;
  CACHE = list;
  return list;
}
const ownersOf = e => Object.keys(KIDS).filter(k => kidSees(e, k));
// Parents also see school events whose match is still unknown (marked as pending). Kids never do.
const ownersFor = e => Object.keys(KIDS).filter(k => kidSees(e, k) || (isParent() && e.source === 'school' && kidResult(e, k) === 'review'));
const viewerKids = () => isParent() ? (ui.kid === 'both' ? ['kid1','kid2'] : [ui.kid]) : [USERS[ui.user].kid];
function visible() {
  const kids = viewerKids(), out = [];
  for (const e of allEvents()) {
    if (ui.hidden.has(e.type)) continue;
    if (!isParent() && e.status === 'missing' && e.possibleMoveTo && e.possibleMoveTo.length) continue;
    const owners = ownersFor(e).filter(k => kids.includes(k));
    if (owners.length) out.push({ ...e, owners });
  }
  return out;
}
const findEvent = id => {
  if (id.startsWith('span|')) return splitSpans(allEvents().map(e => ({ ...e, owners:ownersFor(e) })).filter(e => e.owners.length)).spans.find(x => x.id === id) || null;
  const e = allEvents().find(x => x.id === id); return e ? { ...e, owners:ownersFor(e) } : null;
};
// Consecutive holiday days → one multi-day item for display. The original school days stay inside .items, unchanged.
function splitSpans(list) {
  const { spans, singles } = FSCore.groupSpans(list, { keyExtra:e => (e.owners || []).join(',') });
  return { singles, spans:spans.map(sp => ({ id:'span|' + sp.items[0].id, isSpan:true, type:'holiday', source:sp.items[0].source, title:sp.title,
    date:sp.start, endDate:sp.end, owners:sp.items[0].owners, items:sp.items, status:'active' })) };
}
const spanLen = sp => diffDays(sp.date, sp.endDate) + 1;
const shortRange = (a, b) => `<span class="tm" dir="ltr">${dm(a)}–${dm(b)}</span>`;
const covers = (sp, ds) => sp.date <= ds && sp.endDate >= ds;
const isDone = e => e.planRef ? !!((S.prep[e.planRef.key] || [])[e.planRef.i]) : (S.done[e.id] ?? (e.date < TODAY_ISO && TYPES[e.type].doable && e.source !== 'custom'));
const isOff = e => e.status === 'cancelled';
const sortEv = (a, b) => (isOff(a) - isOff(b)) || (a.start || '00:00').localeCompare(b.start || '00:00') || a.title.localeCompare(b.title);
const byDate = list => { const m = {}; for (const e of list) (m[e.date] ||= []).push(e); for (const k in m) m[k].sort(sortEv); return m; };
const lastReq = id => S.requests.filter(r => r.eventId === id).sort((a, b) => b.createdAt - a.createdAt)[0];
const matchInfo = (e, k) => e.owner ? { result:e.owner === k || e.owner === 'family' ? 'yes' : 'no', certain:true, reason:'' } : FSCore.matchKid(e, profile(k));
const decided = (e, k) => !!(S.reviewDecisions[e.id] || {})[k];
const isUncertain = (e, k) => e.source === 'school' && !decided(e, k) && matchInfo(e, k).result === 'yes' && !matchInfo(e, k).certain;
// Pending = waiting for a parent (unknown or uncertain match). Confirmed = everything else from the school sheet.
const pendingFor = (e, k) => { if (e.source !== 'school' || e.isSpan || decided(e, k)) return false; if (e.kind === 'makeup') return true; const m = matchInfo(e, k); return m.result === 'review' || (m.result === 'yes' && !m.certain); };
const isPending = e => (e.owners || ownersFor(e)).some(k => pendingFor(e, k));
// The ONLY gate for reminders – today the reminder list, later push / WhatsApp. Pending, cancelled or "missing" events never remind.
const canRemind = e => !isOff(e) && e.status !== 'missing' && !isPending(e);
const SHORT_SUBJ = { 'מתמטיקה':'מתמ׳', 'אנגלית':'אנג׳', 'היסטוריה':'היסט׳', 'תנ״ך':'תנ״ך', 'עברית':'עברית', 'ספרות':'ספרות', 'גיאוגרפיה':'גיאו׳', 'מדעים':'מדעים', 'מדעי המחשב':'מד״מ', 'ביולוגיה':'ביו׳', 'כימיה/פיזיקה':'כימ/פיז', 'אזרחות':'אזרחות', 'ערבית':'ערבית', 'יזמות':'יזמות' };
const miniText = e => (e.subjects && e.subjects[0] && SHORT_SUBJ[e.subjects[0]]) || e.title.split(' ').slice(0, 2).join(' ');
// Everything that waits for a parent: unknown matches, uncertain matches, and possible moves of identical-looking exams.
function approvalItems() {
  const list = schoolEvents().filter(e => e.status !== 'cancelled');
  const match = list.flatMap(e => Object.keys(KIDS).filter(k => !decided(e, k)).map(k => ({ e, k, m:matchInfo(e, k) })).filter(x => x.m.result === 'review' || (x.m.result === 'yes' && !x.m.certain)));
  const moves = list.filter(e => e.status === 'missing' && e.possibleMoveTo && e.possibleMoveTo.length)
    .map(o => ({ o, cands:o.possibleMoveTo.map(id => list.find(x => x.id === id)).filter(Boolean) })).filter(x => x.cands.length);
  return { match, moves, count:match.length + moves.length };
}
const reviewItems = () => approvalItems().match;

/* ================= small helpers ================= */
const H = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const timeHTML = e => e.start ? `<span class="tm" dir="ltr">${e.start}${e.end ? '–' + e.end : ''}</span>`
  : (e.type === 'project' || e.type === 'alt') ? 'יום ההגשה' : (e.type === 'exam' || e.type === 'quiz' || e.type === 'makeup') ? 'במהלך יום הלימודים' : 'כל היום';
const plural = (n, one, many) => n === 1 ? one : `${n} ${many}`;
const kidBadge = e => isParent() && ui.kid === 'both' ? e.owners.map(k => `<span class="kb ${k}" title="${KIDS[k].name}">${KIDS[k].initial}</span>`).join('') : '';
const avatar = (u, cls = '') => `<span class="av ${cls} ${u}">${H(USERS[u] ? USERS[u].name[0] : '?')}</span>`;
const whenLabel = n => n === 0 ? 'היום' : n === 1 ? 'מחר' : n === 2 ? 'מחרתיים' : `בעוד ${n} ימים`;
const audText = aud => aud.map(a => a.classes === 'all' ? `כל שכבת ${a.grade}׳` : a.classes.map(c => gradeLabel(a.grade, c)).join(', ')).join(' · ');
const typeLabel = e => e.label && e.source !== 'sample' ? e.label : TYPES[e.type].label;
function changeTag(e) {
  if (e.source === 'sample') return '<span class="tag sample">דוגמה</span>';
  if (e.source !== 'school') return '';
  if (e.status === 'cancelled') return '<span class="tag cancel">בוטל</span>';
  if (e.status === 'missing') return e.possibleMoveTo && e.possibleMoveTo.length ? '<span class="tag moved">ייתכן שהוזז</span>' : '<span class="tag cancel">ייתכן שבוטל</span>';
  if (isPending(e)) return `<span class="tag pend">? ממתין לאישור הורה</span>`;
  const c = e.lastChange;
  if (!c || (Date.now() - Date.parse(c.at)) > 14 * 864e5) return '';
  if (c.type === 'dateChanged') return `<span class="tag moved">הוזז מ־${dm(c.from)}</span>`;
  if (c.type === 'detailsChanged' || c.type === 'textChanged') return '<span class="tag moved">עודכן</span>';
  if (c.type === 'created' && S.school && c.run !== S.school.firstRun) return '<span class="tag new">חדש</span>';
  if (c.type === 'restored') return '<span class="tag new">חזר ללוח</span>';
  return '';
}
// "✓ ודאי" on confirmed school exams/quizzes/projects (shown next to any change tag).
const sureTag = e => e.source === 'school' && EXAMISH.includes(e.type) && !isOff(e) && e.status !== 'missing' && !isPending(e) ? `<span class="tag sure">${I('check')}ודאי</span>` : '';

function rowHTML(e) {
  const t = TYPES[e.type];
  const done = t.doable && isDone(e);
  const r = lastReq(e.id);
  const reqTag = r && r.status === 'pending' ? '<span class="req-tag">ממתין לאישור</span>' : '';
  const subj = e.subjects && e.subjects.length ? e.subjects.join(', ') : '';
  const meta = `${timeHTML(e)}${subj && e.type !== 'homework' ? ' · ' + H(subj) : ''}`;
  if (e.isSpan) return spanRow(e);
  return `<div class="row ${e.type}${done ? ' done' : ''}${isOff(e) ? ' cancelled' : ''}${isPending(e) ? ' pending' : ''}" style="${tv(e.type)}">
    ${t.doable && !isOff(e) ? `<button class="check" data-action="toggle" data-id="${H(e.id)}" aria-pressed="${done}" aria-label="סימון כבוצע: ${H(e.title)}"><span>${I('check')}</span></button>` : ''}
    <button class="row-main" data-action="open" data-id="${H(e.id)}">
      ${ICO(e.type)}
      <span class="row-text"><span class="row-title">${H(e.title)}</span><span class="row-meta">${meta}</span></span>
      ${changeTag(e)}${sureTag(e)}${reqTag}${kidBadge(e)}
    </button>
  </div>`;
}
function spanRow(sp, ds) {
  const n = spanLen(sp), idx = ds ? diffDays(sp.date, ds) + 1 : 0;
  return `<div class="row holiday" style="${tv('holiday')}"><button class="row-main" data-action="open" data-id="${H(sp.id)}">${ICO('holiday')}
    <span class="row-text"><span class="row-title">${H(sp.title)}</span><span class="row-meta">${shortRange(sp.date, sp.endDate)} · ${n} ימים${idx ? ` · יום ${idx} מתוך ${n}` : ''}</span></span>${kidBadge(sp)}</button></div>`;
}
// Singles of a day plus multi-day items that cover it.
function dayItems(ds, list) {
  const { spans, singles } = splitSpans(list || visible());
  return [...spans.filter(sp => covers(sp, ds)).map(sp => ({ ...sp, _ds:ds })), ...singles.filter(e => e.date === ds).sort(sortEv)];
}
const itemRow = e => e.isSpan ? spanRow(e, e._ds) : rowHTML(e);

/* ================= picker ================= */
function pickerHTML() {
  const p = S.profiles;
  return `<div class="picker"><div class="wrap"><div class="picker-in">
    <div class="hello">
      <div class="logo"><span class="mark">${I('cal')}</span><bdi>FamilySmart</bdi></div>
      <p>מי נכנס/ת עכשיו?</p>
    </div>
    <div class="ucards">
      <button class="ucard kid1" data-action="login" data-user="kid1">${avatar('kid1')}<h2>${H(NM('kid1'))}</h2><div class="sub">כיתה ${gradeLabel(p.kid1.grade, p.kid1.cls)} · היומן שלי</div></button>
      <button class="ucard kid2" data-action="login" data-user="kid2">${avatar('kid2')}<h2>${H(NM('kid2'))}</h2><div class="sub">כיתה ${gradeLabel(p.kid2.grade, p.kid2.cls)} · היומן שלי</div></button>
      <div class="ucard">${avatar('parent')}<h2>הורה</h2><div class="sub">רואים את שני היומנים</div>
        <div class="parent-btns">
          <button class="btn" data-action="login" data-user="par1">${H(NM('par1'))}</button>
          <button class="btn soft" data-action="login" data-user="par2">${H(NM('par2'))}</button>
        </div>
      </div>
    </div>
    <small class="priv">גרסת ניסיון: אין כאן סיסמאות, וכל מה שמוזן נשמר רק במכשיר הזה. בגרסה האמיתית כל אחד יתחבר עם חשבון Google אישי, וכל ילד יראה רק את היומן שלו.</small>
  </div></div></div>`;
}

/* ================= shell ================= */
function weekStats(kid) {
  const s = iso(startOfWeek(TODAY)), e = iso(addDays(startOfWeek(TODAY), 6));
  const evs = allEvents().filter(x => x.date >= s && x.date <= e && !isOff(x) && x.status !== 'missing' && kidSees(x, kid) && !pendingFor(x, kid));
  return { exams: evs.filter(x => x.type === 'exam').length, quizzes: evs.filter(x => x.type === 'quiz').length, projects: evs.filter(x => x.type === 'project' || x.type === 'alt').length };
}
function greetHTML() {
  const u = USERS[ui.user];
  if (!isParent()) {
    const st = weekStats(u.kid), parts = [];
    if (st.exams) parts.push(plural(st.exams, 'מבחן אחד', 'מבחנים'));
    if (st.quizzes) parts.push(plural(st.quizzes, 'בוחן אחד', 'בחנים'));
    if (st.projects) parts.push(plural(st.projects, 'הגשה אחת', 'הגשות'));
    return `<h1>היי ${u.name}!</h1><p>${parts.length ? 'השבוע יש לך ' + parts.join(' ו') + '.' : 'השבוע אין מבחנים או הגשות.'}</p>`;
  }
  const line = Object.keys(KIDS).map(k => { const st = weekStats(k), n = st.exams + st.quizzes; return `${KIDS[k].name}: ${n ? plural(n, 'מבחן או בוחן אחד', 'מבחנים ובחנים') : 'בלי מבחנים'}`; }).join(' · ');
  return `<h1>שלום ${u.name}</h1><p>השבוע – ${line}</p>`;
}
/* ================= home hero & exam prep ================= */
const MOTTO = {
  kid1:['יש לך את זה.','צעד קטן כל יום, ותראי איך זה מצטבר.','את יותר מוכנה ממה שנדמה לך.','קצת תרגול היום, הרבה פחות לחץ מחר.','תתחילי מהמשימה הכי קטנה – זה הכי קל.','כל סימון ✓ מקרב אותך.'],
  kid2:['יש לך את זה.','צעד קטן כל יום, ותראה איך זה מצטבר.','אתה יותר מוכן ממה שנדמה לך.','קצת תרגול היום, הרבה פחות לחץ מחר.','תתחיל מהמשימה הכי קטנה – זה הכי קל.','כל סימון ✓ מקרב אותך.'],
};
const STARS = { kid1:'<path d="M24 3l5.6 13.2L44 17.6l-10.9 9.6 3.3 14.3L24 33.9l-12.4 7.6 3.3-14.3L4 17.6l14.4-1.4z"/>', kid2:'<path d="M27 2L8 27h13l-4 19 21-27H25z"/>', parent:'<path d="M24 6c6 8 14 10 14 20a14 14 0 0 1-28 0c0-10 8-12 14-20z"/>' };
const dayGreeting = () => { const h = new Date().getHours(); return h < 5 ? 'לילה טוב' : h < 12 ? 'בוקר טוב' : h < 17 ? 'צהריים טובים' : h < 21 ? 'ערב טוב' : 'לילה טוב'; };
const PREP_STEPS = {
  exam:['לאסוף את כל החומר','לסכם את הנושאים','לתרגל שאלות','לפתור מבחן לדוגמה','חזרה אחרונה'],
  project:['להבין מה צריך להגיש','לאסוף מידע','לכתוב טיוטה','לשפר ולתקן','להגיש'],
};
const prepSteps = e => (e.type === 'project' || e.type === 'alt') ? PREP_STEPS.project : PREP_STEPS.exam;
const prepKey = (e, k) => `${e.id}|${k}`;
const prepState = (e, k) => { const st = (S.prep || {})[prepKey(e, k)] || []; const n = prepSteps(e).length; return { st, done:st.filter(Boolean).length, n }; };
// Upcoming confirmed exams / quizzes / assignments for one kid (pending items are never pushed at kids)
function upcomingFor(k, days) {
  return allEvents().filter(e => ['exam','quiz','project','alt'].includes(e.type) && e.date >= TODAY_ISO && diffDays(TODAY_ISO, e.date) <= days && kidSees(e, k) && canRemind({ ...e, owners:[k] }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
const prepBar = (done, n, label) => `<div class="prep-bar"><div class="progress" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${n}" aria-label="${H(label)}"><i style="width:${n ? Math.round(done / n * 100) : 0}%"></i></div><span class="val">${done} מתוך ${n}</span></div>`;
function prepCard(k) {
  const list = upcomingFor(k, 21).slice(0, 4);
  return `<div class="card prep"><div class="panel-head"><h3>ההכנה ${USERS[ui.user].kid ? 'שלי' : `של ${KIDS[k].name}`} למבחנים</h3><span class="small muted">3 השבועות הקרובים</span></div>
    ${list.length ? list.map(e => { const p = prepState(e, k), d = diffDays(TODAY_ISO, e.date);
      return `<button class="prep-item" data-action="open" data-id="${H(e.id)}" style="${tv(e.type)}"><span class="prep-top">${ICO(e.type)}<span class="t">${H(e.title)}</span><span class="when">${whenLabel(d)} · ${dm(e.date)}</span></span>${prepBar(p.done, p.n, 'התקדמות בהכנה: ' + e.title)}</button>`; }).join('')
      : '<div class="empty">אין מבחנים או הגשות ב־3 השבועות הקרובים.</div>'}
  </div>`;
}
function heroHTML() {
  const u = USERS[ui.user], now = new Date();
  const eyebrow = `${longDate(TODAY)}`;
  const look = u.kid || 'parent';
  const deco = look === 'kid1'
    ? `<div class="hero-deco" aria-hidden="true"><span class="ring r1"></span><span class="ring r2"></span><span class="blob b3"></span><span class="blob b4"></span></div>`
    : look === 'kid2'
    ? `<div class="hero-deco" aria-hidden="true"><span class="stripe s1"></span><span class="stripe s2"></span><span class="stripe s3"></span></div>`
    : `<div class="hero-deco" aria-hidden="true"><span class="band"><i></i><i></i><i></i><i></i></span></div>`;
  if (!isParent()) {
    const k = u.kid, st = weekStats(k), n = st.exams + st.quizzes, next = upcomingFor(k, 60)[0];
    const motto = MOTTO[k][Math.floor((TODAY - new Date(TODAY.getFullYear(), 0, 0)) / 864e5) % MOTTO[k].length];
    const today = allEvents().filter(e => e.date === TODAY_ISO && kidSees(e, k) && TYPES[e.type].doable && !isOff(e)), td = today.filter(isDone).length;
    const hello = k === 'kid1' ? `היי ${H(NM('kid1'))}! 💗<br><span class="hl">מוכנה לכבוש את היום?</span>` : `היי ${H(NM('kid2'))}! ⚡<br><span class="hl">בוא נראה מה מחכה לך היום.</span>`;
    return `<section class="hero ${look}">${deco}
      <div class="hero-main"><span class="eyebrow">${eyebrow}</span><h1>${hello}</h1><p class="motto">${H(motto)}</p></div>
      <div class="hero-stats">
        <div class="bubble c1"><span class="lbl">השבוע</span><b>${n ? plural(n, 'מבחן אחד', 'מבחנים') : 'בלי מבחנים'}</b><span class="sub">${st.projects ? plural(st.projects, 'והגשה אחת', 'הגשות') : n ? 'ובלי הגשות' : 'שבוע רגוע'}</span></div>
        ${next ? `<button class="bubble c2" data-action="open" data-id="${H(next.id)}"><span class="lbl">הבא בתור</span><b>${H(next.title)}</b><span class="sub">${whenLabel(diffDays(TODAY_ISO, next.date))} · ${DSHORT[parse(next.date).getDay()]} ${dm(next.date)}</span></button>`
          : `<div class="bubble c2"><span class="lbl">הבא בתור</span><b>אין מבחנים קרובים</b><span class="sub">בחודשיים הקרובים</span></div>`}
        <div class="bubble c3"><span class="lbl">משימות היום</span><b>${today.length ? `${td} מתוך ${today.length}` : 'אין משימות'}</b>${today.length ? `<div class="progress" role="progressbar" aria-valuenow="${td}" aria-valuemin="0" aria-valuemax="${today.length}" aria-label="משימות שבוצעו היום"><i style="width:${Math.round(td / today.length * 100)}%"></i></div>` : '<span class="sub">יום חופשי</span>'}</div>
      </div>
    </section>
    ${prepCard(k)}`;
  }
  const appr = approvalItems().count;
  return `<section class="hero ${look}">${deco}
    <div class="hero-main"><span class="eyebrow">${eyebrow}</span><h1>${dayGreeting()}, <span class="hl">${u.name}</span></h1><p class="motto">ככה נראים השבועות של הילדים.</p></div>
    <div class="kidtiles">${Object.keys(KIDS).map(k => { const st = weekStats(k), n = st.exams + st.quizzes, next = upcomingFor(k, 60)[0];
      const prepDone = upcomingFor(k, 21).reduce((a, e) => { const p = prepState(e, k); return [a[0] + p.done, a[1] + p.n]; }, [0, 0]);
      return `<div class="kidtile"><div class="who">${avatar(k, 'sm')}<b>${KIDS[k].name}</b><span class="small muted">${gradeLabel(profile(k).grade, profile(k).cls)}</span></div>
        <div>השבוע: <b>${n ? plural(n, 'מבחן אחד', 'מבחנים') : 'בלי מבחנים'}</b>${st.projects ? ` · ${plural(st.projects, 'הגשה אחת', 'הגשות')}` : ''}</div>
        <div class="small">${next ? `הבא: <b>${H(next.title)}</b> – ${whenLabel(diffDays(TODAY_ISO, next.date))}` : 'אין מבחנים בחודשיים הקרובים'}</div>
        ${prepDone[1] ? prepBar(prepDone[0], prepDone[1], `הכנה למבחנים של ${KIDS[k].name}`) : ''}</div>`; }).join('')}
      ${appr ? `<button class="bubble c4" data-action="screen" data-screen="approve"><span class="lbl">לאישור שלך</span><b>${plural(appr, 'אירוע אחד', 'אירועים')}</b><span class="sub">לחצי כדי לאשר</span></button>` : ''}
    </div>
  </section>`;
}
function periodTitle() {
  const c = ui.view === 'month' ? ui.cursor : ui.sel;
  if (ui.view === 'month') return `${MONTHS[c.getMonth()]} <span class="yr">${c.getFullYear()}</span>`;
  if (ui.view === 'day') return longDate(c);
  const a = startOfWeek(c), b = addDays(a, 6);
  return a.getMonth() === b.getMonth()
    ? `<span class="tm" dir="ltr">${a.getDate()}–${b.getDate()}</span> ב${MONTHS[a.getMonth()]}`
    : `${a.getDate()} ב${MONTHS[a.getMonth()]} – ${b.getDate()} ב${MONTHS[b.getMonth()]}`;
}
function sourceNote() {
  if (!S.school) return `<p class="note">${I('info')}<span><b>מבחני דוגמה.</b> עדיין לא יובא לוח המבחנים של בית הספר, ולכן המבחנים כאן הומצאו לבדיקה.${isParent() ? ' אפשר לייבא את הקובץ במסך "לוח מבחנים".' : ''}</span></p>`;
  const d = new Date(S.school.importedAt);
  return `<p class="note" style="background:var(--surface);color:var(--muted);box-shadow:var(--shadow)">${I('table')}<span>המבחנים מלוח המבחנים של בית הספר, עדכון אחרון ${d.getDate()}.${d.getMonth() + 1} בשעה <span class="tm" dir="ltr">${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</span>.${S.showSamples ? ' שיעורי הבית ומטלות הבית עדיין לדוגמה.' : ''}</span></p>`;
}

function shellHTML() {
  const u = USERS[ui.user];
  const pending = S.requests.filter(r => r.status === 'pending').length;
  const rev = isParent() ? approvalItems().count + Object.values(S.pendingItems || {}).filter(p => p && p.status === 'open').length : 0;
  const tabs = isParent()
    ? [['cal','יומן','cal','יומן'],['practice','תרגול','study','תרגול'],['family','מרחב ההורים','chore','הורים'],['approve','לאישור הורה','approve','אישורים'],
       ['schedule','מערכת שעות וחוגים','clock','מערכת',1],['import','לוח מבחנים','table','מבחנים',1],['library','ספריית לימודים','search','ספרייה',1],['settings','הגדרות','gear','הגדרות',1]]
    : [['cal','יומן','cal','יומן'],['practice','תרגול','study','תרגול'],['schedule','מערכת שעות וחוגים','clock','מערכת']];
  const body = typeof V7_SCREENS !== 'undefined' && V7_SCREENS[ui.screen] ? V7_SCREENS[ui.screen]() : ui.screen === 'approve' ? approveHTML() : ui.screen === 'schedule' ? scheduleHTML() : ui.screen === 'import' ? importHTML() : ui.screen === 'settings' ? settingsHTML()
    : ui.screen === 'library' ? libraryHTML() : calendarHTML();
  return `<header class="top"><div class="wrap topbar">
      <div class="brand"><span class="mark">${I('cal')}</span><bdi>FAMILY SMART</bdi></div>
      <div class="top-actions">
        ${typeof cloudChip === 'function' ? cloudChip() : ''}
        ${isParent() ? `<button class="icon-btn" data-action="requests" aria-label="בקשות מהילדים">${I('bell')}${pending ? `<span class="badge">${pending}</span>` : ''}</button>` : ''}
        <button class="me" data-action="logout" aria-label="החלפת משתמש">${avatar(ui.user, 'sm')}<span><b>${u.name}</b><small>${u.sub || 'כיתה ' + gradeLabel(profile(u.kid).grade, profile(u.kid).cls)}</small></span><span class="swap">${I('swap')}החלפה</span></button>
      </div>
    </div>
    <div class="wrap"><nav class="nav" aria-label="מסכים">${tabs.map(([s, l, ic, sh, more]) => `<button class="${more ? 'more-tab' : ''}" data-action="screen" data-screen="${s}" aria-current="${ui.screen === s ? 'page' : 'false'}" aria-label="${l}">${I(ic)}<span class="lbl-long">${l}</span><span class="lbl-short">${sh}</span>${s === 'approve' && rev ? `<span class="dotn">${rev}</span>` : ''}</button>`).join('')}${isParent() ? `<button class="more-btn${tabs.some(t => t[4] && t[0] === ui.screen) ? ' on' : ''}" data-action="more" aria-label="עוד מסכים">${I('gear')}<span class="lbl-short">עוד</span></button>` : ''}</nav></div>
    </header>
    <main class="wrap">${body}</main>
    ${ui.screen === 'cal' ? `<button class="fab" data-action="add">${I('plus')}אירוע</button>` : ''}`;
}

function calendarHTML() {
  const views = [['month','חודש'],['week','שבוע'],['day','יום']];
  const body = ui.view === 'month' ? monthHTML() : ui.view === 'week' ? weekHTML() : dayHTML();
  return `${heroHTML()}
    <div class="toolbar">
      <div class="period">
        <button class="icon-btn" data-action="prev" aria-label="הקודם">${I('prev')}</button>
        <button class="icon-btn" data-action="next" aria-label="הבא">${I('next')}</button>
        <h2 aria-live="polite">${periodTitle()}</h2>
        <button class="today-btn" data-action="today">היום</button>
      </div>
      <div class="controls">
        <div class="seg" role="group" aria-label="תצוגה">${views.map(([v, l]) => `<button data-action="view" data-view="${v}" aria-pressed="${ui.view === v}">${l}</button>`).join('')}</div>
        ${isParent() ? kidSeg('kid', ui.kid, true) : ''}
      </div>
    </div>
    <div class="legend" role="group" aria-label="סינון לפי סוג – לחיצה מסתירה או מציגה">
      ${Object.keys(TYPES).map(t => `<button class="chip" style="${tv(t)}" data-action="type" data-type="${t}" aria-pressed="${!ui.hidden.has(t)}">${ICO(t)}${TYPES[t].label}</button>`).join('')}
    </div>
    <div class="certainty-legend" aria-label="מקרא ודאות">
      <span class="pill demo" style="${tv('exam')}">${I('check')}<span class="t">שיוך ודאי</span></span>
      <span class="pill demo pending" style="${tv('exam')}"><span class="t">? ממתין לאישור הורה</span></span>
      <span>אירוע שממתין לאישור לא מקבל תזכורות.</span>
    </div>
    ${sourceNote()}
    <section>${body}</section>`;
}
function kidSeg(action, cur, withBoth) {
  return `<div class="seg" role="group" aria-label="של מי">
    ${withBoth ? `<button data-action="${action}" data-kid="both" aria-pressed="${cur === 'both'}">שניהם</button>` : ''}
    <button data-action="${action}" data-kid="kid1" aria-pressed="${cur === 'kid1'}"><i class="kdot kid1"></i>${H(NM('kid1'))}</button>
    <button data-action="${action}" data-kid="kid2" aria-pressed="${cur === 'kid2'}"><i class="kdot kid2"></i>${H(NM('kid2'))}</button>
  </div>`;
}

/* ================= calendar views ================= */
function monthHTML() {
  const c = ui.cursor, y = c.getFullYear(), m = c.getMonth();
  const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
  const start = addDays(first, -first.getDay());
  const weeks = Math.ceil((first.getDay() + last.getDate()) / 7);
  const all = visible(), { spans, singles } = splitSpans(all);
  const map = byDate(singles.filter(e => (TYPES[e.type].month || e.important) && e.type !== 'activity'));
  const dayAll = byDate(singles.filter(e => e.type !== 'holiday' && !isOff(e)));
  const selIso = iso(ui.sel);
  const pillHTML = e => {
    const pend = isPending(e), sure = !pend && e.source === 'school' && EXAMISH.includes(e.type) && !isOff(e);
    return `<button class="pill${isOff(e) ? ' cancelled' : ''}${pend ? ' pending' : ''}" style="${tv(e.type)}" data-action="open" data-id="${H(e.id)}" title="${H(e.title)}${pend ? ' – ממתין לאישור הורה' : ''}">${sure ? I('check') : I(e.type)}<span class="t">${H(e.title)}</span>${pend ? '<span class="kl">?</span>' : ''}${isParent() && ui.kid === 'both' ? `<span class="kl">${e.owners.map(k => KIDS[k].initial).join('')}</span>` : ''}</button>`;
  };
  let grid = '';
  for (let w = 0; w < weeks; w++) {
    const ws = addDays(start, w * 7), wsI = iso(ws), weI = iso(addDays(ws, 6));
    const segs = spans.filter(sp => sp.date <= weI && sp.endDate >= wsI).map(sp => {
      const a = sp.date < wsI ? wsI : sp.date, b = sp.endDate > weI ? weI : sp.endDate;
      return { sp, col:parse(a).getDay() + 1, len:diffDays(a, b) + 1, cont:sp.date < wsI, more:sp.endDate > weI };
    }).sort((p, q) => p.col - q.col);
    const lanes = [];
    segs.forEach(g => { let l = lanes.findIndex(end => end < g.col); if (l < 0) { l = lanes.length; lanes.push(0); } lanes[l] = g.col + g.len - 1; g.lane = l; });
    let cells = '';
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i), ds = iso(d), evs = map[ds] || [];
      const off = spans.some(sp => covers(sp, ds)) || evs.some(e => e.type === 'holiday');
      const cls = ['mcell', d.getMonth() !== m && 'out', ds === TODAY_ISO && 'today', ds === selIso && 'sel', d.getDay() === 6 && 'sat', off && 'off', ds < TODAY_ISO && 'past'].filter(Boolean).join(' ');
      const minis = evs.filter(e => !isOff(e) && e.type !== 'holiday').slice(0, 2).map(e => `<span class="mini${isPending(e) ? ' pending' : ''}" style="${tv(e.type)}">${isPending(e) ? '?' : ''}${H(miniText(e))}</span>`).join('');
      const moreN = evs.filter(e => !isOff(e) && e.type !== 'holiday').length - 2;
      cells += `<div class="${cls}" role="button" tabindex="0" data-action="pick" data-date="${ds}" aria-label="${longDate(d)}${(dayAll[ds] || []).length ? ', ' + (dayAll[ds] || []).length + ' אירועים' : ''}">
        <span class="mtop"><span class="mnum">${d.getDate()}</span>${(dayAll[ds] || []).some(e => e.type === 'activity') ? '<i class="tdot" title="אימון"></i>' : ''}${(dayAll[ds] || []).length >= 3 ? `<span class="mcount" aria-hidden="true">${(dayAll[ds] || []).length}</span>` : ''}</span><span class="lane-space"></span>
        <span class="mpills">${evs.slice(0, 3).map(pillHTML).join('')}${evs.length > 3 ? `<span class="more">+${evs.length - 3} נוספים</span>` : ''}</span>
        <span class="mminis">${minis}${moreN > 0 ? `<span class="more">+${moreN}</span>` : ''}</span></div>`;
    }
    const bars = segs.map(g => `<button class="bar${g.cont ? ' cont' : ''}${g.more ? ' more' : ''}" style="${tv('holiday')};grid-column:${g.col} / span ${g.len};grid-row:${g.lane + 1}" data-action="open" data-id="${H(g.sp.id)}" title="${H(g.sp.title)} ${dm(g.sp.date)}–${dm(g.sp.endDate)}">${I('holiday')}<span class="t">${H(g.sp.title)}</span><span class="rng">${shortRange(g.sp.date, g.sp.endDate)}</span></button>`).join('');
    grid += `<div class="mweek" style="--lanes:${lanes.length}">${cells}${bars ? `<div class="mbars">${bars}</div>` : ''}</div>`;
  }
  const dayEvs = dayItems(selIso, all);
  return `${monthSummary(all, spans, singles, y, m)}
    <div class="month">
      <div class="mhead">${DAYS.map((n, i) => `<div><span class="short">${DSHORT[i]}</span><span class="long">${n}</span></div>`).join('')}</div>
      <div class="mweeks">${grid}</div>
    </div>
    <p class="small muted" style="margin:8px 4px 0">לחיצה על תאריך פותחת את כל אירועי היום. נקודה טורקיז = יום אימון.</p>
    <div style="margin-top:14px">${monthGlance(spans, singles, y, m)}</div>`;
}
// One line that answers "what does this month hold for me?" – confirmed items only, pending counted apart.
function monthSummary(all, spans, singles, y, m) {
  const pre = `${y}-${String(m + 1).padStart(2, '0')}`;
  const inM = singles.filter(e => e.date.startsWith(pre) && !isOff(e) && e.status !== 'missing');
  const conf = inM.filter(e => !isPending(e)), pend = inM.filter(e => isPending(e) && EXAMISH.includes(e.type));
  const n = t => conf.filter(e => e.type === t).length;
  const offDays = new Set([...inM.filter(e => e.type === 'holiday').map(e => e.date), ...spans.flatMap(sp => sp.items.map(x => x.date)).filter(d => d.startsWith(pre))]).size;
  const chips = [['exam','מבחנים','מבחן אחד'],['quiz','בחנים','בוחן אחד'],['project','עבודות','עבודה אחת'],['alt','הערכות חלופיות','הערכה חלופית אחת'],['event','אירועים','אירוע אחד']]
    .filter(([t]) => n(t) && !ui.hidden.has(t)).map(([t, many, one]) => `<span class="stat" style="${tv(t)}">${I(t)}${n(t) === 1 ? one : `<b>${n(t)}</b>${many}`}</span>`);
  if (offDays && !ui.hidden.has('holiday')) chips.push(`<span class="stat" style="${tv('holiday')}">${I('holiday')}<b>${offDays}</b>ימי חג וחופשה</span>`);
  if (pend.length) chips.push(`<span class="stat pending" style="${tv('rest')}">?<b>${pend.length}</b>ממתינים לאישור הורה</span>`);
  const who = isParent() ? (ui.kid === 'both' ? '' : ` של ${KIDS[ui.kid].name}`) : ' שלך';
  return `<div class="msum"><h3>${MONTHS[m]}${who} במבט אחד</h3><div class="summary" style="margin:0">${chips.length ? chips.join('') : '<span class="muted">אין מבחנים, הגשות או חופשות החודש.</span>'}</div></div>`;
}
// Everything important this month, week by week, without opening each day.
function monthGlance(spans, singles, y, m) {
  const pre = `${y}-${String(m + 1).padStart(2, '0')}`;
  const items = [
    ...singles.filter(e => e.date.startsWith(pre) && (EXAMISH.includes(e.type) || e.type === 'event' || e.type === 'holiday') && e.status !== 'missing'),
    ...spans.filter(sp => sp.date.startsWith(pre) || sp.endDate.startsWith(pre) || (sp.date < pre && sp.endDate > pre + '-31')),
  ].sort((a, b) => a.date.localeCompare(b.date) || sortEv(a, b));
  const groups = {};
  items.forEach(e => { const k = iso(startOfWeek(parse(e.date < pre + '-01' ? pre + '-01' : e.date))); (groups[k] ||= []).push(e); });
  const line = e => {
    const pend = isPending(e), past = (e.endDate || e.date) < TODAY_ISO, d = parse(e.date);
    const when = e.isSpan ? shortRange(e.date, e.endDate) : `${DSHORT[d.getDay()]} <span class="tm">${dm(e.date)}</span>`;
    return `<button class="gl${pend ? ' pending' : ''}${past ? ' past' : ''}${isOff(e) ? ' cancelled' : ''}" style="${tv(e.type)}" data-action="open" data-id="${H(e.id)}">
      <span class="d">${when}</span>${ICO(e.type)}<span class="t">${H(e.title)}</span>${pend ? '<span class="tag pend">? ממתין</span>' : e.isSpan ? `<span class="small">${spanLen(e)} ימים</span>` : ''}${isOff(e) ? '<span class="tag cancel">בוטל</span>' : ''}${kidBadge(e)}</button>`;
  };
  return `<div class="panel"><div class="panel-head"><h3>מה מחכה ב${MONTHS[m]}</h3><span class="small muted">מבחנים, הגשות, אירועים וחופשות</span></div>
    ${items.length ? `<div class="glance">${Object.keys(groups).sort().map(k => { const a = parse(k), b = addDays(a, 6);
      return `<div class="gweek"><h4>שבוע <span class="tm" dir="ltr">${dm(iso(a))}–${dm(iso(b))}</span>${k <= TODAY_ISO && iso(b) >= TODAY_ISO ? ' · השבוע' : ''}</h4><div class="rows">${groups[k].map(line).join('')}</div></div>`; }).join('')}</div>`
      : '<div class="empty">אין מבחנים, הגשות או אירועים החודש.</div>'}</div>`;
}

function weekHTML() {
  const a = startOfWeek(ui.sel), all = visible(), { spans, singles } = splitSpans(all), map = byDate(singles);
  const days = [...Array(7)].map((_, i) => addDays(a, i)), aI = iso(a), bI = iso(days[6]);
  const wspans = spans.filter(sp => sp.date <= bI && sp.endDate >= aI);
  const evs = days.flatMap(d => map[iso(d)] || []).filter(e => !isOff(e) && !isPending(e));
  const cnt = t => evs.filter(e => e.type === t).length;
  const doable = evs.filter(e => TYPES[e.type].doable), doneN = doable.filter(isDone).length;
  const stats = [['exam','מבחנים'],['quiz','בחנים'],['project','עבודות'],['alt','הערכות חלופיות'],['study','הכנה למבחן'],['homework','שיעורי בית'],['activity','חוגים'],['chore','בבית']]
    .filter(([t]) => cnt(t) && !ui.hidden.has(t))
    .map(([t, l]) => `<span class="stat" style="${tv(t)}">${I(t)}<b>${cnt(t)}</b>${l}</span>`).join('');
  return `<div class="summary">${stats}<span class="stat" style="${tv('rest')}">${I('check')}<b>${doneN}/${doable.length}</b>משימות בוצעו</span></div>
    ${wspans.length ? `<div class="wbanner">${wspans.map(sp => `<button class="bar" style="${tv('holiday')}" data-action="open" data-id="${H(sp.id)}">${I('holiday')}<span class="t">${H(sp.title)}</span><span class="rng">${shortRange(sp.date, sp.endDate)} · ${spanLen(sp)} ימים</span></button>`).join('')}</div>` : ''}
    <div class="week">${days.map(d => {
      const ds = iso(d), list = map[ds] || [], offDay = wspans.some(sp => covers(sp, ds));
      return `<div class="wday${ds === TODAY_ISO ? ' today' : ''}${d.getDay() === 6 ? ' sat' : ''}${offDay ? ' off' : ''}">
        <button class="whead" data-action="openday" data-date="${ds}"><b>${DAYS[d.getDay()]}</b><span>${ds === TODAY_ISO ? 'היום · ' : ''}${d.getDate()}.${d.getMonth() + 1}</span></button>
        ${offDay ? `<div class="small" style="color:var(--holiday-fg)">${I('holiday')} ${H(wspans.find(sp => covers(sp, ds)).title)}</div>` : ''}
        ${list.length ? `<div class="rows">${list.map(rowHTML).join('')}</div>` : `<div class="empty">${offDay ? 'יום חופש' : 'אין משימות – זמן פנוי'}</div>`}
      </div>`; }).join('')}</div>`;
}

function layoutTimed(evs) {
  const items = evs.map(e => { const s = toMin(e.start); return { e, s, en: e.end ? Math.max(toMin(e.end), s + 15) : s + 60 }; })
    .sort((a, b) => a.s - b.s || b.en - a.en);
  const clusters = []; let cur = [], curEnd = -1;
  for (const it of items) {
    if (cur.length && it.s >= curEnd) { clusters.push(cur); cur = []; curEnd = -1; }
    cur.push(it); curEnd = Math.max(curEnd, it.en);
  }
  if (cur.length) clusters.push(cur);
  for (const c of clusters) {
    const cols = [];
    for (const it of c) { let i = cols.findIndex(end => end <= it.s); if (i < 0) { i = cols.length; cols.push(0); } cols[i] = it.en; it.col = i; }
    c.forEach(it => it.n = cols.length);
  }
  return items;
}
function remindersFor(ds) {
  return visible().filter(e => (EXAMISH.includes(e.type) && e.type !== 'makeup' || e.type === 'event') && canRemind(e) && e.date >= ds && diffDays(ds, e.date) <= 7)
    .sort((a, b) => a.date.localeCompare(b.date) || sortEv(a, b));
}
function schoolBand(ds) {
  const kids = viewerKids(); if (kids.length !== 1) return null;
  const k = kids[0], d = parse(ds), day = (S.schedule[k] || {})[d.getDay()];
  if (!day || !day.end || d.getDay() === 6) return null;
  const off = allEvents().some(e => e.type === 'holiday' && e.date === ds && kidSees(e, k)); // uses the original school days
  return off ? null : { start:day.start || '08:00', end:day.end };
}

function dayHTML() {
  const ds = iso(ui.sel), list = dayItems(ds);
  const allday = list.filter(e => !e.start), timed = list.filter(e => e.start);
  const pendSoon = visible().filter(e => isPending(e) && !isOff(e) && e.date >= ds && diffDays(ds, e.date) <= 7);
  const H0 = 7, H1 = 22, hh = 56;
  const hours = [...Array(H1 - H0 + 1)].map((_, i) => `<div class="hour" style="top:${i * hh}px"><label class="tm" dir="ltr">${String(H0 + i).padStart(2, '0')}:00</label></div>`).join('');
  const blocks = layoutTimed(timed).map(it => {
    const s = Math.max(it.s, H0 * 60), en = Math.min(Math.max(it.en, s + 20), H1 * 60);
    const top = (s - H0 * 60) / 60 * hh, h = Math.max(26, (en - s) / 60 * hh);
    return `<div class="tev${h < 46 ? ' short' : ''}" style="top:${top}px;height:${h}px;inset-inline-start:calc(${it.col} * 100% / ${it.n});width:calc(100% / ${it.n})">${rowHTML(it.e)}</div>`;
  }).join('');
  const band = schoolBand(ds);
  const bandHTML = band ? (() => { const s = Math.max(toMin(band.start), H0 * 60), e = Math.min(toMin(band.end), H1 * 60); return e > s ? `<div class="school-band" style="top:${(s - H0 * 60) / 60 * hh}px;height:${(e - s) / 60 * hh}px"><span>בית הספר עד <span class="tm" dir="ltr">${band.end}</span></span></div>` : ''; })() : '';
  const now = new Date(), nm = now.getHours() * 60 + now.getMinutes();
  const nowLine = ds === TODAY_ISO && nm >= H0 * 60 && nm <= H1 * 60 ? `<div class="now" style="top:${(nm - H0 * 60) / 60 * hh}px" aria-label="עכשיו"></div>` : '';
  const doable = list.filter(e => !e.isSpan && TYPES[e.type].doable && !isOff(e)), doneN = doable.filter(isDone).length;
  const pct = doable.length ? Math.round(doneN / doable.length * 100) : 0;
  const rems = remindersFor(ds);
  return `<div class="day">
    <div class="timeline">
      ${allday.length ? `<div class="allday"><span class="allday-label">מבחנים, הגשות ואירועים של היום</span><div class="rows">${allday.map(itemRow).join('')}</div></div>` : ''}
      <div class="tl">${hours}${bandHTML}${blocks}${nowLine}</div>
    </div>
    <div class="side">
      <div class="panel">
        <div class="panel-head"><h3>המשימות שלי היום</h3><span class="tm">${doneN}/${doable.length}</span></div>
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
        <div class="rows">${doable.length ? doable.map(rowHTML).join('') : '<div class="empty">אין משימות לסמן היום.</div>'}</div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>תזכורות</h3><span class="small muted">7 הימים הקרובים</span></div>
        ${pendSoon.length ? `<div class="small muted">${plural(pendSoon.length, 'אירוע אחד', 'אירועים')} בשבוע הקרוב ${pendSoon.length === 1 ? 'ממתין' : 'ממתינים'} לאישור הורה, ולכן ${pendSoon.length === 1 ? 'אין עליו' : 'אין עליהם'} תזכורת.</div>` : ''}
        ${rems.length ? rems.map(e => `<button class="rem" style="${tv(e.type)}" data-action="open" data-id="${H(e.id)}"><span class="when">${whenLabel(diffDays(ds, e.date))}</span><span class="t">${H(e.title)}${isParent() && ui.kid === 'both' ? ' · ' + e.owners.map(k => KIDS[k].name).join(', ') : ''}</span></button>`).join('') : '<div class="empty">אין מבחנים או הגשות בשבוע הקרוב.</div>'}
      </div>
    </div>
  </div>`;
}

/* ================= schedule screen ================= */
const BLOCK_KINDS = { activity:'חוג', training:'אימון', other:'אחר' };
function scheduleHTML() {
  const k = isParent() ? ui.schedKid : USERS[ui.user].kid;
  const sch = S.schedule[k] || {}, canEdit = isParent();
  const total = Object.values(sch).reduce((n, d) => n + ((d && d.blocks) || []).length, 0);
  const days = [0, 1, 2, 3, 4, 5, 6].map(dow => {
    const day = sch[dow] || {}, blocks = (day.blocks || []).slice().sort((a, b) => a.start.localeCompare(b.start));
    const school = dow <= 5 ? `<div class="schoolrow">${I('clock')}<span>לימודים</span>
        <span class="pair"><label class="small muted" for="sc-s-${dow}">מ־</label><input id="sc-s-${dow}" type="time" data-sched="start" data-dow="${dow}" value="${H(day.start || '')}" ${canEdit ? '' : 'disabled'}></span>
        <span class="pair"><label class="small muted" for="sc-e-${dow}">עד</label><input id="sc-e-${dow}" type="time" data-sched="end" data-dow="${dow}" value="${H(day.end || '')}" ${canEdit ? '' : 'disabled'}></span>
      </div>` : '<div class="small muted">שבת – אין לימודים</div>';
    return `<div class="dcard${TODAY.getDay() === dow ? ' today' : ''}">
      <h3>יום ${DAYS[dow]}${TODAY.getDay() === dow ? '<span class="tag new">היום</span>' : ''}</h3>
      ${school}
      ${blocks.map(b => `<div class="blk ${b.kind}">${I('activity')}<span class="bt"><b>${H(b.title)}</b><span>${BLOCK_KINDS[b.kind]} · <span class="tm" dir="ltr">${b.start}–${b.end}</span>${b.place ? ' · ' + H(b.place) : ''}</span></span>
        ${canEdit ? `<button class="icon-btn" data-action="editblock" data-dow="${dow}" data-bid="${b.id}" aria-label="עריכת ${H(b.title)}">${I('edit')}</button><button class="icon-btn" data-action="delblock" data-dow="${dow}" data-bid="${b.id}" aria-label="מחיקת ${H(b.title)}">${I('trash')}</button>` : ''}</div>`).join('')}
      ${canEdit ? `<button class="addblk" data-action="addblock" data-dow="${dow}">${I('plus')}הוספת חוג או אימון</button>` : (blocks.length ? '' : '<div class="small muted">אין חוגים ביום הזה</div>')}
    </div>`;
  }).join('');
  return `<div class="screen-head">
      <h1>מערכת שעות וחוגים${isParent() ? '' : ' שלי'}</h1>
      <p>${canEdit ? 'כאן מזינים לכל ילד את שעות הלימודים, החוגים והאימונים בכל יום. מה שמוזן כאן מופיע אוטומטית ביומן, בכל שבוע.' : 'את המערכת מעדכנים ההורים. מה שכתוב כאן מופיע ביומן שלך בכל שבוע.'}</p>
    </div>
    ${isParent() ? `<div class="toolbar" style="padding-top:0">${kidSeg('schedkid', k, false)}<span class="small muted">${total ? plural(total, 'חוג אחד מוזן', 'חוגים ואימונים מוזנים') : 'עדיין לא הוזנו חוגים'}</span></div>` : ''}
    <div class="days">${days}</div>`;
}

/* ================= import screen ================= */
function importHTML() {
  const sc = S.school, pv = ui.preview, revs = reviewItems();
  let status;
  if (!sc) status = `<div class="callout warn">עדיין לא יובא לוח מבחנים. ביומן מוצגים מבחני דוגמה.</div>`;
  else {
    const d = new Date(sc.importedAt), active = sc.events.filter(e => e.status !== 'cancelled');
    status = `<div class="statgrid">
      <div class="statbox"><b>${active.length}</b><span>אירועים מהלוח</span></div>
      ${Object.keys(KIDS).map(k => `<div class="statbox"><b>${active.filter(e => kidSees(e, k)).length}</b><span>שויכו ל${KIDS[k].name}</span></div>`).join('')}
      <div class="statbox"><b>${revs.length}</b><span>ממתינים לבדיקה</span></div>
    </div>
    <div class="small muted">ייבוא אחרון: ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} · קובץ: ${H(sc.fileName)} · ייבואים עד היום: ${(sc.runs || []).length}</div>`;
  }
  return `<div class="screen-head">
      <h1>לוח המבחנים של בית הספר</h1>
      <p>מעלים את קובץ ה־Excel של לוח המבחנים. האפליקציה מזהה לכל ילד את המבחנים, הבחנים, ההגשות והאירועים שלו, ומסמנת מה חדש, מה הוזז ומה בוטל מאז הייבוא הקודם.</p>
    </div>
    <div class="grid2">
      <div class="card"><h3>מצב נוכחי</h3>${status}</div>
      <div class="card">
        <h3>ייבוא קובץ</h3>
        <div class="drop">
          ${I('upload')}
          <div><b>בחירת קובץ Excel</b><div class="small muted">הקובץ נקרא רק בתוך הדפדפן במכשיר הזה. הוא לא נשלח לשום מקום.</div></div>
          <label class="btn filebtn">${I('upload')}בחירת קובץ<input id="xlsx-file" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-file="xlsx"></label>
        </div>
      </div>
    </div>
    ${pv ? `<div style="margin-top:14px">${previewHTML(pv)}</div>` : ''}
    ${revs.length && !pv ? `<div class="callout warn" style="margin-top:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span><b>${approvalItems().count} אירועים ממתינים לאישור שלך.</b></span><button class="btn" data-action="screen" data-screen="approve">${I('approve')}למסך האישור</button></div>` : ''}
    ${sc ? `<details class="fold" style="margin-top:14px"><summary>${I('shield')}איך מזוהים שינויים?</summary><div class="fold-body small" style="line-height:1.7">
      בגיליון של בית הספר אין מספר קבוע לכל מבחן. לכן כל אירוע מקבל אצלנו מספר קבוע משלו כשהוא מופיע בפעם הראשונה, ובכל ייבוא האפליקציה משווה את הגיליון לגרסה הקודמת:
      <ul><li>אותו אירוע ובאותו יום – ללא שינוי.</li><li>אותו מקצוע ואותו סוג ביום אחר – "הוזז", והתאריך הקודם נשמר בהיסטוריה. כשיש כמה מבחנים דומים, הם מותאמים לפי הסדר שלהם, ורק אם השינוי קטן מ־45 יום.</li>
      <li>אירוע שכתוב לידו "בוטל" – מסומן מיד "בוטל".</li><li>אירוע שנעלם מהגיליון – "ייתכן שבוטל". רק אם הוא חסר גם בבדיקה הבאה הוא מסומן "בוטל". אירוע לא נמחק אף פעם.</li>
      <li>אם בבת אחת נעלמים יותר מ־30% מהמבחנים העתידיים, הייבוא נעצר ושום דבר לא משתנה, כי כנראה מבנה הגיליון השתנה.</li></ul></div></details>` : ''}`;
}
function reasonNo(e, k) {
  const p = profile(k), a = e.audience.find(x => x.grade === p.grade);
  if (!a) return 'שכבה אחרת';
  if (a.classes !== 'all' && !a.classes.includes(p.cls)) return `מיועד ל־${a.classes.map(c => gradeLabel(a.grade, c)).join(', ')}`;
  if (e.group) return e.group === 'science' ? 'מיועד לכיתות מדעיות' : 'מיועד לכיתות רגילות';
  return '';
}
function previewHTML(pv) {
  if (pv.loading) return `<div class="card"><h3>קורא את הקובץ…</h3><p class="muted" style="margin:0">${H(pv.fileName)}</p></div>`;
  if (pv.error) return `<div class="callout no"><b>לא הצלחתי לקרוא את הקובץ.</b> ${H(pv.error)}</div>`;
  const { parsed, rec } = pv;
  if (rec.aborted) return `<div class="callout no"><b>הייבוא נעצר.</b> ${H(rec.reason)}</div>`;
  const evs = rec.events, hasPrev = !!S.school;
  const per = k => evs.filter(e => kidResult(e, k) === 'yes').sort((a, b) => a.date.localeCompare(b.date));
  const revN = evs.filter(e => e.status !== 'cancelled' && Object.keys(KIDS).some(k => kidResult(e, k) === 'review')).length;
  const kinds = { exam:'מבחן', quiz:'בוחן', project:'עבודה / פרויקט', alt:'הערכה חלופית', makeup:'מועד ב׳', holiday:'חג / חופשה', event:'אירוע' };
  const typeCount = Object.keys(kinds).map(kd => [kd, evs.filter(e => e.kind === kd).length]).filter(x => x[1]);
  const CH = { created:'חדש', dateChanged:'הוזז', cancelled:'בוטל', missing:'ייתכן שבוטל', detailsChanged:'פרטים עודכנו', textChanged:'נוסח עודכן', restored:'חזר ללוח' };
  const changes = hasPrev ? rec.changes : [];
  const table = (rows, cols) => `<div class="tablewrap"><table class="t"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  const kidTable = k => table(per(k).map(e => { const m = matchInfo(e, k); return `<tr><td class="num">${dm(e.date)} ${DSHORT[parse(e.date).getDay()]}</td><td><span class="tag" style="${tv(KIND2TYPE[e.kind])};background:var(--bg-t);color:var(--fg-t)">${kinds[e.kind]}</span></td><td>${H(e.subjects.join(', ') || '—')}</td><td>${H(e.title)}${e.status === 'cancelled' ? ' <span class="tag cancel">בוטל</span>' : ''}</td><td class="small">${H(m.reason)}${!m.certain && !decided(e, k) ? ' <span class="tag moved">לא ודאי</span>' : ''}</td><td class="small muted">${H(e.where.sheet)} · ${e.where.cell}</td></tr>`; }), ['תאריך','סוג','מקצוע','מה כתוב בלוח','סיבת השיוך','מיקום בקובץ']);
  const notFor = k => { const p = profile(k); return evs.filter(e => e.grade === p.grade && kidResult(e, k) === 'no').sort((a, b) => a.date.localeCompare(b.date)); };
  const notTable = k => table(notFor(k).map(e => `<tr><td class="num">${dm(e.date)}</td><td>${H(e.title)}</td><td class="small">${H(matchInfo(e, k).reason)}</td></tr>`), ['תאריך','מה כתוב בלוח','למה לא שויך']);
  return `<div class="card">
    <h3>תצוגה מקדימה – ${H(pv.fileName)}</h3>
    <p class="small muted" style="margin:0">עדיין לא נשמר כלום. בודקים, ואז לוחצים "שמירה ביומן".</p>
    <div class="statgrid">
      <div class="statbox"><b>${evs.length}</b><span>אירועים ב־${parsed.coveredMonths.length} חודשים</span></div>
      ${Object.keys(KIDS).map(k => `<div class="statbox"><b>${per(k).length}</b><span>ל${KIDS[k].name} (${gradeLabel(profile(k).grade, profile(k).cls)})</span></div>`).join('')}
      <div class="statbox"><b>${revN}</b><span>לבדיקה שלך</span></div>
    </div>
    <div class="small muted">סוגים: ${typeCount.map(([kd, n]) => `${kinds[kd]} ${n}`).join(' · ')}${parsed.issues.length ? ` · <b>הערות קריאה:</b> ${parsed.issues.map(i => H(i.sheet + ': ' + i.problem)).join('; ')}` : ''}</div>
    ${hasPrev ? `<div class="callout ${changes.length ? 'warn' : 'ok'}"><b>${changes.length ? `${changes.length} שינויים מאז הייבוא הקודם` : 'אין שינויים מאז הייבוא הקודם.'}</b>
      ${changes.length ? `<ul style="margin:6px 0 0;padding-inline-start:18px">${changes.slice(0, 40).map(c => `<li>${CH[c.type] || c.type}: ${H(c.title)} – ${dm(c.date)}${c.type === 'dateChanged' ? ` (היה ${dm(c.from)})` : ''}</li>`).join('')}</ul>` : ''}</div>` : ''}
    ${Object.keys(KIDS).map(k => `<details class="fold"><summary><span class="kb ${k}">${KIDS[k].initial}</span>מה שויך ל${KIDS[k].name} (${per(k).length})</summary><div class="fold-body">${kidTable(k)}</div></details>
      <details class="fold"><summary>אירועים של שכבת ${profile(k).grade}׳ שלא שויכו ל${KIDS[k].name} (${notFor(k).length})</summary><div class="fold-body">${notTable(k)}</div></details>`).join('')}
    <div class="actions"><button class="btn" data-action="apply-import">${I('check')}שמירה ביומן</button><button class="btn ghost" data-action="cancel-import">ביטול</button></div>
  </div>`;
}

/* ================= parent approval ================= */
function approveHTML() {
  const { match, moves } = approvalItems();
  const unsure = match.filter(x => x.m.result === 'yes'), unknown = match.filter(x => x.m.result === 'review');
  const kinds = { exam:'מבחן', quiz:'בוחן', project:'עבודה / פרויקט', alt:'הערכה חלופית', makeup:'מועד ב׳', holiday:'חג / חופשה', event:'אירוע' };
  const item = ({ e, k, m }, shown) => `<div class="review" style="${tv(e.type)}">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="kb ${k}">${KIDS[k].initial}</span><b>${H(e.title)}</b><span class="tag" style="background:var(--bg-t);color:var(--fg-t)">${kinds[FSCore.classify(e.title).kind] || ''}</span></div>
      <div class="small">${longDate(parse(e.date))} · ${H(e.where.sheet)}, תא ${e.where.cell}</div>
      <div class="small muted">${H(m.reason)}</div>
      <div class="small">${shown ? `כרגע <b>מוצג</b> ביומן של ${KIDS[k].name} עם התגית "לא ודאי".` : `כרגע <b>לא מוצג</b> ביומן של ${KIDS[k].name}.`}</div>
      <div class="actions"><button class="btn" data-action="decide-review" data-id="${H(e.id)}" data-kid="${k}" data-val="yes">${I('check')}כן, זה של ${KIDS[k].name}</button><button class="btn ghost" data-action="decide-review" data-id="${H(e.id)}" data-kid="${k}" data-val="no">לא של ${KIDS[k].name}</button></div>
    </div>`;
  const decidedList = schoolEvents().flatMap(e => Object.keys(KIDS).filter(k => decided(e, k)).map(k => ({ e, k, v:S.reviewDecisions[e.id][k] })));
  return `<div class="screen-head"><h1>לאישור הורה</h1><p>כאן מופיעים אירועים שהמערכת לא בטוחה לגביהם. שום דבר לא נקבע בניחוש. ההחלטה שלך נשמרת, וגם בייבואים הבאים לא תצטרכי להחליט שוב.</p></div>
    ${typeof v7ApproveExtra === 'function' ? v7ApproveExtra() : ''}
    ${!S.school ? `<div class="callout warn">עדיין לא יובא לוח מבחנים. ייבאי אותו במסך "לוח מבחנים".</div>` : ''}
    ${S.school && !match.length && !moves.length ? `<div class="callout ok"><b>אין כרגע מה לאשר.</b> כל האירועים שויכו בוודאות.</div>` : ''}
    ${moves.length ? `<div class="card" style="margin-bottom:14px"><h3>ייתכן שמבחן הוזז (${moves.length})</h3>
      <p class="small muted" style="margin:0">כמה מבחנים עם תיאור זהה זזו באותו עדכון, ולכן אי אפשר לדעת בוודאות איזה עבר לאיזה תאריך. התאריכים החדשים כבר מופיעים ביומן. כאן רק קובעים אם זה אותו מבחן, כדי לשמור את ההיסטוריה ואת הסימונים שלו.</p>
      ${moves.map(({ o, cands }) => `<div class="review"><div><b>${H(o.title)}</b> – היה ב${longDate(parse(o.date))}</div>
        <div class="actions">${cands.map(n => `<button class="btn" data-action="confirm-move" data-old="${H(o.id)}" data-new="${H(n.id)}">${I('check')}הוזז ל־${dm(n.date)}</button>`).join('')}
        ${cands.map(n => `<button class="btn ghost" data-action="reject-move" data-old="${H(o.id)}" data-new="${H(n.id)}">${dm(n.date)} הוא מבחן אחר</button>`).join('')}</div></div>`).join('')}
    </div>` : ''}
    ${unknown.length ? `<div class="card" style="margin-bottom:14px"><h3>לא ידוע אם שייך (${unknown.length})</h3>${unknown.map(x => item(x, false)).join('')}</div>` : ''}
    ${unsure.length ? `<div class="card" style="margin-bottom:14px"><h3>כנראה שייך, אבל כדאי לוודא (${unsure.length})</h3>
      <p class="small muted" style="margin:0">מבחנים במקצוע שמתחלק למסלולים, שלא כתוב בהם מסלול או כיתה. כדי שלא יפוספס מבחן, הם מוצגים ביומן עד שתחליטי.</p>${unsure.map(x => item(x, true)).join('')}</div>` : ''}
    ${decidedList.length ? `<details class="fold"><summary>החלטות שכבר קיבלת (${decidedList.length})</summary><div class="fold-body"><div class="rows">
      ${decidedList.map(({ e, k, v }) => `<div class="review"><div><span class="kb ${k}" style="display:inline-grid">${KIDS[k].initial}</span> <b>${H(e.title)}</b> · ${dm(e.date)} – ${v === 'yes' ? 'שייך' : 'לא שייך'}</div><div class="actions"><button class="btn ghost" data-action="undo-review" data-id="${H(e.id)}" data-kid="${k}">ביטול ההחלטה</button></div></div>`).join('')}
    </div></div></details>` : ''}`;
}

/* ================= library (plan) ================= */
function libraryHTML() {
  const steps = [
    ['את בוחרת תיקיות', `רק תיקיות שתאשרי במפורש ייסרקו. בשום שלב לא משתפים עם ${NM('kid1')} את התיקייה של ${NM('kid2')}.`],
    ['סריקה ומיון', 'כל קובץ מסווג לפי מקצוע, כיתה ונושא, ומקבל אחד משלושה מצבים: "חומר לימוד נקי", "אישי" או "לא בטוח".'],
    ['הגנה על מידע אישי', `קבצים עם ציון, בדיקה, הערות מורה, תעודה, שם של ${NM('kid2')}, או תמונה של מבחן שנבדק – מסומנים "אישי" ולא מוצגים ל${NM('kid1')}. כל מה שלא ברור נכנס ל"ממתין לאישור ${NM('par1')}".`],
    ['עותק נקי, לא שיתוף', `קובץ שאושר מועתק לתיקייה חדשה, "ספרייה – ל${NM('kid1')}", ורק התיקייה החדשה משותפת עם ${NM('kid1')} לצפייה. בעותק אין היסטוריית שינויים, אין הערות, והוא לא מראה איפה הקובץ המקורי נמצא.`],
    ['"מצא לי חומר למבחן"', 'בכל מבחן ביומן יופיע כפתור שמציע חומרים מאושרים באותו מקצוע ובאותה שכבה, לפי התאמה לנושא.'],
  ];
  return `<div class="screen-head"><h1>ספריית לימודים מ־Google Drive</h1><p>תכנון בלבד – עדיין לא מחובר, ושום תיקייה לא נסרקה.</p></div>
    <div class="grid2">
      <div class="card"><h3>איך זה יעבוד</h3>${steps.map(([t, d], i) => `<div style="display:flex;gap:10px"><span class="statbox" style="padding:4px 10px;align-self:start"><b style="font-size:18px">${i + 1}</b></span><div><b>${t}</b><div class="small muted" style="line-height:1.6">${d}</div></div></div>`).join('')}</div>
      <div class="card"><h3>מה יוצג ל${H(NM('kid1'))} ומה לא</h3>
        <div class="callout ok"><b>יוצג (אחרי אישור):</b> סיכומים, דפי עבודה ריקים, מצגות, חוברות תרגול, מבחנים ריקים מהשנים הקודמות.</div>
        <div class="callout no"><b>לא יוצג:</b> מבחנים בדוקים עם ציון, משובים והערות מורים, תעודות, עבודות אישיות של ${H(NM('kid2'))}, וכל קובץ שעליו שמו של ${H(NM('kid2'))}.</div>
        <div class="callout"><b>לא בטוח?</b> הקובץ ממתין לאישור שלך ולא מוצג לאף אחד.</div>
        <p class="small muted" style="margin:0">כדאי לשאול גם את ${H(NM('kid2'))} אם הוא מסכים שחומרים שלו ישמשו את ${H(NM('kid1'))}.</p>
      </div>
    </div>`;
}

/* ================= settings ================= */
function settingsHTML() {
  const sel = (id, val, opts, attrs) => `<select id="${id}" ${attrs}>${opts.map(([v, l]) => `<option value="${v}" ${String(val) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
  const kidCard = k => { const p = profile(k); return `<div class="card"><h3><span class="kb ${k}" style="display:inline-grid;vertical-align:middle">${KIDS[k].initial}</span> ${KIDS[k].name}</h3>
    <div class="setrow">
      <div class="field"><label for="pf-${k}-grade">שכבה</label>${sel(`pf-${k}-grade`, p.grade, [['','לבחור…'],['ז','ז׳'],['ח','ח׳'],['ט','ט׳'],['י','י׳']], `data-prof="grade" data-kid="${k}"`)}</div>
      <div class="field"><label for="pf-${k}-cls">כיתה</label><input id="pf-${k}-cls" type="number" min="1" max="15" value="${p.cls ?? ''}" data-prof="cls" data-kid="${k}"></div>
    </div>
    <div class="setrow">
      <div class="field"><label for="pf-${k}-math">מתמטיקה</label>${sel(`pf-${k}-math`, p.tracks.math || '', [['regular','מסלול רגיל'],['science','כיתה מדעית'],['','לא ידוע']], `data-prof="math" data-kid="${k}"`)}</div>
      <div class="field"><label for="pf-${k}-sci">"כיתות מדעיות" (למשל פרויקט מדעי המחשב)</label>${sel(`pf-${k}-sci`, p.scienceClass == null ? '' : p.scienceClass ? 'yes' : 'no', [['','לא ידוע – לשאול אותי'],['no','לא בכיתה מדעית'],['yes','כן, בכיתה מדעית']], `data-prof="sci" data-kid="${k}"`)}</div>
    </div>
    <div class="field"><label for="pf-${k}-eng">מסלול אנגלית (לא חובה)</label><input id="pf-${k}-eng" value="${H(p.tracks.english || '')}" placeholder="יעודכן בהמשך" data-prof="english" data-kid="${k}"></div>
  </div>`; };
  return `<div class="screen-head"><h1>הגדרות</h1><p>הפרטים כאן קובעים אילו מבחנים מהלוח שייכים לכל ילד. השינויים נשמרים מיד.</p></div>
    <div class="grid2">${kidCard('kid1')}${kidCard('kid2')}</div>
    ${typeof v7SettingsExtra === 'function' ? v7SettingsExtra() : ''}
    <div class="grid2" style="margin-top:14px">
      <div class="card"><h3>נתוני דוגמה</h3>
        <div class="checks"><label><input id="show-samples" type="checkbox" data-setting="samples" ${S.showSamples ? 'checked' : ''}> להציג שיעורי בית ומטלות בית לדוגמה</label></div>
        <p class="small muted" style="margin:0">כשתזיני משימות אמיתיות, אפשר לכבות את הדוגמאות.</p>
      </div>
      <div class="card"><h3>גיבויים במכשיר הזה</h3>
        <p class="small muted" style="margin:0">לפני כל ייבוא, עדכון גרסה, איפוס או שחזור, נשמר כאן אוטומטית עותק של הנתונים. נשמרים 5 העותקים האחרונים.</p>
        ${listBackups().length ? listBackups().map((b, i) => { const d = new Date(b.at); return `<div class="review"><div><b>${H(b.reason)}</b></div><div class="small muted">${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} בשעה <span class="tm" dir="ltr">${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</span></div>
          ${ui.confirmRestore === i ? `<div class="inline-confirm"><b>לשחזר? המצב הנוכחי יישמר קודם כגיבוי.</b><button class="btn" data-action="restore-yes" data-i="${i}">כן, לשחזר</button><button class="btn ghost" data-action="restore-no">לא</button></div>` : `<div><button class="btn ghost" data-action="restore" data-i="${i}">שחזור למצב הזה</button></div>`}</div>`; }).join('') : '<div class="empty">עדיין אין גיבויים. הגיבוי הראשון ייווצר לפני הייבוא הבא.</div>'}
      </div>
      <div class="card"><h3>איפוס</h3>
        <p class="small muted" style="margin:0">מוחק מהמכשיר הזה את הלוח שיובא, את מערכת השעות, הסימונים והבקשות.</p>
        ${ui.confirmReset ? `<div class="inline-confirm"><b>בטוח?</b><button class="btn danger" data-action="reset-yes">כן, למחוק</button><button class="btn ghost" data-action="reset-no">לא</button></div>` : `<div><button class="btn ghost" data-action="reset">איפוס נתוני המכשיר</button></div>`}
      </div>
    </div>`;
}

/* ================= dialogs ================= */
function eventSheet(e) {
  const t = TYPES[e.type], done = t.doable && isDone(e), r = lastReq(e.id);
  const kids = e.owners.map(k => `${KIDS[k].name} (${gradeLabel(profile(k).grade, profile(k).cls)})`).join(', ');
  const src = e.source === 'school' ? `לוח המבחנים של בית הספר · לשונית ${H(e.where.sheet)}, תא ${e.where.cell}`
    : e.source === 'sample' ? 'נתוני דוגמה – לא נלקח מבית הספר'
    : e.source === 'schedule' ? 'מערכת השעות והחוגים' : e.source === 'plan' ? 'תוכנית ההכנה האישית (נבנית אוטומטית מהמבחנים והאימונים)'
    : `נוסף ללוח על ידי ${H(USERS[e.addedBy]?.name || 'בן משפחה')}${e.owner === 'family' ? ' · לוח משפחתי' : ''}`;
  let reqBlock = '';
  if (r) {
    const what = r.kind === 'postpone' ? `לדחות ל${longDate(parse(r.date))}` : r.kind === 'time' ? `להזיז לשעה ${r.start}` : 'שינוי אחר';
    const st = { pending:['warn','ממתינה לאישור'], approved:['ok','אושרה'], declined:['no','לא אושרה'] }[r.status];
    reqBlock = `<div class="callout ${st[0]}"><b>בקשה ${st[1]}:</b> ${what}${r.reason ? ` – "${H(r.reason)}"` : ''}
      ${isParent() && r.status === 'pending' ? `<div class="actions" style="margin-top:8px"><button class="btn" data-action="approve" data-rid="${r.id}">${I('check')}אישור</button><button class="btn danger" data-action="decline" data-rid="${r.id}">דחייה</button></div>` : ''}</div>`;
  }
  const statusBlock = e.status === 'cancelled' ? `<div class="callout no"><b>בוטל.</b> ${H((e.history || []).slice(-1)[0]?.why || '')}</div>`
    : e.status === 'missing' ? `<div class="callout warn"><b>ייתכן שבוטל.</b> האירוע לא הופיע בייבוא האחרון. אם הוא יהיה חסר גם בייבוא הבא, הוא יסומן כמבוטל.</div>` : '';
  const HN = { created:'נוסף ללוח', dateChanged:'הוזז', cancelled:'בוטל', missing:'לא הופיע בלוח', detailsChanged:'הפרטים עודכנו', textChanged:'הנוסח עודכן', restored:'חזר ללוח' };
  const hist = e.source === 'school' && e.history && e.history.length ? `<details class="fold"><summary>היסטוריית שינויים (${e.history.length})</summary><div class="fold-body"><ul class="hist">
    ${e.history.map(h => { const d = new Date(h.at); return `<li><span>${d.getDate()}.${d.getMonth() + 1}</span><span>${HN[h.type] || h.type}${h.type === 'dateChanged' ? `: מ־${dm(h.from)} ל־${dm(h.to)}` : h.from && h.type !== 'dateChanged' ? `: "${H(h.from)}" ← "${H(h.to)}"` : ''}</span></li>`; }).join('')}
  </ul></div></details>` : '';
  const canRequest = !isParent() && !t.school && !(r && r.status === 'pending');
  const examish = EXAMISH.includes(e.type) && !isOff(e);
  return `<div class="sheet-top"><span class="chip" style="${tv(e.type)}">${I(e.type)}${H(typeLabel(e))}</span>${changeTag(e)}<button class="icon-btn" data-action="close" aria-label="סגירה" style="margin-inline-start:auto">${I('x')}</button></div>
    <h2>${H(e.title)}</h2>
    ${statusBlock}
    ${e.source === 'school' && EXAMISH.includes(e.type) && !isOff(e) ? (isPending(e)
      ? `<div class="callout warn"><b>? ממתין לאישור הורה.</b> לא בטוח שהאירוע הזה שייך ל${e.owners.map(k => KIDS[k].name).join(' ול')}, ולכן אין עליו תזכורות עד שהורה יאשר.</div>`
      : `<div class="callout ok">${I('check')} <b>שיוך ודאי.</b> ${H(e.owners.map(k => decided(e, k) ? 'אושר על ידי הורה' : matchInfo(e, k).reason).join(' · '))}</div>`) : ''}
    <dl class="facts">
      <div><dt>תאריך</dt><dd>${longDate(parse(e.date))}</dd></div>
      <div><dt>שעה</dt><dd>${timeHTML(e)}${e.source === 'school' && !e.start ? ' <span class="small muted">(השעה לא מופיעה בלוח)</span>' : ''}</dd></div>
      ${e.subjects && e.subjects.length ? `<div><dt>מקצוע</dt><dd>${H(e.subjects.join(', '))}</dd></div>` : ''}
      ${e.details ? `<div><dt>פרטים</dt><dd>${H(e.details)}</dd></div>` : ''}
      ${e.audience ? `<div><dt>מיועד ל</dt><dd>${audText(e.audience)}${e.group ? (e.group === 'regular' ? ' · כיתות רגילות' : ' · כיתות מדעיות') : ''}</dd></div>` : ''}
      ${isParent() ? `<div><dt>של</dt><dd>${kids}</dd></div>` : ''}
      ${isParent() && e.source === 'school' ? e.owners.map(k => `<div><dt>למה ${KIDS[k].name}</dt><dd>${decided(e, k) ? 'אושר על ידי הורה' : H(matchInfo(e, k).reason)}</dd></div>`).join('') : ''}
    </dl>
    ${prepSection(e)}
    ${typeof v7EventExtras === 'function' ? v7EventExtras(e) : ''}
    ${hist}
    ${reqBlock}
    ${t.school && !isParent() && examish ? `<div class="callout">את המועד הזה קובע בית הספר, ולכן אי אפשר לבקש כאן לדחות אותו. אפשר לבקש עזרה בתכנון ההכנה.</div>` : ''}
    <div class="actions">
      ${t.doable && !isOff(e) ? `<button class="btn${done ? ' soft' : ' ghost'}" data-action="toggle" data-id="${H(e.id)}">${I('check')}${done ? 'בטל סימון' : 'סמן כבוצע'}</button>` : ''}
      ${canRequest ? `<button class="btn ghost" data-action="request" data-id="${H(e.id)}">${I('clock')}בקשת שינוי או דחייה</button>` : ''}
    </div>
    <div class="src">${I('info')}<span>מקור: ${src}</span></div>`;
}
function prepSection(e) {
  if (!['exam','quiz','project','alt'].includes(e.type) || isOff(e) || e.date < TODAY_ISO) return '';
  const steps = prepSteps(e), title = (e.type === 'project' || e.type === 'alt') ? 'ההתקדמות בהגשה' : 'ההכנה למבחן';
  if (!isParent()) {
    const k = USERS[ui.user].kid, p = prepState(e, k);
    return `<div class="card" style="box-shadow:none;background:transparent;padding:0;gap:8px"><h3>${title}</h3>${prepBar(p.done, p.n, title)}
      <ul class="steps">${steps.map((s, i) => `<li><button data-action="prep" data-id="${H(e.id)}" data-i="${i}" aria-pressed="${!!p.st[i]}"><span class="box">${I('check')}</span><span>${H(s)}</span></button></li>`).join('')}</ul></div>`;
  }
  return `<div class="card" style="box-shadow:none;background:transparent;padding:0;gap:8px"><h3>${title}</h3>${e.owners.map(k => { const p = prepState(e, k); return `<div class="small"><b>${KIDS[k].name}</b></div>${prepBar(p.done, p.n, `${title} – ${KIDS[k].name}`)}`; }).join('')}
    <p class="small muted" style="margin:0">הילדים מסמנים את שלבי ההכנה בעצמם.</p></div>`;
}
function spanSheet(sp) {
  return `<div class="sheet-top"><span class="chip" style="${tv('holiday')}">${I('holiday')}חג / חופשה</span><button class="icon-btn" data-action="close" aria-label="סגירה" style="margin-inline-start:auto">${I('x')}</button></div>
    <h2>${H(sp.title)}</h2>
    <dl class="facts">
      <div><dt>מתי</dt><dd>מ${longDate(parse(sp.date))}<br>עד ${longDate(parse(sp.endDate))}</dd></div>
      <div><dt>משך</dt><dd>${spanLen(sp)} ימים</dd></div>
      ${isParent() ? `<div><dt>של</dt><dd>${sp.owners.map(k => KIDS[k].name).join(', ')}</dd></div>` : ''}
    </dl>
    <details class="fold"><summary>התאריכים המקוריים בלוח של בית הספר (${sp.items.length})</summary><div class="fold-body"><ul class="hist">
      ${sp.items.map(x => `<li><span>${DSHORT[parse(x.date).getDay()]} ${dm(x.date)}</span><span>${H(x.title)}${x.where ? ` · לשונית ${H(x.where.sheet)}, תא ${x.where.cell}` : ''}</span></li>`).join('')}
    </ul></div></details>
    <div class="src">${I('info')}<span>ביומן מוצג כאירוע אחד. בלוח של בית הספר כל יום רשום בנפרד, וכך הוא נשמר אצלנו.</span></div>`;
}
function materialsSheet(e) {
  const k = (e.owners || [])[0], p = k ? profile(k) : null;
  return `<div class="sheet-top"><h2>חומר למבחן</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <p style="margin:0">${H(e.title)} · ${longDate(parse(e.date))}</p>
    <div class="callout warn"><b>ספריית הלימודים עדיין לא מחוברת.</b> כשנחבר אותה, יופיעו כאן חומרים מאושרים${e.subjects && e.subjects.length ? ` ב${H(e.subjects.join(', '))}` : ''}${p ? ` לשכבת ${p.grade}׳` : ''}: סיכומים, דפי עבודה ומבחנים ריקים משנים קודמות.</div>
    ${k === 'kid1' ? `<p class="small muted" style="margin:0">ל${H(NM('kid1'))} יוצעו גם חומרים מהשנה הקודמת של ${H(NM('kid2'))}, אבל רק עותקים נקיים שאושרו. בלי ציונים, בלי הערות מורים ובלי מידע אישי.</p>` : ''}
    <div class="actions"><button class="btn soft" data-action="open" data-id="${H(e.id)}">חזרה לפרטי המבחן</button></div>`;
}
function requestSheet(e) {
  const tomorrow = iso(addDays(parse(e.date), 1));
  return `<div class="sheet-top"><h2>בקשת שינוי</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <p style="margin:0;color:var(--muted)">${H(e.title)} · ${longDate(parse(e.date))}</p>
    <form class="f" id="reqform" data-id="${H(e.id)}">
      <fieldset class="field"><legend>מה לבקש?</legend>
        <div class="radios">
          <label><input type="radio" name="kind" value="postpone" checked> לדחות ליום אחר</label>
          <label><input type="radio" name="kind" value="time"> לשנות שעה</label>
          <label><input type="radio" name="kind" value="other"> משהו אחר</label>
        </div>
      </fieldset>
      <div class="two">
        <div class="field"><label for="rq-date">יום חדש</label><input id="rq-date" type="date" name="date" value="${tomorrow}"></div>
        <div class="field"><label for="rq-time">שעה חדשה</label><input id="rq-time" type="time" name="start" value="${e.start || '17:00'}"></div>
      </div>
      <div class="field"><label for="rq-reason">למה? (כדי שההורים יבינו)</label><textarea id="rq-reason" name="reason" placeholder="למשל: יש לי אימון ארוך באותו יום"></textarea></div>
      <button class="btn" type="submit">שליחה להורים</button>
    </form>`;
}
function addSheet() {
  const types = isParent() ? ['homework','study','chore','rest','exam','quiz','project','alt','event'] : ['homework','study','chore','rest'];
  return `<div class="sheet-top"><h2>הוספה ליומן</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <p class="small muted" style="margin:0">חוגים ואימונים קבועים מוסיפים במסך "מערכת שעות וחוגים".</p>
    <form class="f" id="addform">
      <div class="field"><label for="ad-title">מה זה?</label><input id="ad-title" name="title" required placeholder="למשל: לסדר את התיק לטיול"></div>
      <div class="two">
        <div class="field"><label for="ad-type">סוג</label><select id="ad-type" name="type">${types.map(t => `<option value="${t}">${TYPES[t].label}</option>`).join('')}</select></div>
        ${isParent() ? `<div class="field"><label for="ad-kid">בשביל</label><select id="ad-kid" name="owner">${kidOptions()}</select></div>` : '<div></div>'}
      </div>
      <div class="field"><label for="ad-date">תאריך</label><input id="ad-date" type="date" name="date" value="${iso(ui.sel)}" required></div>
      <div class="two">
        <div class="field"><label for="ad-start">משעה (לא חובה)</label><input id="ad-start" type="time" name="start"></div>
        <div class="field"><label for="ad-end">עד שעה</label><input id="ad-end" type="time" name="end"></div>
      </div>
      <div class="field"><label for="ad-details">פרטים</label><textarea id="ad-details" name="details"></textarea></div>
      <p class="err" id="ad-err" hidden></p>
      <button class="btn" type="submit">${I('plus')}הוספה</button>
    </form>`;
}
function blockSheet(m) {
  const k = ui.schedKid, b = m.bid ? (S.schedule[k][m.dow].blocks || []).find(x => x.id === m.bid) : null;
  return `<div class="sheet-top"><h2>${b ? 'עריכת חוג או אימון' : 'הוספת חוג או אימון'} – ${KIDS[k].name}</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    <form class="f" id="blockform">
      <div class="field"><label for="bk-title">שם</label><input id="bk-title" name="title" required value="${H(b ? b.title : '')}" placeholder="למשל: אימון כדורסל"></div>
      <fieldset class="field"><legend>סוג</legend><div class="radios">${Object.entries(BLOCK_KINDS).map(([v, l]) => `<label><input type="radio" name="kind" value="${v}" ${(b ? b.kind : 'activity') === v ? 'checked' : ''}> ${l}</label>`).join('')}</div></fieldset>
      <fieldset class="field"><legend>${b ? 'יום' : 'באילו ימים? (אפשר כמה)'}</legend><div class="checks">${DAYS.map((d, i) => `<label><input type="${b ? 'radio' : 'checkbox'}" name="days" value="${i}" ${i === m.dow ? 'checked' : ''}> ${d}</label>`).join('')}</div></fieldset>
      <div class="two">
        <div class="field"><label for="bk-start">משעה</label><input id="bk-start" type="time" name="start" required value="${b ? b.start : ''}"></div>
        <div class="field"><label for="bk-end">עד שעה</label><input id="bk-end" type="time" name="end" required value="${b ? b.end : ''}"></div>
      </div>
      <div class="field"><label for="bk-place">מקום (לא חובה)</label><input id="bk-place" name="place" value="${H(b ? b.place || '' : '')}"></div>
      <div class="field"><label for="bk-notes">הערות (לא חובה)</label><input id="bk-notes" name="notes" value="${H(b ? b.notes || '' : '')}" placeholder="למשל: להביא בגדי ספורט"></div>
      <p class="err" id="bk-err" hidden></p>
      <button class="btn" type="submit">${I('check')}שמירה</button>
    </form>`;
}
function requestsSheet() {
  const list = [...S.requests].sort((a, b) => (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1) || b.createdAt - a.createdAt);
  const st = { pending:'ממתינה', approved:'אושרה', declined:'נדחתה' };
  return `<div class="sheet-top"><h2>בקשות מהילדים</h2><button class="icon-btn" data-action="close" aria-label="סגירה">${I('x')}</button></div>
    ${list.length ? list.map(r => {
      const e = findEvent(r.eventId);
      const what = r.kind === 'postpone' ? `לדחות ל${longDate(parse(r.date))}` : r.kind === 'time' ? `להזיז לשעה ${r.start}` : 'שינוי אחר';
      return `<div class="reqitem"><div class="who">${avatar(r.kid, 'sm')}${KIDS[r.kid].name}<span class="st">${st[r.status]}</span></div>
        <div><b>${H(e ? e.title : 'פריט שנמחק')}</b> – ${what}</div>
        ${r.reason ? `<div style="color:var(--muted)">"${H(r.reason)}"</div>` : ''}
        ${r.status === 'pending' ? `<div class="actions"><button class="btn" data-action="approve" data-rid="${r.id}">${I('check')}אישור</button><button class="btn danger" data-action="decline" data-rid="${r.id}">דחייה</button></div>` : ''}
      </div>`; }).join('') : '<div class="empty">אין בקשות כרגע.</div>'}`;
}
function renderModal() {
  const root = document.getElementById('modal'), m = ui.modal;
  if (!m) { root.innerHTML = ''; return; }
  let html = '';
  if (m.kind === 'event' || m.kind === 'materials' || m.kind === 'request') {
    const e = findEvent(m.id); if (!e) { ui.modal = null; root.innerHTML = ''; return; }
    html = m.kind === 'event' ? (e.isSpan ? spanSheet(e) : eventSheet(e)) : m.kind === 'materials' ? materialsSheet(e) : requestSheet(e);
  }
  if (m.kind === 'add') html = addSheet();
  if (m.kind === 'requests') html = requestsSheet();
  if (m.kind === 'block') html = blockSheet(m);
  if (typeof V7_SHEETS !== 'undefined' && V7_SHEETS[m.kind]) html = V7_SHEETS[m.kind](m);
  const reopen = !root.firstChild;
  root.innerHTML = `<div class="scrim" data-action="scrim"><div class="sheet sheet-${m.kind}" role="dialog" aria-modal="true" tabindex="-1">${html}</div></div>`;
  if (reopen) root.querySelector('.sheet').focus();
}
function render() {
  CACHE = null;
  document.documentElement.dataset.kid = ui.user ? (USERS[ui.user].kid || 'parent') : 'none';
  const gate = window.FSWeb && window.FSWeb.gateHTML();   // web version: connect this device first
  document.getElementById('app').innerHTML = gate || (ui.user ? shellHTML() : pickerHTML());
  renderModal();
}
let toastT;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 3400);
}

/* ================= import ================= */
function loadXLSX() {
  if (window.XLSX) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = res; s.onerror = () => rej(new Error('לא הצלחתי לטעון את רכיב קריאת ה־Excel. בדקי את החיבור לאינטרנט ונסי שוב.'));
    document.head.appendChild(s);
  });
}
async function handleFile(file) {
  if (!file) return;
  ui.preview = { loading:true, fileName:file.name }; render();
  try {
    await loadXLSX();
    const wb = XLSX.read(await file.arrayBuffer(), { cellStyles:true });
    const parsed = FSCore.parseGrid(FSCore.fromSheetJS(XLSX, wb));
    if (!parsed.events.length) throw new Error('לא נמצאו בקובץ לשוניות במבנה של לוח המבחנים (שורת כותרת עם "שכבה ח׳" ו"שכבה ט׳").');
    const now = new Date().toISOString();
    const rec = FSCore.reconcile(S.school ? S.school.events : [], parsed.events, { now, runId:now, today:TODAY_ISO, coveredMonths:parsed.coveredMonths });
    ui.preview = { fileName:file.name, parsed, rec, now };
  } catch (err) {
    ui.preview = { error:err.message || String(err) };
  }
  render();
}
function applyImport() {
  const pv = ui.preview; if (!pv || !pv.rec || pv.rec.aborted) return;
  const prev = S.school;
  backupNow(prev ? 'לפני עדכון לוח המבחנים' : 'לפני הייבוא הראשון');
  S.school = {
    events:pv.rec.events, importedAt:pv.now, fileName:pv.fileName,
    coveredMonths:[...new Set([...(prev ? prev.coveredMonths : []), ...pv.parsed.coveredMonths])].sort(),
    firstRun:prev ? prev.firstRun : pv.now,
    runs:[...(prev ? prev.runs || [] : []), { at:pv.now, file:pv.fileName, changes:prev ? pv.rec.changes.length : 0, events:pv.rec.events.length }].slice(-30),
  };
  ui.preview = null; save(); render();
  toast(prev ? `הלוח עודכן (${pv.rec.changes.length} שינויים)` : 'לוח המבחנים נשמר ביומן');
}

/* ================= actions ================= */
function shift(dir) {
  if (ui.view === 'month') { ui.cursor = new Date(ui.cursor.getFullYear(), ui.cursor.getMonth() + dir, 1); ui.sel = ui.cursor.getMonth() === TODAY.getMonth() && ui.cursor.getFullYear() === TODAY.getFullYear() ? TODAY : ui.cursor; }
  else { ui.sel = addDays(ui.sel, dir * (ui.view === 'week' ? 7 : 1)); ui.cursor = ui.sel; }
}
function decide(rid, status) {
  const r = S.requests.find(x => x.id === rid); if (!r) return;
  r.status = status; r.decidedBy = ui.user;
  if (status === 'approved') {
    const e = findEvent(r.eventId);
    if (e && r.kind === 'postpone' && r.date) S.overrides[e.id] = { ...(S.overrides[e.id] || {}), date:r.date };
    if (e && r.kind === 'time' && r.start) {
      const dur = e.start && e.end ? toMin(e.end) - toMin(e.start) : 60;
      S.overrides[e.id] = { ...(S.overrides[e.id] || {}), start:r.start, end:fromMin(Math.min(toMin(r.start) + dur, 23 * 60 + 59)) };
    }
  }
  save(); render();
  toast(status === 'approved' ? 'הבקשה אושרה והיומן עודכן' : 'הבקשה נדחתה');
}
const newBlockId = () => 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);

const actions = {
  login: el => { ui.user = el.dataset.user; ui.kid = 'both'; ui.screen = 'cal'; ui.sel = ui.cursor = TODAY; ui.preview = null; render(); window.scrollTo(0, 0); },
  logout: () => { ui.user = null; ui.modal = null; render(); },
  screen: el => { ui.screen = el.dataset.screen; ui.confirmReset = false; render(); window.scrollTo(0, 0); },
  view: el => { ui.view = S.view = el.dataset.view; if (ui.view === 'month') ui.cursor = ui.sel; save(); render(); },
  kid: el => { ui.kid = el.dataset.kid; render(); },
  schedkid: el => { ui.schedKid = el.dataset.kid; render(); },
  type: el => { const t = el.dataset.type; ui.hidden.has(t) ? ui.hidden.delete(t) : ui.hidden.add(t); render(); },
  prev: () => { shift(-1); render(); },
  next: () => { shift(1); render(); },
  today: () => { ui.sel = ui.cursor = TODAY; render(); },
  pick: el => { const d = parse(el.dataset.date); ui.sel = d; if (d.getMonth() !== ui.cursor.getMonth()) ui.cursor = new Date(d.getFullYear(), d.getMonth(), 1); render(); },
  goday: () => { ui.view = S.view = 'day'; save(); render(); window.scrollTo(0, 0); },
  openday: el => { ui.sel = parse(el.dataset.date); ui.view = S.view = 'day'; save(); render(); window.scrollTo(0, 0); },
  open: el => { ui.modal = { kind:'event', id:el.dataset.id }; renderModal(); },
  prep: el => {
    const e = findEvent(el.dataset.id); if (!e) return;
    const k = USERS[ui.user].kid, key = prepKey(e, k), n = prepSteps(e).length;
    S.prep = S.prep || {};
    const st = (S.prep[key] || []).slice(); st.length = n; st[+el.dataset.i] = !st[+el.dataset.i];
    S.prep[key] = Array.from(st, Boolean); save(); render();
    if (S.prep[key].every(Boolean)) toast('הכנה מלאה – כל הכבוד!');
  },
  materials: el => { ui.modal = { kind:'materials', id:el.dataset.id }; renderModal(); },
  toggle: el => { const e = findEvent(el.dataset.id); if (!e) return; const now = !isDone(e); S.done[e.id] = now; save(); render(); if (now) toast('כל הכבוד! סומן כבוצע'); },
  request: el => { ui.modal = { kind:'request', id:el.dataset.id }; renderModal(); },
  add: () => { ui.modal = { kind:'add' }; renderModal(); },
  requests: () => { ui.modal = { kind:'requests' }; renderModal(); },
  approve: el => decide(el.dataset.rid, 'approved'),
  decline: el => decide(el.dataset.rid, 'declined'),
  close: () => { ui.modal = null; renderModal(); },
  scrim: (el, ev) => { if (ev.target === el) { ui.modal = null; renderModal(); } },
  'apply-import': () => applyImport(),
  'cancel-import': () => { ui.preview = null; render(); },
  'undo-review': el => { const d = S.reviewDecisions[el.dataset.id]; if (d) delete d[el.dataset.kid]; save(); render(); toast('ההחלטה בוטלה'); },
  'confirm-move': el => {
    const o = el.dataset.old, n = el.dataset.new;
    backupNow('לפני אישור הזזת מבחן');
    S.school.events = FSCore.confirmMove(S.school.events, o, n, { by:ui.user });
    if (S.done[n] != null && S.done[o] == null) S.done[o] = S.done[n];
    if (S.reviewDecisions[n] && !S.reviewDecisions[o]) S.reviewDecisions[o] = S.reviewDecisions[n];
    save(); render(); toast('נשמר: זה אותו מבחן, ההיסטוריה נשמרה');
  },
  'reject-move': el => { S.school.events = FSCore.rejectMove(S.school.events, el.dataset.old, el.dataset.new); save(); render(); toast('נשמר: אלה מבחנים שונים'); },
  'decide-review': el => { (S.reviewDecisions[el.dataset.id] ||= {})[el.dataset.kid] = el.dataset.val; save(); render(); toast('נשמר'); },
  addblock: el => { ui.modal = { kind:'block', dow:+el.dataset.dow }; renderModal(); },
  editblock: el => { ui.modal = { kind:'block', dow:+el.dataset.dow, bid:el.dataset.bid }; renderModal(); },
  delblock: el => { const d = S.schedule[ui.schedKid][el.dataset.dow]; d.blocks = d.blocks.filter(b => b.id !== el.dataset.bid); save(); render(); toast('נמחק'); },
  restore: el => { ui.confirmRestore = +el.dataset.i; render(); },
  'restore-no': () => { ui.confirmRestore = null; render(); },
  'restore-yes': el => {
    const b = listBackups()[+el.dataset.i]; if (!b) return;
    backupNow('לפני שחזור');
    try { S = normalizeState(JSON.parse(b.data)); S.dataVersion = DATA_VERSION; } catch (e) { toast('הגיבוי פגום ולא שוחזר'); return; }
    ui.confirmRestore = null; save(); render(); toast('הנתונים שוחזרו מהגיבוי');
  },
  reset: () => { ui.confirmReset = true; render(); },
  'reset-no': () => { ui.confirmReset = false; render(); },
  'reset-yes': () => { backupNow('לפני איפוס'); const keepView = S.view; S = { dataVersion:DATA_VERSION, done:{}, added:[], requests:[], overrides:{}, view:keepView, school:null, reviewDecisions:{}, profiles:JSON.parse(JSON.stringify(DEFAULT_PROFILES)), schedule:{ kid1:{}, kid2:{} }, names:S.names || {}, showSamples:true }; ui.confirmReset = false; save(); render(); toast('נתוני המכשיר אופסו'); },
};

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (fn) fn(el, ev);
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && ui.modal) { ui.modal = null; renderModal(); return; }
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[role="button"][data-action]')) { ev.preventDefault(); ev.target.click(); }
});
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.dataset.file === 'xlsx') { handleFile(el.files && el.files[0]); el.value = ''; return; }
  if (el.dataset.sched) {
    const k = ui.schedKid, dow = el.dataset.dow;
    S.schedule[k][dow] = { blocks:[], ...(S.schedule[k][dow] || {}), [el.dataset.sched]:el.value };
    save(); CACHE = null; toast('נשמר'); return;
  }
  if (el.dataset.prof) {
    const p = profile(el.dataset.kid), f = el.dataset.prof;
    if (f === 'grade') p.grade = el.value;
    if (f === 'cls') { const n = parseInt(el.value, 10); if (n > 0) p.cls = n; }
    if (f === 'math') p.tracks.math = el.value || null;
    if (f === 'english') p.tracks.english = el.value.trim();
    if (f === 'sci') p.scienceClass = el.value === '' ? null : el.value === 'yes';
    save(); render(); toast('נשמר'); return;
  }
  if (el.dataset.setting === 'samples') { S.showSamples = el.checked; save(); render(); }
});
document.addEventListener('submit', ev => {
  ev.preventDefault();
  const f = ev.target, fd = new FormData(f), data = Object.fromEntries(fd);
  if (f.id === 'reqform') {
    const e = findEvent(f.dataset.id);
    S.requests.push({ id:'r' + Date.now(), eventId:e.id, kid:USERS[ui.user].kid, kind:data.kind, date:data.kind === 'postpone' ? data.date : null,
      start:data.kind === 'time' ? data.start : null, reason:(data.reason || '').trim(), status:'pending', createdAt:Date.now() });
    save(); ui.modal = { kind:'event', id:e.id }; render();
    toast('הבקשה נשלחה להורים');
  }
  if (f.id === 'addform') {
    const err = document.getElementById('ad-err'), title = (data.title || '').trim();
    if (!title) { err.textContent = 'צריך לכתוב מה להוסיף.'; err.hidden = false; return; }
    if (data.start && data.end && data.end <= data.start) { err.textContent = 'שעת הסיום צריכה להיות אחרי שעת ההתחלה.'; err.hidden = false; return; }
    const owner = isParent() ? data.owner : USERS[ui.user].kid;
    S.added.push({ id:'m' + Date.now(), type:data.type, owner, date:data.date, start:data.start || null, end:data.start ? (data.end || null) : null,
      title, details:(data.details || '').trim(), source:'manual', addedBy:ui.user });
    save();
    ui.sel = parse(data.date); ui.cursor = new Date(ui.sel.getFullYear(), ui.sel.getMonth(), 1); ui.modal = null;
    ui.hidden.delete(data.type);
    render(); toast('נוסף ליומן');
  }
  if (f.id === 'blockform') {
    const err = document.getElementById('bk-err'), title = (data.title || '').trim(), days = fd.getAll('days').map(Number);
    const fail = msg => { err.textContent = msg; err.hidden = false; };
    if (!title) return fail('צריך לכתוב שם.');
    if (!days.length) return fail('צריך לבחור לפחות יום אחד.');
    if (!data.start || !data.end) return fail('צריך למלא שעת התחלה ושעת סיום.');
    if (data.end <= data.start) return fail('שעת הסיום צריכה להיות אחרי שעת ההתחלה.');
    const k = ui.schedKid, m = ui.modal, sch = S.schedule[k];
    const block = { title, kind:data.kind || 'activity', start:data.start, end:data.end, place:(data.place || '').trim(), notes:(data.notes || '').trim() };
    if (m.bid) {
      const from = sch[m.dow]; from.blocks = from.blocks.filter(b => b.id !== m.bid);
      const to = days[0]; sch[to] = { blocks:[], ...(sch[to] || {}) }; sch[to].blocks = [...(sch[to].blocks || []), { ...block, id:m.bid }];
    } else {
      for (const d of days) { sch[d] = { blocks:[], ...(sch[d] || {}) }; sch[d].blocks = [...(sch[d].blocks || []), { ...block, id:newBlockId() }]; }
    }
    ui.modal = null; save(); render(); toast('נשמר במערכת השעות');
  }
});

render();
