import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, otpService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react';

type AuthStep = 'login' | 'forgot-password' | 'verify-otp' | 'reset-password';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<AuthStep>('login');
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP/Reset form
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // this is the mock handle logic i commented the real one so that i can test without the backend
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
    return;
  }

  setIsLoading(true);
  try {
    // Simulate network
    await new Promise((resolve) => setTimeout(resolve, 500));

    // MOCK login
    const mockUser = { email, role: "admin" };
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    toast({ title: 'Success', description: 'Logged in successfully' });

    navigate("/"); // goes to Index
  } finally {
    setIsLoading(false);
  }
};

   
  // real handleLogin logic 

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email || !password) {
  //     toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     await authService.login({ email, password });
  //     toast({ title: 'Success', description: 'Logged in successfully' });
  //     navigate('/');
  //   } catch (error: any) {
  //     toast({ 
  //       title: 'Login Failed', 
  //       description: error.response?.data?.message || 'Invalid credentials', 
  //       variant: 'destructive' 
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'Error', description: 'Please enter your email', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await otpService.resendOTP(email);
      toast({ title: 'OTP Sent', description: 'Check your email for the verification code' });
      setStep('verify-otp');
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.message || 'Failed to send OTP', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({ title: 'Error', description: 'Please enter the OTP', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await otpService.verifyOTP(email, otp);
      toast({ title: 'OTP Verified', description: 'Please set your new password' });
      setStep('reset-password');
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.message || 'Invalid OTP', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      toast({ title: 'Password Reset', description: 'You can now login with your new password' });
      setStep('login');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.message || 'Failed to reset password', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'forgot-password') {
      setStep('login');
    } else if (step === 'verify-otp') {
      setStep('forgot-password');
    } else if (step === 'reset-password') {
      setStep('verify-otp');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dental-gradient p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl dental-gradient-strong mb-4">
            <span className="text-2xl font-bold text-primary-foreground">CR</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Clinic CRM</h1>
          <p className="text-muted-foreground text-sm mt-1">Management System</p>
        </div>

        <Card className="glass-card border-border/50">
          {/* Login Form */}
          {step === 'login' && (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="text"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep('forgot-password')}
                    className="w-full text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </form>
              </CardContent>
            </>
          )}

          {/* Forgot Password Form */}
          {step === 'forgot-password' && (
            <>
              <CardHeader className="space-y-1">
                <button onClick={handleBack} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </button>
                <CardTitle className="text-xl">Forgot password?</CardTitle>
                <CardDescription>Enter your email and we'll send you a verification code</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Verification Code
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* OTP Verification Form */}
          {step === 'verify-otp' && (
            <>
              <CardHeader className="space-y-1">
                <button onClick={handleBack} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
                <CardTitle className="text-xl">Verify OTP</CardTitle>
                <CardDescription>
                  Enter the verification code sent to <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="pl-10 text-center tracking-widest"
                        maxLength={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify Code
                  </Button>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-full text-sm text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                </form>
              </CardContent>
            </>
          )}

          {/* Reset Password Form */}
          {step === 'reset-password' && (
            <>
              <CardHeader className="space-y-1">
                <button onClick={handleBack} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
                <CardTitle className="text-xl">Create new password</CardTitle>
                <CardDescription>Your new password must be at least 6 characters</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Clinic CRM. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
