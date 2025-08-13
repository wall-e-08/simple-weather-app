import express from 'express';
import type { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import helmet from "helmet";

import { OpenWeatherAPI } from "./openWeatherAPI";
import type { GeoLocationData } from "./apiTypes";
import {OpenWeatherFullWeatherData} from "./apiTypes";


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

app.get(`${API_BASE_URL}/search`, async (req: Request, res: Response) => {
  const city: string = req.query.city as string;
  const limit: number = parseInt(req.query.limit as string) || 10;

  if (!city) {
    return res.status(422).json({ // Unprocessable Content
      success: false as const,
      message: 'city is required',
      error: "The parameter 'city' is required and cannot be empty.",
    });
  }

  try {
    const weatherAPI: OpenWeatherAPI = new OpenWeatherAPI()
    const weatherAPIResponse: GeoLocationData = await weatherAPI.getGeoLocation(city, limit);

    res.status(200).json(weatherAPIResponse)
  } catch (e) {
    res.status(424).json({  // failed dependency
      success: false as const,
      message: `Error fetching location for city '${city}'`,
      error: `${e instanceof Error ? e.message : String(e)}`,
    })
  }
})

app.get(`${API_BASE_URL}/weather/`, async (req: Request, res: Response) => {
  const {lat, lon}: { lat: string, lon: string } = req.query as any;

  if (!lat || !lon) {
    return res.status(422).json({
      success: false as const,
      message: 'lat and lon are required',
      error: "The parameters 'lat' and 'lon' are both required and cannot be empty.",
    });
  }

  try {
    const weatherAPI: OpenWeatherAPI = new OpenWeatherAPI()
    const weatherAPIResponse: OpenWeatherFullWeatherData = await weatherAPI.getHourlyData(
      parseFloat(lat),
      parseFloat(lon)
    );

    res.status(200).json(weatherAPIResponse)
  } catch (e) {
    res.status(424).json({  // failed dependency
      success: false as const,
      message: `Error fetching weather data for coordinates lat: ${lat}, lon: ${lon}`,
      error: `${e instanceof Error ? e.message : String(e)}`,
    })
  }
});

export default app;