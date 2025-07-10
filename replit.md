# JLR Construction Estimate Generator

## Overview

This is a full-stack web application built for JLR Construction LLC to generate professional estimates and invoices. The application features a React-based frontend with a modern UI using shadcn/ui components, an Express.js backend, and is configured to use PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Development**: Hot reload with tsx for server-side development

### Key Design Decisions
- **Monorepo Structure**: Client, server, and shared code in a single repository
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Component Architecture**: Modular UI components with consistent design system
- **Database-First**: Schema-driven development with Drizzle migrations

## Key Components

### Application Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── attached_assets/ # Static assets and templates
```

### Core Features
1. **Estimate/Invoice Generator**: Toggle between estimate and invoice modes
2. **Client Information Management**: Capture customer details and contact information
3. **Service Line Items**: Dynamic addition/removal of services with pricing
4. **Document Preview**: Professional PDF-ready document generation
5. **Print/Export Functionality**: Browser-based printing and PDF export

### Database Schema
- **Users Table**: Basic user authentication structure (prepared for future use)
- **Extensible Design**: Schema ready for additional tables for clients, estimates, and invoices

## Data Flow

1. **Form Input**: User enters client details and service information through React forms
2. **Client-Side Validation**: Zod schemas validate data before submission
3. **State Management**: TanStack Query manages form state and API interactions
4. **Document Generation**: Client-side document preview with professional formatting
5. **Export Options**: Browser-native printing for PDF generation

## External Dependencies

### Frontend Dependencies
- **UI Components**: Comprehensive shadcn/ui component library
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-kit for schema management
- **Session Storage**: connect-pg-simple for PostgreSQL session persistence
- **Development**: tsx for TypeScript execution and hot reload

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Replit Integration**: Cartographer plugin for Replit environment compatibility
- **Error Handling**: Runtime error modal for development debugging

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both client and server with hot reload
- **Database Setup**: `npm run db:push` applies schema changes to database
- **Type Checking**: `npm run check` validates TypeScript across all modules

### Production Build
- **Client Build**: Vite builds optimized React application to `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Deployment**: Single production command `npm start` serves the complete application

### Environment Configuration
- **Database Connection**: `DATABASE_URL` environment variable for PostgreSQL
- **Session Security**: Environment-based session configuration
- **Replit Compatibility**: Built-in support for Replit deployment environment

### Architecture Benefits
- **Type Safety**: End-to-end TypeScript ensures runtime reliability
- **Performance**: Vite's fast builds and optimized production bundles
- **Scalability**: Modular architecture allows easy feature expansion
- **User Experience**: Professional document generation with modern UI components
- **Developer Experience**: Hot reload, comprehensive tooling, and clear separation of concerns