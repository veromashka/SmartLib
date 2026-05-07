import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from './cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, leftIcon, rightIcon, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-soft">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-2xl border bg-white px-4 text-sm text-ink placeholder:text-ink-soft',
            'transition-all duration-200',
            'border-brand-100 hover:border-brand-200 focus:border-brand-400',
            'shadow-soft focus:shadow-card',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error &&
              'border-rose-300 hover:border-rose-400 focus:border-rose-500 focus:ring-rose-200',
            className,
          )}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-err`} className="text-xs text-rose-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
