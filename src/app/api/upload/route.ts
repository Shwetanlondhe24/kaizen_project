// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { uploadToDrive } from '@/lib/drive';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    const theme = data.get('theme') as string;
    const dept = data.get('dept') as string;
    const period = data.get('period') as string;

    if (!file || !theme || !dept || !period) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(process.cwd(), 'tmp', file.name);
    await writeFile(tempPath, buffer);

    // Upload to Google Drive
    const driveFileId = await uploadToDrive(tempPath, file.name);
    const periodDate = new Date(period);
    const formattedPeriod = new Date(periodDate.getTime() - (periodDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
   // Store in database
const [result] = await pool.execute(
  'INSERT INTO kaizen_reports (theme, dept, file_name, drive_file_id, upload_date) VALUES (?, ?, ?, ?, ?)',
  [theme, dept, file.name, driveFileId, formattedPeriod]
);
    return NextResponse.json({ success: true, message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}