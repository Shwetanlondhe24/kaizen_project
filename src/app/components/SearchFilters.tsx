// src/app/components/SearchFilters.tsx
import { useState } from 'react';
import type { SearchFilters as SearchFiltersType } from '@/types';
import { THEMES, DEPTS } from '@/constants';

interface Props {
  onSearch: (filters: SearchFiltersType) => void;
}

export default function SearchFilters({ onSearch }: Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1997 + 1 }, (_, i) => 1997 + i).reverse();

  const [filters, setFilters] = useState<SearchFiltersType>({
    theme: '',
    dept: '',
    upload_date: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const activeFilters: SearchFiltersType = {};
      if (filters.theme && filters.theme !== '') activeFilters.theme = filters.theme;
      if (filters.dept && filters.dept !== '') activeFilters.dept = filters.dept;
      if (filters.upload_date && filters.upload_date !== '') activeFilters.upload_date = filters.upload_date;

      await onSearch(activeFilters);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Filter Reports</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={filters.theme || ''}
              onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-100"
            >
              <option value="">All Themes</option>
              {THEMES.map((theme) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={filters.dept || ''}
              onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-100"
            >
              <option value="">All Departments</option>
              {DEPTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              value={filters.upload_date || ''}
              onChange={(e) => setFilters({ ...filters, upload_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-100"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search Reports'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}