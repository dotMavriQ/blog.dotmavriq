/**
 * Blog search — pure scoring functions.
 * Extracted from blog/index.astro for testability.
 */

export interface PostEntry {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  body: string;
}

/** Levenshtein distance, bails early past `limit` */
function editDist(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/** Max fuzzy edits per query-word length */
function maxEdits(len: number): number {
  if (len <= 4) return 0;
  if (len <= 7) return 1;
  if (len <= 11) return 2;
  return 3;
}

/** Score a query word against all words in a text field */
function scoreWord(qw: string, textWords: string[]): number {
  let best = 0;
  const me = maxEdits(qw.length);
  for (const tw of textWords) {
    if (tw === qw)                { best = Math.max(best, 100); break; }
    if (tw.startsWith(qw))        { best = Math.max(best, 85); continue; }
    if (me > 0) {
      const d = editDist(qw, tw, me);
      if (d <= me) best = Math.max(best, 70 - d * 15);
    }
  }
  return best;
}

/** Score all query words against a field */
function scoreField(qWords: string[], fieldWords: string[]): number {
  if (!fieldWords.length) return 0;
  let total = 0;
  for (const qw of qWords) {
    const s = scoreWord(qw, fieldWords);
    if (s === 0) return 0;
    total += s;
  }
  return total / qWords.length;
}

/** Tokenize text into lowercase words */
function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[\s,.:;!?'"_\-/\\()\[\]{}|]+/).filter(w => w.length > 0);
}

export interface CardData {
  title: string;
  excerpt: string;
  tags: string;
  body: string;
}

/** Full scoring: title > tags > excerpt > body */
export function scorePost(query: string, card: CardData): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const qWords = tokenize(q);
  if (!qWords.length) return 1;

  const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const phraseRe = qWords.length === 1
    ? new RegExp(`\\b${escapedQ}\\b`)
    : null;
  const exactHit = (text: string) => phraseRe ? phraseRe.test(text.toLowerCase()) : text.toLowerCase().includes(q);

  if (exactHit(card.title))   return 1000;
  if (exactHit(card.body))    return 500;
  if (exactHit(card.tags))    return 450;
  if (exactHit(card.excerpt)) return 400;

  const titleWords   = tokenize(card.title);
  const excerptWords = tokenize(card.excerpt);
  const tagWords     = tokenize(card.tags);
  const bodyWords    = card.body ? tokenize(card.body) : [];

  const tScore = scoreField(qWords, titleWords)   * 4.0;
  const gScore = scoreField(qWords, tagWords)     * 2.5;
  const eScore = scoreField(qWords, excerptWords) * 1.5;
  const bScore = scoreField(qWords, bodyWords)    * 1.0;

  return Math.max(tScore, gScore, eScore, bScore);
}
