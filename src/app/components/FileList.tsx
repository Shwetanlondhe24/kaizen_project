// src/app/components/FileList.tsx
import { useState } from 'react';
import type { KaizenReport } from '@/types';

interface Props {
  files: KaizenReport[];
}

export default function FileList({ files }: Props) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      setLoading({ ...loading, [fileId]: true });
      const response = await fetch(`/api/download?fileId=${fileId}&fileName=${encodeURIComponent(fileName)}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setLoading({ ...loading, [fileId]: false });
    }
  };

  const handleView = async (fileId: string) => {
    try {
      setLoading({ ...loading, [`view_${fileId}`]: true });
      const response = await fetch(`/api/view?fileId=${fileId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get view link');
      }

      const data = await response.json();
      if (data.success && data.viewLink) {
        window.open(data.viewLink, '_blank');
      } else {
        throw new Error('View link not available');
      }
    } catch (error) {
      console.error('View failed:', error);
      alert('Failed to view file. Please try again.');
    } finally {
      setLoading({ ...loading, [`view_${fileId}`]: false });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No files found matching your search criteria
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Theme
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Idea
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Upload Date
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {file.fileName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.theme}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.idea}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.period}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(file.uploadDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                <button
                  onClick={() => handleView(file.driveFileId)}
                  disabled={loading[`view_${file.driveFileId}`]}
                  className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50"
                >
                  {loading[`view_${file.driveFileId}`] ? 'Loading...' : 'View'}
                </button>
                <button
                  onClick={() => handleDownload(file.driveFileId, file.fileName)}
                  disabled={loading[file.driveFileId]}
                  className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                >
                  {loading[file.driveFileId] ? 'Loading...' : 'Download'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}