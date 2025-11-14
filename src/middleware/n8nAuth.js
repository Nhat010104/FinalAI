/**
 * Authentication for n8n webhook
 * Supports both Basic Auth (from n8n.json) and API key authentication
 */
export default function n8nAuth(req, res, next) {
  // Log incoming request for debugging
  console.log('🔐 n8n Auth middleware - Request:', {
    method: req.method,
    url: req.url,
    hasAuthHeader: !!req.headers.authorization,
    authHeader: req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : 'none'
  });
  
  const apiKey = process.env.N8N_API_KEY;
  const basicAuthUsername = process.env.N8N_BASIC_AUTH_USERNAME;
  const basicAuthPassword = process.env.N8N_BASIC_AUTH_PASSWORD;
  
  // If no authentication is configured, allow all requests (for development)
  if (!apiKey && !basicAuthUsername && !basicAuthPassword) {
    console.warn('⚠️  No N8N authentication configured - allowing all requests');
    return next();
  }

  // Check Basic Auth first (from n8n.json configuration)
  if (basicAuthUsername && basicAuthPassword) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({
        success: false,
        message: 'Basic authentication required'
      });
    }

    // Decode Basic Auth credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== basicAuthUsername || password !== basicAuthPassword) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Basic Auth credentials'
      });
    }

    return next();
  }

  // Fallback to API key authentication
  if (apiKey) {
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

    return next();
  }

  // If we reach here, no valid authentication was provided
  return res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
}


