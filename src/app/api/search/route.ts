import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    const idea = searchParams.get('idea');
    const period = searchParams.get('period');

    let query = `
      SELECT 
        id,
        theme,
        idea,
        period,
        file_name as fileName,
        drive_file_id as driveFileId,
        DATE_FORMAT(upload_date, '%Y-%m-%d') as uploadDate
      FROM kaizen_reports 
      WHERE 1=1
    `;
    
    const params = [];

    if (theme && theme !== '') {
      query += ' AND theme = ?';
      params.push(theme);
    }
    if (idea && idea !== '') {
      query += ' AND idea = ?';
      params.push(idea);
    }
    if (period && period !== '') {
      query += ' AND period = ?';
      params.push(period);
    }

    query += ' ORDER BY upload_date DESC';

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