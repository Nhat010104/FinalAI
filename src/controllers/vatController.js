import fs from 'fs';
import Invoice from '../models/Invoice.js';
import VatFile from '../models/VatFile.js';
import { uploadFileToDrive } from '../utils/drive.js';
import { sendTelegramNotification } from '../utils/telegram.js';

export async function uploadHandler(req, res) {
  try {
    const { senderEmail, subject, receivedDate } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'File is required' });
    // create invoice
    const invoice = await Invoice.create({
      senderEmail: senderEmail || req.user?.email || 'unknown',
      subject: subject || file.originalname,
      receivedDate: receivedDate ? new Date(receivedDate) : new Date(),
      status: 'pending'
    });
    // optionally upload to drive
    let driveFile = null;
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const buffer = fs.readFileSync(file.path);
      try {
        driveFile = await uploadFileToDrive(buffer, file.filename);
      } catch (err) {
        console.error('Drive upload failed', err.message);
      }
    }
    const vat = await VatFile.create({
      invoiceId: invoice._id,
      fileName: file.originalname,
      localPath: file.filename, // Store only filename to avoid path duplication
      driveFileId: driveFile ? driveFile.id : null,
      source: senderEmail || 'unknown',
      uploadedDate: new Date(),
      isPublished: false
    });
    // notify telegram
    const text = `New VAT uploaded:\nFile: ${vat.fileName}\nDate: ${invoice.receivedDate.toISOString()}\nSource: ${vat.source}`;
    await sendTelegramNotification(text);
    return res.json({ message: 'Uploaded', invoice, vat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function listVat(req, res) {
  try {
    const items = await VatFile.find().populate('invoiceId').sort({ uploadedDate: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getVat(req, res) {
  try {
    const { id } = req.params;
    const item = await VatFile.findById(id).populate('invoiceId');
    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function publishVat(req, res) {
  try {
    const { id } = req.params;
    const item = await VatFile.findById(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    // Here you could run OCR / push to Google Sheets / push to website
    item.isPublished = true;
    await item.save();
    // notify telegram
    await sendTelegramNotification(`VAT published: ${item.fileName}`);
    return res.json({ message: 'Published', item });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
