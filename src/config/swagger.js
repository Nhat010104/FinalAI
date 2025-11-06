import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VAT Management API',
      version: '1.0.0',
      description: 'API documentation for VAT Management System',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for n8n webhook authentication (optional if N8N_API_KEY not set)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'user@example.com' },
            role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        VatFile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            originalFilename: { type: 'string' },
            filename: { type: 'string' },
            mimetype: { type: 'string' },
            size: { type: 'number' },
            uploadedBy: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'published'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Test',
        description: 'Test endpoints',
      },
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'VAT',
        description: 'VAT file management endpoints (require authentication)',
      },
    ],
  },
  apis: ['./src/routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
