// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    const dept = searchParams.get('dept');
    const upload_date = searchParams.get('upload_date');

    console.log('Received search params:', { theme, dept, upload_date });

    let query = `
      SELECT 
        id,
        theme,
        dept,
        file_name as fileName,
        drive_file_id as driveFileId,
        DATE_FORMAT(upload_date, '%Y-%m-%d') as uploadDate
      FROM kaizen_reports 
      WHERE 1=1
    `;

    const params: any[] = [];

    if (theme && theme.trim() !== '') {
      query += ' AND theme = ?';
      params.push(theme.trim());
    }

    if (dept && dept.trim() !== '') {
      query += ' AND dept = ?';
      params.push(dept.trim());
    }

    if (upload_date && upload_date.trim() !== '') {
      query += ' AND YEAR(upload_date) = ?';
      params.push(upload_date.trim());
    }

    query += ' ORDER BY upload_date DESC';

    console.log('Executing query:', query.replace(/\s+/g, ' '));
    console.log('With parameters:', params);

    const [results] = await pool.execute(query, params);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}