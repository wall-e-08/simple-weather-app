export interface OpenWeatherGeoItem {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface GeoLocationItem {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface GeoLocationData {
  success: true;
  data: GeoLocationItem[]
}

interface OpenWeatherBasicWeatherData {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
}

interface OpenWeatherHRDescription { // human readable
  id: number;
  main: string;
  description: string;
  icon: string;
  [key: string]: any;
}

interface OpenWeatherCurrentWeather extends OpenWeatherBasicWeatherData {
  sunrise: number;
  sunset: number;
  weather: OpenWeatherHRDescription[];
  [key: string]: any;
}

interface HourlyWeather extends OpenWeatherBasicWeatherData {
  wind_gust?: number;
  pop?: number; // probability of precipitation
  weather: OpenWeatherHRDescription[];
  [key: string]: any;
}

export interface OpenWeatherFullWeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: OpenWeatherCurrentWeather;
  hourly: HourlyWeather[];
  [key: string]: any;
}
