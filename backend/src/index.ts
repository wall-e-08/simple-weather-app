import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import {OpenWeatherAPI} from "./openWeatherAPI";


dotenv.config();

const app = express();
const PORT = process.env.PORT as string || 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY as string;

app.get('/', (req: Request, res: Response) => {
  console.log(API_KEY)
  const x = new OpenWeatherAPI()
  x.testing()
  res.send('Hello World!!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
