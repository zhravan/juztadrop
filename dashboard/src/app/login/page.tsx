'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/common';
import TextLogo from '@/components/common/TextLogo';
import { useModeratorLogin } from '@/hooks/useModeratorLogin';
import LoginPageFallback from '@/components/login/LoginPageFallback';
import LoginCard from '@/components/login/LoginCard';
import EmailForm from '@/components/login/EmailForm';
import OTPVerifyForm from '@/components/login/OTPVerifyForm';

function LoginPageContent() {
  const {
    isFetched,
    user,
    otp,
    step,
    loading,
    email,
    setEmail,
    resendCooldown,
    handleSendOtp,
    handleVerifyOtp,
    handleOtpChange,
    handleBack,
    handleResend,
  } = useModeratorLogin();

  if (isFetched && user) {
    return <LoginPageFallback />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <LoginCard>
          <div className="flex justify-center py-2">
            <TextLogo />
          </div>
          {/* Step indicator */}
          <div className="mb-8 flex gap-2">
            <div
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                step === 'email' ? 'bg-jad-primary' : 'bg-jad-primary/30'
              )}
            />
            <div
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                step === 'otp' ? 'bg-jad-primary' : 'bg-foreground/10'
              )}
            />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-jad-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-jad-foreground sm:text-3xl">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {step === 'email'
              ? 'Enter your email to receive a one-time code'
              : `We sent a 6-digit code to ${email}`}
          </p>

          {step === 'email' ? (
            <EmailForm
              email={email}
              handleSendOtp={handleSendOtp}
              loading={loading}
              setEmail={setEmail}
            />
          ) : (
            <OTPVerifyForm
              otp={otp}
              loading={loading}
              resendCooldown={resendCooldown}
              handleVerifyOtp={handleVerifyOtp}
              handleOtpChange={handleOtpChange}
              handleBack={handleBack}
              handleResend={handleResend}
            />
          )}
        </LoginCard>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
