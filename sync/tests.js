/* Run: node sync/tests.js <exam-calendar.xlsx>   (needs the "xlsx" package) */
const X = require('xlsx'), C = require('./core.js'), assert = require('assert');
const file = process.argv[2];
const wb = X.readFile(file, { cellStyles: true });
const grid = () => C.fromSheetJS(X, wb);
const sh = (g, n) => g.find(s => s.name === n);
const edit = fn => { const g = grid(); fn(g); return C.parseGrid(g).events; };
const today = '2026-10-15', T = r => ({ today, coveredMonths: C.parseGrid(grid()).coveredMonths, now: r, runId: r });
const kids = { kid1: { name: 'kid1', grade: 'ח', cls: 2, tracks: { math: 'regular', english: '' }, scienceClass: null },
               kid2: { name: 'kid2', grade: 'ט', cls: 3, tracks: { math: 'regular', english: '' }, scienceClass: null } };
let pass = 0; const ok = (cond, msg) => { assert.ok(cond, msg); pass++; console.log('✓', msg); };

const base = C.reconcile([], C.parseGrid(grid()).events, T('R1')).events;
const byTitleDate = (evs, title, date, grade) => evs.filter(e => e.title.trim() === title && e.date === date && (!grade || e.grade === grade));
const DAN_MATH = "מבחן במתמ' כיתות רגילות";
const m1 = byTitleDate(base, DAN_MATH, '2026-11-02')[0], m2 = byTitleDate(base, DAN_MATH, '2026-12-21')[0];
ok(m1 && m2 && m1.fp === m2.fp && m1.id !== m2.id, 'two identical "regular math" exams for ט share a description but have different IDs');

// 1. unchanged file
ok(C.reconcile(base, C.parseGrid(grid()).events, T('R2')).changes.length === 0, 'unchanged file → 0 changes');

// 2. ONE of two identical exams moves (2.11 → 4.11): the right one keeps its ID, the other is untouched
let r = C.reconcile(base, edit(g => { const n = sh(g, 'נובמבר'); n.rows[4][4] = null; n.rows[6][4] = { v: DAN_MATH, bg: 'FF00FF' }; }), T('R3'));
let a = r.events.find(e => e.id === m1.id), b = r.events.find(e => e.id === m2.id);
ok(a.date === '2026-11-04' && a.lastChange.type === 'dateChanged' && a.lastChange.from === '2026-11-02', 'single move of an identical exam → same ID, moved 2.11→4.11, history kept');
ok(b.date === '2026-12-21' && b.history.length === 1, 'the other identical exam (21.12) did not change');

// 3. BOTH identical exams move in the same update → no automatic pairing, parent confirms
r = C.reconcile(base, edit(g => {
  const n = sh(g, 'נובמבר'), d = sh(g, 'דצמבר');
  n.rows[4][4] = null; n.rows[6][4] = { v: DAN_MATH, bg: 'FF00FF' };        // 2.11 → 4.11
  d.rows[26][4] = null; d.rows[27][4] = { v: DAN_MATH, bg: 'FF00FF' };      // 21.12 → 22.12
}), T('R4'));
a = r.events.find(e => e.id === m1.id); b = r.events.find(e => e.id === m2.id);
ok(a.status === 'missing' && a.date === '2026-11-02' && a.possibleMoveTo && a.possibleMoveTo.length >= 1, 'two identical exams moved together → old 2.11 marked "missing" with a suggested match, not guessed');
const newDates = r.events.filter(e => e.title.trim() === DAN_MATH && e.status === 'active').map(e => e.date).sort();
ok(newDates.includes('2026-11-04') && newDates.includes('2026-12-22'), 'the new dates 4.11 and 22.12 already appear in the calendar');
// parent confirms 2.11 → 4.11
const n4 = r.events.find(e => e.title.trim() === DAN_MATH && e.date === '2026-11-04');
let ev2 = C.confirmMove(r.events, m1.id, n4.id, { by: 'par1' });
ok(ev2.find(e => e.id === m1.id).date === '2026-11-04' && !ev2.find(e => e.id === n4.id), 'parent confirmation: the original exam ID moves to 4.11, the duplicate is removed');
ok(ev2.length === r.events.length - 1, 'no event lost or duplicated after confirmation');

// 4. explicit "בוטל"
r = C.reconcile(base, edit(g => { sh(g, 'אוקטובר').rows[25][3] = { v: "בוחן באנגלית ח'1, ח'2, ח'7 - בוטל", bg: 'FFD966' }; }), T('R5'));
ok(r.events.find(e => e.date === '2026-10-21' && e.grade === 'ח' && /אנגלית/.test(e.title)).status === 'cancelled', '"בוטל" in the cell → cancelled immediately');

// 5. disappeared: missing after 1 run, cancelled after 2
const gone = edit(g => { sh(g, 'אוקטובר').rows[21][3] = null; });
const r6 = C.reconcile(base, gone, T('R6')), r7 = C.reconcile(r6.events, gone, T('R7'));
const tan = id => id.find(e => e.date === '2026-10-18' && e.grade === 'ח');
ok(tan(r6.events).status === 'missing' && tan(r7.events).status === 'cancelled', 'removed exam → "maybe cancelled", then "cancelled" on the next run; never deleted');

// 6. classes added on the same day
r = C.reconcile(base, edit(g => { sh(g, 'אוקטובר').rows[16][3] = { v: "בוחן בהיסטוריה ח'2, ח'5, ח'6, ח'8", bg: 'FFD966' }; }), T('R8'));
ok(r.changes.length === 1 && r.changes[0].type === 'detailsChanged', 'class added to a quiz → "details changed", same event');

// 7. broken sheet → nothing changes
r = C.reconcile(base, edit(g => { sh(g, 'נובמבר').rows[2] = []; sh(g, 'דצמבר').rows[2] = []; }), T('R9'));
ok(r.aborted === true, 'sheet structure broken → update stopped, nothing changed');

// 8. matching by class and track, not just grade
const ev = C.parseGrid(grid()).events, find = (t, d) => ev.find(e => e.title.trim() === t && e.date === d);
ok(C.matchKid(find("בוחן בהיסטוריה ח'1", '2026-10-11'), kids.kid1).result === 'no', 'ח׳1 quiz is not for kid 1 (ח׳2)');
ok(C.matchKid(find("בוחן בהיסטוריה ח'2, ח'6, ח'8", '2026-10-14'), kids.kid1).result === 'yes', 'ח׳2,6,8 quiz is for kid 1');
ok(C.matchKid(find("מבחן במתמ' ח'4", '2026-11-02'), kids.kid1).result === 'no', 'math exam for ח׳4 only is not for kid 1');
ok(C.matchKid(find("מבחן במתמ' ללא מדעית", '2026-11-01'), kids.kid1).result === 'yes', '"ללא מדעית" math exam is for kid 1 (regular track)');
ok(C.matchKid(find("מבחן במתמ' מדעיות", '2026-11-05'), kids.kid2).result === 'no', '"מדעיות" math exam is not for kid 2 (regular track)');
ok(C.matchKid(find("מבחן במתמ' כיתות רגילות", '2026-11-02'), kids.kid2).result === 'yes', '"כיתות רגילות" math exam is for kid 2');
ok(C.matchKid(find("בוחן בעברית ט'2, ט'8", '2026-11-08'), kids.kid2).result === 'no', 'ט׳2,8 Hebrew quiz is not for kid 2 (ט׳3)');
ok(C.matchKid(find('פרוייקט מדעי המחשב כיתות מדעיות', '2026-11-19'), kids.kid2).result === 'review', '"כיתות מדעיות" CS project → parent review (unknown if ט׳3 is a science class)');
ok(C.matchKid(find('בוחן במתמטיקה', '2026-11-24'), kids.kid1).certain === false, 'grade-wide math quiz without track → assigned but flagged uncertain');
ok(C.matchKid({ ...find("מבחן במתמ' מדעיות", '2026-11-05') }, { ...kids.kid2, tracks: { math: 'science' } }).result === 'yes', 'if kid 2 were in the science track, the "מדעיות" exam would be his');

// 9. types are separated
const kinds = new Set(ev.map(e => e.kind));
ok(['exam', 'quiz', 'project', 'alt'].every(k => kinds.has(k)), 'exam / quiz / project / alternative assessment are separate types');
ok(find('הערכה חלופית גיאוגרפיה', '2026-10-19').kind === 'alt' && find('פרוייקט אנגלית', '2026-12-03').kind === 'project', 'הערכה חלופית ≠ פרויקט');
// 10. multi-day holidays become one span, original days kept
const nellyEv = ev.filter(e => C.matchKid(e, kids.kid1).result === 'yes');
const sp = C.groupSpans(nellyEv, { keyExtra: () => 'kid1' });
const suk = sp.spans.find(s => s.title === 'חג סוכות');
ok(suk && suk.start === '2026-09-25' && suk.end === '2026-10-03' && suk.items.length === 9, 'Sukkot = one span 25.9–3.10 across two monthly tabs, all 9 original days kept');
const han = sp.spans.find(s => /חנוכה/.test(s.title));
ok(han && han.start === '2026-12-06' && han.end === '2026-12-10' && han.items.length === 5, 'Hanukkah vacation = one span 6–10.12 (5 original days)');
ok(sp.spans.length + sp.singles.length + sp.spans.reduce((n, s) => n + s.items.length, 0) - sp.spans.length === nellyEv.length, 'grouping loses no event');
ok(!sp.spans.some(s => s.title === 'חג הסיגד'), 'single-day holiday stays a single event');
console.log(`\n${pass} checks passed`);
