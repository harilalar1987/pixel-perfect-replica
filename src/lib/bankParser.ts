import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export type ParsedTransaction = {
  occurred_at: string; // ISO date
  amount: number;
  direction: 'credit' | 'debit';
  counterparty?: string;
  narration?: string;
  raw?: Record<string, any>;
};

export type ParsedStatement = {
  account_mask?: string;
  account_number?: string;
  statement_from?: string | null;
  statement_to?: string | null;
  opening_balance?: number | null;
  closing_balance?: number | null;
  currency?: string;
  transactions: ParsedTransaction[];
  meta?: Record<string, any>;
};

function guessDate(value: any): string | null {
  if (!value && value !== 0) return null;
  // try Date constructor first
  const asDate = new Date(String(value));
  if (!Number.isNaN(asDate.getTime())) return asDate.toISOString().slice(0, 10);

  // common dd/mm/yyyy or dd-mm-yyyy
  const m = String(value).match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const month = m[2].padStart(2, '0');
    let year = m[3];
    if (year.length === 2) year = '20' + year;
    return `${year}-${month}-${day}`;
  }

  return null;
}

function guessAmount(row: Record<string, any>): { amount: number; direction: 'credit' | 'debit' } | null {
  const keys = Object.keys(row).map((k) => k.toLowerCase());
  const valCandidates: Array<[string, any]> = [];
  for (const k of Object.keys(row)) {
    const lk = k.toLowerCase();
    if (/amount|amt|value/.test(lk)) valCandidates.push([k, row[k]]);
    if (/credit/.test(lk)) valCandidates.push([k, row[k]]);
    if (/debit/.test(lk)) valCandidates.push([k, row[k]]);
    if (/withdrawal|dr|debit\s*amt/.test(lk)) valCandidates.push([k, row[k]]);
    if (/deposit|cr|credit\s*amt/.test(lk)) valCandidates.push([k, row[k]]);
  }

  if (valCandidates.length === 0) return null;

  // Prefer a column that looks numeric
  for (const [k, v] of valCandidates) {
    const num = Number(String(v).replace(/[^0-9.-]/g, ''));
    if (!Number.isNaN(num) && num !== 0) {
      // determine direction by column name or sign
      const lk = k.toLowerCase();
      if (/credit|cr/.test(lk)) return { amount: Math.abs(num), direction: 'credit' };
      if (/debit|dr/.test(lk)) return { amount: Math.abs(num), direction: 'debit' };
      return { amount: Math.abs(num), direction: num < 0 ? 'debit' : 'credit' };
    }
  }

  // fallback: first candidate coerced
  const [k, v] = valCandidates[0];
  const num = Number(String(v).replace(/[^0-9.-]/g, ''));
  if (!Number.isNaN(num)) return { amount: Math.abs(num), direction: num < 0 ? 'debit' : 'credit' };
  return null;
}

export async function parseBankFile(file: File): Promise<ParsedStatement> {
  const name = file.name.toLowerCase();
  
  // CSV files
  if (name.endsWith('.csv') || file.type === 'text/csv') {
    return parseCsv(await file.text());
  }

  // Excel files
  if (name.endsWith('.xls') || name.endsWith('.xlsx') || /spreadsheet/.test(file.type)) {
    return parseXlsx(await file.arrayBuffer());
  }

  // PDF files - return indicator that AI parsing is needed
  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    return { 
      transactions: [], 
      meta: { requires_ai_parsing: true, file_type: 'pdf' } 
    };
  }

  // unknown format — return empty structure
  return { transactions: [], meta: { reason: 'unsupported_format' } };
}

// Check if a file needs AI-powered parsing (PDF)
export function requiresAIParsing(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.pdf') || file.type === 'application/pdf';
}

export function parseCsv(contents: string): ParsedStatement {
  const parsed = Papa.parse(contents, { header: true, skipEmptyLines: true });
  const rows = parsed.data as Record<string, any>[];
  return rowsToStatement(rows);
}

export function parseXlsx(buffer: ArrayBuffer): ParsedStatement {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return rowsToStatement(rows as Record<string, any>[]);
}

function rowsToStatement(rows: Record<string, any>[]): ParsedStatement {
  const txs: ParsedTransaction[] = [];
  for (const r of rows) {
    const occurred_at = guessDate(r.date || r.Date || r.transaction_date || r['Txn Date'] || r['Value Date']) || guessDate(r['Posted Date']) || null;
    const amt = guessAmount(r);
    if (!amt) continue;
    const narration = r.narration || r['Description'] || r['Info'] || r['Narration'] || r['Remarks'] || '';
    const counterparty = r['Counterparty'] || r['Payee'] || r['Payee Name'] || r['Merchant'] || r['Beneficiary'] || '';
    txs.push({
      occurred_at: occurred_at || new Date().toISOString().slice(0, 10),
      amount: amt.amount,
      direction: amt.direction,
      counterparty: String(counterparty).trim() || undefined,
      narration: String(narration).trim() || undefined,
      raw: r,
    });
  }

  // best-effort statement-level metadata
  const first = rows[0] || {};
  const meta: Record<string, any> = {};
  if (first['Account'] || first['Account Number'] || first['Account No']) meta.account_number = first['Account'] || first['Account Number'] || first['Account No'];
  if (first['Opening Balance'] || first['Open Balance']) meta.opening_balance = Number(String(first['Opening Balance'] || first['Open Balance']).replace(/[^0-9.-]/g, '')) || null;
  if (first['Closing Balance'] || first['Close Balance']) meta.closing_balance = Number(String(first['Closing Balance'] || first['Close Balance']).replace(/[^0-9.-]/g, '')) || null;

  return {
    account_mask: meta.account_number ? String(meta.account_number).slice(-4).padStart(4, 'X') : undefined,
    account_number: meta.account_number,
    opening_balance: meta.opening_balance ?? null,
    closing_balance: meta.closing_balance ?? null,
    transactions: txs,
    meta,
  };
}
