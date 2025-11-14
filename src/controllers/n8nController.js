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
 * Accepts JSON with file as base64, file URL, or binary object from n8n
 * Supports both Vietnamese field names (from n8n.json) and English field names
 */
export async function n8nWebhookHandler(req, res) {
  try {
    // Log incoming request for debugging
    console.log('📥 n8n Webhook received:');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('Body sample:', JSON.stringify(req.body, null, 2).substring(0, 500));
    
    // Support both Vietnamese field names (from n8n.json) and English field names
    const {
      // Vietnamese field names (from n8n Code Node)
      tenFile,
      nguoiGuiMail,
      ngayNhanMail,
      vat: vatNumberFromN8n, // Rename to avoid conflict with VatFile model
      nhaCungCap,
      ngayXuatHoaDon,
      // English field names (for compatibility)
      fileName,
      fileData, // base64 encoded file
      fileUrl, // or URL to file
      senderEmail,
      subject,
      receivedDate,
      source,
      extractedData,
      isPublished = false,
      // Binary data from n8n
      binary
    } = req.body;

    // Map Vietnamese fields to English
    const finalFileName = tenFile || fileName;
    const finalSenderEmail = nguoiGuiMail || senderEmail;
    const finalReceivedDate = ngayNhanMail || receivedDate;
    
    // Build extractedData from Vietnamese fields if provided
    let finalExtractedData = extractedData || {};
    if (vatNumberFromN8n || nhaCungCap || ngayXuatHoaDon) {
      finalExtractedData = {
        ...finalExtractedData,
        vat: vatNumberFromN8n || finalExtractedData.vat,
        nhaCungCap: nhaCungCap || finalExtractedData.nhaCungCap,
        ngayXuatHoaDon: ngayXuatHoaDon || finalExtractedData.ngayXuatHoaDon,
        // Also store in English for compatibility
        vatNumber: vatNumberFromN8n || finalExtractedData.vatNumber,
        supplierName: nhaCungCap || finalExtractedData.supplierName,
        invoiceDate: ngayXuatHoaDon || finalExtractedData.invoiceDate
      };
    }

    // Validate required fields
    if (!finalFileName) {
      return res.status(400).json({ 
        success: false, 
        message: 'fileName (or tenFile) is required' 
      });
    }

    // Handle binary data from n8n (attachment_0 format)
    // n8n can send binary in different formats:
    // 1. As a binary object with keys like "attachment_0" containing {data, mimeType, fileName}
    // 2. As base64 string in fileData field
    // 3. As base64 string directly in binary property
    let fileBuffer = null;
    let fileMimeType = 'application/octet-stream';
    
    if (binary) {
      // Case 1: Binary object with keys like "attachment_0"
      if (typeof binary === 'object' && !Array.isArray(binary)) {
        const binaryKey = Object.keys(binary)[0]; // e.g., "attachment_0"
        if (binaryKey && binary[binaryKey]) {
          const binaryData = binary[binaryKey];
          // n8n binary object has .data (base64) or .data (Buffer)
          if (binaryData.data) {
            if (Buffer.isBuffer(binaryData.data)) {
              fileBuffer = binaryData.data;
            } else if (typeof binaryData.data === 'string') {
              // Base64 string
              const base64Data = binaryData.data.replace(/^data:.*,/, '');
              fileBuffer = Buffer.from(base64Data, 'base64');
            }
            fileMimeType = binaryData.mimeType || binaryData.mime || 'application/octet-stream';
          } else if (typeof binaryData === 'string') {
            // Case 2: Binary is a base64 string directly
            const base64Data = binaryData.replace(/^data:.*,/, '');
            fileBuffer = Buffer.from(base64Data, 'base64');
          }
        }
      } else if (typeof binary === 'string') {
        // Case 3: Binary is a base64 string directly
        const base64Data = binary.replace(/^data:.*,/, '');
        fileBuffer = Buffer.from(base64Data, 'base64');
      }
    } else if (fileData) {
      // Handle base64 fileData
      const base64Data = fileData.replace(/^data:.*,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    }

    // If no file data from binary or fileData, try fileUrl
    // Note: n8n might not send binary in JSON body when using jsonParameters: true
    // In that case, we'll create the record without file (file can be uploaded later)
    if (!fileBuffer && !fileUrl) {
      console.warn('⚠️  No file data received from n8n. Creating record without file.');
      // Continue without file - file might be uploaded separately or via URL later
    }

    // Create invoice
    const invoice = await Invoice.create({
      senderEmail: finalSenderEmail || 'n8n@automation',
      subject: subject || finalFileName,
      receivedDate: finalReceivedDate ? new Date(finalReceivedDate) : new Date(),
      status: 'processed'
    });

    let localPath = null;
    let driveFileId = null;

    // Handle file - either from binary, base64, or URL
    if (fileBuffer) {
      console.log('✅ File buffer received, size:', fileBuffer.length, 'bytes');
      // Save file buffer to disk
      const UPLOAD_DIR = 'uploads/vat_files';
      
      // Ensure directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      const uniqueFilename = `${Date.now()}-${Math.round(Math.random()*1e9)}-${finalFileName}`;
      const fullPath = path.join(UPLOAD_DIR, uniqueFilename);
      fs.writeFileSync(fullPath, fileBuffer);
      // Store only filename in database to avoid path duplication issues
      localPath = uniqueFilename;

      // Optionally upload to Google Drive
      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        try {
          const driveFile = await uploadFileToDrive(fileBuffer, uniqueFilename);
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

        const uniqueFilename = `${Date.now()}-${Math.round(Math.random()*1e9)}-${finalFileName}`;
        const fullPath = path.join(UPLOAD_DIR, uniqueFilename);
        localPath = uniqueFilename; // Store only filename in database

        // Download file from URL
        const url = new URL(fileUrl);
        const client = url.protocol === 'https:' ? https : http;
        
        await new Promise((resolve, reject) => {
          const file = fs.createWriteStream(fullPath);
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
            fs.unlinkSync(fullPath); // Delete the file on error
            reject(err);
          });
        });

        // Read downloaded file for Drive upload
        const buffer = fs.readFileSync(fullPath);

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
      fileName: finalFileName,
      localPath: localPath || null, // Allow null if no file was received
      driveFileId: driveFileId,
      source: source || finalSenderEmail || 'n8n',
      uploadedDate: new Date(),
      extractedData: finalExtractedData,
      isPublished: isPublished
    });
    
    console.log('✅ VAT file created:', vat._id);

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
    console.error('❌ n8n webhook error:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

