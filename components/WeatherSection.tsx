"use client";

import React, { useState } from "react";
import { WeatherResponse, Language } from "@/lib/types";
import { getWeatherConditionDescription, getWindDirectionCompass } from "@/lib/api";
import { getTranslation } from "@/lib/i18n";
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Sunrise,
  Sunset,
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Activity,
  Layers,
  Info,
} from "lucide-react";

interface WeatherSectionProps {
  weather: WeatherResponse;
  lang: Language;
}

export function WeatherSection({ weather, lang }: WeatherSectionProps) {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const isHi = lang === "hi";

  const { current, daily } = weather;

  const tempDisplay = unit === "C" ? current.temperature_2m : (current.temperature_2m * 9) / 5 + 32;
  const apparentDisplay = unit === "C" ? current.apparent_temperature : (current.apparent_temperature * 9) / 5 + 32;

  const condition = getWeatherConditionDescription(current.weather_code);
  const windCompass = getWindDirectionCompass(current.wind_direction_10m);

  // Helper for weather icons
  const renderWeatherIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-amber-500 dark:text-amber-400" };
    switch (iconName) {
      case "Sun":
        return <Sun {...props} />;
      case "SunDim":
      case "CloudSun":
        return <CloudSun {...props} className="w-6 h-6 text-amber-500" />;
      case "Cloud":
        return <Cloud {...props} className="w-6 h-6 text-zinc-400" />;
      case "CloudFog":
        return <CloudFog {...props} className="w-6 h-6 text-zinc-400" />;
      case "CloudDrizzle":
        return <CloudDrizzle {...props} className="w-6 h-6 text-cyan-500" />;
      case "CloudRain":
      case "CloudRainWind":
        return <CloudRain {...props} className="w-6 h-6 text-blue-500" />;
      case "CloudLightning":
        return <CloudLightning {...props} className="w-6 h-6 text-purple-500" />;
      case "Snowflake":
        return <Snowflake {...props} className="w-6 h-6 text-sky-400" />;
      default:
        return <CloudSun {...props} />;
    }
  };

  const formatSunTime = (isoStr?: string) => {
    if (!isoStr) return "--:--";
    const date = new Date(isoStr);
    return date.toLocaleTimeString(isHi ? "hi-IN" : "en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const sunriseTime = daily.sunrise?.[0] ? formatSunTime(daily.sunrise[0]) : "--:--";
  const sunsetTime = daily.sunset?.[0] ? formatSunTime(daily.sunset[0]) : "--:--";

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {getTranslation(lang, "weatherTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {getTranslation(lang, "weatherSubtitle")}
          </p>
        </div>

        {/* Temperature Unit Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 self-start sm:self-auto border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setUnit("C")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              unit === "C"
                ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => setUnit("F")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              unit === "F"
                ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Temperature */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-medium">{getTranslation(lang, "temperature")}</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono">
              {tempDisplay.toFixed(1)}°{unit}
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {getTranslation(lang, "feelsLike")}: {apparentDisplay.toFixed(1)}°{unit}
          </div>
        </div>

        {/* Condition */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-medium">{getTranslation(lang, "weatherCondition")}</span>
            {renderWeatherIcon(condition.icon)}
          </div>
          <div className="my-2">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
              {isHi ? condition.textHi : condition.textEn}
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
            WMO Code: {current.weather_code}
          </div>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-medium">{getTranslation(lang, "humidity")}</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono">
              {current.relative_humidity_2m}%
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {current.relative_humidity_2m > 70
              ? isHi
                ? "उच्च आर्द्रता"
                : "High humidity"
              : isHi
              ? "संतुलित आर्द्रता"
              : "Moderate humidity"}
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-medium">{getTranslation(lang, "windSpeed")}</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono">
              {current.wind_speed_10m.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400 ml-1">km/h</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono">
            <Compass
              className="w-3 h-3 text-emerald-500 transform transition-transform"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            />
            <span>
              {windCompass} ({current.wind_direction_10m}°)
            </span>
          </div>
        </div>

        {/* Precipitation */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-medium">{getTranslation(lang, "precipitation")}</span>
            <CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono">
              {current.precipitation}
            </span>
            <span className="text-xs text-zinc-400 ml-1">mm</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {current.precipitation > 0 ? (isHi ? "बारिश सक्रिय" : "Precipitation active") : isHi ? "वर्षा नहीं" : "No rain"}
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-medium">{isHi ? "सूर्य चक्र" : "Solar Cycle"}</span>
            <Sunrise className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-1.5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">{getTranslation(lang, "sunrise")}</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{sunriseTime}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">{getTranslation(lang, "sunset")}</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{sunsetTime}</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">Astronomical Local</div>
        </div>
      </div>

      {/* Weather & Air Quality Relationship Explanatory Card */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-cyan-950/40 border border-emerald-200/60 dark:border-emerald-900/60 p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
              <span>{getTranslation(lang, "weatherAQIRelationTitle")}</span>
              <span className="text-[10px] font-mono font-normal uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300">
                Atmospheric Dynamics
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {getTranslation(lang, "weatherAQIRelationDesc")}
            </p>

            {/* Quick Context Highlights */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-emerald-200/50 dark:border-emerald-900/40">
              <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>
                  {current.wind_speed_10m < 5
                    ? isHi
                      ? "मंद हवा: प्रदूषण जमाव का खतरा"
                      : "Stagnant Wind: High particulate entrapment"
                    : isHi
                    ? "सक्रिय हवा: बेहतर प्राकृतिक फैलाव"
                    : "Active Ventilation: Promotes dispersion"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>
                  {current.relative_humidity_2m > 75
                    ? isHi
                      ? "उच्च नमी: धुंध/स्मॉग का निर्माण संभव"
                      : "High Humidity: Fog & secondary aerosol growth"
                    : isHi
                    ? "शुष्क हवा: तेज कण फैलाव"
                    : "Dry Air: Steady vertical boundary mixing"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                <CloudRain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  {current.precipitation > 0
                    ? isHi
                      ? "बारिश: हवा से प्रदूषण धुलने में मददगार"
                      : "Rainfall: Active atmospheric wet deposition"
                    : isHi
                    ? "शुष्क वातावरण: हवा की गति पर निर्भरता"
                    : "Dry Canopy: Dispersion governed by wind"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
