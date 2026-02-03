import { describe, it, expect } from 'vitest';
import { parseCsv, parseBankFile } from '../bankParser';

const sampleCsv = `Date,Description,Amount,Type\n2025-01-01,ACME PAYMENTS,1000,CR\n2025-01-03,PAYMENT TO SUPPLIER,-250,DR\n`;

describe('bankParser (CSV)', () => {
  it('parses CSV rows into transactions', () => {
    const parsed = parseCsv(sampleCsv);
    expect(parsed.transactions.length).toBe(2);
    const [a, b] = parsed.transactions;
    expect(a.direction).toBe('credit');
    expect(a.amount).toBe(1000);
    expect(b.direction).toBe('debit');
    expect(b.amount).toBe(250);
  });

  it('parseBankFile detects CSV by name', async () => {
    const fakeFile = new File([sampleCsv], 'stmt.csv', { type: 'text/csv' });
    const parsed = await parseBankFile(fakeFile);
    expect(parsed.transactions.length).toBe(2);
  });
});
