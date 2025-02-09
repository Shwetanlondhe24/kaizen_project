// src/types/index.ts

// src/types/index.ts
export interface KaizenReport {
  id: number;
  theme: string;
  dept: string;
  fileName: string;
  driveFileId: string;
  uploadDate: string;
}

export interface SearchFilters {
  theme?: string;
  dept?: string;
  upload_date?: string; // Keep this consistent with backend
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

