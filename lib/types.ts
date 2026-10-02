export type AQIStandard = "us" | "european" | "india";

export type Language = "en" | "hi";

export type Theme = "light" | "dark" | "system";

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // State / Region
  country_code?: string;
  timezone?: string;
  elevation?: number;
}

export interface CurrentAQIData {
  time: string;
  us_aqi?: number | null;
  european_aqi?: number | null;
  india_aqi?: number | null;
  pm10?: number | null;
  pm2_5?: number | null;
  carbon_monoxide?: number | null;
  nitrogen_dioxide?: number | null;
  sulphur_dioxide?: number | null;
  ozone?: number | null;
}

export interface HourlyAQIData {
  time: string[];
  us_aqi?: (number | null)[];
  european_aqi?: (number | null)[];
  india_aqi?: (number | null)[];
  pm10?: (number | null)[];
  pm2_5?: (number | null)[];
  carbon_monoxide?: (number | null)[];
  nitrogen_dioxide?: (number | null)[];
  sulphur_dioxide?: (number | null)[];
  ozone?: (number | null)[];
}

export interface AirQualityResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentAQIData;
  hourly_units: Record<string, string>;
  hourly: HourlyAQIData;
}

export interface CurrentWeather {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  daily: DailyWeather;
}

export interface AQICategory {
  index: number;
  label: string;
  rangeText: string;
  min: number;
  max: number;
  color: string; // hex
  bgColor: string; // tailwind or hex bg
  textColor: string;
  borderColor: string;
  description: string;
  generalAdvice: string;
  sensitiveAdvice: string;
}

export interface PollutantInfo {
  code: "pm2_5" | "pm10" | "o3" | "no2" | "so2" | "co";
  name: string;
  chemicalFormula: string;
  value: number;
  unit: string;
  category: "good" | "moderate" | "poor" | "unhealthy" | "hazardous";
  categoryLabel: string;
  categoryColor: string;
  description: string;
  sources: string;
  healthEffects: string;
  whoGuideline: string;
  trend24h: "rising" | "falling" | "stable";
  hourlyValues: number[];
}

export interface AIInsightData {
  currentSituation: string;
  mainPollutionConcern: string;
  trend: string;
  whatYouCanDo: string;
  outdoorActivityGuidance: string;
  summary: string;
  isFallback?: boolean;
}

export interface AirQualityStory {
  morning: { aqi: number; category: string; description: string };
  afternoon: { aqi: number; category: string; description: string };
  evening: { aqi: number; category: string; description: string };
  night: { aqi: number; category: string; description: string };
  bestPeriod: string;
  peakPeriod: string;
  dominantPollutant: string;
  trendDirection: string;
  narrative: string;
}

export interface BestWindow {
  startTime: string;
  endTime: string;
  formattedWindow: string;
  expectedAqi: number;
  category: string;
  reason: string;
  weatherSummary: string;
}

export interface CompareLocationData {
  location: LocationData;
  aqiData: AirQualityResponse;
  weatherData: WeatherResponse;
}
