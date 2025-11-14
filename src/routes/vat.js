import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/auth.js';
import n8nAuth from '../middleware/n8nAuth.js';
import { uploadHandler, listVat, getVat, publishVat } from '../controllers/vatController.js';
import { n8nWebhookHandler } from '../controllers/n8nController.js';

const router = express.Router();
const UPLOAD_DIR = 'uploads/vat_files';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF / JPG / PNG allowed'));
};

const maxSizeMB = parseInt(process.env.FILE_MAX_SIZE_MB || '10', 10);
const upload = multer({ storage, fileFilter, limits: { fileSize: maxSizeMB * 1024 * 1024 } });

/**
 * @swagger
 * /api/vat/upload:
 *   post:
 *     summary: Upload VAT file
 *     tags: [VAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: VAT file (PDF, JPG, PNG - max 10MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request (invalid file type or size)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post('/upload', auth, upload.single('file'), uploadHandler);

/**
 * @swagger
 * /api/vat:
 *   get:
 *     summary: Get all VAT files
 *     tags: [VAT]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of VAT files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VatFile'
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, listVat);

/**
 * @swagger
 * /api/vat/webhook:
 *   post:
 *     summary: Webhook endpoint for n8n to send invoice data
 *     description: Accepts JSON with file as base64 or file URL. No JWT auth required, but API key recommended.
 *     tags: [VAT]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: Name of the invoice file
 *               fileData:
 *                 type: string
 *                 format: base64
 *                 description: Base64 encoded file (alternative to fileUrl)
 *               fileUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL to the file (alternative to fileData)
 *               senderEmail:
 *                 type: string
 *                 format: email
 *                 description: Email of the sender
 *               subject:
 *                 type: string
 *                 description: Subject/title of the invoice
 *               receivedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date when invoice was received
 *               source:
 *                 type: string
 *                 description: Source of the invoice
 *               extractedData:
 *                 type: object
 *                 description: Extracted data from invoice (optional)
 *               isPublished:
 *                 type: boolean
 *                 default: false
 *                 description: Whether invoice is published
 *     responses:
 *       200:
 *         description: Invoice received and processed successfully
 *       400:
 *         description: Bad request (missing required fields)
 *       401:
 *         description: Unauthorized (invalid or missing API key)
 */
// IMPORTANT: webhook route must be before /:id route to avoid route conflict
// POST route for n8n webhook
router.post('/webhook', n8nAuth, n8nWebhookHandler);

// GET route for testing connection (temporary - remove in production)
router.get('/webhook', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Webhook endpoint is reachable. Please use POST method for actual webhook calls.',
    method: 'GET',
    note: 'This is a test endpoint. Use POST method for n8n webhook.'
  });
});

/**
 * @swagger
 * /api/vat/{id}:
 *   get:
 *     summary: Get VAT file by ID
 *     tags: [VAT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: VAT file ID
 *     responses:
 *       200:
 *         description: VAT file details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VatFile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: VAT file not found
 */
router.get('/:id', auth, getVat);

/**
 * @swagger
 * /api/vat/{id}/publish:
 *   put:
 *     summary: Publish VAT file
 *     description: Mark VAT file as published and optionally upload to Google Drive / send to Telegram
 *     tags: [VAT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: VAT file ID
 *     responses:
 *       200:
 *         description: VAT file published successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: VAT file not found
 */
router.put('/:id/publish', auth, publishVat);

export default router;
