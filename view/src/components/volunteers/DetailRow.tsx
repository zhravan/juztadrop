export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-jad-mint/50">
        <Icon className="h-4 w-4 text-jad-primary" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground/50">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-jad-foreground break-words">{value}</p>
      </div>
    </div>
  );
}
