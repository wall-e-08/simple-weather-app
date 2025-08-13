'use client';

import {Loader2, Search} from "lucide-react";
import {useEffect, useRef, useState} from "react";


const SearchInput = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<any>(null)

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

    fetch(new URL("/api/v1/search", process.env.NEXT_PUBLIC_API_BASE_URL!).href + "?city=london&limit=10")
      .then(async res => {
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;  // invalid json fallback (required to handle too many requests)
        }

        if (!res.ok) {
          throw new Error(
            data?.message || data || `HTTP error ${res.status}`
          );
        }

        return data;
      })
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

  // Outside click to close results
  useEffect(() => {
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
    setOpen(false);

    // todo: fetch weather
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
                {item.city}
              </li>
            ))
          ) : (
            <li className="text-gray-500 px-4 py-2">No results found</li>
          )}
        </ul>
      )}
    </div>
  )
}

export default SearchInput;