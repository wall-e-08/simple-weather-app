import axios from "axios";
import type { AxiosInstance } from "axios";

export class OpenWeatherAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.openweathermap.org",
      params: {
        appid: process.env.OPENWEATHER_API_KEY
      }
    });
  }

  public testing() {
    console.log(process.env.OPENWEATHER_API_KEY)
  }

  // /geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  // https://openweathermap.org/api/geocoding-api#direct
  async getGeoLocation(city: string) {
    const res = await this.client.get(
      "/geo/1.0/direct",
      {
        params: {
          q: city,
          lang: "en",
        }
      }
    );
    // todo: format and handle errors
    return res.data;
  }

  // /data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  // https://openweathermap.org/api/one-call-3
  async getHourlyData(lat: number, lon: number) {
    const res = await this.client.get(
      "/data/3.0/onecall",
      {
        params: {
          lat,
          lon,
          exclude: "minutely,daily"
        }
      }
    );
    // todo: format and handle errors
    return res.data;
  }
}

