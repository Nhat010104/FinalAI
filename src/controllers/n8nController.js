import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import Invoice from '../models/Invoice.js';
import VatFile from '../models/VatFile.js';
import { uploadFileToDrive } from '../utils/drive.js';
import { sendTelegramNotification } from '../utils/telegram.js';

/**
 * Webhook handler for n8n to send invoice data
 * Accepts JSON with file as base64 or file URL
 */
export async function n8nWebhookHandler(req, res) {
  try {
    const {
      fileName,
      fileData, // base64 encoded file
      fileUrl, // or URL to file
      senderEmail,
      subject,
      receivedDate,
      source,
      extractedData,
      isPublished = false
    } = req.body;

    // Validate required fields
    if (!fileName) {
      return res.status(400).json({ 
        success: false, 
        message: 'fileName is required' 
      });
    }

    if (!fileData && !fileUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either fileData (base64) or fileUrl is required' 
      });
    }

    // Create invoice
    const invoice = await Invoice.create({
      senderEmail: senderEmail || 'n8n@automation',
      subject: subject || fileName,
      receivedDate: receivedDate ? new Date(receivedDate) : new Date(),
      status: 'processed'
    });

    let localPath = null;
    let driveFileId = null;

    // Handle file - either from base64 or URL
    if (fileData) {
      // Save base64 file to disk
      const base64Data = fileData.replace(/^data:.*,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const UPLOAD_DIR = 'uploads/vat_files';
      
      // Ensure directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const uniqueFilename = `${Date.now()}-${Math.round(Math.random()*1e9)}-${fileName}`;
      localPath = path.join(UPLOAD_DIR, uniqueFilename);
      fs.writeFileSync(localPath, buffer);

      // Optionally upload to Google Drive
      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        try {
          const driveFile = await uploadFileToDrive(buffer, uniqueFilename);
          driveFileId = driveFile ? driveFile.id : null;
        } catch (err) {
          console.error('Drive upload failed', err.message);
        }
      }
    } else if (fileUrl) {
      // Download file from URL
      try {
        const UPLOAD_DIR = 'uploads/vat_files';
        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const uniqueFilename = `${Date.now()}-${Math.round(Math.random()*1e9)}-${fileName}`;
        localPath = path.join(UPLOAD_DIR, uniqueFilename);

        // Download file from URL
        const url = new URL(fileUrl);
        const client = url.protocol === 'https:' ? https : http;
        
        await new Promise((resolve, reject) => {
          const file = fs.createWriteStream(localPath);
          client.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
              reject(new Error(`Failed to download file: ${response.statusCode}`));
              return;
            }
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', (err) => {
            fs.unlinkSync(localPath); // Delete the file on error
            reject(err);
          });
        });

        // Read downloaded file for Drive upload
        const buffer = fs.readFileSync(localPath);

        // Optionally upload to Google Drive
        if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
          try {
            const driveFile = await uploadFileToDrive(buffer, uniqueFilename);
            driveFileId = driveFile ? driveFile.id : null;
          } catch (err) {
            console.error('Drive upload failed', err.message);
          }
        }
      } catch (err) {
        console.error('Failed to download file from URL:', err.message);
        // Fallback: store URL if download fails
        localPath = fileUrl;
      }
    }

    // Create VAT file
    const vat = await VatFile.create({
      invoiceId: invoice._id,
      fileName: fileName,
      localPath: localPath,
      driveFileId: driveFileId,
      source: source || senderEmail || 'n8n',
      uploadedDate: new Date(),
      extractedData: extractedData || {},
      isPublished: isPublished
    });

    // Notify Telegram
    const text = `New VAT from n8n:\nFile: ${vat.fileName}\nDate: ${invoice.receivedDate.toISOString()}\nSource: ${vat.source}`;
    await sendTelegramNotification(text);

    return res.json({
      success: true,
      message: 'Invoice received and processed successfully',
      data: {
        invoice: {
          id: invoice._id,
          senderEmail: invoice.senderEmail,
          subject: invoice.subject,
          receivedDate: invoice.receivedDate
        },
        vatFile: {
          id: vat._id,
          fileName: vat.fileName,
          source: vat.source,
          isPublished: vat.isPublished
        }
      }
    });
  } catch (err) {
    console.error('n8n webhook error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  }
}

