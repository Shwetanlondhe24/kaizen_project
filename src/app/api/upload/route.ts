import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import ExcelJS from 'exceljs';
import { uploadToDrive } from '@/lib/drive';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as File[];

    const results = [];

    for (const file of files) {
      // Create temporary file path
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const tempPath = join(process.cwd(), 'tmp', file.name);
      await writeFile(tempPath, buffer);

      // Read Excel file using exceljs
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(tempPath);
      const worksheet = workbook.worksheets[0];

      // Convert rows to JSON
      const jsonData: Record<string, string>[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip the header row
        const rowData: Record<string, string> = {};
        row.eachCell((cell, colNumber) => {
          const header = worksheet.getRow(1).getCell(colNumber).value?.toString();
          if (header) rowData[header] = cell.text;
        });
        jsonData.push(rowData);
      });

      // Upload to Google Drive
      const driveFileId = await uploadToDrive(tempPath, file.name);

      // Store in database
      for (const row of jsonData) {
        const subject = row['subject'] || 'Unknown Subject';
        let uploadDate = row['upload_date']
          ? new Date(row['upload_date'])
          : new Date(); // Use current date as default
        const fileName = file.name;
        
        if (isNaN(uploadDate.getTime())) {
          // If the date is invalid, skip this record or set to current date
          console.warn(`Invalid date found: ${row['upload_date']}, using current date instead.`);
          uploadDate = new Date();
        }

        const [result] = await pool.execute(
          'INSERT INTO uploads (subject, upload_date, file_name, drive_file_id) VALUES (?, ?, ?, ?)',
          [subject, uploadDate.toISOString().split('T')[0], fileName, driveFileId]
        );
        results.push(result);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
