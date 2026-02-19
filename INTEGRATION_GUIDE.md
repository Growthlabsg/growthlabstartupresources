# GrowthLab Platform Integration Guide

## Overview

The Startup Resources Portal is designed to integrate seamlessly with the main GrowthLab platform. It can operate in two modes:

1. **Standalone Mode**: Independent application accessible directly
2. **Embedded Mode**: Integrated within the main platform as a dynamic component/iframe

## Architecture

```
┌─────────────────────────────────────┐
│   Main GrowthLab Platform           │
│   (Port 3001)                       │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Startup Resources Portal     │  │
│  │  (Port 3003) - Embedded       │  │
│  │                               │  │
│  │  • User Context               │  │
│  │  • Authentication             │  │
│  │  • Resource Management        │  │
│  │  • Tool Access                │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Setup

### 1. Environment Configuration

Create a `.env.local` file:

```env
GROWTHLAB_API_URL=http://localhost:3001
GROWTHLAB_API_KEY=your_api_key_here
NEXT_PUBLIC_GROWTHLAB_API_URL=http://localhost:3001
NEXT_PUBLIC_GROWTHLAB_API_KEY=your_api_key_here
```

### 2. Main Platform Requirements

The main platform should expose these endpoints:

- `GET /api/auth/verify` - Verify authentication token
- `GET /api/user/profile` - Get user profile
- `GET /api/startup-resources/*` - Resource endpoints
- `GET /api/user/bookmarks` - User bookmarks
- `GET /api/user/progress` - User progress tracking

## Integration Methods

### Method 1: Standalone Application

Access the portal directly at `http://localhost:3003`. Users authenticate via the main platform, and tokens are shared via cookies or localStorage.

**Flow:**
1. User logs into main platform
2. Main platform sets `growthlab_token` cookie
3. Portal reads token and fetches user data
4. Portal operates with full user context

### Method 2: Embedded Iframe

Embed the portal within the main platform using an iframe:

```html
<iframe 
  id="startup-resources-frame"
  src="http://localhost:3003?embedded=true&token=<user_token>&theme=light&width=100%&height=100%"
  style="width: 100%; height: 100%; border: none;"
  allow="clipboard-read; clipboard-write"
></iframe>
```

**PostMessage Communication:**

```javascript
// From Main Platform to Portal
window.addEventListener('message', (event) => {
  if (event.data.source === 'startup-resources') {
    switch (event.data.type) {
      case 'REQUEST_TOKEN':
        // Send token to portal
        event.source.postMessage({
          type: 'TOKEN_RESPONSE',
          token: getUserToken(),
        }, '*')
        break
      
      case 'NAVIGATION':
        // Handle navigation in main platform
        handleNavigation(event.data.payload.path)
        break
      
      case 'RESOURCE_VIEW':
        // Track resource views
        trackResourceView(event.data.payload)
        break
    }
  }
})

// From Portal to Main Platform
iframe.contentWindow.postMessage({
  type: 'AUTH_UPDATE',
  token: newToken,
}, '*')
```

### Method 3: Dynamic Component (Recommended)

For React-based main platform, use the portal as a dynamic component:

```tsx
import dynamic from 'next/dynamic'

const StartupResources = dynamic(
  () => import('@growthlab/startup-resources'),
  { ssr: false }
)

function MainPlatformPage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <StartupResources 
        token={userToken}
        theme={currentTheme}
        onNavigation={(path) => handleNavigation(path)}
      />
    </div>
  )
}
```

## User Context Flow

```
┌─────────────┐
│ Main Platform│
│  (User Auth) │
└──────┬──────┘
       │ Token
       ▼
┌─────────────────┐
│ Startup Resources│
│   Portal API     │
│                  │
│ 1. Verify Token │
│ 2. Get User     │
│ 3. Get Context   │
└──────┬───────────┘
       │ User Data
       ▼
┌─────────────────┐
│ Portal UI       │
│ (Personalized)  │
└─────────────────┘
```

## API Integration Examples

### 1. Get User Profile

```typescript
import { platformClient } from '@/lib/api/platform-client'

// Set token from main platform
platformClient.setToken(userToken)

// Fetch user profile
const user = await platformClient.getUserProfile()
console.log(user.name, user.stage, user.industry)
```

### 2. Get Personalized Resources

```typescript
// Resources filtered by user stage and industry
const resources = await platformClient.getResources({
  featured: true,
  limit: 10,
})

// Resources will be filtered based on user context
```

### 3. Track User Progress

```typescript
// Update progress when user views/completes resource
await platformClient.updateProgress(
  'resource_123',
  75, // 75% complete
  false // not completed yet
)
```

### 4. Search with User Context

```typescript
// Search results will be personalized based on user
const results = await platformClient.search('pitch deck', 'all')
```

## Dynamic Page Sizing

The portal automatically adapts to container dimensions:

### Iframe Dimensions

```html
<iframe 
  src="http://localhost:3003?embedded=true&width=1200&height=800"
  style="width: 100%; height: 100%;"
></iframe>
```

### JavaScript Resize

```javascript
// Portal listens for resize events
window.addEventListener('resize', () => {
  const dimensions = {
    width: container.offsetWidth,
    height: container.offsetHeight,
  }
  
  iframe.contentWindow.postMessage({
    type: 'RESIZE',
    dimensions,
  }, '*')
})
```

### CSS Container Queries

The portal uses container queries to adapt:

```css
.container {
  container-type: inline-size;
}

@container (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Theme Integration

### Light/Dark Theme Sync

```javascript
// Main platform sends theme changes
iframe.contentWindow.postMessage({
  type: 'THEME_CHANGE',
  payload: { theme: 'dark' },
}, '*')

// Portal automatically applies theme
```

### Custom Theme Variables

```css
:root {
  --primary-color: #0F7377;
  --secondary-color: #F59E0B;
}

[data-theme="dark"] {
  --primary-color: #66A3A5;
  --background: #1a1a1a;
}
```

## Navigation Integration

### Portal → Main Platform

```typescript
import { notifyNavigation } from '@/lib/utils/platform-integration'

// When user navigates in portal
notifyNavigation('/startup/pitch-deck-builder')

// Main platform receives:
// { type: 'NAVIGATION', payload: { path: '/startup/pitch-deck-builder' } }
```

### Main Platform → Portal

```javascript
// Main platform can navigate portal
iframe.contentWindow.postMessage({
  type: 'NAVIGATE',
  payload: { path: '/startup/financial-projections' },
}, '*')
```

## User Data Synchronization

All user data is retrieved from the main platform:

- **User Profile**: Name, email, role, company, stage, industry
- **Preferences**: Theme, locale, notifications
- **Bookmarks**: Saved resources and tools
- **Progress**: Completion status for resources
- **Activity**: Recent views, tool usage

## Security Considerations

1. **Token Validation**: All tokens are verified with main platform
2. **CORS**: Configure allowed origins for API access
3. **XSS Protection**: All user input is sanitized
4. **CSRF Protection**: Tokens are validated on each request
5. **Rate Limiting**: API endpoints have rate limits

## Testing Integration

### 1. Test Authentication

```bash
# Get token from main platform
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq -r '.token')

# Verify token with portal
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3003/api/auth/verify
```

### 2. Test User Profile

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3003/api/user/profile
```

### 3. Test Resources

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3003/api/resources?featured=true"
```

## Deployment

### Environment Variables

Set these in your deployment environment:

```env
GROWTHLAB_API_URL=https://api.growthlab.com
GROWTHLAB_API_KEY=production_api_key
NEXT_PUBLIC_GROWTHLAB_API_URL=https://api.growthlab.com
NEXT_PUBLIC_GROWTHLAB_API_KEY=production_api_key
```

### Build Configuration

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p 3003"
  }
}
```

## Troubleshooting

### Portal Not Loading

1. Check if main platform is running
2. Verify API URL in environment variables
3. Check CORS settings
4. Verify API key is correct

### Authentication Failing

1. Check token format (should be Bearer token)
2. Verify token is valid with main platform
3. Check token expiration
4. Verify API key matches

### Embedded Mode Issues

1. Check iframe permissions
2. Verify postMessage communication
3. Check console for errors
4. Verify token is being passed correctly

## Support

For integration support, contact the GrowthLab platform team.

