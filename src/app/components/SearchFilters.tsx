// Update SearchFilters.tsx
import { useState } from 'react';
import type { SearchFilters } from '@/types';
import { THEMES, IDEAS, PERIODS } from '@/constants';

interface Props {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchFilters({ onSearch }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({
    theme: '',
    idea: '',
    period: ''
  });

  const handleSearch = () => {
    // Only include non-empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    onSearch(activeFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <select
          value={filters.theme || ''}
          onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm w-full"
        >
          <option value="">All Themes</option>
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>

        <select
          value={filters.idea || ''}
          onChange={(e) => setFilters({ ...filters, idea: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm w-full"
        >
          <option value="">All Ideas</option>
          {IDEAS.map((idea) => (
            <option key={idea} value={idea}>{idea}</option>
          ))}
        </select>

        <select
          value={filters.period || ''}
          onChange={(e) => setFilters({ ...filters, period: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm w-full"
        >
          <option value="">All Periods</option>
          {PERIODS.map((period) => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Search
      </button>
    </div>
  );
}