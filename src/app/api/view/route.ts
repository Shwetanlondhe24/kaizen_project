// src/app/api/view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/drive';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    const drive = google.drive({ version: 'v3', auth });
    
    // Get the file metadata first
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink'
    });

    if (!file.data.webViewLink) {
      return NextResponse.json(
        { success: false, error: 'View link not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      viewLink: file.data.webViewLink 
    });
  } catch (error) {
    console.error('View link error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get view link' },
      { status: 500 }
    );
  }
}
