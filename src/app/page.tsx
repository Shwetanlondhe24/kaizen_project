// src/app/page.tsx
'use client';

import { useState } from 'react';
import UploadForm from './components/UploadForm';
import SearchFilters from './components/SearchFilters';
import FileList from './components/FileList';
import Analytics from './components/Analytics';
import type { KaizenReport, SearchFilters as SearchFiltersType } from '@/types';

export default function Home() {
  const [files, setFiles] = useState<KaizenReport[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'upload' | 'search'>('analytics');

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
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-2 px-4 mr-4 font-medium ${
              activeTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Dashboard
          </button>
          <button
            className={`py-2 px-4 mr-4 font-medium ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Reports
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search Reports
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Analytics Overview</h2>
            <Analytics />
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Old Reports</h2>
            <UploadForm />
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Search Reports</h2>
            <SearchFilters onSearch={handleSearch} />
            <FileList files={files} />
          </div>
        )}
      </div>
    </main>
  );
}