/* ================= web version: the family's own Firebase project =================
   Loaded only in the stand-alone site (tools/build_web.py), before app.js.
   No passwords anywhere: the managing parent signs in with Google once (on a computer),
   and every other device joins with a one-time code that she creates in Settings.
   The code of this site is public, so it holds no names or family data – those live in Firestore,
   readable only by connected family devices (see firestore.rules). */
(function () {
  const cfg = window.FS_FIREBASE_CONFIG || null;
  const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const ROLE = { par1:'admin', par2:'parent', kid1:'child', kid2:'child' };
  const PARENT_ONLY = ['fmsg', 'shop', 'appts'];            // parents' space: never sent to the kids' devices
  const KID_WRITES = ['done', 'prep', 'requests', 'events']; // plus their own flashcard progress
  const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';           // no 0/O or 1/I – easy to read aloud
  const CODE_HOURS = 48;
  const W = { phase:cfg ? 'loading' : 'off', err:'', busy:false, uid:null, fam:null, member:null, isGoogle:false,
    newCode:null, members:null, confirmRemove:null, importInfo:null };
  let fb = null, fdb = null, auth = null, resolveStart = null, readyOnce = false;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const nm = k => (typeof NM === 'function' ? NM(k) : k);
  const rnd = n => Array.from(crypto.getRandomValues(new Uint32Array(n)), x => ALPH[x % ALPH.length]).join('');
  const fmtCode = c => c.slice(0, 5) + '-' + c.slice(5);
  const siteURL = () => location.origin + location.pathname.replace(/index\.html$/, '');
  const deviceLabel = () => { const u = navigator.userAgent; return /iPhone/.test(u) ? 'אייפון' : /iPad/.test(u) ? 'אייפד' : /Android/.test(u) ? 'אנדרואיד' : 'מחשב'; };
  const paint = () => { if (typeof render === 'function') render(); };
  const fail = (msg, e) => { W.busy = false; W.err = msg; if (e) console.warn(e); paint(); };

  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); });
  }
  async function boot() {
    try {
      await loadScript(SDK + 'firebase-app-compat.js');
      await Promise.all([loadScript(SDK + 'firebase-auth-compat.js'), loadScript(SDK + 'firebase-firestore-compat.js')]);
      fb = window.firebase; fb.initializeApp(cfg);
      auth = fb.auth(); fdb = fb.firestore();
      fdb.settings({ ignoreUndefinedProperties:true });
      if (cfg.emulator) { auth.useEmulator('http://127.0.0.1:9099'); fdb.useEmulator('127.0.0.1', 8080); }   // local testing only
      try { await fdb.enablePersistence({ synchronizeTabs:true }); } catch (e) {}
      auth.onAuthStateChanged(u => { afterAuth(u); });
    } catch (e) { W.phase = 'error'; fail('לא הצלחתי להתחבר לשרת. בדקו את החיבור לאינטרנט ונסו שוב.', e); }
  }

  // The app's cloud layer speaks one small interface (doc/collection, get/set/update/onSnapshot).
  // Here it is served by Firestore, under this family's folder. update = merge, never a removal.
  function adapter(base) {
    return {
      doc: p => { const r = fdb.doc(base + p); return { get:() => r.get(), set:d => r.set(d), update:d => r.set(d, { merge:true }), onSnapshot:(f, e) => r.onSnapshot(f, e) }; },
      collection: p => fdb.collection(base + p),
    };
  }
  function backend() {
    const m = W.member;
    return { db:adapter(`families/${W.fam}/`), user:m.user, role:m.role,
      canRead:n => m.role !== 'child' || !PARENT_ONLY.includes(n),
      canWrite:n => m.role !== 'child' || KID_WRITES.includes(n) || n === 'prog_' + m.user,
      schoolWrite:m.role !== 'child' };
  }

  async function afterAuth(u) {
    W.err = ''; W.busy = false;
    if (!u) { W.phase = 'welcome'; W.member = null; paint(); return; }
    W.uid = u.uid; W.isGoogle = !u.isAnonymous;
    try {
      const us = await fdb.doc('users/' + u.uid).get();
      if (!us.exists) { W.phase = u.isAnonymous ? 'welcome' : 'setup'; paint(); return; }
      W.fam = us.data().fam;
      const ms = await fdb.doc(`families/${W.fam}/members/${u.uid}`).get();
      if (!ms.exists) { W.phase = 'removed'; paint(); return; }
      const wasRemoved = W.phase === 'removed';
      W.member = ms.data(); W.phase = 'ready';
      if (readyOnce) { if (wasRemoved) location.reload(); else paint(); return; }   // re-joined after being removed: start clean
      readyOnce = true;
      if (resolveStart) resolveStart(backend());
      paint();
    } catch (e) { W.phase = 'error'; fail('לא הצלחתי לבדוק את החיבור של המכשיר. נסו לרענן את הדף.', e); }
  }

  async function join(raw) {
    const code = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 10) return fail('הקוד צריך להיות באורך 10 תווים (אותיות ומספרים).');
    W.busy = true; W.err = ''; paint();
    try {
      if (!auth.currentUser) await auth.signInAnonymously();
      const uid = auth.currentUser.uid;
      const inv = await fdb.doc('invites/' + code).get();
      if (!inv.exists) return fail('הקוד לא נמצא. ייתכן שכבר השתמשו בו. בקשו קוד חדש.');
      const d = inv.data();
      if (d.expires.toMillis() < Date.now()) return fail('תוקף הקוד פג. בקשו קוד חדש.');
      const b = fdb.batch();
      b.set(fdb.doc(`families/${d.fam}/members/${uid}`), { user:d.user, role:d.role, code, device:deviceLabel(), at:fb.firestore.FieldValue.serverTimestamp() });
      b.set(fdb.doc('users/' + uid), { fam:d.fam });
      b.delete(fdb.doc('invites/' + code));
      await b.commit();
      await afterAuth(auth.currentUser);
    } catch (e) { fail('החיבור לא הצליח. ייתכן שהקוד כבר נוצל או שהמכשיר כבר מחובר. בקשו קוד חדש.', e); }
  }
  async function google() {
    W.busy = true; W.err = ''; paint();
    try { await auth.signInWithPopup(new fb.auth.GoogleAuthProvider()); }
    catch (e) {
      const c = e && e.code;
      if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return fail('');
      fail(/iPhone|iPad/.test(navigator.userAgent) ? 'בטלפון מתחברים עם קוד. כניסה עם Google עובדת במחשב.' : 'הכניסה עם Google לא הצליחה. נסו שוב.', e);
    }
  }
  async function createFamily() {
    W.busy = true; W.err = ''; paint();
    try {
      const fam = 'f' + rnd(15).toLowerCase(), uid = auth.currentUser.uid, now = fb.firestore.FieldValue.serverTimestamp();
      const b = fdb.batch();
      b.set(fdb.doc(`families/${fam}`), { owner:uid, createdAt:now });
      b.set(fdb.doc(`families/${fam}/members/${uid}`), { user:'par1', role:'admin', code:'', device:deviceLabel(), at:now });
      b.set(fdb.doc('users/' + uid), { fam });
      await b.commit();
      await afterAuth(auth.currentUser);
    } catch (e) { fail('לא הצלחתי ליצור את המשפחה. נסו שוב.', e); }
  }
  async function newCode(user) {
    if (!ROLE[user]) return;
    W.busy = true; W.err = ''; W.newCode = null; paint();
    try {
      const code = rnd(10), expires = fb.firestore.Timestamp.fromMillis(Date.now() + CODE_HOURS * 3600e3);
      await fdb.doc('invites/' + code).set({ fam:W.fam, user, role:ROLE[user], expires, by:W.uid });
      W.busy = false; W.newCode = { code, user, expires:expires.toMillis() }; paint();
    } catch (e) { fail('לא הצלחתי ליצור קוד. נסו שוב.', e); }
  }
  async function loadMembers() {
    try { const qs = await fdb.collection(`families/${W.fam}/members`).get(); W.members = qs.docs.map(d => ({ uid:d.id, ...d.data() })); paint(); }
    catch (e) { fail('לא הצלחתי לטעון את רשימת המכשירים.', e); }
  }
  async function removeMember(uid) {
    try { await fdb.doc(`families/${W.fam}/members/${uid}`).delete(); W.confirmRemove = null; await loadMembers(); if (typeof toast === 'function') toast('המכשיר נותק'); }
    catch (e) { fail('לא הצלחתי לנתק את המכשיר.', e); }
  }
  // Data file from Claude: {slices:{name:{...}}, school_events:[...]} – the first move from the previous version, or additions
  // such as the exam bank and flashcards. Everything is merged in; nothing is removed.
  async function importFile(file) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || !data.slices || typeof data.slices !== 'object') throw new Error('format');
      data.school_events = Array.isArray(data.school_events) ? data.school_events : [];
      W.importInfo = { data, name:file.name, slices:Object.keys(data.slices).length, events:data.school_events.length, what:data.summary || '' }; paint();
    } catch (e) { fail('הקובץ לא נראה כמו קובץ נתונים של FAMILY SMART.', e); }
  }
  async function importRun() {
    const data = W.importInfo && W.importInfo.data; if (!data) return;
    W.busy = true; paint();
    try {
      const base = `families/${W.fam}/`, writes = [];
      for (const name in data.slices) writes.push([base + 'st/' + name, { m:data.slices[name], at:Date.now() }, true]);
      for (const e of data.school_events) if (e && e.id) writes.push([base + 'school_events/' + e.id, e, false]);
      for (let i = 0; i < writes.length; i += 400) {
        const b = fdb.batch();
        writes.slice(i, i + 400).forEach(([p, d, merge]) => b.set(fdb.doc(p), d, merge ? { merge:true } : {}));
        await b.commit();
      }
      try { localStorage.setItem('familysmart.cloudMerged', '1'); } catch (e) {}
      location.reload();
    } catch (e) { fail('הייבוא לא הצליח. שום דבר לא נמחק. נסו שוב.', e); }
  }
  async function signOut() { try { await auth.signOut(); } catch (e) {} try { localStorage.removeItem('familysmart.cloudMerged'); } catch (e) {} location.reload(); }

  /* ---------- screens ---------- */
  const errHTML = () => W.err ? `<div class="callout no" role="alert">${esc(W.err)}</div>` : '';
  const codeForm = (label) => `<form class="f" id="webcode" autocomplete="off">
      <div class="field"><label for="web-code">${label}</label><input id="web-code" name="code" inputmode="text" autocapitalize="characters" spellcheck="false" placeholder="XXXXX-XXXXX" maxlength="11" required ${W.busy ? 'disabled' : ''}></div>
      <button class="btn" type="submit" ${W.busy ? 'disabled' : ''}>${W.busy ? 'מתחבר…' : 'חיבור המכשיר'}</button></form>`;
  function gateHTML() {
    if (W.phase === 'off' || W.phase === 'ready') return '';
    const wrap = inner => `<main class="gate"><div class="gate-card"><div class="gate-brand">FAMILY SMART</div>${inner}</div></main>`;
    if (W.phase === 'loading') return wrap('<p class="gate-sub">מתחבר…</p>');
    if (W.phase === 'error') return wrap(`${errHTML()}<button class="btn" data-web="reload">לנסות שוב</button>`);
    if (W.phase === 'setup') return wrap(`<h1>שלום! 👋</h1><p class="gate-sub">נכנסת עם Google, ועדיין אין משפחה שמחוברת לחשבון הזה.</p>${errHTML()}
      <button class="btn" data-web="create" ${W.busy ? 'disabled' : ''}>יצירת המשפחה שלנו (למנהל/ת בלבד)</button>
      <div class="gate-or">או</div>${codeForm('קיבלתי קוד חיבור')}
      <button class="btn ghost" data-web="signout">יציאה</button>`);
    const removed = W.phase === 'removed';
    return wrap(`<h1>${removed ? 'המכשיר נותק' : 'היומן המשפחתי'}</h1>
      <p class="gate-sub">${removed ? 'המכשיר הזה כבר לא מחובר למשפחה. כדי לחבר אותו שוב, צריך קוד חדש מההורה המנהל/ת.' : 'כדי לראות את היומן, מחברים את המכשיר פעם אחת עם קוד שמקבלים מההורה המנהל/ת. אין סיסמאות.'}</p>
      ${errHTML()}${codeForm('קוד חיבור')}
      ${removed ? '' : `<div class="gate-or">מנהל/ת המשפחה?</div><button class="btn soft" data-web="google" ${W.busy ? 'disabled' : ''}>כניסה עם Google (במחשב)</button>`}
      <p class="small muted gate-foot">באייפון: קודם מוסיפים למסך הבית (כפתור השיתוף ← "הוספה למסך הבית"), פותחים מהסמל החדש, ורק שם מקלידים את הקוד.</p>`);
  }
  function settingsHTML() {
    const m = W.member; if (!m) return '';
    const me = `<p class="small" style="margin:0">המכשיר הזה מחובר בתור <b>${esc(nm(m.user))}</b>. כתובת האתר: <span dir="ltr">${esc(siteURL())}</span></p>`;
    if (m.role !== 'admin') return `<div class="card"><h3>חיבור המכשיר</h3>${me}<p class="small muted" style="margin:0">רק ההורה המנהל/ת יכול/ה לחבר מכשירים חדשים או לנתק מכשירים.</p></div>`;
    const opt = k => `<option value="${k}">${esc(nm(k))}</option>`;
    const nc = W.newCode;
    const list = W.members ? W.members.map(x => `<div class="shop-row"><span style="flex:1"><b>${esc(nm(x.user))}</b> · ${esc(x.device || '')}${x.uid === W.uid ? ' · המכשיר הזה' : ''}</span>
        ${x.uid === W.uid ? '' : W.confirmRemove === x.uid ? `<button class="btn ghost" data-web="rm-yes" data-uid="${esc(x.uid)}">לנתק</button><button class="btn ghost" data-web="rm-no">ביטול</button>`
        : `<button class="icon-btn" data-web="rm" data-uid="${esc(x.uid)}" aria-label="ניתוק המכשיר">${typeof I === 'function' ? I('trash') : '×'}</button>`}</div>`).join('') : '';
    return `<div class="card"><h3>מכשירים במשפחה</h3>${me}${errHTML()}
      <form class="f" id="webinvite"><div class="field"><label for="web-who">קוד חיבור בשביל</label><select id="web-who" name="who">${opt('par2')}${opt('kid1')}${opt('kid2')}${opt('par1')}</select></div>
        <button class="btn" type="submit" ${W.busy ? 'disabled' : ''}>יצירת קוד חד-פעמי</button></form>
      ${nc ? `<div class="callout ok"><div>הקוד בשביל <b>${esc(nm(nc.user))}</b>:</div><div class="web-code" dir="ltr">${fmtCode(nc.code)}</div>
        <div class="small">בתוקף ${CODE_HOURS} שעות, לשימוש פעם אחת. באייפון: פותחים ב-Safari את <span dir="ltr">${esc(siteURL())}</span>, כפתור השיתוף ← "הוספה למסך הבית", פותחים מהסמל החדש, ורק שם מקלידים את הקוד.</div></div>` : ''}
      <div class="rows">${list}</div>
      <button class="btn ghost" data-web="members">${W.members ? 'רענון הרשימה' : 'הצגת המכשירים המחוברים'}</button>
      <details class="fold" ${W.importInfo ? 'open' : ''}><summary>ייבוא קובץ נתונים</summary><div class="fold-body">
        <p class="small">בוחרים קובץ נתונים שקיבלת מ-Claude (למשל מאגר מבחנים או כרטיסיות), והוא מתווסף לענן של המשפחה. שום דבר לא נמחק.</p>
        <input type="file" id="webimport" accept=".json,application/json">
        ${W.importInfo ? `<div class="callout">${W.importInfo.what ? esc(W.importInfo.what) : `בקובץ: ${W.importInfo.events ? W.importInfo.events + ' אירועים מלוח המבחנים ו-' : ''}${W.importInfo.slices} חלקי נתונים.`}</div><button class="btn" data-web="import" ${W.busy ? 'disabled' : ''}>${W.busy ? 'מעביר…' : 'להעביר עכשיו'}</button>` : ''}
      </div></details></div>`;
  }

  document.addEventListener('submit', ev => {
    const f = ev.target;
    if (f.id === 'webcode') { ev.preventDefault(); ev.stopImmediatePropagation(); join(new FormData(f).get('code')); }
    if (f.id === 'webinvite') { ev.preventDefault(); ev.stopImmediatePropagation(); newCode(new FormData(f).get('who')); }
  }, true);
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-web]'); if (!el) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    const a = el.dataset.web;
    if (a === 'google') google();
    if (a === 'create') createFamily();
    if (a === 'signout') signOut();
    if (a === 'reload') location.reload();
    if (a === 'members') loadMembers();
    if (a === 'rm') { W.confirmRemove = el.dataset.uid; paint(); }
    if (a === 'rm-no') { W.confirmRemove = null; paint(); }
    if (a === 'rm-yes') removeMember(el.dataset.uid);
    if (a === 'import') importRun();
  }, true);
  document.addEventListener('change', ev => { if (ev.target.id === 'webimport') importFile(ev.target.files[0]); }, true);

  window.FSWeb = {
    configured:() => !!cfg,
    start:() => cfg ? new Promise(res => { resolveStart = res; if (W.phase === 'ready') res(backend()); }) : Promise.resolve(null),
    gateHTML, settingsHTML,
    recheck:() => { if (auth && auth.currentUser) afterAuth(auth.currentUser); },
  };
  if (cfg) boot();
})();
