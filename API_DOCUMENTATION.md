# Startup Resources Portal API Documentation

## Overview

This API provides comprehensive endpoints for the Startup Resources Portal, designed to integrate seamlessly with the main GrowthLab platform. The portal can operate in both standalone and embedded (iframe) modes.

## Base URL

- **Development**: `http://localhost:3003`
- **Production**: Configure via `NEXT_PUBLIC_GROWTHLAB_API_URL`

## Authentication

The API supports multiple authentication methods:

1. **Authorization Header**: `Authorization: Bearer <token>`
2. **Cookie**: `growthlab_token`
3. **Query Parameter**: `?token=<token>` (for iframe embedding)
4. **Custom Header**: `X-Iframe-Token: <token>` (for embedded mode)

## Environment Variables

```env
# Main Platform API
GROWTHLAB_API_URL=http://localhost:3001
GROWTHLAB_API_KEY=your_api_key_here

# Public (client-side) variables
NEXT_PUBLIC_GROWTHLAB_API_URL=http://localhost:3001
NEXT_PUBLIC_GROWTHLAB_API_KEY=your_api_key_here
```

## API Endpoints

### Authentication

#### `GET /api/auth/verify`
Verify authentication status and get user context.

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "founder",
    "stage": "seed",
    "industry": "SaaS"
  },
  "isEmbedded": false,
  "platformContext": {
    "theme": "light",
    "locale": "en"
  }
}
```

### User

#### `GET /api/user/profile`
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "founder",
    "company": "My Startup",
    "stage": "seed",
    "industry": "SaaS",
    "subscription": "pro"
  }
}
```

#### `GET /api/user/bookmarks`
Get user's bookmarked resources.

**Query Parameters:**
- `type` (optional): Filter by resource type

**Response:**
```json
{
  "bookmarks": [
    {
      "id": "bookmark_1",
      "resourceId": "resource_123",
      "resourceType": "startup-resource",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

#### `POST /api/user/bookmarks`
Add a bookmark.

**Request Body:**
```json
{
  "resourceId": "resource_123",
  "resourceType": "startup-resource"
}
```

#### `DELETE /api/user/bookmarks?resourceId=<id>`
Remove a bookmark.

#### `GET /api/user/progress`
Get user's progress on resources.

**Query Parameters:**
- `resourceId` (optional): Get progress for specific resource

**Response:**
```json
{
  "progress": [
    {
      "resourceId": "resource_123",
      "progress": 75,
      "completed": false,
      "lastAccessed": "2024-01-20T10:00:00Z"
    }
  ]
}
```

#### `POST /api/user/progress`
Update user progress.

**Request Body:**
```json
{
  "resourceId": "resource_123",
  "progress": 75,
  "completed": false
}
```

### Resources

#### `GET /api/resources`
Get list of resources.

**Query Parameters:**
- `category`: Filter by category
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `type`: Filter by type (guide, template, tool, etc.)
- `search`: Search query
- `featured`: Boolean, get featured resources
- `popular`: Boolean, get popular resources
- `limit`: Limit number of results

**Response:**
```json
{
  "resources": [
    {
      "id": "resource_123",
      "title": "Pitch Deck Builder",
      "description": "Create professional pitch decks",
      "type": "tool",
      "category": "Funding & Investment",
      "difficulty": "intermediate",
      "href": "/startup/pitch-deck-builder"
    }
  ],
  "total": 150,
  "userContext": {
    "stage": "seed",
    "industry": "SaaS"
  }
}
```

#### `GET /api/resources/[id]`
Get specific resource by ID.

**Response:**
```json
{
  "id": "resource_123",
  "title": "Pitch Deck Builder",
  "description": "Create professional pitch decks",
  "content": "...",
  "userContext": {
    "bookmarked": false,
    "viewed": true,
    "completed": false
  }
}
```

### Tools

#### `GET /api/tools`
Get list of tools.

**Query Parameters:**
- `category`: Filter by category
- `search`: Search query
- `featured`: Boolean
- `limit`: Limit number of results

**Response:**
```json
{
  "tools": [
    {
      "id": "tool_123",
      "title": "Financial Projections",
      "description": "Build financial models",
      "category": "Finance",
      "features": ["Revenue Forecasting", "Expense Planning"]
    }
  ]
}
```

#### `GET /api/tools/[id]`
Get specific tool by ID.

**Response:**
```json
{
  "id": "tool_123",
  "title": "Financial Projections",
  "description": "Build financial models",
  "userContext": {
    "bookmarked": false,
    "progress": null
  }
}
```

### Search

#### `GET /api/search?q=<query>&type=<type>`
Search across resources, tools, and guides.

**Query Parameters:**
- `q`: Search query (required)
- `type`: Type to search (all, tools, resources, guides)
- `limit`: Limit per category

**Response:**
```json
{
  "query": "pitch deck",
  "type": "all",
  "results": {
    "tools": [...],
    "resources": [...],
    "guides": [...]
  },
  "total": 25
}
```

### Stats

#### `GET /api/stats`
Get platform and resource statistics.

**Response:**
```json
{
  "platform": {
    "totalFounders": 12500,
    "totalMentors": 450,
    "activeEvents": 24
  },
  "resources": {
    "totalResources": 500,
    "totalTools": 50,
    "totalGuides": 35
  },
  "user": {
    "id": "user_123",
    "stage": "seed",
    "industry": "SaaS"
  }
}
```

### Health & Embedding

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "startup-resources",
  "version": "1.0.0",
  "platform": {
    "connected": true,
    "url": "http://localhost:3001"
  }
}
```

#### `GET /api/embed/config`
Get configuration for embedded mode.

**Query Parameters:**
- `containerId`: Container ID from parent platform

**Response:**
```json
{
  "version": "1.0.0",
  "embedded": true,
  "features": {
    "authentication": true,
    "userContext": true,
    "navigation": true
  },
  "endpoints": {
    "auth": "/api/auth/verify",
    "user": "/api/user/profile"
  }
}
```

## Embedded Mode

When embedded in the main platform via iframe:

1. **Token Exchange**: The portal requests a token from the parent via `postMessage`
2. **Theme Sync**: Supports light/dark theme from parent
3. **Navigation**: Notifies parent of navigation events
4. **User Context**: Automatically receives user data from parent

### PostMessage API

**From Portal to Platform:**
- `REQUEST_TOKEN`: Request authentication token
- `NAVIGATION`: Notify of navigation
- `RESOURCE_VIEW`: Notify of resource view
- `TOOL_USAGE`: Notify of tool usage
- `EMBEDDED_READY`: Portal is ready

**From Platform to Portal:**
- `TOKEN_RESPONSE`: Provide authentication token
- `AUTH_UPDATE`: Update authentication status
- `THEME_CHANGE`: Change theme

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE" // optional
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute
- **Search endpoints**: 50 requests/minute

## CORS

The API supports CORS for cross-origin requests from the main platform. Configure allowed origins via environment variables.

## Examples

### Get User Profile
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3003/api/user/profile
```

### Search Resources
```bash
curl "http://localhost:3003/api/search?q=pitch%20deck&type=all"
```

### Add Bookmark
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"resourceId":"resource_123","resourceType":"startup-resource"}' \
  http://localhost:3003/api/user/bookmarks
```

## Integration Guide

### 1. Standalone Mode

Use the portal as a standalone application:

```typescript
import { platformClient } from '@/lib/api/platform-client'

// Set token
platformClient.setToken(userToken)

// Fetch resources
const resources = await platformClient.getResources({ featured: true })
```

### 2. Embedded Mode

Embed in main platform via iframe:

```html
<iframe 
  src="http://localhost:3003?embedded=true&token=<user_token>&theme=light"
  width="100%"
  height="100%"
></iframe>
```

The portal will automatically:
- Request token from parent if not provided
- Sync theme with parent
- Send navigation events to parent

### 3. React Integration

Use the PlatformProvider and hooks:

```tsx
import { PlatformProvider, usePlatformUser } from '@/lib/hooks/usePlatformUser'

function App() {
  return (
    <PlatformProvider>
      <YourComponent />
    </PlatformProvider>
  )
}

function YourComponent() {
  const { user, loading, isEmbedded } = usePlatformUser()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return <div>Welcome, {user.name}!</div>
}
```

