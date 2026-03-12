export function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-white px-3 py-1 text-xs font-medium text-foreground/70 shadow-sm">
      {skill}
    </span>
  );
}
