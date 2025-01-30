// src/app/page.tsx
'use client';

import { useState } from 'react';
import UploadForm from './components/UploadForm';
import SearchFilters from './components/SearchFilters';
import FileList from './components/FileList';
import type { KaizenReport, SearchFilters as SearchFiltersType } from '@/types';
// Continuing src/app/page.tsx
export default function Home() {
  const [files, setFiles] = useState<KaizenReport[]>([]);

  const handleSearch = async (filters: SearchFiltersType) => {
    try {
      const params = new URLSearchParams();
      if (filters.theme) params.append('theme', filters.theme);
      if (filters.idea) params.append('idea', filters.idea);
      if (filters.period) params.append('period', filters.period);

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Kaizen Bank</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Old Reports</h2>
          <UploadForm />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Search Reports</h2>
          <SearchFilters onSearch={handleSearch} />
          <FileList files={files} />
        </div>
      </div>
    </main>
  );
}