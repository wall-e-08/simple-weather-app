import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT as string || 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY as string;

app.get('/', (req: Request, res: Response) => {
  console.log(API_KEY)
  res.send('Hello World!!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
