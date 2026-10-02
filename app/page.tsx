"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  AirQualityResponse,
  AQIStandard,
  Language,
  LocationData,
  Theme,
  WeatherResponse,
} from "@/lib/types";
import { fetchCombinedData } from "@/lib/api";
import { calculateIndianNAQI, getAQICategory } from "@/lib/aqi-standards";
import {
  DEFAULT_LOCATION,
  getStoredLanguage,
  getStoredRecentLocations,
  getStoredStandard,
  getStoredTheme,
  saveStoredLanguage,
  saveStoredStandard,
  saveStoredTheme,
} from "@/lib/storage";
import { getTranslation } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { HeroDashboard } from "@/components/HeroDashboard";
import { AIInsightCard } from "@/components/AIInsightCard";
import { PollutantsGrid } from "@/components/PollutantsGrid";
import { WeatherSection } from "@/components/WeatherSection";
import { AQIStoryCard } from "@/components/AQIStoryCard";
import { BestWindowCard } from "@/components/BestWindowCard";
import { AQITimeline } from "@/components/AQITimeline";
import { AQIForecast } from "@/components/AQIForecast";
import { PreventiveMeasures } from "@/components/PreventiveMeasures";
import { EducationSection } from "@/components/EducationSection";
import { CompareLocationsModal } from "@/components/CompareLocationsModal";
import { Footer } from "@/components/Footer";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function HomePage() {
  // User Preferences
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [standard, setStandard] = useState<AQIStandard>("us");
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("system");

  // API Data
  const [airQualityData, setAirQualityData] = useState<AirQualityResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("");

  // Compare Cities Modal
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Initialize stored preferences
  useEffect(() => {
    const storedStd = getStoredStandard();
    const storedLang = getStoredLanguage();
    const storedTh = getStoredTheme();
    const recents = getStoredRecentLocations();

    setStandard(storedStd);
    setLang(storedLang);
    setTheme(storedTh);

    if (recents.length > 0) {
      setLocation(recents[0]);
    }
  }, []);

  // Sync Theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    saveStoredTheme(theme);
  }, [theme]);

  const handleSelectStandard = (newStd: AQIStandard) => {
    setStandard(newStd);
    saveStoredStandard(newStd);
  };

  const handleSelectLanguage = (newLang: Language) => {
    setLang(newLang);
    saveStoredLanguage(newLang);
  };

  // Fetch real atmospheric data
  const loadData = useCallback(
    async (targetLoc: LocationData, showRefreshSpin = false) => {
      if (showRefreshSpin) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      try {
        const { airQuality, weather } = await fetchCombinedData(
          targetLoc.latitude,
          targetLoc.longitude,
          targetLoc.timezone
        );

        setAirQualityData(airQuality);
        setWeatherData(weather);

        const now = new Date();
        setLastUpdatedTime(
          now.toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      } catch (err: any) {
        console.error("Error loading atmospheric data:", err);
        setError(err.message || getTranslation(lang, "errorLoading"));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [lang]
  );

  useEffect(() => {
    loadData(location);
  }, [location, loadData]);

  // Compute current AQI value according to active standard
  let currentAqi = 0;
  if (airQualityData) {
    if (standard === "india") {
      currentAqi = calculateIndianNAQI({
        pm2_5: airQualityData.current.pm2_5,
        pm10: airQualityData.current.pm10,
        no2: airQualityData.current.nitrogen_dioxide,
        so2: airQualityData.current.sulphur_dioxide,
        co: airQualityData.current.carbon_monoxide,
        o3: airQualityData.current.ozone,
      });
    } else if (standard === "us") {
      currentAqi = airQualityData.current.us_aqi ?? 0;
    } else {
      currentAqi = airQualityData.current.european_aqi ?? 0;
    }
  }

  const currentCategory = getAQICategory(currentAqi, standard, lang);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 transition-colors">
      {/* Sticky Top Header */}
      <Header
        currentLocation={location}
        onSelectLocation={setLocation}
        standard={standard}
        onSelectStandard={handleSelectStandard}
        lang={lang}
        onSelectLanguage={handleSelectLanguage}
        theme={theme}
        onSelectTheme={setTheme}
        onRefresh={() => loadData(location, true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Page Body: Ordered exactly as specified */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => loadData(location)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, "retry")}</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !airQualityData ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {getTranslation(lang, "loading")}
            </span>
          </div>
        ) : airQualityData && weatherData ? (
          <>
            {/* 1. Current Air Quality & Speedometer + AQI Severity Scale */}
            <HeroDashboard
              location={location}
              aqi={currentAqi}
              category={currentCategory}
              standard={standard}
              lang={lang}
              lastUpdated={lastUpdatedTime}
              isRefreshing={isRefreshing}
              onRefresh={() => loadData(location, true)}
              onOpenCompare={() => setIsCompareOpen(true)}
            />

            {/* 2. AI Air Insight */}
            <AIInsightCard
              location={location}
              aqiData={airQualityData}
              weatherData={weatherData}
              category={currentCategory}
              standard={standard}
              lang={lang}
            />

            {/* 3. Pollutants in Air */}
            <PollutantsGrid
              data={airQualityData}
              lang={lang}
            />

            {/* 4. Weather & Meteorology */}
            <WeatherSection
              weather={weatherData}
              lang={lang}
            />

            {/* 5. Air Quality Story (Diurnal Study) */}
            <AQIStoryCard
              data={airQualityData}
              standard={standard}
              lang={lang}
            />

            {/* 6. Best Modeled Window (Best Time to Go Outdoor) */}
            <BestWindowCard
              data={airQualityData}
              standard={standard}
              lang={lang}
            />

            {/* 7. AQI Timeline */}
            <AQITimeline
              data={airQualityData}
              standard={standard}
              lang={lang}
            />

            {/* 8. AQI Forecast */}
            <AQIForecast
              data={airQualityData}
              standard={standard}
              lang={lang}
            />

            {/* 9. Preventive Measures & Health Guidelines */}
            <PreventiveMeasures
              category={currentCategory}
              standard={standard}
              lang={lang}
            />

            {/* 10. AQI and Air Quality Guidance (Education Section) */}
            <EducationSection
              lang={lang}
            />
          </>
        ) : null}
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Compare Locations Modal */}
      {isCompareOpen && airQualityData && weatherData && (
        <CompareLocationsModal
          primaryLocation={location}
          primaryAqiData={airQualityData}
          primaryWeatherData={weatherData}
          standard={standard}
          lang={lang}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
}
