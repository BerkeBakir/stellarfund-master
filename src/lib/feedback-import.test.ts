import { describe, it, expect } from 'vitest';
import { splitCsvLine, parseFeedbackCsv } from './feedback-import';

describe('splitCsvLine', () => {
  it('respects quoted fields with commas and escaped quotes', () => {
    expect(splitCsvLine('a,"b, c","d""e",f')).toEqual(['a', 'b, c', 'd"e', 'f']);
  });
});

describe('parseFeedbackCsv', () => {
  it('maps varied headers into structured entries', () => {
    const csv = [
      'Timestamp,Name,Wallet address,Email,Rating (1-5),Your feedback',
      '2026-07-07,Ada,GABC,ada@x.com,5,"Loved it, gasless!"',
      '2026-07-07,Ben,GDEF,ben@x.com,4,Solid',
    ].join('\n');
    const rows = parseFeedbackCsv(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ name: 'Ada', wallet: 'GABC', rating: 5, comment: 'Loved it, gasless!' });
    expect(rows[1].rating).toBe(4);
  });

  it('returns [] for an empty sheet', () => {
    expect(parseFeedbackCsv('Timestamp,Name\n')).toEqual([]);
  });
});
