import express from 'express';
import type { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import helmet from "helmet";
import Redis from "ioredis";

import { OpenWeatherAPI } from "./openWeatherAPI";
import {HourlyWeather, OpenWeatherFullWeatherData} from "./apiTypes";


dotenv.config();

export const API_BASE_URL: string = '/api/v1';

const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS as string

if (!ALLOWED_HOSTS) {
  console.warn("ALLOWED_HOSTS environment variable is not set.");
}

const RATE_LIMIT_WINDOW_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS as string) || 60
const RATE_LIMIT_COUNT = parseInt(process.env.RATE_LIMIT_COUNT as string) || 20

// todo: handle blocked ip for a certain time
const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_SECONDS * 1000,
  max: RATE_LIMIT_COUNT,
  message: 'Too many requests from this IP, please try again later.'
});

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const app = express();

// Enable CORS
app.use(cors({
  origin: ALLOWED_HOSTS ? ALLOWED_HOSTS.split(',') : [],
  methods: ['GET',],
  allowedHeaders: ['Content-Type',],
  credentials: false
}));

app.use(rateLimiter);

// Helmet for security headers
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// helper function
const handleRequest = async <T>(
  res: Response,
  fn: () => Promise<T>,
  errorMessage: string
) => {
  try {
    const data = await fn();
    res.status(200).json({
      success: true as const,
      data
    });
  } catch (e) {
    res.status(424).json({  // failed dependency
      success: false as const,
      message: errorMessage,
      error: e instanceof Error ? e.message : String(e),
    });
  }
};

const validateQueryParam = (isInvalid: () => boolean, names: string[]) => {
  if (isInvalid()) {
    throw {
      status: 422,
      message: `${names.join(", ")} is/are missing or invalid.`,
      error: `The parameter '${names.join(", ")}' is/are missing or invalid.`
    };
  }
};

app.get(`${API_BASE_URL}/search`, async (req: Request, res: Response) => {
  const city: string = req.query.city as string;
  const limit: number = parseInt(req.query.limit as string) || 10;

  try {
    validateQueryParam(() => !city, ["city"]);
    const weatherAPI: OpenWeatherAPI = new OpenWeatherAPI()

    await handleRequest(
      res,
      () => weatherAPI.getGeoLocation(city, limit),
      `Error fetching location for city '${city}'`
    );
  } catch (e: any) {
    res.status(e.status).json({
      success: false as const,
      message: e.message,
      error: e.error || String(e),
    });
  }
})

app.get(`${API_BASE_URL}/search-by-coord`, async (req: Request, res: Response) => {
  const lat: number = parseFloat(req.query.lat as string);
  const lon: number = parseFloat(req.query.lon as string);

  try {
    validateQueryParam(() => Number.isNaN(lat) || Number.isNaN(lon), ["lat", "lon"]);
    const weatherAPI: OpenWeatherAPI = new OpenWeatherAPI()

    await handleRequest(
      res,
      () => weatherAPI.reverseGeoLocation(lat, lon),
      `Error fetching location for lat '${lat}', lon '${lon}'`
    );
  } catch (e: any) {
    res.status(e.status).json({
      success: false as const,
      message: e.message,
      error: e.error || String(e),
    });
  }
})

app.get(`${API_BASE_URL}/weather/`, async (req: Request, res: Response) => {
  const lat: number = parseFloat(req.query.lat as string);
  const lon: number = parseFloat(req.query.lon as string);

  try {
    validateQueryParam(() => Number.isNaN(lat) || Number.isNaN(lon), ["lat", "lon"]);

    const cached = await redis.get(`weather:${lat},${lon}`);
    if (cached) {
      const data: OpenWeatherFullWeatherData = JSON.parse(cached);

      const filteredHourly: HourlyWeather[] = data.hourly
        .filter(h => h.dt > new Date().getTime() / 1000)   // only future hours
        .slice(0, 6);

      return res.status(200).json({
        success: true,
        data: {
          ...data,
          hourly: filteredHourly,
        },
      });
    }

    const weatherAPI: OpenWeatherAPI = new OpenWeatherAPI()

    await handleRequest(
      res,
      () => weatherAPI.getHourlyData(lat, lon)
        .then(async data => {
          await redis.set(`weather:${lat},${lon}`, JSON.stringify(data), "EX", 3600);
          return {
            ...data,
            hourly: data.hourly
              .filter(h => h.dt > new Date().getTime() / 1000)
              .slice(0, 6) ?? []
          }
        }),
      `Error fetching weather data for coordinates lat '${lat}', lon '${lon}'`
    );
  } catch (e: any) {
    res.status(e.status).json({
      success: false as const,
      message: e.message,
      error: e.error || String(e),
    });
  }
});

export default app;