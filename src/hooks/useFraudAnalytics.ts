import { useMemo } from 'react';
import type {
  LumpsumPatternAnalysis,
  LumpsumCluster,
  RecurringPatternAnalysis,
  RecurringCluster,
  RoundTrippingAnalysis,
} from '@/types/fraud';

interface TransactionRow {
  id: string;
  occurred_at: string;
  amount: number;
  direction: string;
  counterparty?: string | null;
  narration?: string | null;
}

interface BankStatementRow {
  bank_transactions?: TransactionRow[];
}

/**
 * Compute fraud analytics from bank transaction data.
 * Lumpsum, Recurring, and Round-Tripping patterns are identified heuristically.
 */
export function useFraudAnalytics(bankStatements: BankStatementRow[] | undefined | null) {
  return useMemo(() => {
    if (!bankStatements || bankStatements.length === 0) return null;

    const allTx: TransactionRow[] = bankStatements.flatMap((s) => s.bank_transactions || []);
    if (allTx.length === 0) return null;

    const debits = allTx.filter((t) => t.direction === 'debit');

    // ── Lumpsum Patterns ──
    // Group large round-number debits by counterparty
    const roundAmountThreshold = 50000;
    const lumpsumTx = debits.filter((t) => Number(t.amount) >= roundAmountThreshold && Number(t.amount) % 1000 === 0);
    const lumpsumGroups: Record<string, TransactionRow[]> = {};
    for (const tx of lumpsumTx) {
      const key = tx.counterparty || tx.narration?.substring(0, 30) || 'Unknown';
      if (!lumpsumGroups[key]) lumpsumGroups[key] = [];
      lumpsumGroups[key].push(tx);
    }

    const lumpsumClusters: LumpsumCluster[] = Object.entries(lumpsumGroups)
      .filter(([, txs]) => txs.length >= 2)
      .map(([name, txs], i) => {
        const totalDebit = txs.reduce((a, t) => a + Number(t.amount), 0);
        const roundedCount = txs.filter((t) => Number(t.amount) % 10000 === 0).length;
        return {
          id: `LC${String(i + 1).padStart(3, '0')}`,
          merchantName: name,
          transactionCount: txs.length,
          roundedRatio: Math.round((roundedCount / txs.length) * 100),
          totalDebitValue: totalDebit,
          totalCreditValue: 0,
          patternType: txs.length >= 3 ? 'Recurring' as const : 'One-time' as const,
          riskLevel: totalDebit > 1000000 ? 'High' as const : totalDebit > 500000 ? 'Medium' as const : 'Low' as const,
        };
      })
      .slice(0, 10);

    const lumpsumAnalysis: LumpsumPatternAnalysis = {
      totalClusters: lumpsumClusters.length,
      totalTransactions: lumpsumClusters.reduce((a, c) => a + c.transactionCount, 0),
      accountsWithActivity: bankStatements.length,
      totalDebitAmount: lumpsumClusters.reduce((a, c) => a + c.totalDebitValue, 0),
      riskLevel: lumpsumClusters.some((c) => c.riskLevel === 'High') ? 'High' : lumpsumClusters.length > 0 ? 'Medium' : 'Low',
      clusters: lumpsumClusters,
    };

    // ── Recurring Patterns ──
    // Group debits by counterparty with >= 3 occurrences
    const debitGroups: Record<string, TransactionRow[]> = {};
    for (const tx of debits) {
      const key = tx.counterparty || tx.narration?.substring(0, 30) || 'Unknown';
      if (!debitGroups[key]) debitGroups[key] = [];
      debitGroups[key].push(tx);
    }

    const recurringClusters: RecurringCluster[] = Object.entries(debitGroups)
      .filter(([, txs]) => txs.length >= 3)
      .map(([name, txs], i) => {
        const totalDebit = txs.reduce((a, t) => a + Number(t.amount), 0);
        const avg = totalDebit / txs.length;
        const amounts = txs.map((t) => Number(t.amount));
        const stdDev = Math.sqrt(amounts.reduce((a, v) => a + (v - avg) ** 2, 0) / amounts.length);
        const cv = avg > 0 ? stdDev / avg : 0;
        return {
          id: `RC${String(i + 1).padStart(3, '0')}`,
          counterpartyName: name,
          transactionCount: txs.length,
          averageDebitAmount: Math.round(avg),
          totalDebitExposure: totalDebit,
          patternClassification: 'Recurring' as const,
          runningBalanceTrend: cv < 0.2 ? 'Positive' as const : cv < 0.5 ? 'Variable' as const : 'Negative' as const,
        };
      })
      .sort((a, b) => b.totalDebitExposure - a.totalDebitExposure)
      .slice(0, 10);

    const totalRecurringDebit = recurringClusters.reduce((a, c) => a + c.totalDebitExposure, 0);
    const recurringAnalysis: RecurringPatternAnalysis = {
      totalClusters: recurringClusters.length,
      totalTransactions: recurringClusters.reduce((a, c) => a + c.transactionCount, 0),
      accountsWithActivity: bankStatements.length,
      averageDebitAmount: recurringClusters.length > 0
        ? Math.round(totalRecurringDebit / recurringClusters.reduce((a, c) => a + c.transactionCount, 0))
        : 0,
      totalDebitExposure: totalRecurringDebit,
      riskLevel: recurringClusters.length > 5 ? 'High' : recurringClusters.length > 2 ? 'Medium' : 'Low',
      clusters: recurringClusters,
      highRiskIndicators: [
        ...(recurringClusters.filter((c) => c.runningBalanceTrend === 'Variable').length > 0
          ? [`${recurringClusters.filter((c) => c.runningBalanceTrend === 'Variable').length} clusters with variable balance trends`]
          : []),
        ...(recurringClusters.length > 5 ? ['High number of recurring debit clusters'] : []),
      ],
    };

    // ── Round Tripping ──
    // Check for same-day credit+debit to same counterparty
    const txByDate: Record<string, TransactionRow[]> = {};
    for (const tx of allTx) {
      if (!txByDate[tx.occurred_at]) txByDate[tx.occurred_at] = [];
      txByDate[tx.occurred_at].push(tx);
    }

    let roundTrippingFound = false;
    for (const [, dateTxs] of Object.entries(txByDate)) {
      const credits = dateTxs.filter((t) => t.direction === 'credit');
      const debits = dateTxs.filter((t) => t.direction === 'debit');
      for (const cr of credits) {
        for (const dr of debits) {
          if (cr.counterparty && dr.counterparty && cr.counterparty === dr.counterparty && Math.abs(Number(cr.amount) - Number(dr.amount)) < Number(cr.amount) * 0.1) {
            roundTrippingFound = true;
            break;
          }
        }
        if (roundTrippingFound) break;
      }
      if (roundTrippingFound) break;
    }

    const roundTrippingAnalysis: RoundTrippingAnalysis = {
      clustersFound: roundTrippingFound,
      totalChains: roundTrippingFound ? 1 : 0,
      riskLevel: roundTrippingFound ? 'Medium' : 'None',
      chains: [],
      summary: roundTrippingFound
        ? 'Potential round-tripping patterns detected. Same-day credits and debits to similar counterparties found.'
        : 'No round-tripping patterns detected in the analyzed transaction data.',
    };

    return {
      lumpsumAnalysis,
      recurringAnalysis,
      roundTrippingAnalysis,
    };
  }, [bankStatements]);
}
