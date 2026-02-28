export default function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-jad-primary/10 bg-white p-8 shadow-2xl shadow-foreground/5 sm:p-10">
        {children}
      </div>
      <p className="mt-6 text-center text-sm text-foreground/60">
        No password needed — we&apos;ll send a secure code to your inbox.
      </p>
    </div>
  );
}
