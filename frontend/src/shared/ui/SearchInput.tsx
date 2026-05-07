import { Search, X } from 'lucide-react';
import { Input } from './Input';
import type { ChangeEvent } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', onClear }: Props) {
  return (
    <Input
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      leftIcon={<Search size={16} />}
      rightIcon={
        value ? (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            className="rounded-full p-1 text-ink-soft hover:bg-brand-50 hover:text-ink transition"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : undefined
      }
    />
  );
}
