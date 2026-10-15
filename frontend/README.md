# NagrikSetu

NagrikSetu is a citizen-first civic accountability platform designed to empower citizens to report, track, and resolve local civic issues transparently.

## Key Features

- **Civic Issue Reporting**: Report common public infrastructure problems including potholes, garbage dumps, broken streetlights, water leakages, and traffic concerns.
- **Geo-Tagged Photos & Location Tracking**: Capture real-time geolocation with browser coordinates and attach photo evidence to reports.
- **Interactive OpenStreetMap Explorer**: Explore civic issues on an interactive Leaflet map with status indicators (Pending, In Progress, Resolved).
- **Status Tracking & Community Upvoting**: Track issue lifecycles from submission to resolution with community engagement and AI priority insights.
- **AI Categorization & Assistance**: Automated category suggestions and severity analysis for faster municipal triage.

## Environment Configuration

Configure the backend API URL in `.env`:

```env
VITE_API_URL=http://localhost:5000
```

For production deployment:
```env
VITE_API_URL=https://nagriksetu-api.onrender.com
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
The production bundle will be generated in the `dist` directory.
