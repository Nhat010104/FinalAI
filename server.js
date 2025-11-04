import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import vatRoutes from './src/routes/vat.js';
import swaggerSpec from './src/config/swagger.js';
import path from 'path';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test endpoint
 *     description: Check if backend is working
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Backend is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Backend is working!
 */
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/vat', vatRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`========================================`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`========================================\n`);
});
