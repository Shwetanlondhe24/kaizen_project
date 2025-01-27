// src/types/index.ts
export interface UploadedFile {
    subject: string;
    date: string;
    fileName: string;
    driveFileId: string;
  }
  
  export interface UploadResponse {
    success: boolean;
    message: string;
    results?: UploadedFile[];
    error?: string;
  }
  
 

  
 