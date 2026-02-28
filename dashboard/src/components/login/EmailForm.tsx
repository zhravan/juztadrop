import { Loader2, Mail } from 'lucide-react';
import { FormField, FormInput } from '../ui/form';
import { FormEvent, SetStateAction } from 'react';
import { cn } from '@/lib/common';

interface IEmailForm {
  handleSendOtp: (e: FormEvent<Element>) => Promise<void>;
  email: string;
  setEmail: (value: SetStateAction<string>) => void;
  loading: boolean;
}
export default function EmailForm({ handleSendOtp, email, loading, setEmail }: IEmailForm) {
  return (
    <form onSubmit={handleSendOtp} className="mt-8 space-y-6">
      <FormField label="Email" htmlFor="email" required>
        <FormInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          icon={<Mail className="h-5 w-5" />}
          inputSize="lg"
          className="bg-jad-mint/30"
        />
      </FormField>
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-xl bg-jad-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-jad-primary/25 transition-all hover:bg-jad-dark hover:shadow-xl disabled:opacity-60',
          loading && 'cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send verification code'
        )}
      </button>
    </form>
  );
}
