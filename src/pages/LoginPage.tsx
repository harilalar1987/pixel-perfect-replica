import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowRight, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('otp');
    toast({
      title: 'OTP Sent',
      description: `A verification code has been sent to ${email}`,
    });
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    
    setIsLoading(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: 'Login Successful',
      description: 'Welcome to Supermoney Credit Intelligence',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-info blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-xl bg-accent/20 backdrop-blur flex items-center justify-center">
                <span className="font-display font-bold text-2xl">S</span>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">Supermoney</h1>
                <p className="sr-only">Credit Intelligence</p>
              </div>
            </div>
            
            <h2 className="font-display text-4xl font-bold leading-tight mb-6">
              AI-Powered Loan Analysis Platform
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-md">
              Streamline credit decisions with comprehensive bureau analysis, banking patterns, 
              and GST compliance checks — all in one intelligent platform.
            </p>

            <div className="space-y-4">
              {[
                'Automated policy evaluation across 50+ criteria',
                'Real-time bureau, banking & GST analysis',
                'AI-generated risk summaries & recommendations',
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-primary-foreground/90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="gradient-primary h-10 w-10 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">S</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">Supermoney</span>
          </div>

          <Card className="border-border shadow-elevated bg-card">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                {step === 'email' ? (
                  <Mail className="h-7 w-7 text-accent" />
                ) : (
                  <Lock className="h-7 w-7 text-accent" />
                )}
              </div>
              <CardTitle className="font-display text-2xl">
                {step === 'email' ? 'Welcome Back' : 'Verify OTP'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {step === 'email'
                  ? 'Enter your email to receive a one-time password'
                  : `Enter the 6-digit code sent to ${email}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  <motion.form
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleEmailSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background border-border h-12"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 gradient-accent text-accent-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleOtpSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">One-Time Password</label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="bg-background border-border h-12 text-center text-2xl tracking-[0.5em] font-mono"
                        maxLength={6}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 gradient-accent text-accent-foreground"
                      disabled={isLoading || otp.length < 6}
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          Verify & Login
                          <ShieldCheck className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setStep('email')}
                    >
                      Use a different email
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
