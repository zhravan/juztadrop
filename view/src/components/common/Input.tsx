import * as React from 'react';
import { LucideIcon } from 'lucide-react';

type InputSize = 'sm' | 'default' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  prefixIcon?: LucideIcon;
  suffixIcon?: LucideIcon;
  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
  wrapperClassName?: string;
}

const sizeConfig: Record<InputSize, { wrapper: string; input: string; icon: string }> = {
  sm: {
    wrapper: 'h-8 rounded-md px-2.5 gap-1.5',
    input: 'text-xs',
    icon: 'w-3.5 h-3.5',
  },
  default: {
    wrapper: 'h-10 rounded-xl px-3 gap-2',
    input: 'text-sm',
    icon: 'w-4 h-4',
  },
  md: {
    wrapper: 'h-12 rounded-xl px-3.5 gap-2.5',
    input: 'text-base',
    icon: 'w-5 h-5',
  },
  lg: {
    wrapper: 'h-14 rounded-xl px-4 gap-3',
    input: 'text-lg',
    icon: 'w-5 h-5',
  },
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = 'default',
      prefixIcon: PrefixIcon,
      suffixIcon: SuffixIcon,
      onPrefixClick,
      onSuffixClick,
      className = '',
      wrapperClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizes = sizeConfig[inputSize];
    return (
      <div
        className={[
          'flex items-center w-full bg-input transition-all duration-200',
          'focus-within:bg-input/70',
          'hover:bg-input/80',
          disabled && 'opacity-50 pointer-events-none',
          sizes.wrapper,
          className,
          wrapperClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {PrefixIcon && (
          <PrefixIcon
            className={[
              'shrink-0 text-muted-foreground transition-colors duration-200',
              onPrefixClick && 'cursor-pointer hover:text-foreground',
              sizes.icon,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={onPrefixClick}
          />
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={[
            'flex-1 min-w-0 bg-transparent outline-none border-none focus:outline-none focus:ring-0 ring-offset-0 font-medium',
            'text-foreground placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed',
            sizes.input,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {SuffixIcon && (
          <SuffixIcon
            className={[
              'shrink-0 text-muted-foreground transition-colors duration-200',
              onSuffixClick && 'cursor-pointer hover:text-foreground',
              sizes.icon,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={onSuffixClick}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
