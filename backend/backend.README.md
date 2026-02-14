# Bank Transaction System – Backend

A minimal Express + Mongoose backend that exposes a basic HTTP server and connects to MongoDB. This README documents local development, configuration, operations, and production deployment considerations tailored to this codebase.

## Tech Stack
- Node.js (CommonJS)
- Express 5
- Mongoose 9 (MongoDB ODM)
- dotenv for environment variable management

## Project Structure
```
backend/
├─ server.js                 # App entrypoint: bootstraps Express and DB connection
├─ example.env.js            # Loads .env and exports typed config
├─ src/
│  └─ Database/
│     └─ db.js              # MongoDB connection via Mongoose
├─ .env                      # Local environment variables (not for commit)
├─ .gitignore                # Ensures sensitive files (e.g., .env) are ignored
├─ package.json              # Scripts and dependencies
└─ backend.README.md         # This file
```

## Features (current)
- Express server with JSON middleware and a simple health endpoint GET /
- Environment-driven configuration (PORT, database_uri)
- Mongoose connection with basic success/error logging

## Getting Started (Local Development)
1) Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB instance (local or remote)

2) Install dependencies
```
npm install
```

3) Configure environment
- Create a .env file in backend/ based on the example below.
- Variables used by the app are loaded by example.env.js (which imports dotenv) and consumed in server.js and src/Database/db.js.

Example .env
```
PORT=3000
# For local dev, use your local Mongo instance or Atlas URI
# Local example
# database_uri=mongodb://localhost:27017/Bank_Transaction_System
# Atlas example
# database_uri=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

database_uri=mongodb://localhost:27017/Bank_Transaction_System
```

4) Run the server
```
npm start
```
- The app starts on http://localhost:3000 by default (or your configured PORT).
- Health check: GET / should return "Hi hi".

## Configuration Details
- Config loader: example.env.js
  - Loads environment variables via dotenv from .env
  - Exposes: PORT, database_uri
- Consumers:
  - server.js uses PORT and ConnectDB()
  - src/Database/db.js uses database_uri to establish a Mongoose connection

## Code Walkthrough
- server.js
  - Initializes Express, JSON body parsing
  - Defines GET / for quick health/availability
  - Calls ConnectDB() before starting the HTTP server
- src/Database/db.js
  - ConnectDB(): async function calling mongoose.connect(database_uri)
  - Logs success or failure

## Scripts
- npm start: Start the server with Node (server.js)
- test: Placeholder script

## Production Hardening Checklist
- Environment and secrets
  - Store secrets (e.g., MongoDB credentials) in a secure secrets manager (e.g., AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) or in your orchestrator (Kubernetes secrets) rather than plain .env files.
  - Ensure .env is never committed; validate .gitignore coverage.
- Configuration
  - Prefer a dedicated config module that validates env schema (e.g., using zod or joi) and supports per-environment files.
  - Use a single source of truth for config instead of importing example.env.js from multiple modules.
- Logging & Monitoring
  - Replace console.log with a structured logger (pino, winston) and set appropriate log levels.
  - Emit health and readiness endpoints and wire them to liveness/readiness probes.
  - Add request logging middleware (e.g., morgan or pino-http) with correlation IDs.
- Error handling
  - Global error handler middleware for Express; avoid leaking internal errors to clients.
  - Handle unhandledRejection and uncaughtException to allow graceful shutdown.
- Security
  - Add security middleware (helmet, cors with strict origin rules, rate limiting via express-rate-limit or a gateway).
  - Validate inputs and sanitize outputs.
- Database
  - Use connection options (pool size, timeouts, retryWrites if using Atlas) and set strictQuery as needed.
  - Implement graceful shutdown that closes the Mongoose connection when the process exits.
  - Add schemas/models with validation and indexes as the domain grows.
- Observability
  - Expose a /healthz endpoint that checks Mongo connectivity.
  - Add metrics (Prometheus client) and traces (OpenTelemetry) for production.
- Performance
  - Enable compression where appropriate (beware of CPU overhead and encrypted transport).
  - Cache layer for expensive reads if applicable (Redis).
- Deployment
  - Containerize with a minimal base image (Node 18+), run as non-root, pin versions.
  - Configure PORT via env; bind 0.0.0.0 in container.
  - Set NODE_ENV=production.
- Testing & CI/CD
  - Add unit/integration tests and a CI pipeline (lint, test, build, scan, deploy).

## Example Enhancements (Code Snippets)
- Graceful shutdown pattern
```
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  try {
    await mongoose.connection.close(false);
    console.info('Mongo connection closed.');
  } finally {
    process.exit(0);
  }
}
```

- Basic error-handling and health endpoint skeleton
```
const express = require('express');
const app = express();

app.get('/healthz', async (req, res) => {
  // Optionally check mongoose.connection.readyState
  res.status(200).json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});
```

## Common Issues
- dotenv not loading values
  - Ensure example.env.js is required before any module that needs env variables (it is in this project).
  - Ensure .env exists in backend/ and key names match exactly (PORT, database_uri).
- MongoDB connection failures
  - Verify that the database_uri is reachable from your environment (firewall, credentials, SRV records).
  - Confirm the database name exists or your user has permissions to create it.

## API Surface (current)
- GET /
  - 200 OK, body: text "Hi hi"

## License
ISC (see package.json). Adjust as needed for your organization.
