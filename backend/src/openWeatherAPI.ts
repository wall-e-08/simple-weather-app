import axios from "axios";
import type { AxiosInstance } from "axios";
import {GeoLocationData, GeoLocationItem, OpenWeatherFullWeatherData, OpenWeatherGeoItem} from "./apiTypes";


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

  // /geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  // https://openweathermap.org/api/geocoding-api#direct
  async getGeoLocation(city: string, limit: number) {
    try {
      const res = await this.client.get<OpenWeatherGeoItem[]>(
        "/geo/1.0/direct",
        {
          params: {
            q: city,
            lang: "en",
            limit: limit,
          },
          timeout: 3000,
        }
      );

      const data = await res.data;

      return {
        success: true,
        data: data.map((item: OpenWeatherGeoItem): GeoLocationItem => ({
          city: item.name,
          country: item.country,
          lat: item.lat,
          lon: item.lon
        }))
      } as GeoLocationData;
    } catch (e) {
      throw new Error(`Internal API Error: City: ${city}`);
    }
  }

  // /data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  // https://openweathermap.org/api/one-call-3
  async getHourlyData(lat: number, lon: number) {
    try {
      const res = await this.client.get<OpenWeatherFullWeatherData>(
        "/data/3.0/onecall",
        {
          params: {
            lat,
            lon,
            units: "metric",
            exclude: "minutely,daily"
          },
          timeout: 3000,
        }
      );
      const data = await res.data;
      return data as OpenWeatherFullWeatherData;  // todo: do I need re-format ?

    } catch (e) {
      throw new Error(`Internal API Error: Lat: ${lat}, Lon: ${lon}`);
    }
  }
}

