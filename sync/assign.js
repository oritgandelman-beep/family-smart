/**
 * FamilySmart – matching a "class" cell from the school exam sheet to a child.
 * Plain JavaScript so the same code runs in Google Apps Script and in the app.
 *
 * parseAudience("ח'2")        -> [{grade:'ח', classes:[2]}]
 * parseAudience("שכבת ט")      -> [{grade:'ט', classes:'all'}]
 * parseAudience("ח1-4")        -> [{grade:'ח', classes:[1,2,3,4]}]
 * parseAudience("ח׳1, ח׳3")     -> [{grade:'ח', classes:[1]}, {grade:'ח', classes:[3]}]
 * parseAudience("")            -> null   (unknown → goes to the parents' review list, never guessed)
 */
var GRADES = 'זחטי';

function parseAudience(raw) {
  if (raw == null) return null;
  var s = String(raw)
    .replace(/[׳'`’"״]/g, '')        // ח'2 / ח׳2 → ח2
    .replace(/שכבתית|שכבתי|כיתות|כיתה|שכבת|שכבה|כל/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return null;
  var out = [];
  // a grade letter standing alone (not inside a word like "מבחן"), optionally followed by class numbers
  var re = /(^|[^א-ת])([זחטי])(?![א-ת])\s*-?\s*((?:\d+\s*(?:[-–,\/ו]|\s)\s*)*\d+)?/g;
  var m;
  while ((m = re.exec(s))) {
    var grade = m[2], nums = m[3];
    if (!nums) { out.push({ grade: grade, classes: 'all' }); continue; }
    var classes = [];
    nums.split(/\s*[,\/ו ]\s*/).forEach(function (part) {
      var r = part.split(/\s*[-–]\s*/).map(Number);
      if (r.length === 2 && r[0] <= r[1] && r[1] - r[0] < 15) { for (var i = r[0]; i <= r[1]; i++) classes.push(i); }
      else r.forEach(function (n) { if (!isNaN(n)) classes.push(n); });
    });
    out.push({ grade: grade, classes: classes });
  }
  return out.length ? out : null;
}

/** kid = {grade:'ח', cls:2}. Returns 'yes' | 'no' | 'review'. */
function matchKid(raw, kid) {
  var aud = parseAudience(raw);
  if (!aud) return 'review';
  for (var i = 0; i < aud.length; i++) {
    var a = aud[i];
    if (a.grade !== kid.grade) continue;
    if (a.classes === 'all' || a.classes.indexOf(kid.cls) !== -1) return 'yes';
  }
  return 'no';
}

if (typeof module !== 'undefined') module.exports = { parseAudience: parseAudience, matchKid: matchKid };
