'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/common';
import { useClickOutside } from '@/hooks';

const triggerClass =
  'flex w-full items-center justify-between rounded-xl border border-foreground/15 bg-white px-4 py-2.5 pr-10 text-left text-sm text-jad-foreground transition-all duration-200 focus:border-jad-primary focus:outline-none focus:ring-2 focus:ring-jad-primary/20 disabled:cursor-not-allowed disabled:opacity-60';

export interface FormDropdownOption {
  value: string;
  label: string;
}

export interface FormDropdownProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: FormDropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export function FormDropdown({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  className,
  disabled,
  'aria-label': ariaLabel,
}: FormDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside(ref, open, () => setOpen(false));

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={id ? `${id}-label` : undefined}
        disabled={disabled}
        className={cn(triggerClass, !selectedOption && 'text-foreground/50')}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 shrink-0',
            open && 'rotate-180',
            selectedOption ? 'text-foreground/40' : 'text-foreground/30'
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={value ? `${id ?? 'dropdown'}-opt-${value}` : undefined}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-foreground/15 bg-white py-1 shadow-lg focus:outline-none"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              id={id ? `${id}-opt-${opt.value}` : undefined}
              role="option"
              aria-selected={value === opt.value}
              className={cn(
                'cursor-pointer px-4 py-2.5 text-sm transition-colors',
                value === opt.value
                  ? 'bg-jad-mint/50 text-jad-foreground font-medium'
                  : 'text-jad-foreground hover:bg-foreground/5'
              )}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
