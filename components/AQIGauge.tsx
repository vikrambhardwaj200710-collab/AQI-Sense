"use client";

import React from "react";
import { AQICategory, AQIStandard } from "@/lib/types";

interface AQIGaugeProps {
  aqi: number;
  category: AQICategory;
  standard: AQIStandard;
  size?: number;
}

export function AQIGauge({ aqi, category, standard }: AQIGaugeProps) {
  const maxVal = standard === "european" ? 120 : 500;
  const clampedAqi = Math.max(0, Math.min(aqi, maxVal));

  // Horizontal Car Speedometer Geometry:
  // Sweeps horizontally from 200° (bottom-left) to -20° (bottom-right), a 220° wide horizontal arc
  const startAngle = 200;
  const sweepAngle = 220;
  const endAngle = startAngle + sweepAngle;

  const pct = clampedAqi / maxVal;
  const currentAngle = startAngle + pct * sweepAngle;

  const cx = 220;
  const cy = 180;
  const radius = 135;
  const trackWidth = 14;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  // Full track background arc
  const bgArc = describeArc(cx, cy, radius, startAngle, endAngle);

  // Active colored arc
  const activeArc = currentAngle > startAngle + 1 ? describeArc(cx, cy, radius, startAngle, currentAngle) : "";

  // Needle tip
  const needleRadius = radius - 16;
  const needleTip = polarToCartesian(cx, cy, needleRadius, currentAngle);

  // Speedometer Major & Minor Tick Marks
  const majorTicks =
    standard === "european"
      ? [0, 20, 40, 60, 80, 100, 120]
      : standard === "india"
      ? [0, 50, 100, 200, 300, 400, 500]
      : [0, 50, 100, 150, 200, 300, 500];

  // Minor ticks: 20 subdivisions
  const minorTickCount = 28;
  const minorTicks = Array.from({ length: minorTickCount + 1 }, (_, i) => {
    const tickPct = i / minorTickCount;
    return startAngle + tickPct * sweepAngle;
  });

  // Standard display label inside speedometer center
  const standardName =
    standard === "india"
      ? "INDIA NAQI (CPCB)"
      : standard === "european"
      ? "EUROPEAN EAQI"
      : "US EPA AQI";

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[440px] px-2 py-1">
      {/* Automotive Speedometer Dial Shell */}
      <div className="relative w-full aspect-[440/260] flex items-center justify-center">
        <svg
          viewBox="0 0 440 260"
          className="w-full h-full overflow-visible transition-all duration-500"
        >
          <defs>
            {/* Speedometer dial subtle bezel shadow */}
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            <filter id="speedoGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={category.color} floodOpacity="0.5" />
            </filter>

            <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Outer Speedometer Cluster Ring */}
          <path
            d={describeArc(cx, cy, radius + 22, startAngle, endAngle)}
            fill="none"
            stroke="currentColor"
            className="text-zinc-200 dark:text-zinc-800/60"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Main Background Speed Track */}
          <path
            d={bgArc}
            fill="none"
            stroke="currentColor"
            className="text-zinc-200 dark:text-zinc-800"
            strokeWidth={trackWidth}
            strokeLinecap="round"
          />

          {/* Active Speedometer Arc */}
          {activeArc && (
            <path
              d={activeArc}
              fill="none"
              stroke={category.color}
              strokeWidth={trackWidth}
              strokeLinecap="round"
              filter="url(#speedoGlow)"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Minor Ticks */}
          {minorTicks.map((angle, idx) => {
            const inner = polarToCartesian(cx, cy, radius + trackWidth / 2 + 2, angle);
            const outer = polarToCartesian(cx, cy, radius + trackWidth / 2 + 7, angle);
            return (
              <line
                key={`minor-${idx}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-zinc-300 dark:text-zinc-700"
              />
            );
          })}

          {/* Major Speed Ticks & Speed Numbers */}
          {majorTicks.map((val, idx) => {
            const tPct = val / maxVal;
            const tAngle = startAngle + tPct * sweepAngle;
            const inner = polarToCartesian(cx, cy, radius - trackWidth / 2 - 3, tAngle);
            const outer = polarToCartesian(cx, cy, radius + trackWidth / 2 + 10, tAngle);
            const labelPos = polarToCartesian(cx, cy, radius - 26, tAngle);

            return (
              <g key={`major-${idx}`}>
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-zinc-500 dark:text-zinc-400"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y + 4}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-bold fill-zinc-500 dark:fill-zinc-400 select-none"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Speedometer Center Hub (Car Instrument Cluster Pivot) */}
          <circle cx={cx} cy={cy} r="18" fill="url(#hubGradient)" className="shadow-lg" />
          <circle cx={cx} cy={cy} r="12" fill={category.color} className="opacity-90" />
          <circle cx={cx} cy={cy} r="5" fill="#ffffff" />

          {/* Glowing Speedometer Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke={category.color}
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#needleShadow)"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Digital Odometer & Standard Display */}
        <div className="absolute top-[82px] left-0 right-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {/* Main Large AQI Value (Car Digital Speed) */}
          <div className="flex items-baseline justify-center gap-1 leading-none">
            <span
              className="text-5xl sm:text-6xl font-black font-mono tracking-tight transition-colors duration-500"
              style={{ color: category.color }}
            >
              {aqi}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              AQI
            </span>
          </div>

          {/* Standard Indicator in the Center */}
          <div className="mt-1 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80">
            <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              {standardName}
            </span>
          </div>
        </div>
      </div>

      {/* Speedometer Lower Cluster Display: Category Status Pill */}
      <div className="-mt-8 z-10 flex flex-col items-center">
        <div
          className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold tracking-wide uppercase border shadow-sm transition-all duration-300 flex items-center gap-2"
          style={{
            backgroundColor: `${category.color}15`,
            borderColor: `${category.color}50`,
            color: category.color,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: category.color }}
          />
          <span>{category.label}</span>
        </div>
      </div>
    </div>
  );
}
