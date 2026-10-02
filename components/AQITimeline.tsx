"use client";

import React, { useState, useMemo, useEffect } from "react";
import { AirQualityResponse, AQIStandard, Language } from "@/lib/types";
import { getAQICategory } from "@/lib/aqi-standards";
import { getTranslation } from "@/lib/i18n";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Calendar, Filter, Layers } from "lucide-react";

interface AQITimelineProps {
  data: AirQualityResponse;
  standard: AQIStandard;
  lang: Language;
}

type PeriodFilter = "24h" | "3d" | "7d";

export function AQITimeline({ data, standard, lang }: AQITimelineProps) {
  const [filter, setFilter] = useState<PeriodFilter>("24h");
  const [selectedMetric, setSelectedMetric] = useState<"aqi" | "pm2_5" | "pm10" | "o3" | "no2">("aqi");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isHi = lang === "hi";
  const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";

  // Filter and format hourly data based on selected filter
  const chartData = useMemo(() => {
    const hourly = data.hourly;
    if (!hourly || !hourly.time || hourly.time.length === 0) return [];

    const currentTime = data.current.time || new Date().toISOString();
    let currentIndex = hourly.time.findIndex((t) => t >= currentTime);
    if (currentIndex === -1) currentIndex = hourly.time.length - 1;

    let pointsCount = 24;
    if (filter === "3d") pointsCount = 72;
    if (filter === "7d") pointsCount = 168;

    const startIndex = Math.max(0, currentIndex - pointsCount);
    const endIndex = currentIndex;

    const slicedTimes = hourly.time.slice(startIndex, endIndex + 1);
    const slicedAqi = ((hourly as any)[aqiKey] as number[])?.slice(startIndex, endIndex + 1) || [];
    const slicedPm25 = hourly.pm2_5?.slice(startIndex, endIndex + 1) || [];
    const slicedPm10 = hourly.pm10?.slice(startIndex, endIndex + 1) || [];
    const slicedO3 = hourly.ozone?.slice(startIndex, endIndex + 1) || [];
    const slicedNo2 = hourly.nitrogen_dioxide?.slice(startIndex, endIndex + 1) || [];

    return slicedTimes.map((timeStr, idx) => {
      const d = new Date(timeStr);
      let formattedTime = "";
      if (filter === "24h") {
        formattedTime = d.toLocaleTimeString(isHi ? "hi-IN" : "en-US", { hour: "numeric", hour12: true });
      } else {
        formattedTime = d.toLocaleDateString(isHi ? "hi-IN" : "en-US", {
          month: "numeric",
          day: "numeric",
          hour: "numeric",
        });
      }

      const aqiVal = slicedAqi[idx] ?? 0;
      const cat = getAQICategory(aqiVal, standard, lang);

      return {
        time: formattedTime,
        rawTime: timeStr,
        aqi: aqiVal,
        pm2_5: slicedPm25[idx] ?? 0,
        pm10: slicedPm10[idx] ?? 0,
        o3: slicedO3[idx] ?? 0,
        no2: slicedNo2[idx] ?? 0,
        category: cat.label,
        color: cat.color,
      };
    });
  }, [data, standard, filter, lang, aqiKey, isHi]);

  // Color & labels according to selected metric
  const metricConfig = {
    aqi: {
      name: standard === "us" ? "US AQI" : "European EAQI",
      stroke: "#10b981",
      fill: "url(#aqiGradient)",
      unit: "AQI",
    },
    pm2_5: {
      name: "PM2.5",
      stroke: "#ef4444",
      fill: "url(#pm25Gradient)",
      unit: "μg/m³",
    },
    pm10: {
      name: "PM10",
      stroke: "#f59e0b",
      fill: "url(#pm10Gradient)",
      unit: "μg/m³",
    },
    o3: {
      name: "Ozone (O₃)",
      stroke: "#06b6d4",
      fill: "url(#o3Gradient)",
      unit: "μg/m³",
    },
    no2: {
      name: "NO₂",
      stroke: "#8b5cf6",
      fill: "url(#no2Gradient)",
      unit: "μg/m³",
    },
  };

  const activeConf = metricConfig[selectedMetric];

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>{getTranslation(lang, "timelineTitle")}</span>
            <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              Historical Trend
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {getTranslation(lang, "timelineSubtitle")}
          </p>
        </div>

        {/* Filters and Metric Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Filter Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setFilter("24h")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filter === "24h"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              24h
            </button>
            <button
              type="button"
              onClick={() => setFilter("3d")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filter === "3d"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              3d
            </button>
            <button
              type="button"
              onClick={() => setFilter("7d")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filter === "7d"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              7d
            </button>
          </div>

          {/* Metric Selector Pills */}
          <div className="hidden sm:inline-flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {(["aqi", "pm2_5", "pm10", "o3", "no2"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMetric(m)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedMetric === m
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {m === "aqi" ? "AQI" : m === "pm2_5" ? "PM2.5" : m === "pm10" ? "PM10" : m === "o3" ? "O₃" : "NO₂"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="w-full h-80 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 shadow-sm transition-colors">
        {isMounted && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="pm25Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="pm10Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="o3Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="no2Gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/80" />

              <XAxis
                dataKey="time"
                stroke="currentColor"
                className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500"
                tickLine={false}
                axisLine={false}
                interval={filter === "24h" ? 3 : filter === "3d" ? 11 : 23}
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
                        <div className="font-mono text-[11px] text-zinc-400">{d.rawTime.replace("T", " ")}</div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-zinc-200">{activeConf.name}:</span>
                          <span className="font-bold font-mono text-sm" style={{ color: activeConf.stroke }}>
                            {d[selectedMetric]} {activeConf.unit}
                          </span>
                        </div>
                        {selectedMetric === "aqi" && (
                          <div className="text-[11px] font-medium" style={{ color: d.color }}>
                            {d.category}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={activeConf.stroke}
                strokeWidth={2.5}
                fill={activeConf.fill}
                activeDot={{ r: 5, fill: activeConf.stroke, stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-zinc-400">
            {getTranslation(lang, "loading")}
          </div>
        )}
      </div>
    </section>
  );
}
