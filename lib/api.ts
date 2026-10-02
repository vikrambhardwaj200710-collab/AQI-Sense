import { AirQualityResponse, LocationData, WeatherResponse } from "./types";

const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchLocations(query: string, signal?: AbortSignal): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Geocoding error: ${res.statusText}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      country_code: item.country_code,
      timezone: item.timezone || "auto",
      elevation: item.elevation,
    }));
  } catch (err: any) {
    if (err.name === "AbortError") {
      return [];
    }
    console.error("Failed to search locations:", err);
    throw err;
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
  // Open-Meteo doesn't have an official free reverse endpoint, so we can query big cities nearby or use Nominatim/Open-Meteo search
  // or fall back to cleanly formatted coordinates: "Latitude, Longitude"
  try {
    // Try BigDataCloud free client reverse geocoding API or OpenStreetMap Nominatim
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      return {
        id: Math.round(latitude * 1000 + longitude * 1000),
        name: data.locality || data.city || data.principalSubdivision || "Current Location",
        latitude,
        longitude,
        country: data.countryName || "Unknown",
        admin1: data.principalSubdivision || "",
        country_code: data.countryCode || "",
        timezone: "auto",
      };
    }
  } catch (e) {
    console.warn("Reverse geocode lookup failed, using coordinate fallback:", e);
  }

  return {
    id: Math.round(latitude * 1000 + longitude * 1000),
    name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
    country: "Detected Location",
    admin1: "",
    country_code: "",
    timezone: "auto",
  };
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  timezone: string = "auto"
): Promise<AirQualityResponse> {
  const currentParams = [
    "us_aqi",
    "european_aqi",
    "pm10",
    "pm2_5",
    "carbon_monoxide",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
  ].join(",");

  const hourlyParams = [
    "us_aqi",
    "european_aqi",
    "pm10",
    "pm2_5",
    "carbon_monoxide",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
  ].join(",");

  const url = `${AIR_QUALITY_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&past_days=7&forecast_days=3&timezone=${encodeURIComponent(
    timezone
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Air Quality API error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  timezone: string = "auto"
): Promise<WeatherResponse> {
  const currentParams = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
  ].join(",");

  const dailyParams = ["weather_code", "sunrise", "sunset"].join(",");

  const url = `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&daily=${dailyParams}&timezone=${encodeURIComponent(
    timezone
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchCombinedData(
  latitude: number,
  longitude: number,
  timezone: string = "auto"
): Promise<{ airQuality: AirQualityResponse; weather: WeatherResponse }> {
  const [airQuality, weather] = await Promise.all([
    fetchAirQuality(latitude, longitude, timezone),
    fetchWeather(latitude, longitude, timezone),
  ]);

  return { airQuality, weather };
}

export function getWeatherConditionDescription(code: number): { textEn: string; textHi: string; icon: string } {
  // WMO Weather interpretation codes (WW)
  switch (code) {
    case 0:
      return { textEn: "Clear Sky", textHi: "साफ़ आसमान", icon: "Sun" };
    case 1:
      return { textEn: "Mainly Clear", textHi: "मुख्यतः साफ़", icon: "SunDim" };
    case 2:
      return { textEn: "Partly Cloudy", textHi: "आंशिक रूप से बादल", icon: "CloudSun" };
    case 3:
      return { textEn: "Overcast", textHi: "घने बादल", icon: "Cloud" };
    case 45:
    case 48:
      return { textEn: "Fog / Haze", textHi: "कोहरा / धुंध", icon: "CloudFog" };
    case 51:
    case 53:
    case 55:
      return { textEn: "Drizzle", textHi: "हल्की बूंदाबांदी", icon: "CloudDrizzle" };
    case 61:
    case 63:
    case 65:
      return { textEn: "Rain", textHi: "बारिश", icon: "CloudRain" };
    case 71:
    case 73:
    case 75:
      return { textEn: "Snow", textHi: "बर्फबारी", icon: "Snowflake" };
    case 80:
    case 81:
    case 82:
      return { textEn: "Rain Showers", textHi: "बारिश की फुहारें", icon: "CloudRainWind" };
    case 95:
    case 96:
    case 99:
      return { textEn: "Thunderstorm", textHi: "गरज के साथ तूफ़ान", icon: "CloudLightning" };
    default:
      return { textEn: "Variable Weather", textHi: "परिवर्तनशील मौसम", icon: "Cloud" };
  }
}

export function getWindDirectionCompass(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor((degrees / 22.5) + 0.5);
  return directions[val % 16];
}
