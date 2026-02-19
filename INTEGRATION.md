# GrowthLab Startup Resources - Integration Guide

This document explains how to integrate the Startup Resources microservice with the main GrowthLab platform.

## Architecture

The Startup Resources service is a separate Next.js application that communicates with the main GrowthLab platform via REST APIs.

```
┌─────────────────────┐         ┌──────────────────────┐
│  GrowthLab Platform │◄────────►│ Startup Resources    │
│   (Main Platform)   │   API   │    (Microservice)    │
└─────────────────────┘         └──────────────────────┘
```

## API Endpoints

### Authentication

The service uses the main platform's authentication system:

- **Verify Token**: `GET /api/auth/verify`
- **Login**: `POST /api/auth/login`

### Resources

- **Get Resources**: `GET /api/resources?category=&difficulty=&type=&search=&featured=&popular=`
- **Create Resource**: `POST /api/resources` (requires auth)

### Tools

- **Get Tools**: `GET /api/tools?id=&category=`
- **Get Single Tool**: `GET /api/tools/{id}`
- **Create Tool**: `POST /api/tools` (requires auth)

### User Data

- **Get User Profile**: `GET /api/user` (requires auth)

## Environment Variables

Set these environment variables in your Startup Resources service:

```env
GROWTHLAB_API_URL=http://localhost:3001
GROWTHLAB_API_KEY=your_api_key_here
```

## Integration Steps

### 1. Main Platform Setup

In your main GrowthLab platform, create API endpoints that the Startup Resources service can call:

```typescript
// Example: /api/startup-resources/resources
app.get('/api/startup-resources/resources', async (req, res) => {
  // Verify API key
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // Return resources from database
  const resources = await db.resources.findMany({
    where: {
      // Apply filters from query params
    }
  })
  
  res.json(resources)
})
```

### 2. Embedding in Main Platform

To embed the Startup Resources section in your main platform:

#### Option A: Iframe Embedding

```html
<iframe 
  src="http://localhost:3000" 
  width="100%" 
  height="1000px"
  frameborder="0"
></iframe>
```

#### Option B: Direct Link

```html
<a href="http://localhost:3000">Startup Resources</a>
```

#### Option C: API Integration

Fetch data from the Startup Resources API and render in your main platform:

```typescript
const resources = await fetch('http://localhost:3000/api/resources')
  .then(res => res.json())
```

### 3. Authentication Flow

1. User logs into main GrowthLab platform
2. Main platform generates JWT token
3. When accessing Startup Resources, pass token in Authorization header
4. Startup Resources service verifies token with main platform
5. If valid, user can access resources

### 4. CORS Configuration

If running on different domains, configure CORS in the Startup Resources service:

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-main-platform.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-API-Key' },
        ],
      },
    ]
  },
}
```

## Data Flow

1. **User Request**: User clicks "Startup Resources" in main platform
2. **Authentication**: Main platform redirects with auth token
3. **API Call**: Startup Resources service calls main platform API with token
4. **Data Fetch**: Main platform returns data
5. **Render**: Startup Resources service renders the UI

## Database Considerations

The Startup Resources service does NOT have its own database. All data is fetched from the main GrowthLab platform via APIs. This ensures:

- Single source of truth
- Reduced database load
- Easier data synchronization
- Centralized user management

## Deployment

### Startup Resources Service

Deploy the Startup Resources service separately:

```bash
# Build
npm run build

# Start
npm start
```

### Environment Variables

Set production environment variables:

```env
GROWTHLAB_API_URL=https://api.growthlab.com
GROWTHLAB_API_KEY=production_api_key
NODE_ENV=production
```

## Testing

### Local Development

1. Start main GrowthLab platform on port 3001
2. Start Startup Resources service on port 3000
3. Set environment variables
4. Test API integration

### Integration Testing

Test the full flow:

1. User authentication
2. Resource fetching
3. Tool access
4. Data synchronization

## Security Considerations

1. **API Key**: Always use API keys for service-to-service communication
2. **Token Validation**: Always validate JWT tokens with main platform
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Input Validation**: Validate all inputs from API responses

## Monitoring

Monitor the following:

- API response times
- Error rates
- Authentication failures
- Resource access patterns
- Tool usage statistics

## Support

For integration issues, contact the GrowthLab development team.

