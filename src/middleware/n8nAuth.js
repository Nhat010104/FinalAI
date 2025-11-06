/**
 * Simple API key authentication for n8n webhook
 * Checks for API key in header or query parameter
 */
export default function n8nAuth(req, res, next) {
  const apiKey = process.env.N8N_API_KEY;
  
  // If no API key is set, allow all requests (for development)
  if (!apiKey) {
    console.warn('⚠️  N8N_API_KEY not set - allowing all requests');
    return next();
  }

  // Check API key from header or query parameter
  const providedKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!providedKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required. Provide it in header: X-API-Key or query: ?apiKey=YOUR_KEY'
    });
  }

  if (providedKey !== apiKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  next();
}


