import { useMemo } from 'react';
import { format, parseISO, differenceInMonths } from 'date-fns';
import type {
  BankAccount,
  TransactionSummary,
  BankingConductAnalysis,
  CashFlowPattern,
  BalanceBehavior,
  BankingRedFlags,
  AIBankingAssessment,
  OutwardChequeBounce,
  InwardChequeBounce,
  BankingEMIBounce,
  CashVsNonCash,
  MonthlyBalance,
} from '@/types/banking';

interface BankStatementRow {
  id: string;
  account_mask?: string | null;
  account_number?: string | null;
  statement_from?: string | null;
  statement_to?: string | null;
  opening_balance?: number | null;
  closing_balance?: number | null;
  meta?: Record<string, any> | null;
  bank_transactions?: TransactionRow[];
}

interface TransactionRow {
  id: string;
  occurred_at: string;
  amount: number;
  direction: string;
  counterparty?: string | null;
  narration?: string | null;
}

function groupByMonth(transactions: TransactionRow[]) {
  const groups: Record<string, TransactionRow[]> = {};
  for (const tx of transactions) {
    const d = parseISO(tx.occurred_at);
    const key = format(d, 'MMM yyyy');
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }
  return groups;
}

export function useBankingAnalytics(bankStatements: BankStatementRow[] | undefined | null) {
  return useMemo(() => {
    if (!bankStatements || bankStatements.length === 0) return null;

    const allTx: TransactionRow[] = bankStatements.flatMap((s) => s.bank_transactions || []);

    if (allTx.length === 0) return null;

    // ── Accounts ──
    const accounts: BankAccount[] = bankStatements.map((s) => ({
      id: s.id,
      maskedAccountNumber: s.account_mask || (s.account_number ? `XXXX${String(s.account_number).slice(-4)}` : '—'),
      bankName: (s.meta as any)?.bank_name || '—',
      accountType: 'Current Account' as const,
      branchName: (s.meta as any)?.branch || undefined,
      ifscCode: (s.meta as any)?.ifsc || undefined,
      accountName: s.account_number || '—',
      statementPeriod:
        s.statement_from && s.statement_to
          ? `${new Date(s.statement_from).toLocaleDateString('en-IN')} - ${new Date(s.statement_to).toLocaleDateString('en-IN')}`
          : '—',
    }));

    // ── Transaction Summary ──
    const credits = allTx.filter((t) => t.direction === 'credit');
    const debits = allTx.filter((t) => t.direction === 'debit');
    const totalCredits = credits.reduce((a, t) => a + Number(t.amount), 0);
    const totalDebits = debits.reduce((a, t) => a + Number(t.amount), 0);
    const months = groupByMonth(allTx);
    const monthCount = Object.keys(months).length || 1;

    const transactionSummary: TransactionSummary = {
      totalCredits,
      totalDebits,
      totalTransactions: allTx.length,
      analysisPeriods: monthCount,
    };

    // ── Cash Flow Patterns ──
    const sortedMonthKeys = Object.keys(months).sort((a, b) => {
      const da = new Date(a);
      const db = new Date(b);
      return db.getTime() - da.getTime(); // newest first
    });

    const cashFlowPatterns: CashFlowPattern[] = sortedMonthKeys.map((m) => {
      const txs = months[m];
      const cr = txs.filter((t) => t.direction === 'credit');
      const dr = txs.filter((t) => t.direction === 'debit');
      const crSum = cr.reduce((a, t) => a + Number(t.amount), 0);
      const drSum = dr.reduce((a, t) => a + Number(t.amount), 0);
      return {
        month: m,
        credits: crSum,
        debits: drSum,
        netCashFlow: crSum - drSum,
        creditCount: cr.length,
        debitCount: dr.length,
      };
    });

    // ── Conduct Analysis ──
    const avgTxPerMonth = allTx.length / monthCount;
    const txFrequency: 'Low' | 'Medium' | 'High' = avgTxPerMonth > 100 ? 'High' : avgTxPerMonth > 30 ? 'Medium' : 'Low';
    const creditDebitDominance: 'Credit Dominant' | 'Balanced' | 'Debit Dominant' =
      totalCredits > totalDebits * 1.1 ? 'Credit Dominant' : totalDebits > totalCredits * 1.1 ? 'Debit Dominant' : 'Balanced';

    // Determine cash vs digital (heuristic: narrations containing "cash", "atm", "cdm")
    const cashKeywords = ['cash', 'atm', 'cdm', 'cash deposit', 'cash withdrawal'];
    const cashTx = allTx.filter((t) => cashKeywords.some((k) => (t.narration || '').toLowerCase().includes(k)));
    const cashPct = (cashTx.length / allTx.length) * 100;
    const digitalVsCash: 'Digital Dominant' | 'Mixed' | 'Cash Dominant' = cashPct < 20 ? 'Digital Dominant' : cashPct < 50 ? 'Mixed' : 'Cash Dominant';

    // Consistency: check if all months have transactions
    const monthlyTxCounts = Object.values(months).map((t) => t.length);
    const avgCount = monthlyTxCounts.reduce((a, b) => a + b, 0) / monthlyTxCounts.length;
    const stdDev = Math.sqrt(monthlyTxCounts.reduce((a, c) => a + (c - avgCount) ** 2, 0) / monthlyTxCounts.length);
    const cv = stdDev / avgCount;
    const usageConsistency: 'Consistent' | 'Variable' | 'Irregular' = cv < 0.3 ? 'Consistent' : cv < 0.6 ? 'Variable' : 'Irregular';

    const conductAnalysis: BankingConductAnalysis = {
      transactionFrequency: txFrequency,
      creditDebitDominance,
      digitalVsCash,
      usageConsistency,
      insights: [
        `Average of ${Math.round(avgTxPerMonth)} transactions per month`,
        `Total credits: ₹${(totalCredits / 100000).toFixed(1)}L, Total debits: ₹${(totalDebits / 100000).toFixed(1)}L`,
        `${cashPct.toFixed(1)}% cash transactions, ${(100 - cashPct).toFixed(1)}% digital`,
        `Transaction activity is ${usageConsistency.toLowerCase()} across months`,
      ],
    };

    // ── Cash vs Non-Cash ──
    const cashCredits = allTx.filter((t) => t.direction === 'credit' && cashKeywords.some((k) => (t.narration || '').toLowerCase().includes(k)));
    const cashDebits = allTx.filter((t) => t.direction === 'debit' && cashKeywords.some((k) => (t.narration || '').toLowerCase().includes(k)));
    const cashDepositValue = cashCredits.reduce((a, t) => a + Number(t.amount), 0);
    const cashWithdrawalValue = cashDebits.reduce((a, t) => a + Number(t.amount), 0);

    const cashVsNonCash: CashVsNonCash = {
      cashDepositPercentage: totalCredits > 0 ? Number(((cashDepositValue / totalCredits) * 100).toFixed(1)) : 0,
      cashWithdrawalPercentage: totalDebits > 0 ? Number(((cashWithdrawalValue / totalDebits) * 100).toFixed(1)) : 0,
      cashDepositValue,
      cashWithdrawalValue,
    };

    // ── Monthly Balances (estimated from running balance) ──
    // We compute running balance per month from opening balance + transactions
    const openingBal = bankStatements[0]?.opening_balance ?? 0;
    let runningBalance = Number(openingBal);
    const monthlyBalances: MonthlyBalance[] = [];
    // Process chronologically (reverse of sortedMonthKeys)
    const chronological = [...sortedMonthKeys].reverse();
    for (const m of chronological) {
      const txs = months[m];
      const balances: number[] = [runningBalance];
      for (const tx of txs.sort((a, b) => a.occurred_at.localeCompare(b.occurred_at))) {
        runningBalance += tx.direction === 'credit' ? Number(tx.amount) : -Number(tx.amount);
        balances.push(runningBalance);
      }
      monthlyBalances.push({
        month: m,
        averageBalance: Math.round(balances.reduce((a, b) => a + b, 0) / balances.length),
        lowestBalance: Math.min(...balances),
        closingBalance: runningBalance,
      });
    }
    monthlyBalances.reverse(); // newest first

    // ── Balance Behavior ──
    const allAvgBalances = monthlyBalances.map((m) => m.averageBalance);
    const negativeMonths = monthlyBalances.filter((m) => m.lowestBalance < 0);

    const balanceBehavior: BalanceBehavior = {
      averageEODBalance: Math.round(allAvgBalances.reduce((a, b) => a + b, 0) / allAvgBalances.length),
      lowestBalance: Math.min(...monthlyBalances.map((m) => m.lowestBalance)),
      frequencyOfNegativeBalances: negativeMonths.length,
      overdraftUsage: negativeMonths.length > 0
        ? {
            frequency: negativeMonths.length,
            averageDuration: 3, // approximate
            maxNegativeBalance: Math.abs(Math.min(...monthlyBalances.map((m) => m.lowestBalance).filter((b) => b < 0), 0)),
          }
        : undefined,
    };

    // ── Red Flags ──
    const netCashOutflow = totalDebits > totalCredits;
    const redFlags: BankingRedFlags = {
      frequentChequeBounces: false, // can't detect from transactions alone
      negativeEODBalances: negativeMonths.length > 0,
      netCashOutflow,
      excessiveOverdraftDependence: negativeMonths.length > monthCount * 0.3,
      details: [
        ...(negativeMonths.length > 0
          ? [`${negativeMonths.length} month(s) with negative balance observed`]
          : ['No negative balances observed']),
        ...(netCashOutflow ? ['Net cash outflow detected over the analysis period'] : []),
        `Cash deposit percentage: ${cashVsNonCash.cashDepositPercentage}%`,
      ],
    };

    // ── Bounce Analysis (heuristic from narrations) ──
    const bounceKeywords = ['bounce', 'returned', 'dishonour', 'unpaid'];
    const outwardBounces = allTx.filter(
      (t) => t.direction === 'debit' && bounceKeywords.some((k) => (t.narration || '').toLowerCase().includes(k))
    );
    const inwardBounces = allTx.filter(
      (t) => t.direction === 'credit' && bounceKeywords.some((k) => (t.narration || '').toLowerCase().includes(k))
    );
    const emiKeywords = ['emi', 'loan', 'instalment', 'installment'];
    const emiBounces = outwardBounces.filter((t) =>
      emiKeywords.some((k) => (t.narration || '').toLowerCase().includes(k))
    );

    const outwardChequeBounce: OutwardChequeBounce = {
      chequesDeposited: credits.length,
      chequesBounced: outwardBounces.length,
      bounceRate: credits.length > 0 ? Number(((outwardBounces.length / credits.length) * 100).toFixed(2)) : 0,
      validMonths: monthCount,
      excludedMonths: 0,
    };

    const inwardChequeBounce: InwardChequeBounce = {
      chequesIssued: debits.length,
      chequesBounced: inwardBounces.length,
      bounceRate: debits.length > 0 ? Number(((inwardBounces.length / debits.length) * 100).toFixed(2)) : 0,
    };

    const bankingEMIBounce: BankingEMIBounce = {
      totalEmiBounces: emiBounces.length,
      recencyOfBounces: emiBounces.length > 0 ? 'Recent' : 'None',
      frequency: emiBounces.length === 0 ? 'None' : emiBounces.length <= 2 ? 'Occasional' : 'Repeated',
    };

    // ── AI Assessment (computed heuristics) ──
    const riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' =
      negativeMonths.length === 0 && !netCashOutflow && outwardBounces.length === 0
        ? 'Low Risk'
        : negativeMonths.length <= 2 && outwardBounces.length <= 3
        ? 'Moderate Risk'
        : 'High Risk';

    const aiAssessment: AIBankingAssessment = {
      financialDiscipline: avgTxPerMonth > 50 ? 'Good - Active and consistent transaction patterns' : 'Moderate - Limited transaction activity',
      liquidityStrength: balanceBehavior.averageEODBalance > 500000
        ? `Good - Average EOD balance of ₹${(balanceBehavior.averageEODBalance / 100000).toFixed(1)}L`
        : `Low - Average EOD balance of ₹${(balanceBehavior.averageEODBalance / 100000).toFixed(1)}L`,
      riskOfDefault: outwardBounces.length === 0 && emiBounces.length === 0
        ? 'Low - No bounce history detected'
        : `Moderate - ${outwardBounces.length} bounces detected`,
      creditworthiness: riskLevel === 'Low Risk'
        ? 'Positive - Healthy banking conduct'
        : 'Needs Review - Some concerns identified',
      riskLevel,
      summary: `Banking analysis based on ${allTx.length} transactions over ${monthCount} months. Total credits: ₹${(totalCredits / 100000).toFixed(1)}L, Total debits: ₹${(totalDebits / 100000).toFixed(1)}L. ${negativeMonths.length > 0 ? `${negativeMonths.length} month(s) with negative balances.` : 'No negative balance instances.'} Overall risk assessment: ${riskLevel}.`,
    };

    return {
      accounts,
      transactionSummary,
      conductAnalysis,
      cashFlowPatterns,
      balanceBehavior,
      redFlags,
      aiAssessment,
      outwardChequeBounce,
      inwardChequeBounce,
      bankingEMIBounce,
      cashVsNonCash,
      monthlyBalances,
    };
  }, [bankStatements]);
}
