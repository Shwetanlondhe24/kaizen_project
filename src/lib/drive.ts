import { google } from 'googleapis';
import { createReadStream } from 'fs';

export const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json', // Replace with the actual path to your service account key file
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadToDrive(filePath: string, fileName: string): Promise<string> {
  try {
    const fileStream = createReadStream(filePath); // Use a stream for the file

    const response = await drive.files.create({
      requestBody: {
        name: fileName, // File name in Google Drive
        parents: ['1jcPktG1XHurZPLzBuXdM2_oKXSvYuaXJ'], // Replace with your Drive folder ID
      },
      media: {
        mimeType: 'application/octet-stream',
        body: fileStream, // Pass the file stream here
      },
      fields: 'id',
    });

    if (!response.data.id) {
      throw new Error('Failed to retrieve file ID after upload.');
    }

    console.log(`File uploaded successfully: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error('Google Drive upload failed:', error); // Log the actual error details
    throw new Error('Google Drive upload failed');
  }
}
