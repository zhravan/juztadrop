import { CAUSE_VALUES } from '../constants/causes.js';

export function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export function parseStringArray(value: string | string[] | undefined): string[] | undefined {
  if (value === undefined) return undefined;
  const arr = Array.isArray(value)
    ? value
    : value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
  return arr.length > 0 ? arr : undefined;
}

export function parseCauses(
  value: string | string[] | undefined
): (typeof CAUSE_VALUES)[number][] | undefined {
  const arr = parseStringArray(value);
  if (!arr) return undefined;
  const valid = arr.filter((c) =>
    CAUSE_VALUES.includes(c as (typeof CAUSE_VALUES)[number])
  ) as (typeof CAUSE_VALUES)[number][];
  return valid.length > 0 ? valid : undefined;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parseLimit(value: string | undefined): number {
  if (!value) return DEFAULT_LIMIT;
  const n = parseInt(String(value), 10);
  return Math.min(MAX_LIMIT, Math.max(1, Number.isNaN(n) ? DEFAULT_LIMIT : n));
}

export function parseOffset(value: string | undefined): number {
  if (!value) return 0;
  const n = parseInt(String(value), 10);
  return Math.max(0, Number.isNaN(n) ? 0 : n);
}
