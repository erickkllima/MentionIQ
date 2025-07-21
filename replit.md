# MentionIQ - Social Media Sentiment Analysis Platform

## Overview

MentionIQ is a comprehensive social media monitoring and sentiment analysis platform built with a modern full-stack architecture. The application helps businesses track mentions across social media platforms, analyze sentiment, and generate insights through automated data collection and AI-powered analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Integration**: OpenAI GPT-4o for sentiment analysis
- **Session Management**: Express sessions with PostgreSQL store

### Development Environment
- **Platform**: Replit-optimized with development tools
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Error Handling**: Runtime error overlays and comprehensive logging

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Mentions**: Social media mentions with content, source, and metadata
- **Tags**: Categorization system with usage tracking
- **Search Queries**: Saved search configurations for automated collection
- **Reports**: Generated analytics and insights

### AI Services
- **Sentiment Analysis**: OpenAI GPT-4o integration for Portuguese content analysis
- **Tag Suggestion**: Automated tagging based on content analysis
- **Report Generation**: AI-powered insights and summaries

### Data Collection
- **Web Scraper**: Modular scraping system (currently mock implementation)
- **Multi-platform Support**: Twitter, Facebook, Instagram, LinkedIn
- **Scheduled Collection**: Background jobs for continuous monitoring

### Dashboard Features
- **Real-time Metrics**: Total mentions, sentiment distribution, growth trends
- **Visualization**: Line charts for sentiment trends, pie charts for source distribution
- **Recent Activity**: Live feed of new mentions with sentiment indicators
- **Tag Management**: Popular tags with usage statistics

## Data Flow

1. **Collection**: Web scrapers gather mentions from social platforms
2. **Processing**: Content is analyzed for sentiment using OpenAI API
3. **Storage**: Mentions are stored with metadata and analysis results
4. **Presentation**: Dashboard displays real-time metrics and trends
5. **Reporting**: Automated insights and exportable reports

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4o for sentiment analysis and content processing

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Recharts**: Chart and visualization library
- **Embla Carousel**: Touch-friendly carousels

### Development Tools
- **Replit Plugins**: Cartographer for development insights
- **ESBuild**: Production bundling for server code
- **PostCSS**: CSS processing with Tailwind integration

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Full-stack development with instant updates
- **Environment**: Replit-native development environment

### Production
- **Build Process**: Vite builds frontend to `dist/public`, ESBuild bundles server
- **Static Assets**: Frontend served from Express static middleware
- **Database**: Managed PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Architecture Benefits
- **Monorepo Structure**: Shared types and schemas between frontend and backend
- **Type Safety**: End-to-end TypeScript with Drizzle schema validation
- **Scalability**: Serverless database with efficient ORM queries
- **Modern Development**: Fast builds, hot reload, and comprehensive tooling
- **AI Integration**: Seamless sentiment analysis with OpenAI's latest models

The application follows a clean separation of concerns with shared type definitions, making it maintainable and scalable for social media monitoring at any scale.