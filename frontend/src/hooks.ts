'use cl'

import {useEffect, useState} from "react";


export const usePersistedState = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    } else {
      const item = window.localStorage.getItem(key);

      if (!item) return initialValue;

      try {
        return JSON.parse(item) as T;
      } catch {
        return initialValue;
      }
    }
  })

  useEffect(() => {
    if (typeof window != "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value]);

  return [value, setValue] as const;
}