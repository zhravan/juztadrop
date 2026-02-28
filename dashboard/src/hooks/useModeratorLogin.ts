'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { moderatorAuthClient } from '@/lib/auth/moderator-auth-client';
import { useSession } from '@/lib/auth/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OTP_LENGTH, RESEND_COOLDOWN_SEC } from '@/lib/constants';

export const useModeratorLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = useMemo(() => {
    const r = searchParams.get('redirect');
    return r && r.startsWith('/') && !r.startsWith('//') ? r : '/';
  }, [searchParams]);
  const queryClient = useQueryClient();
  const { data: user, isFetched } = useSession();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isFetched && user) {
      router.replace(redirectTo);
    }
  }, [isFetched, user, redirectTo, router]);

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const startCooldown = () => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }
    setResendCooldown(RESEND_COOLDOWN_SEC);
    cooldownIntervalRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await moderatorAuthClient.sendOtp(trimmed);
      toast.success('Verification code sent to your email');
      setEmail(trimmed);
      setStep('otp');
      setOtp('');
      startCooldown();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await moderatorAuthClient.sendOtp(email);
      toast.success('Code resent');
      startCooldown();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  const verifyWithCode = async (code: string) => {
    if (code.length !== OTP_LENGTH || loading) return;
    setLoading(true);
    try {
      await moderatorAuthClient.verifyOtp(email, code);
      await queryClient.invalidateQueries({ queryKey: ['moderator-auth', 'moderator-session'] });
      router.replace(redirectTo || '/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyWithCode(otp.replace(/\D/g, ''));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(raw);
    if (raw.length === OTP_LENGTH) {
      verifyWithCode(raw);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtp('');
  };

  return {
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
  };
};
