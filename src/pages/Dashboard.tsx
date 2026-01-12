import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { LoanCard } from '@/components/loans/LoanCard';
import { LoanFilters } from '@/components/loans/LoanFilters';
import { mockLoans } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { FolderOpen, Users, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalyst, setSelectedAnalyst] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedLoanType, setSelectedLoanType] = useState('All Types');

  const filteredLoans = useMemo(() => {
    return mockLoans.filter((loan) => {
      const matchesSearch =
        loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAnalyst = selectedAnalyst === 'all' || loan.assignedAnalyst === selectedAnalyst;
      const matchesLoanType = selectedLoanType === 'All Types' || loan.loanType === selectedLoanType;
      return matchesSearch && matchesAnalyst && matchesLoanType;
    });
  }, [searchQuery, selectedAnalyst, selectedLoanType]);

  const stats = useMemo(() => {
    return {
      total: mockLoans.length,
      underReview: mockLoans.filter((l) => l.status === 'Under Review').length,
      approved: mockLoans.filter((l) => l.status === 'Approved').length,
      processing: mockLoans.filter((l) => l.status === 'Processing').length,
    };
  }, []);

  const handleNewApplication = () => {
    navigate('/new-application');
  };

  const handleLoanClick = (loanId: string) => {
    navigate(`/loan/${loanId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNewApplication={handleNewApplication} />

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

          {filteredLoans.length > 0 ? (
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
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
