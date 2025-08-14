import {useReducer, createContext, useContext, Dispatch} from "react";


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

export interface HourlyWeather extends OpenWeatherBasicWeatherData {
  wind_gust?: number;
  pop?: number; // probability of precipitation
  weather: OpenWeatherHRDescription[];
  [key: string]: any;
}

export interface OpenWeatherFullWeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: OpenWeatherCurrentWeather;
  hourly: HourlyWeather[];
  [key: string]: any;
}

type StoreAction = {
  type: "SET_WEATHER_DATA"
  data: OpenWeatherFullWeatherData
} | {
  type: "SET_CITY"
  data: {
    city: string;
    country: string;
  }
};

interface StoreContextType {
  state: OpenWeatherFullWeatherData;
  dispatch: Dispatch<StoreAction>;
}

const initialState: OpenWeatherFullWeatherData = {
  city: '',
  country: '',
  lat: 0,
  lon: 0,
  timezone: '',
  timezone_offset: 0,
  current: {
    dt: 0,
    temp: 0,
    feels_like: 0,
    pressure: 0,
    humidity: 0,
    dew_point: 0,
    uvi: 0,
    clouds: 0,
    visibility: 0,
    wind_speed: 0,
    wind_deg: 0,
    sunrise: 0,
    sunset: 0,
    weather: []
  },
  hourly: []
}

const StoreContext = createContext<StoreContextType>({
  state: initialState,
  dispatch: () => {}
})

const reducer = (
  state: OpenWeatherFullWeatherData,
  action: StoreAction
): OpenWeatherFullWeatherData => {
  switch (action.type) {
    case "SET_CITY":
      return {
        ...state,
        ...{city: action.data.city, country: action.data.country}
      }
    case "SET_WEATHER_DATA":
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}

export const useWeatherStore = () => {
  const context= useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StateProvider');
  }
  return context
}

export const StoreProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}