// src/app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { auth } from '@/lib/drive';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const fileName = searchParams.get('fileName');

    if (!fileId || !fileName) {
      return NextResponse.json(
        { success: false, error: 'File ID and filename are required' },
        { status: 400 }
      );
    }

    const drive = google.drive({ version: 'v3', auth });
    
    // First verify the file exists
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType'
    });

    if (!file.data) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Then get the file content
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media'
      },
      {
        responseType: 'stream'
      }
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    const stream = response.data as unknown as Readable;
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);

    // Return the file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Download failed' },
      { status: 500 }
    );
  }
}