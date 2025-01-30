// Update UploadForm.tsx to use the same constants
import { useState } from 'react';
import { THEMES, IDEAS, PERIODS } from '@/constants';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState('');
  const [idea, setIdea] = useState('');
  const [period, setPeriod] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !theme || !idea || !period) {
      setStatus('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('theme', theme);
    formData.append('idea', idea);
    formData.append('period', period);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setStatus(data.success ? 'Upload successful!' : data.error);
    } catch (error) {
      setStatus('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Select Theme</option>
          {THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Idea</label>
        <select
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Select Idea</option>
          {IDEAS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Period</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Select Period</option>
          {PERIODS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">PDF File</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {status && (
        <div className={`mt-4 text-sm ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </div>
      )}
    </form>
  );
}
