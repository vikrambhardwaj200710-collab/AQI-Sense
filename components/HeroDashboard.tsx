"use client";

import React from "react";
import { AQICategory, AQIStandard, Language, LocationData } from "@/lib/types";
import { AQIGauge } from "./AQIGauge";
import { AQIScaleLegend } from "./AQIScaleLegend";
import { getTranslation } from "@/lib/i18n";
import { MapPin, Info, Clock, Database, ShieldAlert, HeartPulse, RefreshCw, ArrowRightLeft } from "lucide-react";

interface HeroDashboardProps {
  location: LocationData;
  aqi: number;
  category: AQICategory;
  standard: AQIStandard;
  lang: Language;
  lastUpdated: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onOpenCompare?: () => void;
}

export function HeroDashboard({
  location,
  aqi,
  category,
  standard,
  lang,
  lastUpdated,
  isRefreshing = false,
  onRefresh,
  onOpenCompare,
}: HeroDashboardProps) {
  const isHi = lang === "hi";

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 sm:p-8 transition-colors">
        {/* Subtle Ambient Background Glow */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: category.color }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Location, Category & Primary Guidance */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Location Header Pill */}
            <div className="flex items-center gap-2 mb-2 flex-wrap justify-center lg:justify-start">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {location.name}
                  {location.admin1 ? `, ${location.admin1}` : ""}
                  {location.country ? `, ${location.country}` : ""}
                </span>
                {location.country_code && (
                  <span className="ml-1 text-[10px] font-mono uppercase text-zinc-500">
                    [{location.country_code}]
                  </span>
                )}
              </span>

              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {getTranslation(lang, "currentAirQuality")}
            </h1>

            {/* Category Explanation */}
            <div className="mt-3 max-w-xl">
              <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {category.description}
              </p>
            </div>

            {/* Health & Action Guidance Box */}
            <div className="mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 max-w-xl text-left w-full">
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.index >= 3 ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <HeartPulse className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {isHi ? "त्वरित स्वास्थ्य परामर्श" : "Primary Health Guidance"}
                  </span>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {category.generalAdvice}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {category.sensitiveAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* Meta Actions & Timestamp */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 justify-center lg:justify-start">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {getTranslation(lang, "lastUpdated")}: {lastUpdated}
                </span>
              </div>

              <span className="text-zinc-300 dark:text-zinc-700">•</span>

              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Open-Meteo Regional Model</span>
              </div>

              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-500" : ""}`} />
                  <span>{isHi ? "रीफ़्रेश" : "Refresh"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Horizontal Car Speedometer Gauge */}
          <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full lg:w-auto">
            <AQIGauge
              aqi={aqi}
              category={category}
              standard={standard}
            />

            {/* Compare Cities Action */}
            {onOpenCompare && (
              <div className="mt-4 flex items-center justify-center">
                <button
                  type="button"
                  onClick={onOpenCompare}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors shadow-sm"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{getTranslation(lang, "compareCities")}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Model Disclaimer */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-start sm:items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <Info className="w-4 h-4 flex-shrink-0 text-zinc-400 mt-0.5 sm:mt-0" />
          <p className="leading-snug">
            {getTranslation(lang, "modeledDataNotice")}
          </p>
        </div>
      </div>

      {/* AQI Scale Legend */}
      <AQIScaleLegend
        currentAqi={aqi}
        standard={standard}
        lang={lang}
      />
    </div>
  );
}
