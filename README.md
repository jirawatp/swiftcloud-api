
# SwiftCloud API

SwiftCloud API provides a platform to query Taylor Swift's song data. This includes retrieving, searching, and sorting songs and albums based on various parameters, such as year, month, and popularity.

## Features

- Retrieve songs by year.
- Fetch the most popular songs or albums for a specific month or overall.
- Sort songs by fields such as title, year, or plays count.
- API secured with API key authentication.
- Includes a health check endpoint.
- Swagger documentation for API reference.

---

## Project Structure

```plaintext
src/
├── common/              # Shared utilities, DTOs, guards, and services
├── config/              # Configuration files
├── data-loader/         # Data loading service for song records
├── health/              # Health check module
├── popular/             # Popularity-related features and endpoints
├── search/              # Search functionality for songs and albums
├── songs/               # Song-related endpoints and services
├── main.ts              # Entry point of the application
tests/
├── popular.service.spec.ts   # Test cases for PopularService
├── songs.service.spec.ts     # Test cases for SongsService
...
```

---

## Getting Started

### Prerequisites

- **Node.js** (v20.16.0 or above)
- **npm** (v7.0.0 or above)
- **Docker** (optional, for containerized setup)

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jirawatp/swiftcloud-api.git
   cd swiftcloud-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```plaintext
   API_KEY=my-api-key
   PORT=3000
   ```

4. Place your song data CSV file at the `src/data-loader/songs.csv` location.

---

### Running the Application

Start the application locally:

```bash
npm run start
```

Visit `http://localhost:3000` to access the API.

---

## Testing

Run the test suite using Jest:

```bash
npm run test
```

---

## Deployment

### Docker Deployment

1. Build the Docker image:

   ```bash
   docker build -t swiftcloud-api .
   ```

2. Run the container:

   ```bash
   docker run -d -p 3000:3000 -e API_KEY=my-api-key swiftcloud-api
   ```

---

## Swagger Documentation

Swagger documentation is available for API usage. Access it at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## API Endpoints

### Authentication

All endpoints (except `/health`) require the `x-api-key` header.

**Example:**

```plaintext
x-api-key: my-api-key
```

### Endpoints

1. **Get Songs by Year**
   - **GET** `/songs?year=<year>`
   - Fetches all songs released in the specified year.
   - Query Parameters:
     - `field`: Sort field (optional, e.g., `title`, `playsJune`).

2. **Most Popular**
   - **GET** `/popular?year=<year>&month=<month>`
   - Fetches the most popular songs or albums for a given year and month.

3. **Search**
   - **GET** `/search?query=<string>`
   - Searches songs or albums by title, artist, or album name.

4. **Health Check**
   - **GET** `/health`
   - Ensures the application is running.

---

## Environment Variables

- `API_KEY`: API key for authentication.
- `PORT`: Port to run the application.

---
