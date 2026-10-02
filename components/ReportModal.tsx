"use client";

import React from "react";
import {
  AirQualityResponse,
  AQICategory,
  AQIStandard,
  Language,
  LocationData,
  WeatherResponse,
} from "@/lib/types";
import { getTranslation } from "@/lib/i18n";
import { Printer, Download, X, FileText, CheckCircle2, Shield } from "lucide-react";

interface ReportModalProps {
  location: LocationData;
  aqi: number;
  category: AQICategory;
  standard: AQIStandard;
  aqiData: AirQualityResponse;
  weatherData: WeatherResponse;
  lang: Language;
  onClose: () => void;
}

export function ReportModal({
  location,
  aqi,
  category,
  standard,
  aqiData,
  weatherData,
  lang,
  onClose,
}: ReportModalProps) {
  const isHi = lang === "hi";
  const currentDate = new Date().toLocaleString(isHi ? "hi-IN" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportObj = {
      title: "AQI Guardian Atmospheric Intelligence Report",
      generatedAt: new Date().toISOString(),
      location: {
        name: location.name,
        admin1: location.admin1,
        country: location.country,
        coordinates: [location.latitude, location.longitude],
      },
      standard: standard === "us" ? "U.S. EPA AQI" : "European EAQI",
      aqi,
      category: category.label,
      pollutants: aqiData.current,
      weather: weatherData.current,
      disclaimer: "Modeled atmospheric simulation provided by Open-Meteo regional grids.",
    };

    const blob = new Blob([JSON.stringify(reportObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AQI_Guardian_Report_${location.name}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 my-8 text-zinc-900 dark:text-zinc-100 print:shadow-none print:border-none print:m-0 print:p-0">
        {/* Header - Not printed */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{getTranslation(lang, "reportTitle")}</h2>
              <span className="text-xs text-zinc-400 font-mono">
                {location.name} • {currentDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, "printReport")}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="space-y-6 print:space-y-4">
          {/* Official Document Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-emerald-600 dark:text-emerald-400">
                  AQI Guardian
                </span>
                <span className="text-xs font-mono uppercase bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                  Environmental Intelligence Report
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {location.name}, {[location.admin1, location.country].filter(Boolean).join(", ")} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
              </p>
            </div>
            <div className="text-right text-xs text-zinc-400 font-mono">
              <div>{currentDate}</div>
              <div>Standard: {standard === "us" ? "US EPA AQI" : "European EAQI"}</div>
            </div>
          </div>

          {/* AQI Overview Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                {getTranslation(lang, "currentAirQuality")}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black font-mono" style={{ color: category.color }}>
                  {aqi}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${category.color}15`,
                    borderColor: `${category.color}40`,
                    color: category.color,
                  }}
                >
                  {category.label}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 max-w-md">
                {category.description}
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="text-zinc-500">
                {getTranslation(lang, "temperature")}: <strong className="text-zinc-800 dark:text-zinc-200">{weatherData.current.temperature_2m}°C</strong>
              </div>
              <div className="text-zinc-500">
                {getTranslation(lang, "humidity")}: <strong className="text-zinc-800 dark:text-zinc-200">{weatherData.current.relative_humidity_2m}%</strong>
              </div>
              <div className="text-zinc-500">
                {getTranslation(lang, "windSpeed")}: <strong className="text-zinc-800 dark:text-zinc-200">{weatherData.current.wind_speed_10m} km/h</strong>
              </div>
            </div>
          </div>

          {/* Pollutant Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              {getTranslation(lang, "pollutantsTitle")}
            </h4>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              <div className="grid grid-cols-4 bg-zinc-50 dark:bg-zinc-800/80 p-2.5 font-bold text-zinc-600 dark:text-zinc-300">
                <span>Pollutant</span>
                <span>Formula</span>
                <span>Concentration</span>
                <span>WHO Limit</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="font-medium">Fine Particulates</span>
                <span className="font-mono font-bold">PM2.5</span>
                <span className="font-mono">{aqiData.current.pm2_5 ?? "--"} μg/m³</span>
                <span className="text-zinc-400">15 μg/m³</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="font-medium">Coarse Particulates</span>
                <span className="font-mono font-bold">PM10</span>
                <span className="font-mono">{aqiData.current.pm10 ?? "--"} μg/m³</span>
                <span className="text-zinc-400">45 μg/m³</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="font-medium">Ground Ozone</span>
                <span className="font-mono font-bold">O₃</span>
                <span className="font-mono">{aqiData.current.ozone ?? "--"} μg/m³</span>
                <span className="text-zinc-400">100 μg/m³</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="font-medium">Nitrogen Dioxide</span>
                <span className="font-mono font-bold">NO₂</span>
                <span className="font-mono">{aqiData.current.nitrogen_dioxide ?? "--"} μg/m³</span>
                <span className="text-zinc-400">25 μg/m³</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="font-medium">Sulphur Dioxide</span>
                <span className="font-mono font-bold">SO₂</span>
                <span className="font-mono">{aqiData.current.sulphur_dioxide ?? "--"} μg/m³</span>
                <span className="text-zinc-400">40 μg/m³</span>
              </div>
              <div className="grid grid-cols-4 p-2.5">
                <span className="font-medium">Carbon Monoxide</span>
                <span className="font-mono font-bold">CO</span>
                <span className="font-mono">{aqiData.current.carbon_monoxide ?? "--"} μg/m³</span>
                <span className="text-zinc-400">4000 μg/m³</span>
              </div>
            </div>
          </div>

          {/* Health Guidance */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
            <span className="font-bold uppercase tracking-wider text-zinc-500 block">
              Health & Operational Guidance:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300">{category.generalAdvice}</p>
            <p className="text-zinc-500">{category.sensitiveAdvice}</p>
          </div>

          {/* Model Disclaimer */}
          <div className="text-[10px] text-zinc-400 leading-snug pt-3 border-t border-zinc-100 dark:border-zinc-800">
            {getTranslation(lang, "modeledDataNotice")} This document is an automated environmental summary intended for informational awareness. Not a medical diagnostic tool or in-situ regulatory gauge.
          </div>
        </div>
      </div>
    </div>
  );
}
