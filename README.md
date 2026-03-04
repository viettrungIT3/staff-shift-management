# Staff Shift Management System

A backend system for managing staff duty schedules, built with Node.js, Express, MySQL, RabbitMQ, and MinIO.

## Features

- **Upload Roster Images**: Upload images of handwritten duty schedules
- **OCR Processing**: Extract data from roster images (mock implementation)
- **Review & Approve**: Manual review and correction of OCR results
- **Statistics & Reports**: Monthly duty statistics and employee shift reports
- **RESTful API**: Full REST API for all operations

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MySQL 8.0 + Knex.js
- **Queue**: RabbitMQ 3
- **Storage**: MinIO (S3-compatible)
- **Container**: Docker + Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)

### Running the Application

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f api

# Stop all services
docker compose down
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| API | 8080 | Express REST API |
| MySQL | 3306 | Database |
| RabbitMQ | 5672 | Message queue |
| RabbitMQ Management | 15672 | Queue UI |
| MinIO | 9000 | Object storage |
| MinIO Console | 9001 | Storage UI |

### API Endpoints

#### Health Check
```
GET /health
```

#### Upload Roster
```
POST /api/v1/rosters/upload
Content-Type: multipart/form-data

Body: image (file)
```

#### Review OCR Cells
```
GET /api/v1/review/:imageId/cells
POST /api/v1/review/:ocrCellId/fix
POST /api/v1/review/:imageId/approve
```

#### Reports
```
GET /api/v1/reports/monthly?year=2026&month=3
GET /api/v1/reports/summary
GET /api/v1/reports/employee/:employeeId
```

## Database

### Schema

- **employees**: Staff information
- **positions**: Duty positions (C.trại, Chơi 1-4)
- **shifts**: Shift times (Ca 1-4)
- **roster_images**: Uploaded roster images
- **ocr_cells**: OCR extracted cells
- **duty_assignments**: Confirmed duty assignments
- **duty_swaps**: Shift swap requests
- **assignment_audit_logs**: Audit trail

### Running Migrations

```bash
docker compose exec api npm run migrate
```

### Running Seeds

```bash
docker compose exec api npm run seed
```

## Development

### Project Structure

`src/
├── api/
│   ├── app.js              # Express app
│   ├── controllers/        # Route handlers
│   ├── services/          # Business logic
│   ├── routes/            # Route definitions
│   └── middleware/        # Middleware
├── worker/
│   ├── ocr.worker.js      # OCR processing worker
│   └── mapping.worker.js  # Mapping worker
├── shared/
│   ├── config/            # Configuration
│   ├── db/               # Database helper
│   ├── loggeO helper
└── db/
    ├── migrations/        # Knex migrations
    └── seeds/            # Seed data
```

### Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Run tests
npm test

# Build Docker
docker compose build
```

## Environment Variables

See `src/.env.example` for configuration:

- `PORT`: API port (default: 8080)
- `DB_*`: Database connection
- `MQ_URL`: RabbitMQ connection
- `MINIO_*`: MinIO configuration

## License

MIT
