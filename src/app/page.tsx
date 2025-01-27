 // src/app/page.tsx
 'use client';
  
 import { useCallback, useState } from 'react';
 import { useDropzone } from 'react-dropzone';
 import type { UploadResponse } from '@/types';
 
 export default function Home() {
   const [uploadStatus, setUploadStatus] = useState<string>('');
   const [isUploading, setIsUploading] = useState<boolean>(false);
 
   const onDrop = useCallback(async (acceptedFiles: File[]) => {
     setIsUploading(true);
     setUploadStatus('Uploading...');
 
     const formData = new FormData();
     acceptedFiles.forEach(file => {
       formData.append('files', file);
     });
 
     try {
       const response = await fetch('/api/upload', {
         method: 'POST',
         body: formData,
       });
 
       const data: UploadResponse = await response.json();
       
       setUploadStatus(
         data.success 
           ? `Successfully uploaded ${acceptedFiles.length} files` 
           : `Error: ${data.error}`
       );
     } catch (error) {
       setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
     } finally {
       setIsUploading(false);
     }
   }, []);
 
   const { getRootProps, getInputProps, isDragActive } = useDropzone({
     onDrop,
     accept: {
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
       'application/vnd.ms-excel': ['.xls']
     }
   });
 
   return (
     <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-md mx-auto">
         <h1 className="text-2xl font-bold text-center mb-8">Excel File Uploader</h1>
         
         <div
           {...getRootProps()}
           className={`
             mt-8 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer
             transition-colors duration-200
             ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
           `}
         >
           <input {...getInputProps()} />
           {isDragActive ? (
             <p className="text-blue-500">Drop the Excel files here...</p>
           ) : (
             <p className="text-gray-600">Drag & drop Excel files here, or click to select files</p>
           )}
         </div>
 
         {isUploading && (
           <div className="mt-4 text-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
           </div>
         )}
 
         {uploadStatus && (
           <div className={`mt-4 text-center text-sm ${
             uploadStatus.includes('Error') ? 'text-red-600' : 'text-green-600'
           }`}>
             {uploadStatus}
           </div>
         )}
       </div>
     </main>
   );
 }