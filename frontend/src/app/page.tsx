'use client';

import {useEffect, useState} from "react";
import {MapPin} from "lucide-react";

import HourlyCard from "../components/HourlyCard";
import {Button} from "../components/ui/button";
import SearchInput from "../components/SearchInput";
import {HourlyWeather, StoreProvider, useWeatherStore} from "./weatherStore";
import {getGreetings, getHourStr, hrVisibility, today} from "../lib/utils";


const favouriteCities = [
  { city: "London" },
  { city: "Leeds" },
  { city: "Manchester" },
]

function Home() {
  const {state, dispatch} = useWeatherStore();

  const [userLocCord, setUserLocCord] = useState<{ lat: number; lon: number }>({
    lat: 0, lon: 0
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        setUserLocCord({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        console.error(err.message);
      }
    );
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="max-w-[1200px] w-full bg-white rounded-xl card-main
                      p-4 md:py-8 md:pl-8 md:pr-0 flex flex-col md:flex-row overflow-hidden">
        <section className="flex-1 md:pr-8 lg:w-[70%] flex flex-col justify-between">

          <SearchInput {...userLocCord}/>

          <div className="flex justify-start items-center gap-5 py-2">
            <div className="text-base md:text-lg font-bold flex items-center space-x-2">
              {state.city ? (
                <>
                  <MapPin size={16} color="red"/>
                  <span>{state.city}</span>
                </>
              ) : (
                <span className="text-gray-500">Search for a location</span>
              )}
            </div>
            <div className="text-center text-xs md:text-sm small-muted">{today()}</div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex items-start md:items-center space-x-2 md:space-x-4">
              <div className="text-[5rem] md:text-[12rem] leading-none text-gray-600 font-family-poppins">
                {state.city ? Math.round(state.current.temp) : "?"}
              </div>
              {state.city ? <div className="text-4xl md:text-6xl text-gray-600 self-start mt-4">°</div> : null}
            </div>

            {state.city ? (
              <>
                <div className="mt-2 md:mt-3 text-xl md:text-md">
                  Feels like {Math.round(state.current.feels_like)}°C • {today(true, state.timezone)} (local time)
                </div>
                <div className="mt-2 md:mt-3 text-2xl md:text-4xl text-gray-500">Cloudy</div>
              </>
            ) : (
              <div>-</div>
            )}
          </div>

          {state.city && (
            <div className="mt-6 md:mt-8 flex gap-4 md:gap-6">
              {state.hourly.map((hw: HourlyWeather) => (
                <HourlyCard
                  key={hw.dt}
                  time={getHourStr(hw.dt, state.timezone)}
                  temp={hw.temp}
                  label={hw.weather[0].main}
                  rotation={hw.wind_deg}
                  speed={Math.round(hw.wind_speed * 3.6)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="mt-8 md:-mt-8 md:-mb-8 lg:w-[30%]
                          rounded-xl md:rounded-tl-none md:rounded-bl-none
                          p-4 md:p-6 flex flex-col items-center bg-gray-50 shadow-sm">
          <div className="text-lg md:text-2xl font-medium">{getGreetings()}</div>
          <div className="text-sm md:text-xl small-muted mt-1 md:mt-2">{today(true)}</div>

          <div className="mt-4 md:mt-6 w-full bg-white rounded-lg p-3 md:p-4 card">
            {state.city ? (
              <table className="table-fixed w-full">
                <tbody>
                <tr>
                  <td>Wind speed</td>
                  <td>{(state.current.wind_speed * 3.6).toFixed(2)} km/h</td>
                </tr>
                {state.current.wind_gust ? (
                  <tr>
                    <td>Wind gust</td>
                    <td>{(state.current.wind_gust * 3.6).toFixed(2)} km/h</td>
                  </tr>
                ) : null}
                <tr>
                  <td>Humidity</td>
                  <td>{state.current.humidity}%</td>
                </tr>
                <tr>
                  <td>Pressure</td>
                  <td>{state.current.pressure} hPa</td>
                </tr>
                <tr>
                  <td>Dew Point</td>
                  <td>{state.current.dew_point}°C</td>
                </tr>
                <tr>
                  <td>Visibility</td>
                  <td>{hrVisibility(state.current.visibility)}</td>
                </tr>
                </tbody>
              </table>
            ) : "Select a location to see more details"}
          </div>

          <hr className="border-t border-gray-300 w-full my-3 md:my-6 "/>

          <div className="w-full flex flex-col gap-2">
            <h3 className="text-xl">
              {favouriteCities.length > 0 ? "Favourite Location" : "Add your Favourite Location"}
            </h3>
            {favouriteCities.map((fav, index) => (
              <div className="w-full flex" key={`fav-city-${index}`}>
                <Button className="flex-1 rounded-none mr-1">
                  {fav.city}
                </Button>
                <Button className="w-10 rounded-none">X</Button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <Home/>
    </StoreProvider>
  )
}
