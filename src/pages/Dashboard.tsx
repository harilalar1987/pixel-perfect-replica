import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { LoanCard } from '@/components/loans/LoanCard';
import { LoanFilters } from '@/components/loans/LoanFilters';
import { useLoans, Loan } from '@/hooks/useLoans';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FolderOpen, Users, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { LoanApplication, LoanType, LoanStatus } from '@/types/loan';

// Map database loan to UI LoanApplication format
const mapLoanToApplication = (loan: Loan): LoanApplication => {
  const loanTypeMap: Record<string, LoanType> = {
    'WCBL': 'Working Capital',
    'Term Loan': 'Term Loan',
    'LAP': 'Property Loan',
    'OD': 'Overdraft',
    'CC': 'Cash Credit',
  };

  const statusMap: Record<string, LoanStatus> = {
    'under-review': 'Under Review',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'processing': 'Processing',
    'disbursed': 'Approved',
  };

  return {
    id: loan.id,
    customerName: loan.customer_name,
    loanAmount: loan.loan_amount,
    loanType: loanTypeMap[loan.loan_type] || 'Working Capital',
    anchorName: loan.anchor_name || undefined,
    assignedAnalyst: loan.profiles?.full_name || 'Unassigned',
    status: statusMap[loan.status] || 'Under Review',
    createdAt: new Date(loan.created_at),
    updatedAt: new Date(loan.updated_at),
    teamName: loan.team || 'Retail',
  };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: loans, isLoading, error } = useLoans();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalyst, setSelectedAnalyst] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedLoanType, setSelectedLoanType] = useState('All Types');

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('loans-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loans',
        },
        () => {
          // Invalidate and refetch loans when any change occurs
          queryClient.invalidateQueries({ queryKey: ['loans'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const loanApplications = useMemo(() => {
    return (loans || []).map(mapLoanToApplication);
  }, [loans]);

  // Derive analyst list from DB-backed loans (prefer real data over mocks)
  const analystsList = useMemo(() => {
    return Array.from(new Set((loanApplications || []).map((l) => l.assignedAnalyst).filter(Boolean)));
  }, [loanApplications]);

  const filteredLoans = useMemo(() => {
    return loanApplications.filter((loan) => {
      const matchesSearch =
        loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAnalyst = selectedAnalyst === 'all' || loan.assignedAnalyst === selectedAnalyst;
      const matchesLoanType = selectedLoanType === 'All Types' || loan.loanType === selectedLoanType;
      return matchesSearch && matchesAnalyst && matchesLoanType;
    });
  }, [loanApplications, searchQuery, selectedAnalyst, selectedLoanType]);

  const stats = useMemo(() => {
    return {
      total: loanApplications.length,
      underReview: loanApplications.filter((l) => l.status === 'Under Review').length,
      approved: loanApplications.filter((l) => l.status === 'Approved').length,
      processing: loanApplications.filter((l) => l.status === 'Processing').length,
    };
  }, [loanApplications]);

  const handleNewApplication = () => {
    navigate('/new-application');
  };

  const handleLoanClick = (loanId: string) => {
    navigate(`/loan/${loanId}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header onNewApplication={handleNewApplication} />
        <main className="container py-8">
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <p className="text-destructive">Failed to load loans. Please try again.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNewApplication={handleNewApplication} />

      <header className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Loans</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze all loan applications for Team Supermoney
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* DB controls moved to Settings -> DB Settings */}
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Loans</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze all loan applications for Team Supermoney
          </p>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Applications', value: stats.total, icon: FolderOpen, color: 'text-accent' },
            { label: 'Under Review', value: stats.underReview, icon: Clock, color: 'text-info' },
            { label: 'Approved', value: stats.approved, icon: TrendingUp, color: 'text-success' },
            { label: 'Processing', value: stats.processing, icon: Users, color: 'text-warning' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <LoanFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedAnalyst={selectedAnalyst}
          onAnalystChange={setSelectedAnalyst}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
          selectedLoanType={selectedLoanType}
          onLoanTypeChange={setSelectedLoanType}
          analystsList={analystsList}
        />

        {/* Loan Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Loan Applications
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredLoans.length} results)
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : filteredLoans.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLoans.map((loan) => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onClick={() => handleLoanClick(loan.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No loans found</h3>
              <p className="text-muted-foreground">
                {loanApplications.length === 0 
                  ? 'Create your first loan application to get started'
                  : 'Try adjusting your search or filter criteria'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
