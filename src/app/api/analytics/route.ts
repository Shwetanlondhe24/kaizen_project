// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get theme distribution
    const [themeResults] = await pool.execute(`
      SELECT theme, COUNT(*) as count
      FROM kaizen_reports
      GROUP BY theme
      ORDER BY count DESC
    `);

    // Get idea (department) distribution
    const [deptResults] = await pool.execute(`
      SELECT dept, COUNT(*) as count
      FROM kaizen_reports
      GROUP BY dept
      ORDER BY count DESC
    `);

    return NextResponse.json({
      success: true,
      themeData: themeResults,
      deptData: deptResults
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}