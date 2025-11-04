import { google } from 'googleapis';
import stream from 'stream';

const authClient = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/drive']
);

const drive = google.drive({ version: 'v3', auth: authClient });

export async function uploadFileToDrive(buffer, fileName, mimeType='application/pdf') {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Drive not configured');
  }
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : []
    },
    media: {
      mimeType,
      body: bufferStream
    },
    fields: 'id, name, webViewLink'
  });
  return res.data;
}
