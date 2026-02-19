# GrowthLab Startup Resources Service

A separate microservice for the Startup Resources section of the GrowthLab platform - a global startup ecosystem based in Asia, serving founders worldwide.

## Features

- 🚀 12+ Essential Startup Tools
- 📚 Comprehensive Resource Library
- 🤖 AI-Powered Tools
- 👥 Professional Services Directory
- 🏢 Startup Directory
- 🔍 Advanced Search & Filtering
- 📱 Fully Responsive Design
- 🌙 Dark Mode Support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

This service integrates with the main GrowthLab platform via API endpoints:

- `/api/auth` - Authentication
- `/api/resources` - Resource data
- `/api/tools` - Tool data
- `/api/user` - User data

## Environment Variables

```env
GROWTHLAB_API_URL=http://localhost:3001
GROWTHLAB_API_KEY=your_api_key_here
```

