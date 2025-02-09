// src/app/components/UploadForm.tsx
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { THEMES, DEPTS } from '@/constants';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState('');
  const [dept, setDept] = useState('');
  const [period, setPeriod] = useState<Date | null>(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !theme || !dept || !period) {
      setStatus('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('theme', theme);
    formData.append('dept', dept);
    formData.append('period', period.toISOString());

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setStatus(data.success ? 'Upload successful!' : data.error);
    } catch (error) {
      setStatus('Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-100"
              required
            >
              <option value="">Select Theme</option>
              {THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-100"
              required
            >
              <option value="">Select Department</option>
              {DEPTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <DatePicker
              selected={period}
              onChange={(date: Date | null) => setPeriod(date)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-100"
              placeholderText="Select a date"
              required
              maxDate={new Date()}
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 py-2">
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    {'<'}
                  </button>
                  <div className="space-x-4">
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) => changeYear(parseInt(value))}
                      className="px-2 py-1 rounded-md border border-gray-300 text-sm"
                    >
                      {Array.from({ length: new Date().getFullYear() - 1997 + 1 }, (_, i) => 1997 + i)
                        .reverse()
                        .map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select
                      value={date.getMonth()}
                      onChange={({ target: { value } }) => changeMonth(parseInt(value))}
                      className="px-2 py-1 rounded-md border border-gray-300 text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  >
                    {'>'}
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">PDF File</label>
          <div
            {...getRootProps()}
            className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
          >
            <input {...getInputProps()} accept=".pdf" />
            <div className="space-y-2">
              {file ? (
                <>
                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                  <p className="text-xs text-gray-500">Click or drag to replace</p>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-900">
                    Drop your PDF file here, or click to select
                  </div>
                  <p className="text-xs text-gray-500">PDF files only</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Report'
            )}
          </button>

          {status && (
            <div className={`p-4 rounded-lg text-sm ${
              status.includes('success')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}