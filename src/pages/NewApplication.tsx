import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Lock,
  FileCheck,
  Building2,
  IndianRupee,
  User,
} from 'lucide-react';
import { LoanType } from '@/types/loan';
import { createClient } from '@supabase/supabase-js';
import { parseBankFile, ParsedStatement } from '@/lib/bankParser';
import { useUploadAndParseBankStatement } from '@/hooks/useLoans';

const loanTypes: LoanType[] = [
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

const steps = [
  { id: 1, title: 'Loan Information', icon: FileText },
  { id: 2, title: 'Document Upload', icon: Upload },
  { id: 3, title: 'Review & Save', icon: CheckCircle2 },
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export default function NewApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanType, setLoanType] = useState<LoanType | ''>('');
  const [anchorName, setAnchorName] = useState('');
  const [anchorAmount, setAnchorAmount] = useState('');
  const [bankStatementDuration, setBankStatementDuration] = useState<'6' | '12'>('6');
  
  // File upload state
  const [bureauReports, setBureauReports] = useState<UploadedFile[]>([]);
  const [bankStatements, setBankStatements] = useState<UploadedFile[]>([]);
  const [bankFiles, setBankFiles] = useState<File[]>([]);
  const [gstDocuments, setGstDocuments] = useState<UploadedFile[]>([]);
  const [bankPreviews, setBankPreviews] = useState<ParsedStatement[]>([]);
  const [bankPassword, setBankPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setter((prev) => [...prev, ...newFiles]);
      
      // Check for password protected files (simulated)
      if (Math.random() > 0.7) {
        setShowPasswordField(true);
      }
    }
  };

  // Specialized handler for bank statements: parse CSV/XLSX client-side and keep a preview
  const handleBankFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const arr = Array.from(files);
    // update metadata state + keep the original File for upload
    setBankStatements((prev) => [...prev, ...arr.map((f) => ({ name: f.name, size: f.size, type: f.type }))]);
    setBankFiles((prev) => [...prev, ...arr]);

    // parse and keep a lightweight preview for the user
    const previews: ParsedStatement[] = [];
    for (const f of arr) {
      try {
        const parsed = await parseBankFile(f);
        previews.push(parsed);
      } catch (err) {
        console.warn('Failed to parse bank file for preview', err);
        previews.push({ transactions: [], meta: { error: 'parse_failed' } });
      }
    }
    setBankPreviews((prev) => [...prev, ...previews]);
  };

  const isStep1Valid = customerName && loanAmount && loanType;
  const isStep2Valid = bureauReports.length > 0 && bankStatements.length > 0;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: 'Draft Saved',
      description: 'Your application has been saved as a draft',
    });
    navigate('/dashboard');
  };

  const uploadAndParse = useUploadAndParseBankStatement();

  const handleSubmit = async () => {
    // Map frontend values to DB schema and validate required columns
    const mapLoanType = (frontend: string | '') => {
      // DB enum: ('WCBL', 'Term Loan', 'LAP', 'OD', 'CC')
      return frontend === 'Working Capital' ? 'WCBL'
        : frontend === 'Term Loan' ? 'Term Loan'
        : frontend === 'Overdraft' ? 'OD'
        : frontend === 'Cash Credit' ? 'CC'
        : frontend === 'Property Loan' ? 'LAP'
        : frontend === 'Credit Card' ? 'CC'
        : frontend === 'Equipment Finance' ? 'Term Loan'
        : frontend === 'Business Expansion' ? 'Term Loan'
        : frontend === 'Personal Loan' ? 'Term Loan'
        : 'WCBL';
    };

    const generateApplicationId = () => `LN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    const payloadForDb: Record<string, any> = {
      application_id: generateApplicationId(),
      customer_name: customerName || null,
      loan_amount: loanAmount ? Number(loanAmount) : null,
      loan_type: mapLoanType(loanType || ''),
      anchor_name: anchorName || null,
      // team will default to 'Retail' in DB if omitted
    };

    // Client-side validation for required DB fields
    if (!payloadForDb.application_id || !payloadForDb.customer_name || payloadForDb.loan_amount == null) {
      console.warn('Validation failed before submit:', payloadForDb);
      toast({ title: 'Validation error', description: 'Please provide Customer Name and Loan Amount.' });
      return;
    }

    console.log('Submitting new loan payload (DB schema):', payloadForDb);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        const msg = 'Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY)';
        console.error(msg);
        toast({ title: 'Configuration error', description: msg });
        return;
      }

      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Insert only known columns (drop anything that doesn't exist in DB schema)
      const { data, error } = await supabase.from('loans').insert(payloadForDb).select();

      if (error) {
        console.error('Supabase insert error:', error);

        // If error indicates missing/renamed DB column, surface a helpful message
        if (error.message && /Could not find the/.test(error.message)) {
          console.error('Column mismatch — app is sending keys that do not exist in the loans table.');
          toast({ title: 'Submission failed', description: `Schema mismatch: ${error.message}` });
          return;
        }

        // RLS / permission errors
        if (error.message && /permission denied|forbidden|row level security/i.test(error.message)) {
          toast({ title: 'Permission denied', description: 'Ensure the user is authenticated and RLS policies allow inserts.' });
          return;
        }

        toast({ title: 'Submission failed', description: error.message || 'Unable to create loan' });
        return;
      }

      console.log('Insert result:', data);

      const created = Array.isArray(data) && data[0] ? data[0] : data;
      const id = created && (created.id || created.application_id || created.loan_id);

      // If bank files were selected, upload & parse them and persist parsed rows before navigating
      if (id && bankFiles.length > 0) {
        try {
          await Promise.all(bankFiles.map((f) => uploadAndParse.mutateAsync({ file: f, loanId: id })));
          toast({ title: 'Application Submitted', description: 'Bank statements uploaded and parsed.' });
        } catch (err) {
          console.warn('One or more bank files failed to ingest:', err);
          toast({ title: 'Partial success', description: 'Loan created but one or more bank files failed to parse.' });
        }
      } else {
        toast({ title: 'Application Submitted', description: 'Your loan analysis has been created. 1 credit consumed.' });
      }

      if (id) {
        navigate(`/loan/${id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      console.error('Unexpected error creating loan:', e);
      toast({ title: 'Submission error', description: String(e) });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            New Loan Application
          </h1>
          <p className="text-muted-foreground">
            Complete the following steps to create a new loan analysis
          </p>

          {/* Step Progress */}
          <div className="mt-8">
            <Progress value={progress} className="h-2 mb-6" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    step.id <= currentStep ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id < currentStep
                        ? 'gradient-accent text-accent-foreground'
                        : step.id === currentStep
                        ? 'border-2 border-accent text-accent'
                        : 'border-2 border-muted text-muted-foreground'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium text-sm">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Loan Information
                  </CardTitle>
                  <CardDescription>
                    Enter the basic details for this loan application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Customer Name *
                      </Label>
                      <Input
                        id="customerName"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loanAmount" className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        Loan Amount (₹) *
                      </Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Loan Type *
                      </Label>
                      <Select value={loanType} onValueChange={(value) => setLoanType(value as LoanType)}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select loan type" />
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

                    <div className="space-y-2">
                      <Label htmlFor="anchorName">Anchor Name</Label>
                      <Input
                        id="anchorName"
                        placeholder="Optional"
                        value={anchorName}
                        onChange={(e) => setAnchorName(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="anchorAmount">Anchor Suggested Amount (₹)</Label>
                      <Input
                        id="anchorAmount"
                        type="number"
                        placeholder="Optional"
                        value={anchorAmount}
                        onChange={(e) => setAnchorAmount(e.target.value)}
                        className="bg-background border-border max-w-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Bureau Reports */}
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-accent" />
                    Bureau Reports *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
                    <input
                      type="file"
                      id="bureau"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, setBureauReports)}
                    />
                    <label htmlFor="bureau" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-foreground font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC up to 10MB
                      </p>
                    </label>
                  </div>
                  {bureauReports.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {bureauReports.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">{file.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bank Statements */}
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    Bank Statements *
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label>Duration:</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={bankStatementDuration === '6' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBankStatementDuration('6')}
                        className={bankStatementDuration === '6' ? 'gradient-accent text-accent-foreground' : ''}
                      >
                        6 Months
                      </Button>
                      <Button
                        type="button"
                        variant={bankStatementDuration === '12' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setBankStatementDuration('12')}
                        className={bankStatementDuration === '12' ? 'gradient-accent text-accent-foreground' : ''}
                      >
                        12 Months
                      </Button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
                    <input
                      type="file"
                      id="bank"
                      className="hidden"
                      multiple
                      accept=".csv,.pdf,.xlsx,.xls"
                      onChange={handleBankFileChange}
                    />
                    <label htmlFor="bank" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-foreground font-medium">
                        Click to upload bank statements
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        CSV, Excel or PDF up to 10MB (CSV/XLSX parsed instantly)
                      </p>
                    </label>

                    {/* preview (first file) */}
                    {bankPreviews[0] && (
                      <div className="mt-4 text-left">
                        <p className="text-sm font-medium">Preview — first 5 transactions</p>
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-muted-foreground text-xs">
                                <th className="text-left">Date</th>
                                <th className="text-right">Amount</th>
                                <th className="text-left">Direction</th>
                                <th className="text-left">Narration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bankPreviews[0].transactions.slice(0, 5).map((t, i) => (
                                <tr key={i} className="border-t border-border/50">
                                  <td className="py-2">{t.occurred_at}</td>
                                  <td className="py-2 text-right">{t.amount.toLocaleString('en-IN')}</td>
                                  <td className="py-2">{t.direction}</td>
                                  <td className="py-2">{t.narration || t.counterparty || '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {showPasswordField && (
                    <div className="flex items-center gap-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <Lock className="h-5 w-5 text-warning" />
                      <div className="flex-1">
                        <Label htmlFor="bankPassword">Bank Statement Password</Label>
                        <Input
                          id="bankPassword"
                          type="password"
                          placeholder="Enter password for protected file"
                          value={bankPassword}
                          onChange={(e) => setBankPassword(e.target.value)}
                          className="mt-2 bg-background border-border"
                        />
                      </div>
                    </div>
                  )}

                  {bankStatements.length > 0 && (
                    <div className="space-y-2">
                      {bankStatements.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">{file.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* GST Documents */}
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    GST Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
                    <input
                      type="file"
                      id="gst"
                      className="hidden"
                      multiple
                      accept=".pdf,.xlsx,.xls"
                      onChange={(e) => handleFileUpload(e, setGstDocuments)}
                    />
                    <label htmlFor="gst" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-foreground font-medium">
                        Click to upload GST documents
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Excel up to 10MB
                      </p>
                    </label>
                  </div>
                  {gstDocuments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {gstDocuments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">{file.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-border bg-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    Review Application
                  </CardTitle>
                  <CardDescription>
                    Please review the information before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Details Summary */}
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-foreground">Loan Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer Name:</span>
                        <p className="font-medium text-foreground">{customerName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loan Amount:</span>
                        <p className="font-medium text-foreground">₹{Number(loanAmount).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loan Type:</span>
                        <p className="font-medium text-foreground">{loanType}</p>
                      </div>
                      {anchorName && (
                        <div>
                          <span className="text-muted-foreground">Anchor:</span>
                          <p className="font-medium text-foreground">{anchorName}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents Summary */}
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-foreground">Uploaded Documents</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-5 w-5 ${bureauReports.length > 0 ? 'text-success' : 'text-muted-foreground'}`} />
                        <span className="text-sm">
                          Bureau Reports ({bureauReports.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-5 w-5 ${bankStatements.length > 0 ? 'text-success' : 'text-muted-foreground'}`} />
                        <span className="text-sm">
                          Bank Statements ({bankStatements.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-5 w-5 ${gstDocuments.length > 0 ? 'text-success' : 'text-muted-foreground'}`} />
                        <span className="text-sm">
                          GST Documents ({gstDocuments.length})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      <strong>Note:</strong> Submitting this application will consume 1 credit 
                      and start the loan analysis process. You can save as draft to continue later 
                      without consuming credits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentStep === 3 && (
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                className="gradient-accent text-accent-foreground"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gradient-accent text-accent-foreground">
                <Send className="mr-2 h-4 w-4" />
                Submit & Create Analysis
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
