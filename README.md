# Weather App

A modern weather web application built with TypeScript, Next.js, Express.js, and Redis for caching weather data. Users can query weather information by city, and the app efficiently fetches and caches data from OpenWeatherMap API.

## Table of Contents
 - [Setup and Installation](#setup-and-installation)
 - [Architecture Overview](#architecture-overview)
 - [Technology Choices and Justifications](#technology-choices-and-justifications)
 - [Known Limitations or Assumptions](#known-limitations-or-assumptions)
 - [Future Improvements](#future-improvements)

### Setup and Installation
#### Prerequisites
 - Node.js >= 18
 - Redis
 - OpenWeatherMap API key

#### Installation
```bash
git clone https://github.com/wall-e-08/simple-weather-app.git
cd simple-weather-app
npm run install # handled from root script, installs both frontend and backend dependencies
```

#### Environment Variables
Create two `.env` files in both `frontend` and `backend` directories and add the following variables:

```dotenv
### frontend/.env ###
# required
NEXT_PUBLIC_API_URL=http://your-api-base.url

### backend/.env ###
# required
OPENWEATHER_API_KEY=your-openweathermap-api-key
PORT=3001

# required
ALLOWED_HOSTS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_COUNT=20

# optional, defaults to redis://localhost:6379/0
REDIS_URL=redis://localhost:6379/0
```

#### Running the Application
_Make sure Redis is running on your machine. For example:_
```bash
 redis-server
```

```bash
# development
npm run dev

# production
npm run build
```

### Architecture Overview
The app is a full-stack TypeScript project built with Next.js frontend and Express backend API. Redis is used to cache weather data to reduce API calls and improve performance.

#### Components
 1. Frontend (Next.js)
    - Shows current and hourly forecast weather
    - Calls backend API routes for weather data
    - Allows users to search for weather by city name
    - Allows users to save favorite cities
    - Uses browser local storage to persist favorite cities
 2. Backend (Express.js)
    - Provides RESTful API for
      - Searching locations/cities.
      - Reverse searching coordinates to city names (handy for frontend geolocation)
      - Weather data (hourly, max 6 hours forecast data)
    - API endpoints:
      - /api/v1/search?city={city_name}
      - /api/v1/search-by-coord?lat={latitude}&lon={longitude}
      - /api/v1/weather?lat={latitude}&lon={longitude}
    - Provides rate limiting to prevent abuse
    - Handles internal API error
    - Provides caching of weather data using Redis
 3. Redis Cache
    - Stores recent weather responses
    - Provides next 6 hours forecast data

### Technology Choices and Justifications
| Technology             | Justification                                                              |
|------------------------|----------------------------------------------------------------------------|
| **TypeScript**         | Ensures type safety across frontend and backend, reduces runtime errors    |
| **Next.js**            | Provides server-side rendering and seamless React integration for frontend |
| **Express.js**         | Lightweight and flexible backend framework for API endpoints               |
| **Redis**              | In-memory caching for fast, repeated weather queries                       |

### Known Limitations or Assumptions
 - UI is made for only desktop browsers; no mobile responsiveness
 - Relies on OpenWeatherMap API, which has usage limits (rate-limited free tier)
 - Redis caching is in-memory; cached data will be lost if Redis restarts 
 - No authentication; any user can access API endpoints
 - Basic IP based rate limiter enabled, but not user-specific. Might be an issue for shared IP users
 - No logger implemented
 - No autocomplete for city search; OpenWeatherMap API no longer supports it in free tier
 - No handling ambiguous city names; users must provide exact city names 
 - Basic error handling; may return generic errors if OpenWeatherMap is down
 - Tests are minimal; only basic unit tests for backend API routes

### Future Improvements
 - Improved rate limiting with user-specific limits
 - Add integration tests for critical components
 - Combine Reverse Geocoding and Weather API to reduce API calls and latency
 - Implement logger
 - Implement responsive design for mobile or smaller devices
 - Implement autocomplete for city search using a third-party service
 - Implement Docker and CI/CD for easier deployment

### Test results
```text
PASS  tests/apiRoute.test.ts
  GET /api/v1
    ✓ should return 422 if city parameter is missing (17 ms)
    ✓ should return list of cities with details (4 ms)
    ✓ should return a city with details (2 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.358 s, estimated 1 s
Ran all test suites.
```

