// src/types/index.ts

export interface KaizenReport {
  id: number;
  theme: string;
  idea: string;
  period: string;
  fileName: string;
  driveFileId: string;
  uploadDate: string;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SearchFilters {
  theme?: string;
  idea?: string;
  period?: string;
}