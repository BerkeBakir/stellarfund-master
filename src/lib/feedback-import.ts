// Parse a Google-Form CSV export into structured feedback entries. Tolerant of
// header-name variations and quoted fields. Consumed by the growth report and the
// Tier-4 testimonial wall. Only real, consented responses should be placed here.

export type FeedbackEntry = {
  at: string;
  name: string;
  wallet: string;
  email: string;
  rating: number | null;
  comment: string;
};

// Minimal CSV row splitter that respects double-quoted fields (incl. escaped "").
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

function pick(headers: string[], row: string[], names: string[]): string {
  for (const n of names) {
    const idx = headers.findIndex((h) => h.toLowerCase().includes(n));
    if (idx >= 0 && row[idx] != null) return row[idx].trim();
  }
  return '';
}

export function parseFeedbackCsv(text: string): FeedbackEntry[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]);
  const entries: FeedbackEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = splitCsvLine(lines[i]);
    const ratingRaw = pick(headers, row, ['rating', 'score', 'stars']);
    const rating = ratingRaw ? Number(ratingRaw.replace(/[^0-9.]/g, '')) : NaN;
    entries.push({
      at: pick(headers, row, ['timestamp', 'date', 'time']),
      name: pick(headers, row, ['name']),
      wallet: pick(headers, row, ['wallet', 'address', 'public key']),
      email: pick(headers, row, ['email', 'e-mail']),
      rating: Number.isFinite(rating) ? rating : null,
      comment: pick(headers, row, ['feedback', 'comment', 'message', 'suggestion']),
    });
  }
  return entries;
}
