'use client';

import {Loader2, Search} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';

import {useWeatherStore} from "../app/weatherStore";
import {fetchWeatherData, invalidJSONFallback} from "../lib/api";


const SearchInput = () => {
  const {state, dispatch} = useWeatherStore();

  const [userLocCord, setUserLocCord] = useState<{ lat: number; lon: number }>({
    lat: 0, lon: 0
  });
  const [query, setQuery] = useState<string>(state.city);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<any>(null)

  const loadWeatherData = useCallback((lat: number, lon: number) => {
    toast.promise(
      fetchWeatherData(lat, lon),
      {
        pending: "Loading weather data",
        success: "Weather data loaded",
        error: "Failed to load weather data!",
      },
      {
        toastId: "weather-data-toast",
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      }
    )
      .then(data => {
        if (data && data.success) {
          dispatch({type: "SET_WEATHER_DATA", data: data.data});
        } else {
          throw new Error(data?.message || "No data found");
        }
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : e as string);
      })
  }, [dispatch])

  useEffect(() => {
    if (userLocCord.lat && userLocCord.lon) {
      fetch(
        new URL("/api/v1/search-by-coord", process.env.NEXT_PUBLIC_API_BASE_URL!).href +
        `?lat=${userLocCord.lat}&lon=${userLocCord.lon}`
      )
        .then(invalidJSONFallback)
        .then(data => {
          if (data && data.success) {
            dispatch({type: "SET_CITY", data: {city: data.data.city, country: data.data.country}});
            setQuery(data.data.city);
            loadWeatherData(userLocCord.lat, userLocCord.lon);
          } else {
            throw new Error(data?.message || "No data found");
          }
        })
        .catch(e => {
          console.error(e);
        })
    }
  }, [userLocCord]);

  const searchCityHandler = () => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setError(null)
    setLoading(true);
    setOpen(true);

    fetch(
      new URL("/api/v1/search", process.env.NEXT_PUBLIC_API_BASE_URL!).href +
      `?city=${query}&limit=10`
    )
      .then(invalidJSONFallback)
      .then(data => {
        if (data && data.success) {
          setResults(data.data);
        } else {
          throw new Error(data?.message || "No data found");
        }
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : e as string);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  const searchOnKeyDownHandler = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchCityHandler();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // geolocation + Outside click to close results
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
    } else {
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
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onClickCity = (item) => () => {
    setQuery(item.city);
    dispatch({type: "SET_CITY", data: {city: item.city, country: item.country}});
    setOpen(false);

    loadWeatherData(item.lat, item.lon)
  }

  return (
    <div className="mt-4 w-full relative flex items-center space-x-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={searchOnKeyDownHandler}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          size={16}
          onClick={searchCityHandler}
        />
      </div>

      {open && (
        <ul
          className="absolute list-none p-0 mt-1 w-full bg-white border border-gray-300 rounded-md
           shadow-lg top-[100%] max-h-60 overflow-auto z-10"
          ref={containerRef}
        >
          {loading ? (
            <li className="flex justify-center items-center p-3">
              <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
            </li>
          ) : error ? (
            <li className="text-red-500 px-4 py-2">{error}</li>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <li
                key={idx}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={onClickCity(item)}
              >
                {item.city}, {item.country}
              </li>
            ))
          ) : (
            <li className="text-gray-500 px-4 py-2">No results found</li>
          )}
        </ul>
      )}

      <ToastContainer/>
    </div>
  )
}

export default SearchInput;