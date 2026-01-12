import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { analysts } from '@/lib/mockData';

interface LoanFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedAnalyst: string;
  onAnalystChange: (value: string) => void;
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
  selectedLoanType: string;
  onLoanTypeChange: (value: string) => void;
}

const timeRanges = [
  { value: 'all', label: 'All Time' },
  { value: '1d', label: 'Last 1 Day' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last 1 Year' },
];

const loanTypes = [
  'All Types',
  'Working Capital',
  'Equipment Finance',
  'Business Expansion',
  'Property Loan',
  'Personal Loan',
  'Credit Card',
  'Term Loan',
  'Overdraft',
  'Cash Credit',
];

export function LoanFilters({
  searchQuery,
  onSearchChange,
  selectedAnalyst,
  onAnalystChange,
  selectedTimeRange,
  onTimeRangeChange,
  selectedLoanType,
  onLoanTypeChange,
}: LoanFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-xl border border-border shadow-card">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer name or loan ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        <Select value={selectedAnalyst} onValueChange={onAnalystChange}>
          <SelectTrigger className="w-[160px] bg-background border-border">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Analysts</SelectItem>
            {analysts.map((analyst) => (
              <SelectItem key={analyst} value={analyst}>
                {analyst}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[140px] bg-background border-border">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLoanType} onValueChange={onLoanTypeChange}>
          <SelectTrigger className="w-[160px] bg-background border-border">
            <SelectValue placeholder="Loan Type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {loanTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
