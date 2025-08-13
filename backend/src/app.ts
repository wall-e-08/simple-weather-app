import express from 'express';
import type { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { OpenWeatherAPI } from "./openWeatherAPI";
import type { GeoLocationData } from "./openWeatherAPI";


const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', ], // todo: add frontend main url
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type',],
  credentials: false
}));

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(rateLimiter);

// Helmet for security headers
app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

export const API_BASE_URL: string = '/api/v1';

app.get(API_BASE_URL, async (req: Request, res: Response) => {
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

export default app;