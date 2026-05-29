'use client';

import { getStatusColor } from '@/lib/utils';
import type { SelectOption } from '@/types';

interface StatusSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  loading?: boolean;
}

export default function StatusSelect({ value, options, onChange, loading }: StatusSelectProps) {
  const colorClass = getStatusColor(value);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
      className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${colorClass} disabled:opacity-60`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
