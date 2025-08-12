'use client';

import {Loader2, Search} from "lucide-react";
import {useEffect, useRef, useState} from "react";


type CityType = {
  city: string;
};

const CITIES: CityType[] = [
  { city: "London" },
  { city: "Paris" },
  { city: "New York" },
  { city: "Tokyo" },
  { city: "Berlin" },
  { city: "Sydney" }
];

const dummyFetchCities = (query: string): Promise<CityType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query.trim()) {
        resolve([]);
      } else {
        const filtered = CITIES.filter((item) =>
          item.city.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }
    }, 300);
  });
};

const SearchInput = () => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<any>(null)

  // Debounce effect: Updates `debouncedQuery` after user stops typing for 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler); // Clear timeout if user types again quickly
    };
  }, [query]);

  // API Fetch effect: Triggers only when `debouncedQuery` changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    // todo: add abortcontroller
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await dummyFetchCities(query);
        console.log(response)
        // if (!response.ok) throw new Error("Failed to fetch data");

        // const data = await response.json();
        setResults(response || []); // Adjust based on API response
      } catch (err) {
        setError((err as Error).message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  // Show dropdown when typing
  useEffect(() => {
    if (query.trim() !== "") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query]);

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


  return (
    <div className="mt-4 w-full relative flex items-center space-x-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {open && (
        <ul className="absolute list-none p-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg top-[100%] max-h-60 overflow-auto z-10">
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
                onClick={() => {
                  setQuery(item.city);
                }}
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