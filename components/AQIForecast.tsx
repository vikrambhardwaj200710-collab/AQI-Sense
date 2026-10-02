"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AirQualityResponse, AQIStandard, Language } from "@/lib/types";
import { calculateIndianNAQI, getAQICategory } from "@/lib/aqi-standards";
import { getTranslation } from "@/lib/i18n";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { AlertTriangle } from "lucide-react";

interface AQIForecastProps {
  data: AirQualityResponse;
  standard: AQIStandard;
  lang: Language;
}

export function AQIForecast({ data, standard, lang }: AQIForecastProps) {
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isHi = lang === "hi";

  // Process next 48-72 hours forecast data
  const forecastData = useMemo(() => {
    const hourly = data.hourly;
    if (!hourly || !hourly.time || hourly.time.length === 0) return [];

    const currentTime = data.current.time || new Date().toISOString();
    let startIndex = hourly.time.findIndex((t) => t >= currentTime);
    if (startIndex === -1) startIndex = 0;

    const futureTimes = hourly.time.slice(startIndex, startIndex + 48);

    let futureAqi: number[] = [];
    if (standard === "india") {
      futureAqi = futureTimes.map((_, idx) => {
        const actualIdx = startIndex + idx;
        return calculateIndianNAQI({
          pm2_5: hourly.pm2_5?.[actualIdx],
          pm10: hourly.pm10?.[actualIdx],
          no2: hourly.nitrogen_dioxide?.[actualIdx],
          so2: hourly.sulphur_dioxide?.[actualIdx],
          co: hourly.carbon_monoxide?.[actualIdx],
          o3: hourly.ozone?.[actualIdx],
        });
      });
    } else {
      const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";
      futureAqi = (((hourly as any)[aqiKey] as number[]) || []).slice(startIndex, startIndex + 48);
    }

    return futureTimes.map((timeStr, idx) => {
      const d = new Date(timeStr);
      const val = futureAqi[idx] ?? 0;
      const cat = getAQICategory(val, standard, lang);

      return {
        time: d.toLocaleTimeString(isHi ? "hi-IN" : "en-US", { hour: "numeric", hour12: true }),
        date: d.toLocaleDateString(isHi ? "hi-IN" : "en-US", { weekday: "short", month: "numeric", day: "numeric" }),
        rawTime: timeStr,
        aqi: val,
        category: cat.label,
        color: cat.color,
      };
    });
  }, [data, standard, lang, isHi]);

  // Aggregate daily averages
  const dailyData = useMemo(() => {
    const hourly = data.hourly;
    if (!hourly || !hourly.time) return [];

    const grouped: Record<string, number[]> = {};
    const currentTime = data.current.time || new Date().toISOString();

    hourly.time.forEach((t, i) => {
      if (t >= currentTime.slice(0, 10)) {
        const dateKey = t.slice(0, 10);
        if (!grouped[dateKey]) grouped[dateKey] = [];

        let aqiVal = 0;
        if (standard === "india") {
          aqiVal = calculateIndianNAQI({
            pm2_5: hourly.pm2_5?.[i],
            pm10: hourly.pm10?.[i],
            no2: hourly.nitrogen_dioxide?.[i],
            so2: hourly.sulphur_dioxide?.[i],
            co: hourly.carbon_monoxide?.[i],
            o3: hourly.ozone?.[i],
          });
        } else {
          const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";
          aqiVal = (hourly as any)[aqiKey]?.[i] ?? 0;
        }

        grouped[dateKey].push(aqiVal);
      }
    });

    return Object.entries(grouped)
      .slice(0, 5) // Next 5 days
      .map(([dateStr, vals]) => {
        const avg = Math.round(vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
        const max = Math.max(...vals, avg);
        const min = Math.min(...vals, avg);
        const cat = getAQICategory(avg, standard, lang);
        const d = new Date(dateStr);

        return {
          dateStr,
          dayName: d.toLocaleDateString(isHi ? "hi-IN" : "en-US", { weekday: "short" }),
          formattedDate: d.toLocaleDateString(isHi ? "hi-IN" : "en-US", { month: "short", day: "numeric" }),
          avgAqi: avg,
          maxAqi: max,
          minAqi: min,
          category: cat.label,
          color: cat.color,
        };
      });
  }, [data, standard, lang, isHi]);

  // Find peak forecast hour
  const peakForecastHour = useMemo(() => {
    if (forecastData.length === 0) return null;
    return [...forecastData].sort((a, b) => b.aqi - a.aqi)[0];
  }, [forecastData]);

  const standardLabel =
    standard === "india" ? "India NAQI" : standard === "us" ? "US AQI" : "EAQI";

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>{getTranslation(lang, "forecastTitle")}</span>
            <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
              Future 72h
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {getTranslation(lang, "forecastSubtitle")}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("hourly")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              viewMode === "hourly"
                ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {getTranslation(lang, "next24Hours")}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              viewMode === "daily"
                ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {getTranslation(lang, "next3Days")}
          </button>
        </div>
      </div>

      {/* Peak Alert Banner if forecast is elevated */}
      {peakForecastHour && peakForecastHour.aqi > 100 && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {isHi
              ? `पूर्वानुमान चेतावनी: ${peakForecastHour.date} ${peakForecastHour.time} के आसपास ${standardLabel} ~${peakForecastHour.aqi} (${peakForecastHour.category}) तक पहुंचने की संभावना है।`
              : `Forecast Alert: Atmospheric stagnation expected around ${peakForecastHour.date} ${peakForecastHour.time} with projected ${standardLabel} ~${peakForecastHour.aqi} (${peakForecastHour.category}).`}
          </span>
        </div>
      )}

      {/* Visual Chart or Daily Cards */}
      <div className="w-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm transition-colors">
        {viewMode === "hourly" ? (
          <div className="h-72 w-full">
            {isMounted && forecastData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData.slice(0, 36)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/80" />
                  <XAxis
                    dataKey="time"
                    stroke="currentColor"
                    className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500"
                    tickLine={false}
                    axisLine={false}
                    interval={3}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-xl bg-zinc-900/95 dark:bg-zinc-800/95 text-white p-3 shadow-xl border border-zinc-700/80 text-xs space-y-1">
                            <div className="font-mono text-[11px] text-zinc-400">
                              {d.date} • {d.time}
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-zinc-200">
                                {standardLabel}:
                              </span>
                              <span className="font-bold font-mono text-sm" style={{ color: d.color }}>
                                {d.aqi}
                              </span>
                            </div>
                            <div className="text-[11px] font-medium" style={{ color: d.color }}>
                              {d.category}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                    {forecastData.slice(0, 36).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                {getTranslation(lang, "loading")}
              </div>
            )}
          </div>
        ) : (
          /* Daily Cards View */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-2">
            {dailyData.map((day) => (
              <div
                key={day.dateStr}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                    {day.dayName}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {day.formattedDate}
                  </span>
                </div>

                <div className="my-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono" style={{ color: day.color }}>
                      ~{day.avgAqi}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">
                      AVG
                    </span>
                  </div>
                  <span
                    className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${day.color}15`,
                      borderColor: `${day.color}40`,
                      color: day.color,
                    }}
                  >
                    {day.category}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 font-mono flex items-center justify-between">
                  <span>Min: {day.minAqi}</span>
                  <span>Max: {day.maxAqi}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
