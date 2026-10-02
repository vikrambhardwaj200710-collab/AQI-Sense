import { AQIStandard, Language, LocationData, Theme } from "./types";

const RECENT_LOCATIONS_KEY = "aqi_guardian_recent_locations";
const AQI_STANDARD_KEY = "aqi_guardian_standard";
const THEME_KEY = "aqi_guardian_theme";
const LANGUAGE_KEY = "aqi_guardian_language";

export const DEFAULT_LOCATION: LocationData = {
  id: 1273294,
  name: "Delhi",
  latitude: 28.65195,
  longitude: 77.23149,
  country: "India",
  admin1: "National Capital Territory of Delhi",
  country_code: "IN",
  timezone: "Asia/Kolkata",
};

export function getStoredRecentLocations(): LocationData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_LOCATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading recent locations from storage", e);
    return [];
  }
}

export function saveRecentLocation(location: LocationData): LocationData[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getStoredRecentLocations();
    // Filter out duplicate by id or coordinates
    const filtered = existing.filter(
      (loc) => loc.id !== location.id && !(Math.abs(loc.latitude - location.latitude) < 0.01 && Math.abs(loc.longitude - location.longitude) < 0.01)
    );
    const updated = [location, ...filtered].slice(0, 6);
    localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error saving recent location", e);
    return [];
  }
}

export function removeRecentLocation(locationId: number): LocationData[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getStoredRecentLocations();
    const updated = existing.filter((loc) => loc.id !== locationId);
    localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error removing recent location", e);
    return [];
  }
}

export function clearRecentLocations(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_LOCATIONS_KEY);
  } catch (e) {
    console.error("Error clearing recent locations", e);
  }
}

export function getStoredStandard(): AQIStandard {
  if (typeof window === "undefined") return "us";
  try {
    const stored = localStorage.getItem(AQI_STANDARD_KEY);
    if (stored === "us" || stored === "european" || stored === "india") return stored;
  } catch (e) {}
  return "us";
}

export function saveStoredStandard(standard: AQIStandard): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AQI_STANDARD_KEY, standard);
  } catch (e) {}
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch (e) {}
  return "system";
}

export function saveStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === "en" || stored === "hi") return stored;
  } catch (e) {}
  return "en";
}

export function saveStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {}
}
