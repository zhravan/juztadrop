import { cn } from '@/lib/common';
import { FormField } from '../ui/form';
import { KeyRound, Loader2 } from 'lucide-react';
import { OTP_LENGTH } from '@/lib/constants';
import { ChangeEvent, FormEvent } from 'react';

interface IOTPVerifyForm {
  otp: string;
  loading: boolean;
  resendCooldown: number;
  handleVerifyOtp: (e: FormEvent<Element>) => Promise<void>;
  handleOtpChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleResend: () => Promise<void>;
}
export default function OTPVerifyForm({
  otp,
  loading,
  resendCooldown,
  handleVerifyOtp,
  handleOtpChange,
  handleBack,
  handleResend,
}: IOTPVerifyForm) {
  return (
    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
      <FormField label="Verification code" htmlFor="otp" required>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={otp}
            onChange={handleOtpChange}
            disabled={loading}
            maxLength={OTP_LENGTH}
            className="w-full rounded-xl border border-foreground/15 bg-jad-mint/30 py-3.5 pl-12 pr-4 text-center text-2xl font-mono tracking-[0.5em] text-jad-foreground placeholder:text-foreground/40 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20 transition-colors disabled:opacity-60"
          />
        </div>
      </FormField>
      <button
        type="submit"
        disabled={loading || otp.replace(/\D/g, '').length !== OTP_LENGTH}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-xl bg-jad-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark hover:shadow-xl disabled:opacity-60',
          (loading || otp.replace(/\D/g, '').length !== OTP_LENGTH) && 'cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify & sign in'
        )}
      </button>

      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={loading}
          className="text-sm font-medium text-jad-primary hover:text-jad-dark hover:underline disabled:opacity-60"
        >
          Use different email
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || resendCooldown > 0}
          className="text-sm font-medium text-jad-primary hover:text-jad-dark hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </button>
      </div>
    </form>
  );
}
