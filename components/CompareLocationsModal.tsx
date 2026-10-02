"use client";

import React, { useState } from "react";
import { AirQualityResponse, AQIStandard, Language, LocationData, WeatherResponse } from "@/lib/types";
import { searchLocations, fetchCombinedData } from "@/lib/api";
import { getAQICategory } from "@/lib/aqi-standards";
import { getTranslation } from "@/lib/i18n";
import { X, Search, Loader2, ArrowRightLeft, MapPin, Sparkles, Check, AlertCircle } from "lucide-react";

interface CompareLocationsModalProps {
  primaryLocation: LocationData;
  primaryAqiData: AirQualityResponse;
  primaryWeatherData: WeatherResponse;
  standard: AQIStandard;
  lang: Language;
  onClose: () => void;
}

export function CompareLocationsModal({
  primaryLocation,
  primaryAqiData,
  primaryWeatherData,
  standard,
  lang,
  onClose,
}: CompareLocationsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [targetLocation, setTargetLocation] = useState<LocationData | null>(null);
  const [targetAqiData, setTargetAqiData] = useState<AirQualityResponse | null>(null);
  const [targetWeatherData, setTargetWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoadingTarget, setIsLoadingTarget] = useState(false);
  const [targetError, setTargetError] = useState<string | null>(null);

  const isHi = lang === "hi";
  const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    setIsSearching(true);
    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTarget = async (loc: LocationData) => {
    setTargetLocation(loc);
    setSearchResults([]);
    setSearchQuery("");
    setIsLoadingTarget(true);
    setTargetError(null);

    try {
      const { airQuality, weather } = await fetchCombinedData(loc.latitude, loc.longitude, loc.timezone);
      setTargetAqiData(airQuality);
      setTargetWeatherData(weather);
    } catch (err: any) {
      setTargetError(err.message || "Failed to load location data");
    } finally {
      setIsLoadingTarget(false);
    }
  };

  const primaryAqi = primaryAqiData.current[aqiKey] ?? 0;
  const primaryCat = getAQICategory(primaryAqi, standard, lang);

  const targetAqi = targetAqiData ? targetAqiData.current[aqiKey] ?? 0 : null;
  const targetCat = targetAqi !== null ? getAQICategory(targetAqi, standard, lang) : null;

  // Comparison verdict
  let verdictText = "";
  if (targetAqi !== null && targetLocation) {
    if (Math.abs(primaryAqi - targetAqi) <= 5) {
      verdictText = isHi
        ? `${primaryLocation.name} और ${targetLocation.name} दोनों में लगभग समान वायु गुणवत्ता दर्ज की गई है।`
        : `Both ${primaryLocation.name} and ${targetLocation.name} exhibit virtually identical atmospheric levels.`;
    } else if (primaryAqi < targetAqi) {
      const diffPct = Math.round(((targetAqi - primaryAqi) / targetAqi) * 100);
      verdictText = isHi
        ? `${primaryLocation.name} की वायु गुणवत्ता ${targetLocation.name} की तुलना में लगभग ${diffPct}% अधिक स्वच्छ है।`
        : `${primaryLocation.name} is currently approximately ${diffPct}% cleaner than ${targetLocation.name}.`;
    } else {
      const diffPct = Math.round(((primaryAqi - targetAqi) / primaryAqi) * 100);
      verdictText = isHi
        ? `${targetLocation.name} की वायु गुणवत्ता ${primaryLocation.name} की तुलना में लगभग ${diffPct}% अधिक स्वच्छ है।`
        : `${targetLocation.name} is currently approximately ${diffPct}% cleaner than ${primaryLocation.name}.`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 my-8 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500 text-white">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {getTranslation(lang, "compareTitle")}
              </h2>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {standard === "us" ? "U.S. EPA AQI Standard" : "European EAQI Standard"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search for City B */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getTranslation(lang, "compareSearchPlaceholder")}
              className="w-full pl-4 pr-24 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : getTranslation(lang, "searchButton")}
            </button>
          </form>

          {/* Autocomplete Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg max-h-48 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-700 z-10 relative">
              {searchResults.map((res, i) => (
                <div
                  key={`${res.id}-${i}`}
                  onClick={() => handleSelectTarget(res)}
                  className="px-4 py-2 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-semibold">
                    {res.name}, {res.admin1 || res.country}
                  </span>
                  <span className="font-mono text-zinc-400">{res.country_code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Target Loading & Error */}
        {isLoadingTarget && (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span>{getTranslation(lang, "loading")}</span>
          </div>
        )}

        {targetError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs">
            {targetError}
          </div>
        )}

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City A: Primary Location */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {getTranslation(lang, "cityA")}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {primaryLocation.country_code}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {primaryLocation.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {[primaryLocation.admin1, primaryLocation.country].filter(Boolean).join(", ")}
              </p>

              {/* Main AQI */}
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono" style={{ color: primaryCat.color }}>
                  {primaryAqi}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${primaryCat.color}15`,
                    borderColor: `${primaryCat.color}40`,
                    color: primaryCat.color,
                  }}
                >
                  {primaryCat.label}
                </span>
              </div>

              {/* Metrics Table */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-zinc-500">PM2.5:</span>
                  <span className="font-mono font-bold">{primaryAqiData.current.pm2_5 ?? "--"} μg/m³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-zinc-500">PM10:</span>
                  <span className="font-mono font-bold">{primaryAqiData.current.pm10 ?? "--"} μg/m³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-zinc-500">Ozone (O₃):</span>
                  <span className="font-mono font-bold">{primaryAqiData.current.ozone ?? "--"} μg/m³</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">{getTranslation(lang, "temperature")}:</span>
                  <span className="font-mono font-bold">{primaryWeatherData.current.temperature_2m}°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* City B: Target Comparison Location */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex flex-col justify-between">
            {targetLocation && targetAqiData && targetWeatherData && targetCat ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    {getTranslation(lang, "cityB")}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {targetLocation.country_code}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {targetLocation.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {[targetLocation.admin1, targetLocation.country].filter(Boolean).join(", ")}
                </p>

                {/* Main AQI */}
                <div className="my-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono" style={{ color: targetCat.color }}>
                    {targetAqi}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${targetCat.color}15`,
                      borderColor: `${targetCat.color}40`,
                      color: targetCat.color,
                    }}
                  >
                    {targetCat.label}
                  </span>
                </div>

                {/* Metrics Table */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/60">
                    <span className="text-zinc-500">PM2.5:</span>
                    <span className="font-mono font-bold">{targetAqiData.current.pm2_5 ?? "--"} μg/m³</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/60">
                    <span className="text-zinc-500">PM10:</span>
                    <span className="font-mono font-bold">{targetAqiData.current.pm10 ?? "--"} μg/m³</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700/60">
                    <span className="text-zinc-500">Ozone (O₃):</span>
                    <span className="font-mono font-bold">{targetAqiData.current.ozone ?? "--"} μg/m³</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">{getTranslation(lang, "temperature")}:</span>
                    <span className="font-mono font-bold">{targetWeatherData.current.temperature_2m}°C</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 text-zinc-400">
                <Search className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-medium">
                  {isHi ? "तुलना के लिए ऊपर कोई शहर खोजें" : "Search a second city above to compare real-time metrics."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Verdict Banner */}
        {verdictText && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-900 dark:text-emerald-100 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{verdictText}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            {getTranslation(lang, "close")}
          </button>
        </div>
      </div>
    </div>
  );
}
