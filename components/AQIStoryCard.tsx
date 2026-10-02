"use client";

import React, { useMemo } from "react";
import { AirQualityResponse, AQIStandard, Language } from "@/lib/types";
import { computeAirQualityStory } from "@/lib/story-engine";
import { getTranslation } from "@/lib/i18n";
import { Sunrise, Sun, Sunset, Moon, Sparkles, TrendingUp, AlertCircle, Award } from "lucide-react";

interface AQIStoryCardProps {
  data: AirQualityResponse;
  standard: AQIStandard;
  lang: Language;
}

export function AQIStoryCard({ data, standard, lang }: AQIStoryCardProps) {
  const story = useMemo(
    () => computeAirQualityStory(data, standard, lang),
    [data, standard, lang]
  );

  const isHi = lang === "hi";

  const periods = [
    {
      key: "morning",
      label: getTranslation(lang, "morning"),
      timeRange: "06:00 – 11:00",
      icon: Sunrise,
      iconColor: "text-amber-500",
      data: story.morning,
    },
    {
      key: "afternoon",
      label: getTranslation(lang, "afternoon"),
      timeRange: "12:00 – 17:00",
      icon: Sun,
      iconColor: "text-yellow-500",
      data: story.afternoon,
    },
    {
      key: "evening",
      label: getTranslation(lang, "evening"),
      timeRange: "18:00 – 21:00",
      icon: Sunset,
      iconColor: "text-orange-500",
      data: story.evening,
    },
    {
      key: "night",
      label: getTranslation(lang, "night"),
      timeRange: "22:00 – 05:00",
      icon: Moon,
      iconColor: "text-indigo-400",
      data: story.night,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>{getTranslation(lang, "storyTitle")}</span>
          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            Diurnal Rhythm
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {getTranslation(lang, "storySubtitle")}
        </p>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-7 shadow-sm transition-colors">
        {/* Diurnal 4-Phase Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {periods.map((p) => {
            const Icon = p.icon;
            const isBest = story.bestPeriod.toLowerCase().includes(p.key);
            const isPeak = story.peakPeriod.toLowerCase().includes(p.key);

            return (
              <div
                key={p.key}
                className={`relative rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                  isBest
                    ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-sm"
                    : isPeak
                    ? "bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                    : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700/80"
                }`}
              >
                {/* Badge if cleanest or peak */}
                {isBest && (
                  <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{isHi ? "स्वच्छ" : "Cleanest"}</span>
                  </div>
                )}
                {isPeak && (
                  <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white shadow-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{isHi ? "चरम" : "Peak"}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${p.iconColor}`} />
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {p.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {p.timeRange}
                  </span>
                </div>

                <div className="my-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-50">
                      {p.data.aqi}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      AQI
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
                    {p.data.category}
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {p.data.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Narrative & Statistical Highlights */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4">
            {story.narrative}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
            <div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                {getTranslation(lang, "bestPeriod")}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {story.bestPeriod}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                {getTranslation(lang, "peakPeriod")}
              </span>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
                {story.peakPeriod}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                {getTranslation(lang, "dominantPollutant")}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {story.dominantPollutant}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                {getTranslation(lang, "trendTrajectory")}
              </span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                {story.trendDirection}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
