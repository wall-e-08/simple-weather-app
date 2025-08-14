export const invalidJSONFallback = async (res: Response) => {
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
}

export const fetchWeatherData = (lat: number, lon: number) => {
  return fetch(new URL(
    "/api/v1/weather", process.env.NEXT_PUBLIC_API_BASE_URL!).href + `?lat=${lat}&lon=${lon}`
  ).then(invalidJSONFallback)
}