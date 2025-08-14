import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const today = (time: boolean = false, tz: string = '') => {
  const date = new Date();
  return time ?
    date.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tz || undefined
    })
    :
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

export const getHourStr = (timestamp: number, tz: string = '') => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: tz || undefined
  });
}

export const getGreetings = () => {
  const date = new Date();
  const hour = date.getHours(); // 0-23

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

export const hrVisibility = (meters: number): string => { // human readable
  if (meters >= 10000) return "Excellent";
  if (meters >= 8000) return "Very good";
  if (meters >= 5000) return "Good";
  if (meters >= 2000) return "Moderate";
  if (meters >= 1000) return "Poor";
  return "Very poor";
};
