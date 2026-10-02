"use client";

import React, { useState, useEffect } from "react";
import { AIInsightData, AirQualityResponse, AQICategory, AQIStandard, Language, LocationData, WeatherResponse } from "@/lib/types";
import { getTranslation } from "@/lib/i18n";
import { Sparkles, Bot, AlertCircle, RefreshCw, CheckCircle2, ShieldAlert, HeartHandshake, Compass, Activity, ArrowRight } from "lucide-react";

interface AIInsightCardProps {
  location: LocationData;
  aqiData: AirQualityResponse;
  weatherData: WeatherResponse;
  category: AQICategory;
  standard: AQIStandard;
  lang: Language;
}

export function AIInsightCard({
  location,
  aqiData,
  weatherData,
  category,
  standard,
  lang,
}: AIInsightCardProps) {
  const [insight, setInsight] = useState<AIInsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);

    const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";
    const currentAqi = aqiData.current[aqiKey] ?? 50;

    // Compute recent 24h trend direction
    const hourlyAqi = ((aqiData.hourly as any)?.[aqiKey] as number[]) || [];
    let trend24h = "stable";
    if (hourlyAqi.length >= 6) {
      const recent = hourlyAqi.slice(-3).reduce((a, b) => a + (b || 0), 0) / 3;
      const earlier = hourlyAqi.slice(-6, -3).reduce((a, b) => a + (b || 0), 0) / 3;
      if (recent - earlier > 10) trend24h = "worsening (particulates accumulating)";
      else if (earlier - recent > 10) trend24h = "improving (particulates clearing)";
    }

    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            name: location.name,
            admin1: location.admin1,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
          },
          aqi: currentAqi,
          standard,
          categoryLabel: category.label,
          pollutants: {
            pm2_5: aqiData.current.pm2_5,
            pm10: aqiData.current.pm10,
            o3: aqiData.current.ozone,
            no2: aqiData.current.nitrogen_dioxide,
            so2: aqiData.current.sulphur_dioxide,
            co: aqiData.current.carbon_monoxide,
          },
          weather: {
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            windSpeed: weatherData.current.wind_speed_10m,
            windDirection: `${weatherData.current.wind_direction_10m}°`,
            condition: `WMO ${weatherData.current.weather_code}`,
          },
          trend24h,
          language: lang,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate AI insight (${res.status})`);
      }

      const data = await res.json();
      setInsight(data);
    } catch (err: any) {
      console.warn("AI Insight error, will display fallback notice:", err);
      setError(err.message || "Failed to generate AI insight");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when location, standard, or language changes
  useEffect(() => {
    fetchInsight();
  }, [location.id, standard, lang]);

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span>{getTranslation(lang, "aiInsightTitle")}</span>
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Gemini AI
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {getTranslation(lang, "aiInsightSubtitle")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchInsight}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors self-start sm:self-auto border border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-500" : ""}`} />
          <span>{loading ? getTranslation(lang, "generatingInsight") : lang === "hi" ? "पुनः विश्लेषण" : "Re-analyze"}</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 transition-colors overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {insight?.isFallback
                ? lang === "hi"
                  ? "स्मार्ट वायुमंडलीय संश्लेषण (ऑफ़लाइन मोड)"
                  : "Atmospheric Intelligence Synthesizer"
                : lang === "hi"
                ? "Google Gemini 2.5 लाइव विश्लेषण"
                : "Google Gemini 2.5 Live Analysis"}
            </span>
          </div>

          {insight?.isFallback && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              {lang === "hi" ? "ऑफ़लाइन मोड" : "Synthesis Fallback"}
            </span>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
              <div className="h-24 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
        )}

        {/* Error Notice */}
        {!loading && error && !insight && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{getTranslation(lang, "aiFallbackNotice")}</p>
              <button
                type="button"
                onClick={fetchInsight}
                className="font-bold underline hover:text-amber-900 dark:hover:text-amber-100"
              >
                {getTranslation(lang, "retry")}
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && insight && (
          <div className="space-y-6">
            {/* 1. Current Situation */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
                <Activity className="w-4 h-4" />
                <span>{getTranslation(lang, "currentSituation")}</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                {insight.currentSituation}
              </p>
            </div>

            {/* 2 & 3: Main Concern & Trend in 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Pollution Concern */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{getTranslation(lang, "mainPollutionConcern")}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {insight.mainPollutionConcern}
                </p>
              </div>

              {/* Trend */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
                  <Compass className="w-4 h-4" />
                  <span>{getTranslation(lang, "trendAnalysis")}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {insight.trend}
                </p>
              </div>
            </div>

            {/* 4 & 5: What You Can Do & Outdoor Guidance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What You Can Do */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{getTranslation(lang, "whatYouCanDo")}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {insight.whatYouCanDo}
                </p>
              </div>

              {/* Outdoor Activity Guidance */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
                  <HeartHandshake className="w-4 h-4" />
                  <span>{getTranslation(lang, "outdoorActivityGuidance")}</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {insight.outdoorActivityGuidance}
                </p>
              </div>
            </div>

            {/* 6. Summary Conclusion */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-start gap-2.5">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex-shrink-0 mt-0.5">
                {getTranslation(lang, "aiSummary")}:
              </span>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 italic">
                "{insight.summary}"
              </p>
            </div>
          </div>
        )}

        {/* Security & Health Disclaimer */}
        <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">
          {getTranslation(lang, "aiDisclaimer")}
        </div>
      </div>
    </section>
  );
}
