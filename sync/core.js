/**
 * FamilySmart core – shared by the app (browser) and, later, the Google Apps Script sync.
 * Plain JavaScript, no dependencies, no network, no personal data.
 *
 *  1. parseGrid(sheets)        → school events read from the exam calendar grid
 *  2. matchKid(event, kid)      → 'yes' | 'no' | 'review'
 *  3. reconcile(prev, parsed)   → stable event IDs, date changes, cancellations, history
 *
 * Input format for parseGrid (built from Excel by SheetJS, or from Apps Script getValues/getBackgrounds):
 *   sheets = [{ name, rows: [[{ v, bg, strike }, ...], ...], merges: [{ r1, c1, r2, c2 }] }]
 *   v = string | { y, m, d } for dates. Rows and columns are 0-based.
 */
var FSCore = (function () {
  'use strict';

  /* ---------------- text helpers ---------------- */
  function clean(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function noQuotes(s) { return s.replace(/[׳'`’"״]/g, ''); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function isoOf(d) { return d.y + '-' + pad(d.m) + '-' + pad(d.d); }

  var GRADE_LETTERS = 'זחטי';

  /* ---------------- classification ---------------- */
  // Order matters: "מועד ב׳ במתמטיקה" is a make-up exam even though it contains "מבחן"-like words.
  var KIND_RULES = [
    { kind: 'makeup',  label: 'מועד ב׳',       re: /מועד(י)?\s*ב/ },
    { kind: 'alt',     label: 'הערכה חלופית',  re: /הערכה\s*חלופית/ },
    { kind: 'project', label: 'מטלת ביצוע',    re: /מטלת\s*ביצוע|מטלה/ },
    { kind: 'project', label: 'פרויקט',        re: /פרו?י?יקט/ },
    { kind: 'project', label: 'עבודה',         re: /עבוד(ה|ת)/ },
    { kind: 'quiz',    label: 'בוחן',          re: /בוחן|מבדק/ },
    { kind: 'exam',    label: 'מבחן',          re: /מבחן/ },
    { kind: 'holiday', label: 'חג / חופשה',    re: /חופש|(^|\s)חג(\s|$)|ראש השנה|כיפור|סוכות|חנוכה|פסח|פורים|שבועות|ט"?ו בשבט|יום בחירות|גשר בין/ },
  ];
  // Fill colours used in the school sheet's legend → kind (used only to double-check the text).
  var COLOR_KINDS = {
    'FF00FF': 'exam',
    'FFD966': 'quiz', 'FFE599': 'quiz',
    'B6D7A8': 'alt', '93C47D': 'alt',   // the school uses the same green for projects too
    '6FA8DC': 'makeup', '6D9EEB': 'makeup', '3D85C6': 'makeup',
    'CFE2F3': 'holiday',
  };
  var SUBJECTS = [
    ['מדעי המחשב', /מדעי\s*ה?מחשב/],
    ['מתמטיקה', /מתמטיקה|מתמ(?![א-ת])/],
    ['אנגלית', /אנגלית/],
    ['היסטוריה', /היסטוריה/],
    ['תנ״ך', /תנ"?ך|תנך/],
    ['עברית', /עברית/],
    ['ספרות', /ספרות/],
    ['גיאוגרפיה', /גי?אוגרפיה/],
    ['כימיה/פיזיקה', /כימיה|פיזיקה/],
    ['ביולוגיה', /ביולוגיה/],
    ['מדעים', /מדעים/],
    ['אזרחות', /אזרחות/],
    ['ערבית', /ערבית/],
    ['יזמות', /יזמות/],
  ];

  function classify(text, bg) {
    var t = clean(text), k = null;
    for (var i = 0; i < KIND_RULES.length; i++) if (KIND_RULES[i].re.test(t)) { k = KIND_RULES[i]; break; }
    var kind = k ? k.kind : 'event', label = k ? k.label : 'אירוע בית־ספרי';
    var colorKind = bg ? COLOR_KINDS[String(bg).replace(/^#|^FF(?=[0-9A-F]{6}$)/i, '').toUpperCase()] || null : null;
    var subjects = [];
    SUBJECTS.forEach(function (s) { if (s[1].test(t) && subjects.indexOf(s[0]) < 0) subjects.push(s[0]); });
    if (subjects.indexOf('מדעי המחשב') >= 0) subjects = subjects.filter(function (s) { return s !== 'מדעים'; });
    var group = null;
    if (/ללא\s*מדעי(ת|ות)|כיתות\s*רגילות|(^|\s)רגילות/.test(t)) group = 'regular';
    else if (/מדעיות|מדעית(?![א-ת])/.test(t)) group = 'science';
    var cancelled = /בוטל|מבוטל|נדחה(?!\s*ל)/.test(t);
    return { kind: kind, label: label, colorKind: colorKind, colorMismatch: !!(colorKind && colorKind !== kind && kind !== 'event' && !(colorKind === 'alt' && kind === 'project')),
             subjects: subjects, group: group, cancelledText: cancelled };
  }

  /* ---------------- audience (which classes) ---------------- */
  // Returns [{grade, classes:'all'|[n...]}] found in the text, or [] if none.
  function audienceInText(text) {
    var s = noQuotes(clean(text)).replace(/שכבתית|שכבתי|כיתות|כיתה|שכבת|שכבה/g, ' ');
    var out = [], m;
    var re = /(^|[^א-ת])([זחטי])(?![א-ת])\s*-?\s*((?:\d+\s*(?:[-–,\/ו]|\s)\s*)*\d+)?/g;
    while ((m = re.exec(s))) {
      var g = m[2], nums = m[3];
      if (!nums) { out.push({ grade: g, classes: 'all' }); continue; }
      var cls = [];
      nums.split(/\s*[,\/ו ]\s*/).forEach(function (part) {
        var r = part.split(/\s*[-–]\s*/).map(Number);
        if (r.length === 2 && r[0] <= r[1] && r[1] - r[0] < 15) { for (var i = r[0]; i <= r[1]; i++) cls.push(i); }
        else r.forEach(function (n) { if (!isNaN(n) && n > 0) cls.push(n); });
      });
      out.push({ grade: g, classes: cls });
    }
    // merge entries of the same grade: "ח'2, ח'6, ח'8"
    var merged = {};
    out.forEach(function (a) {
      if (!merged[a.grade]) merged[a.grade] = { grade: a.grade, classes: a.classes === 'all' ? 'all' : a.classes.slice() };
      else if (merged[a.grade].classes !== 'all') {
        if (a.classes === 'all') merged[a.grade].classes = 'all';
        else a.classes.forEach(function (c) { if (merged[a.grade].classes.indexOf(c) < 0) merged[a.grade].classes.push(c); });
      }
    });
    return Object.keys(merged).map(function (g) { var a = merged[g]; if (a.classes !== 'all') a.classes.sort(function (x, y) { return x - y; }); return a; });
  }

  /* ---------------- grid → events ---------------- */
  function cellVal(c) { return c && c.v != null ? c.v : null; }
  function isDate(v) { return v && typeof v === 'object' && v.y; }

  function parseGrid(sheets) {
    var events = [], issues = [], covered = {}; // covered: months present in the file ("2026-10")
    sheets.forEach(function (sh) {
      var rows = sh.rows || [];
      // expand merged cells: every cell in a merged range gets the top-left value (remember the range)
      var mergeOf = {};
      (sh.merges || []).forEach(function (mg) {
        var src = (rows[mg.r1] || [])[mg.c1];
        for (var r = mg.r1; r <= mg.r2; r++) for (var c = mg.c1; c <= mg.c2; c++) {
          if (!rows[r]) rows[r] = [];
          if (r !== mg.r1 || c !== mg.c1) rows[r][c] = src ? { v: src.v, bg: src.bg, strike: src.strike } : null;
          mergeOf[r + ':' + c] = mg;
        }
      });
      // header row: cells like "שכבה ח'"
      var header = -1, gradeCols = {}, notesCol = -1;
      for (var r = 0; r < Math.min(rows.length, 15) && header < 0; r++) {
        (rows[r] || []).forEach(function (c, ci) {
          var v = cellVal(c); if (typeof v !== 'string') return;
          var m = noQuotes(clean(v)).match(/^שכבה\s*([זחטי])$/);
          if (m) { gradeCols[ci] = m[1]; header = r; }
        });
      }
      if (header < 0) { issues.push({ sheet: sh.name, problem: 'לא נמצאה שורת כותרת עם "שכבה ח׳"/"שכבה ט׳" – הלשונית דולגה' }); return; }
      (rows[header] || []).forEach(function (c, ci) { if (/הערות/.test(String(cellVal(c) || ''))) notesCol = ci; });
      var gcols = Object.keys(gradeCols).map(Number);
      var lastDate = null, seen = {};
      for (r = header + 1; r < rows.length; r++) {
        var row = rows[r] || [];
        var dv = cellVal(row[0]);
        if (isDate(dv)) lastDate = dv;
        var hasContent = gcols.some(function (ci) { return clean(cellVal(row[ci])); });
        if (!hasContent) continue;
        if (!lastDate) { issues.push({ sheet: sh.name, row: r + 1, problem: 'יש תוכן בלי תאריך' }); continue; }
        var date = isoOf(lastDate);
        covered[date.slice(0, 7)] = true;
        // group identical text across grade columns when it comes from one merged cell (holiday spanning all grades)
        gcols.forEach(function (ci) {
          var cell = row[ci], text = clean(cellVal(cell));
          if (!text) return;
          var mg = mergeOf[r + ':' + ci];
          var key = date + '|' + text + '|' + (mg ? mg.r1 + ':' + mg.c1 : 'g' + ci);
          var cls = classify(text, cell && cell.bg);
          var colGrade = gradeCols[ci];
          if (seen[key]) { // same merged block → add this grade to the existing event
            var ev = seen[key];
            if (!ev.audience.some(function (a) { return a.grade === colGrade; })) ev.audience.push({ grade: colGrade, classes: 'all' });
            return;
          }
          var inText = audienceInText(text).filter(function (a) { return a.grade === colGrade; });
          var other = audienceInText(text).filter(function (a) { return a.grade !== colGrade; });
          var audience = inText.length ? inText : [{ grade: colGrade, classes: 'all' }];
          var ev2 = {
            date: date, grade: colGrade, title: text, kind: cls.kind, label: cls.label, subjects: cls.subjects, group: cls.group,
            audience: audience, cancelled: !!(cls.cancelledText || (cell && cell.strike)),
            note: notesCol >= 0 ? clean(cellVal(row[notesCol])) : '',
            where: { sheet: sh.name, cell: colName(ci) + (r + 1) },
            warn: [],
          };
          if (cls.colorMismatch) ev2.warn.push('הצבע בגיליון לא תואם לטקסט');
          if (other.length) ev2.warn.push('בטקסט מוזכרת שכבה אחרת מהעמודה');
          seen[key] = ev2;
          events.push(ev2);
        });
      }
    });
    events.forEach(function (e) { e.fp = fingerprint(e); });
    return { events: events, issues: issues, coveredMonths: Object.keys(covered).sort() };
  }
  function colName(ci) { return String.fromCharCode(65 + ci); }

  /* ---------------- kid matching ---------------- */
  // kid = { name, grade:'ח', cls:2, tracks:{ math:'regular'|'science'|null, english:'' }, scienceClass: true|false|null }
  // Returns { result:'yes'|'no'|'review', certain:true|false, reason:'…' } – the reason is shown to parents.
  var TRACKED = { 'מתמטיקה': 'math', 'אנגלית': 'english' };
  function gl(g, c) { return g + '׳' + (c == null ? '' : c); }
  function matchKid(ev, kid) {
    var name = kid.name || 'הילד/ה', a = null;
    for (var i = 0; i < ev.audience.length; i++) if (ev.audience[i].grade === kid.grade) a = ev.audience[i];
    if (!a) return { result: 'no', certain: true, reason: 'מיועד לשכבה אחרת' };
    var classList = a.classes === 'all' ? null : a.classes.map(function (c) { return gl(a.grade, c); }).join(', ');
    if (a.classes !== 'all' && a.classes.indexOf(kid.cls) < 0)
      return { result: 'no', certain: true, reason: 'מיועד ל־' + classList + ' בלבד – ' + gl(kid.grade, kid.cls) + ' לא ברשימה' };
    var why = classList ? 'כיתה ' + gl(kid.grade, kid.cls) + ' מופיעה ברשימה (' + classList + ')'
      : ev.audience.length > 1 ? 'אירוע לכל השכבות' : 'לכל שכבת ' + gl(a.grade) + ' – לא צוינו כיתות';
    if (ev.group) {
      var isMath = ev.subjects.indexOf('מתמטיקה') >= 0;
      var known = isMath ? (kid.tracks && kid.tracks.math) : (kid.scienceClass == null ? null : (kid.scienceClass ? 'science' : 'regular'));
      var groupName = ev.group === 'science' ? '"כיתות מדעיות"' : '"כיתות רגילות"';
      if (!known) return { result: 'review', certain: false, reason: 'מיועד ל' + groupName + (isMath ? ' – לא ידוע מסלול המתמטיקה של ' + name : ' – לא ידוע אם הכיתה של ' + name + ' מדעית') };
      var mine = known === 'science' ? 'בכיתה מדעית' : 'במסלול רגיל';
      return known === ev.group
        ? { result: 'yes', certain: true, reason: 'מיועד ל' + groupName + (isMath ? ' במתמטיקה' : '') + ' – ' + name + ' ' + mine }
        : { result: 'no', certain: true, reason: 'מיועד ל' + groupName + ' – ' + name + ' ' + mine };
    }
    // A subject that is split by track (math, or English once its track is set) but this row names no class or track → probably everyone, but a parent should confirm.
    var trackedSubj = ev.subjects.filter(function (s) { return TRACKED[s] === 'math' || (TRACKED[s] === 'english' && kid.tracks && kid.tracks.english); });
    if (!classList && trackedSubj.length && (ev.kind === 'exam' || ev.kind === 'quiz'))
      return { result: 'yes', certain: false, reason: why + ', אבל ב' + trackedSubj.join('/') + ' יש מבחנים נפרדים לפי מסלול – כדאי לוודא שזה גם ל' + name };
    if (ev.warn && ev.warn.length) return { result: 'yes', certain: false, reason: why + ' · ' + ev.warn.join(' · ') };
    return { result: 'yes', certain: true, reason: why };
  }

  /* ---------------- stable identity & reconciliation ---------------- */
  // The sheet has no IDs. The fingerprint describes WHAT the event is (not when):
  // grade + kind + subjects + classes + group. Two math quizzes in the same month share a fingerprint,
  // so the fingerprint is never used as the ID – each event gets its own random, permanent ID.
  function fingerprint(e) {
    var aud = e.audience.map(function (a) { return a.grade + ':' + (a.classes === 'all' ? '*' : a.classes.join('.')); }).sort().join(',');
    var what = e.subjects.length ? e.subjects.slice().sort().join('+') : noQuotes(clean(e.title)).replace(/\s/g, '');
    return [e.kind, what, aud, e.group || ''].join('|');
  }
  function newId() {
    var s = '';
    for (var i = 0; i < 16; i++) s += 'abcdefghijkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 32)];
    return 'ev_' + s;
  }
  function daysBetween(a, b) { return Math.round((Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10)) - Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10))) / 864e5); }

  /**
   * prev   – events stored from earlier syncs: { id, fp, date, title, status:'active'|'missing'|'cancelled', missingCount, history:[] , ... }
   * parsed – result.events of parseGrid
   * opts   – { now: ISO timestamp, today: 'YYYY-MM-DD', coveredMonths: [...], runId, maxMove: 45, abortRatio: 0.3 }
   * Returns { events, changes, aborted, reason }
   */
  function reconcile(prev, parsed, opts) {
    opts = opts || {};
    var now = opts.now || new Date().toISOString(), runId = opts.runId || now;
    var maxMove = opts.maxMove || 45, covered = opts.coveredMonths || [];
    var out = [], changes = [], usedPrev = {}, usedNew = {};
    var P = (prev || []).map(function (e) { return JSON.parse(JSON.stringify(e)); });
    function hist(e, type, extra) { e.history = e.history || []; var h = { at: now, run: runId, type: type }; for (var k in extra) h[k] = extra[k]; e.history.push(h); e.lastChange = h; changes.push({ id: e.id, title: e.title, date: e.date, type: type, from: extra && extra.from, to: extra && extra.to }); }
    function adopt(old, p) {
      var e = old;
      var restored = e.status !== 'active';
      ['title', 'kind', 'label', 'subjects', 'group', 'audience', 'grade', 'note', 'where', 'warn', 'fp'].forEach(function (k) { e[k] = p[k]; });
      e.missingCount = 0; delete e.possibleMoveTo; delete e.possibleMoveFrom;
      if (p.cancelled) { if (e.status !== 'cancelled') { e.status = 'cancelled'; hist(e, 'cancelled', { why: 'מסומן כמבוטל בגיליון' }); } }
      else if (restored) { e.status = 'active'; hist(e, 'restored', {}); }
      return e;
    }
    // Pass 1 – same fingerprint, same date
    parsed.forEach(function (p, i) {
      for (var j = 0; j < P.length; j++) if (!usedPrev[j] && P[j].fp === p.fp && P[j].date === p.date) {
        usedPrev[j] = usedNew[i] = true;
        var titleBefore = P[j].title;
        var e = adopt(P[j], p);
        if (titleBefore !== p.title) hist(e, 'textChanged', { from: titleBefore, to: p.title });
        out.push(e); return;
      }
    });
    // Pass 2 – same date, same grade, same kind, overlapping subject, unique on both sides → details changed (e.g. classes added)
    parsed.forEach(function (p, i) {
      if (usedNew[i]) return;
      var cands = [];
      P.forEach(function (o, j) { if (!usedPrev[j] && o.date === p.date && o.grade === p.grade && o.kind === p.kind && o.subjects.some(function (s) { return p.subjects.indexOf(s) >= 0; })) cands.push(j); });
      var rivals = parsed.filter(function (q, k) { return !usedNew[k] && q.date === p.date && q.grade === p.grade && q.kind === p.kind && q.subjects.some(function (s) { return p.subjects.indexOf(s) >= 0; }); });
      if (cands.length === 1 && rivals.length === 1) {
        var j = cands[0]; usedPrev[j] = usedNew[i] = true;
        var before = P[j].title; var e = adopt(P[j], p);
        hist(e, 'detailsChanged', { from: before, to: p.title });
        out.push(e);
      }
    });
    // Pass 3 – same fingerprint, different date (a move).
    // Automatic only when exactly ONE event with this description disappeared and exactly ONE appeared, within maxMove days.
    // If two or more identical-looking events moved in the same update, nothing can tell them apart, so they are NOT paired
    // automatically: the new dates appear as new events, the old ones are marked "missing", and the pair is offered to a parent to confirm.
    var byFp = {}, ambiguous = [];
    P.forEach(function (o, j) { if (!usedPrev[j] && o.status !== 'cancelled') (byFp[o.fp] = byFp[o.fp] || { o: [], n: [] }).o.push(j); });
    parsed.forEach(function (p, i) { if (!usedNew[i] && byFp[p.fp]) byFp[p.fp].n.push(i); });
    Object.keys(byFp).forEach(function (fp) {
      var g = byFp[fp];
      if (!g.o.length || !g.n.length) return;
      if (g.o.length === 1 && g.n.length === 1 && Math.abs(daysBetween(P[g.o[0]].date, parsed[g.n[0]].date)) <= maxMove) {
        var j = g.o[0], i = g.n[0], p = parsed[i]; usedPrev[j] = usedNew[i] = true;
        var from = P[j].date; var e = adopt(P[j], p); e.date = p.date;
        hist(e, 'dateChanged', { from: from, to: p.date });
        out.push(e);
      } else ambiguous.push(g);
    });
    // New events
    parsed.forEach(function (p, i) {
      if (usedNew[i]) return;
      var e = JSON.parse(JSON.stringify(p));
      e.id = newId(); e.status = p.cancelled ? 'cancelled' : 'active'; e.missingCount = 0; e.firstSeen = now; e.history = []; e._srcIndex = i;
      hist(e, 'created', {});
      out.push(e);
    });
    // Link ambiguous moves (both directions) so a parent can confirm which is which.
    ambiguous.forEach(function (g) {
      var newIds = g.n.map(function (i) { return out.filter(function (e) { return e._srcIndex === i; })[0]; }).filter(Boolean);
      g.o.forEach(function (j) {
        var cands = newIds.filter(function (e) { return Math.abs(daysBetween(P[j].date, e.date)) <= maxMove; });
        if (!cands.length) return;
        P[j].possibleMoveTo = cands.map(function (e) { return e.id; });
        cands.forEach(function (e) { (e.possibleMoveFrom = e.possibleMoveFrom || []).push(P[j].id); });
      });
    });
    out.forEach(function (e) { delete e._srcIndex; });
    // Events that disappeared. Only inside months the file still covers; past events are left alone.
    var activeFuture = 0, goingAway = 0;
    P.forEach(function (o, j) {
      if (usedPrev[j]) return;
      var inScope = covered.indexOf(o.date.slice(0, 7)) >= 0 && (!opts.today || o.date >= opts.today);
      if (inScope && o.status !== 'cancelled') {
        o.missingCount = (o.missingCount || 0) + 1;
        if (o.missingCount >= 2 && !(o.possibleMoveTo && o.possibleMoveTo.length)) { o.status = 'cancelled'; hist(o, 'cancelled', { why: 'נעלם מהגיליון בשתי בדיקות רצופות' }); }
        else if (o.status !== 'missing') { o.status = 'missing'; hist(o, 'missing', {}); }
        goingAway++;
      }
      out.push(o);
    });
    P.forEach(function (o) { if (o.status === 'active' && (!opts.today || o.date >= opts.today)) activeFuture++; });
    var ratio = activeFuture ? goingAway / activeFuture : 0;
    if (P.length >= 10 && ratio > (opts.abortRatio || 0.3)) {
      return { aborted: true, reason: 'יותר מ־' + Math.round((opts.abortRatio || 0.3) * 100) + '% מהמבחנים העתידיים נעלמו בבת אחת. ייתכן שמבנה הגיליון השתנה – לא בוצע שום שינוי.', events: prev, changes: [] };
    }
    out.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    return { aborted: false, events: out, changes: changes };
  }

  /* ---------------- multi-day spans (display only) ---------------- */
  // Consecutive days with the same holiday title become one span. The original per-day events are kept untouched inside span.items,
  // so the school's dates (and sheet cells) are never changed. A gap of only Friday/Saturday does not break a span.
  // list: [{ id, date:'YYYY-MM-DD', title, type|kind, ... }]  opts: { types:['holiday'], keyExtra: fn(e) → string }
  function groupSpans(list, opts) {
    opts = opts || {};
    var types = opts.types || ['holiday'], groups = {}, singles = [], spans = [];
    function dowOf(iso) { return new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))).getUTCDay(); }
    function addDay(iso, n) { var d = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10) + n)); return d.toISOString().slice(0, 10); }
    list.forEach(function (e) {
      if (types.indexOf(e.type || e.kind) < 0 || e.status === 'cancelled') { singles.push(e); return; }
      var k = noQuotes(clean(e.title)) + '|' + (opts.keyExtra ? opts.keyExtra(e) : '');
      (groups[k] = groups[k] || []).push(e);
    });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k].slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      var cur = null;
      function flush() { if (!cur) return; if (cur.items.length > 1) spans.push(cur); else singles.push(cur.items[0]); cur = null; }
      g.forEach(function (e) {
        if (cur) {
          var gapOk = true, d = addDay(cur.end, 1);
          if (e.date === cur.end) { cur.items.push(e); return; } // same day twice – keep once in the span
          while (d < e.date) { var w = dowOf(d); if (w !== 5 && w !== 6) { gapOk = false; break; } d = addDay(d, 1); }
          if (gapOk && daysBetween(cur.end, e.date) <= 3) { cur.items.push(e); cur.end = e.date; return; }
          flush();
        }
        cur = { title: clean(e.title), start: e.date, end: e.date, items: [e] };
      });
      flush();
    });
    spans.sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    return { spans: spans, singles: singles };
  }

  /* ---------------- parent decisions on ambiguous moves ---------------- */
  // "Yes, the exam on newId is the same one that was on oldId": the old event (with its ID, history and the kid's progress) moves to the new date.
  function confirmMove(events, oldId, newId, opts) {
    opts = opts || {};
    var list = JSON.parse(JSON.stringify(events));
    var o = list.filter(function (e) { return e.id === oldId; })[0], n = list.filter(function (e) { return e.id === newId; })[0];
    if (!o || !n) return events;
    var from = o.date;
    ['date', 'title', 'kind', 'label', 'subjects', 'group', 'audience', 'grade', 'note', 'where', 'warn', 'fp'].forEach(function (k) { o[k] = n[k]; });
    o.status = 'active'; o.missingCount = 0; delete o.possibleMoveTo; delete o.possibleMoveFrom;
    var h = { at: opts.now || new Date().toISOString(), run: 'parent', type: 'dateChanged', from: from, to: o.date, confirmedBy: opts.by || '' };
    (o.history = o.history || []).push(h); o.lastChange = h;
    list = list.filter(function (e) { return e.id !== newId; });
    list.forEach(function (e) {
      if (e.possibleMoveTo) { e.possibleMoveTo = e.possibleMoveTo.filter(function (x) { return x !== newId; }); if (!e.possibleMoveTo.length) delete e.possibleMoveTo; }
      if (e.possibleMoveFrom) { e.possibleMoveFrom = e.possibleMoveFrom.filter(function (x) { return x !== oldId; }); if (!e.possibleMoveFrom.length) delete e.possibleMoveFrom; }
    });
    return list;
  }
  // "No, these are different exams": just remove the link.
  function rejectMove(events, oldId, newId) {
    var list = JSON.parse(JSON.stringify(events));
    list.forEach(function (e) {
      if (e.id === oldId && e.possibleMoveTo) { e.possibleMoveTo = e.possibleMoveTo.filter(function (x) { return x !== newId; }); if (!e.possibleMoveTo.length) delete e.possibleMoveTo; }
      if (e.id === newId && e.possibleMoveFrom) { e.possibleMoveFrom = e.possibleMoveFrom.filter(function (x) { return x !== oldId; }); if (!e.possibleMoveFrom.length) delete e.possibleMoveFrom; }
    });
    return list;
  }

  /* ---------------- adapter: SheetJS workbook → grid ---------------- */
  // Read with XLSX.read(data, { cellStyles: true }) – dates stay as serial numbers, so there are no time-zone shifts.
  function fromSheetJS(XLSX, wb) {
    return wb.SheetNames.map(function (name) {
      var ws = wb.Sheets[name], ref = ws['!ref'];
      if (!ref) return { name: name, rows: [], merges: [] };
      var R = XLSX.utils.decode_range(ref), rows = [];
      var maxR = Math.min(R.e.r, 400), maxC = Math.min(R.e.c, 12);
      for (var r = 0; r <= maxR; r++) {
        var row = [];
        for (var c = 0; c <= maxC; c++) {
          var cell = ws[XLSX.utils.encode_cell({ r: r, c: c })];
          if (!cell || cell.v == null || cell.v === '') { row.push(null); continue; }
          var v = cell.v;
          if (cell.t === 'n' && c === 0 && v > 30000 && v < 80000) { var d = XLSX.SSF.parse_date_code(v); v = { y: d.y, m: d.m, d: d.d }; }
          else if (cell.t === 'd' && v instanceof Date) v = { y: v.getFullYear(), m: v.getMonth() + 1, d: v.getDate() };
          else v = String(v);
          var bg = cell.s && cell.s.fgColor && cell.s.fgColor.rgb ? String(cell.s.fgColor.rgb).slice(-6) : null;
          row.push({ v: v, bg: bg, strike: false });
        }
        rows.push(row);
      }
      var merges = (ws['!merges'] || []).map(function (m) { return { r1: m.s.r, c1: m.s.c, r2: m.e.r, c2: m.e.c }; });
      return { name: name, rows: rows, merges: merges };
    });
  }

  return { groupSpans: groupSpans, confirmMove: confirmMove, rejectMove: rejectMove, fromSheetJS: fromSheetJS, parseGrid: parseGrid, classify: classify, audienceInText: audienceInText, matchKid: matchKid, fingerprint: fingerprint, reconcile: reconcile, daysBetween: daysBetween };
})();
if (typeof module !== 'undefined') module.exports = FSCore;
