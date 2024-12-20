# SwiftCloud API

A NestJS-based API to query Taylor Swift songs data, with:
- JWT Authentication
- Sorting, Searching, Popular queries
- Health Check endpoint
- Swagger Documentation
- In-memory Cache
- Helmet for security
- Compression for performance
- Winston Logging
- Day.js for date/time
- OpenTelemetry instrumentation
- Axios for external data loading
- Docker Compose for local dev
- Helm chart for Kubernetes
- `.env` for env variables
- Deployed via GitHub Actions to Cloud Run
- Container images stored on GHCR (GitHub Container Registry)

## Running Locally

1. Copy `.env.example` to `.env` and adjust as needed.
2. `docker-compose up --build`
3. Access API at `http://localhost:3000`
4. `GET /health` to check service health.
5. Obtain JWT token:
   ```bash
   curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"apiKey":"my-api-key"}'