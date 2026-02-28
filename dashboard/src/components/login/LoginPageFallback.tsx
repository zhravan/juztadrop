import { Loader2 } from 'lucide-react';

export default function LoginPageFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-jad-primary" />
      </main>
    </div>
  );
}
