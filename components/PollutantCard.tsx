"use client";

import React from "react";
import { PollutantInfo, Language } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PollutantCardProps {
  info: PollutantInfo;
  lang: Language;
}

export function PollutantCard({ info, lang }: PollutantCardProps) {
  const isHi = lang === "hi";

  // Generate mini SVG sparkline path
  const points = info.hourlyValues || [];
  const maxVal = Math.max(...points, 1);
  const minVal = Math.min(...points, 0);
  const range = maxVal - minVal || 1;

  const width = 100;
  const height = 30;

  const sparklinePoints = points
    .slice(-12) // Last 12 hours
    .map((val, idx, arr) => {
      const x = (idx / (arr.length - 1 || 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group">
      <div>
        {/* Header: Chemical Formula, Name, and Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight">
                {info.chemicalFormula}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                ({info.name})
              </span>
            </div>
          </div>

          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: `${info.categoryColor}15`,
              borderColor: `${info.categoryColor}40`,
              color: info.categoryColor,
            }}
          >
            {info.categoryLabel}
          </span>
        </div>

        {/* Value and Unit */}
        <div className="flex items-baseline gap-1.5 my-2">
          <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
            {typeof info.value === "number" ? info.value.toFixed(1) : "--"}
          </span>
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {info.unit}
          </span>
        </div>

        {/* Plain-English Explanation */}
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2 line-clamp-3">
          {info.description}
        </p>
      </div>

      {/* Footer: Trend & Mini Sparkline */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          {info.trend24h === "rising" ? (
            <span className="flex items-center gap-0.5 text-rose-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isHi ? "बढ़ता रुझान" : "Rising"}</span>
            </span>
          ) : info.trend24h === "falling" ? (
            <span className="flex items-center gap-0.5 text-emerald-500">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{isHi ? "घटता रुझान" : "Falling"}</span>
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-zinc-400">
              <Minus className="w-3.5 h-3.5" />
              <span>{isHi ? "स्थिर" : "Stable"}</span>
            </span>
          )}
        </div>

        {/* Mini SVG Sparkline */}
        {sparklinePoints && (
          <div className="w-24 h-6">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke={info.categoryColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparklinePoints}
                className="opacity-80"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
