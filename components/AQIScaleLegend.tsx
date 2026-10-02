"use client";

import React from "react";
import { AQIStandard, Language } from "@/lib/types";
import { US_AQI_SCALE, EUROPEAN_AQI_SCALE } from "@/lib/aqi-standards";
import { getTranslation } from "@/lib/i18n";

interface AQIScaleLegendProps {
  currentAqi: number;
  standard: AQIStandard;
  lang: Language;
}

export function AQIScaleLegend({ currentAqi, standard, lang }: AQIScaleLegendProps) {
  const scale = standard === "us" ? US_AQI_SCALE : EUROPEAN_AQI_SCALE;
  const isHi = lang === "hi";

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          {getTranslation(lang, "scaleLegendTitle")}
        </h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {standard === "us" ? "EPA Breakpoints (0 - 500)" : "European EAQI Breakpoints (0 - 100+)"}
        </span>
      </div>

      {/* Visual Bar of Tiers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {scale.map((item, idx) => {
          const isCurrent = currentAqi >= item.min && (currentAqi <= item.max || idx === scale.length - 1);

          return (
            <div
              key={idx}
              className={`relative rounded-xl p-2.5 transition-all duration-200 border flex flex-col justify-between ${
                isCurrent
                  ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 border-transparent shadow-sm"
                  : "border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
              style={{
                backgroundColor: isCurrent ? `${item.color}15` : undefined,
                borderColor: isCurrent ? item.color : undefined,
                // @ts-ignore
                "--tw-ring-color": isCurrent ? item.color : "transparent",
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                    {item.min} - {item.max === 500 ? "500+" : item.max}
                  </span>
                </div>
                <div
                  className="text-xs font-bold truncate"
                  style={{ color: item.color }}
                >
                  {isHi ? item.labelHi : item.labelEn}
                </div>
              </div>

              {isCurrent && (
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Current
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
