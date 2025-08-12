import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import {OpenWeatherAPI} from "./openWeatherAPI";


dotenv.config();

const app = express();
const PORT = process.env.PORT as string || 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY as string;

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

app.get('/', (req: Request, res: Response) => {
  console.log(API_KEY)
  const x = new OpenWeatherAPI()
  x.testing()
  res.send('Hello World!!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
