# Addepar Integration Management Platform

A full-stack mock UI demonstrating how Addepar customers can manage bidirectional integrations between the Addepar wealth management platform and Salesforce CRM systems, powered by MuleSoft as the integration middleware engine.

## 🎯 Overview

This application validates that MuleSoft can serve as the foundation for a productized, self-service integration solution enabling Addepar customers to synchronize financial data without requiring extensive technical expertise or ongoing vendor support.

### Key Features

- **Self-Service Configuration** - Non-technical administrators can configure integrations
- **OAuth Connection** - Simulated Salesforce OAuth flow with organization details
- **Field Mapping** - Drag-and-drop interface for mapping Addepar entities to Salesforce objects
- **Bidirectional Sync** - Support for data synchronization in both directions
- **Real-time Monitoring** - Live sync status with progress tracking
- **Comprehensive Logging** - Detailed logs with error messages and stack traces
- **Historical Tracking** - View past sync runs with statistics

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   React UI      │────────▶│  Mock MuleSoft   │────────▶│   Salesforce    │
│   (Frontend)    │         │    Backend       │         │   (Simulated)   │
│                 │◀────────│   (Express)      │◀────────│                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     │
                                     ▼
                            ┌──────────────────┐
                            │    Addepar       │
                            │   (Simulated)    │
                            └──────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/ui (styling)
- TanStack React Query (API state)
- @dnd-kit (drag-and-drop)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- TypeScript
- Faker.js (mock data generation)
- In-memory data storage

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone or navigate to the project directory:**

```bash
cd "/Users/dcovey/Addepar /addepar-integration-mock"
```

2. **Install backend dependencies:**

```bash
cd server
npm install
```

3. **Install frontend dependencies:**

```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start the Backend Server

In one terminal:

```bash
cd server
npm run dev
```

The backend will start on `http://localhost:3001`

### Start the Frontend Application

In another terminal:

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:3000`

### Access the Application

Open your browser and navigate to: `http://localhost:3000`

## 📖 User Guide

### Demo Scenario 1: First-Time Setup

1. **Navigate to Connection Tab**
   - Click on "Connection" in the navigation bar

2. **Connect to Salesforce**
   - Select "Production" or "Sandbox" environment
   - Click "Connect to Salesforce"
   - View the connected organization details

3. **Create Field Mappings**
   - Navigate to "Field Mapping" tab
   - Select "Household" from the entity type dropdown
   - Drag "Total AUM" field from Addepar column
   - Drop it on "TotalAUM__c" field in Salesforce column
   - The mapping is automatically created with bidirectional sync

4. **Trigger Initial Sync**
   - Navigate to "Sync & Monitor" tab
   - Click "Trigger Sync" button
   - Watch the real-time progress bar
   - View statistics: Total, New, Updated, and Failed records

5. **View Sync Results**
   - Once complete, review the statistics
   - Check the sync history table below
   - Click "View Logs" to see detailed logs

### Demo Scenario 2: Mapping Evolution

1. **Add Custom Field Mapping**
   - Go to "Field Mapping" tab
   - Select different entity type (e.g., "Account")
   - Create new mappings by dragging fields

2. **Modify Existing Mappings**
   - View active mappings in the center column
   - Click "Remove" to delete a mapping
   - Create new mapping with different sync direction

3. **Re-run Sync**
   - Navigate to "Sync & Monitor" tab
   - Click "Trigger Sync" again
   - Observe that new mappings are included
   - No vendor support needed!

### Demo Scenario 3: Troubleshooting

1. **View Detailed Logs**
   - From "Sync & Monitor" tab, click "View Logs" on any job
   - Filter logs by level (Info, Warning, Error)
   - Click on any log entry to expand details
   - View stack traces for errors

2. **Export Logs**
   - Click "Export Logs" button to download JSON
   - Share with support team if needed

## 🗂️ Project Structure

```
addepar-integration-mock/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # Shadcn/ui base components
│   │   │   ├── ConnectionSetup.tsx
│   │   │   ├── FieldMapper.tsx
│   │   │   ├── SyncDashboard.tsx
│   │   │   └── LogsViewer.tsx
│   │   ├── pages/
│   │   │   └── IntegrationManager.tsx
│   │   ├── services/
│   │   │   └── api.ts              # API client
│   │   ├── types/
│   │   │   └── integration.ts      # TypeScript types
│   │   ├── hooks/
│   │   │   └── useQuery.ts         # React Query hooks
│   │   ├── lib/
│   │   │   └── utils.ts            # Utility functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
├── server/                          # Mock MuleSoft backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── salesforce.ts       # Salesforce API routes
│   │   │   ├── addepar.ts          # Addepar API routes
│   │   │   ├── mappings.ts         # Mapping CRUD routes
│   │   │   └── sync.ts             # Sync job routes
│   │   ├── services/
│   │   │   ├── dataGenerator.ts    # Mock data generation
│   │   │   └── syncEngine.ts       # Sync simulation logic
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   └── server.ts               # Express server
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Salesforce Routes
- `POST /api/salesforce/connect` - Connect to Salesforce (OAuth simulation)
- `GET /api/salesforce/status` - Get connection status
- `GET /api/salesforce/metadata` - Get Salesforce schema metadata
- `DELETE /api/salesforce/disconnect` - Disconnect from Salesforce

### Addepar Routes
- `GET /api/addepar/entities` - Get Addepar entity types and attributes

### Mapping Routes
- `GET /api/mappings` - Get all field mappings
- `POST /api/mappings` - Create new field mapping
- `PUT /api/mappings/:id` - Update field mapping
- `DELETE /api/mappings/:id` - Delete field mapping

### Sync Routes
- `POST /api/sync/trigger` - Trigger new sync job
- `GET /api/sync/status` - Get current sync status
- `GET /api/sync/history` - Get historical sync jobs
- `GET /api/sync/logs/:jobId` - Get logs for specific job
- `POST /api/sync/retry` - Retry failed records

## 🎨 Design System

The UI follows Addepar's design principles:

- **Streamline** - Turn complex tasks into clear, quick actions
- **Scale** - Ecosystem of products that work together
- **Transform** - Set new standards for design in finance

**Color Palette:**
- Primary: Navy blue (#0F2D52) - Professional, trustworthy
- Secondary: Light gray backgrounds - Clean, spacious
- Success: Green - Positive actions, completed status
- Warning: Yellow - Caution, running processes
- Error: Red - Failed operations, attention needed

## 🧪 Mock Data

The backend generates realistic mock data for:

- **Households** - 50+ family groups with AUM, advisors, risk profiles
- **Entities** - Legal entities with tax IDs, formation dates
- **Owners** - Individual owners with contact info, ownership percentages
- **Accounts** - Financial accounts with balances, performance metrics
- **Salesforce Objects** - Account, Contact, Financial Account fields
- **Sync Jobs** - Historical sync runs with realistic timestamps and statistics
- **Logs** - Info, warning, and error logs with details and stack traces

## ✅ Success Criteria

- ✅ Modern, responsive UI renders in all browsers
- ✅ OAuth connection flow completes successfully
- ✅ Field mapper displays 20+ fields per entity type
- ✅ Drag-and-drop mapping creation works smoothly
- ✅ Sync completes within simulated 5-10 seconds
- ✅ Error logs show detailed, helpful messages
- ✅ UI reflects Addepar's professional design aesthetic

## 🔧 Development

### Build for Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

### Type Checking

Both client and server use TypeScript. Type errors will be shown during development.

## 📝 Notes

- All data is stored in-memory and will be lost on server restart
- OAuth flow is simulated - no actual Salesforce connection is made
- Sync operations are mocked with realistic delays and outcomes
- This is a demonstration/prototype, not production-ready code

## 🙋 Support

For questions or issues with this demonstration, please contact the development team.

## 📄 License

© 2026 Addepar. Internal demonstration project.
