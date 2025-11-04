import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/auth.js';
import { uploadHandler, listVat, getVat, publishVat } from '../controllers/vatController.js';

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
