"use client";

import React, { useMemo } from "react";
import { AirQualityResponse, AQIStandard, Language } from "@/lib/types";
import { computeBestModeledWindow } from "@/lib/story-engine";
import { getTranslation } from "@/lib/i18n";
import { CalendarClock, Sparkles, Wind, Info, CheckCircle2 } from "lucide-react";

interface BestWindowCardProps {
  data: AirQualityResponse;
  standard: AQIStandard;
  lang: Language;
}

export function BestWindowCard({ data, standard, lang }: BestWindowCardProps) {
  const windowData = useMemo(
    () => computeBestModeledWindow(data, standard, lang),
    [data, standard, lang]
  );

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-cyan-950/40 border border-emerald-300/80 dark:border-emerald-800/80 p-6 sm:p-7 shadow-sm transition-all relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
              <CalendarClock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>{getTranslation(lang, "bestWindowTitle")}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Recommended
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {getTranslation(lang, "bestWindowSubtitle")}
              </p>
            </div>
          </div>

          <div className="pt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-xl">
            {windowData.reason}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{windowData.weatherSummary}</span>
          </div>
        </div>

        {/* Right Side: Big Highlight Badge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-zinc-800/90 border border-emerald-200 dark:border-emerald-800 shadow-sm min-w-[220px] text-center self-stretch sm:self-auto">
          <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
            {getTranslation(lang, "recommendedTime")}
          </span>
          <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
            {windowData.formattedWindow}
          </span>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ~{windowData.expectedAqi}
            </span>
            <span className="text-xs font-bold text-zinc-400">
              {standard === "us" ? "US AQI" : "EAQI"}
            </span>
          </div>

          <span className="mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {windowData.category}
          </span>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="mt-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-900/40 flex items-start gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-400" />
        <p>{getTranslation(lang, "windowDisclaimer")}</p>
      </div>
    </div>
  );
}
