import { useState, useEffect, useCallback } from "react";

interface Timezone {
  label: string;
  value: string;
  offset: string;
  emoji: string;
}

const timezones: Timezone[] = [
  {
    label: "Nairobi, Kenya",
    value: "Africa/Nairobi",
    offset: "UTC+3",
    emoji: "🇰🇪",
  },
  {
    label: "Melbourne, Australia",
    value: "Australia/Melbourne",
    offset: "UTC+10",
    emoji: "🇦🇺",
  },
  {
    label: "New York, USA",
    value: "America/New_York",
    offset: "UTC-5",
    emoji: "🇺🇸",
  },
  { label: "London, UK", value: "Europe/London", offset: "UTC+0", emoji: "🇬🇧" },
  { label: "Tokyo, Japan", value: "Asia/Tokyo", offset: "UTC+9", emoji: "🇯🇵" },
  { label: "Dubai, UAE", value: "Asia/Dubai", offset: "UTC+4", emoji: "🇦🇪" },
  {
    label: "Mumbai, India",
    value: "Asia/Kolkata",
    offset: "UTC+5:30",
    emoji: "🇮🇳",
  },
  { label: "Singapore", value: "Asia/Singapore", offset: "UTC+8", emoji: "🇸🇬" },
  {
    label: "Paris, France",
    value: "Europe/Paris",
    offset: "UTC+1",
    emoji: "🇫🇷",
  },
  {
    label: "Sydney, Australia",
    value: "Australia/Sydney",
    offset: "UTC+10",
    emoji: "🇦🇺",
  },
  {
    label: "Toronto, Canada",
    value: "America/Toronto",
    offset: "UTC-5",
    emoji: "🇨🇦",
  },
  {
    label: "Berlin, Germany",
    value: "Europe/Berlin",
    offset: "UTC+1",
    emoji: "🇩🇪",
  },
  {
    label: "Moscow, Russia",
    value: "Europe/Moscow",
    offset: "UTC+3",
    emoji: "🇷🇺",
  },
  {
    label: "Beijing, China",
    value: "Asia/Shanghai",
    offset: "UTC+8",
    emoji: "🇨🇳",
  },
  {
    label: "Seoul, South Korea",
    value: "Asia/Seoul",
    offset: "UTC+9",
    emoji: "🇰🇷",
  },
  {
    label: "Mexico City, Mexico",
    value: "America/Mexico_City",
    offset: "UTC-6",
    emoji: "🇲🇽",
  },
  {
    label: "São Paulo, Brazil",
    value: "America/Sao_Paulo",
    offset: "UTC-3",
    emoji: "🇧🇷",
  },
  {
    label: "Cairo, Egypt",
    value: "Africa/Cairo",
    offset: "UTC+2",
    emoji: "🇪🇬",
  },
  {
    label: "Johannesburg, South Africa",
    value: "Africa/Johannesburg",
    offset: "UTC+2",
    emoji: "🇿🇦",
  },
  { label: "UTC", value: "UTC", offset: "UTC+0", emoji: "🌍" },
];

interface UseTimezoneReturn {
  currentTimezone: Timezone;
  setTimezone: (timezone: string) => void;
  getCurrentTime: (timezone?: string) => string;
  getCurrentDate: (timezone?: string) => string;
  getFormattedDateTime: (date: Date, timezone?: string) => string;
  timezones: Timezone[];
  isLoading: boolean;
}

export const useTimezone = (): UseTimezoneReturn => {
  const [currentTimezone, setCurrentTimezone] = useState<Timezone>(
    timezones[0],
  ); // Default to Nairobi
  const [isLoading, setIsLoading] = useState(true);

  // Load saved timezone preference
  useEffect(() => {
    const savedTimezone = localStorage.getItem("qmoi-timezone");
    if (savedTimezone) {
      const found = timezones.find((tz) => tz.value === savedTimezone);
      if (found) {
        setCurrentTimezone(found);
      }
    }
    setIsLoading(false);
  }, []);

  const setTimezone = useCallback((timezoneValue: string) => {
    const found = timezones.find((tz) => tz.value === timezoneValue);
    if (found) {
      setCurrentTimezone(found);
      localStorage.setItem("qmoi-timezone", timezoneValue);
    }
  }, []);

  const getCurrentTime = useCallback(
    (timezone?: string) => {
      const tz = timezone || currentTimezone.value;
      return new Date().toLocaleTimeString("en-US", {
        hour12: false,
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    [currentTimezone.value],
  );

  const getCurrentDate = useCallback(
    (timezone?: string) => {
      const tz = timezone || currentTimezone.value;
      return new Date().toLocaleDateString("en-US", {
        timeZone: tz,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    [currentTimezone.value],
  );

  const getFormattedDateTime = useCallback(
    (date: Date, timezone?: string) => {
      const tz = timezone || currentTimezone.value;
      return date.toLocaleString("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    },
    [currentTimezone.value],
  );

  return {
    currentTimezone,
    setTimezone,
    getCurrentTime,
    getCurrentDate,
    getFormattedDateTime,
    timezones,
    isLoading,
  };
};
