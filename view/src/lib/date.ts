/** Date formatting utilities. All accept null/undefined and return safe display strings. */

export function formatDate(d: string | Date | null | undefined): string {
  if (d == null) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatDateLong(d: string | Date | null | undefined): string {
  if (d == null) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateRange(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined
): string {
  if (!start && !end) return 'Ongoing';
  if (!end || String(start) === String(end)) return formatDateLong(start);
  return `${formatDateLong(start)} – ${formatDateLong(end)}`;
}

/** Time range for display (e.g. "10:00 – 12:00"). */
export function formatTime(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  if (!start && !end) return '';
  if (!end) return start ?? '';
  return `${start ?? '?'} – ${end}`;
}
