"use client";

import React from "react";
import { AQICategory, AQIStandard } from "@/lib/types";

interface AQIGaugeProps {
  aqi: number;
  category: AQICategory;
  standard: AQIStandard;
  size?: number;
}

export function AQIGauge({ aqi, category, standard, size = 260 }: AQIGaugeProps) {
  const maxVal = standard === "us" ? 500 : 120;
  const clampedAqi = Math.max(0, Math.min(aqi, maxVal));

  // Gauge geometry: 240-degree arc from 150deg to 390deg (or -210deg to 30deg)
  const startAngle = 150;
  const totalAngle = 240;
  const endAngle = startAngle + totalAngle;

  // Percentage value for needle
  const pct = clampedAqi / maxVal;
  const currentAngle = startAngle + pct * totalAngle;

  const radius = 100;
  const center = 130;
  const strokeWidth = 16;

  // Function to calculate x, y on arc
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  // Needle tip coordinates
  const needleRadius = radius - 15;
  const needleTip = polarToCartesian(center, center, needleRadius, currentAngle);

  // Background full arc
  const bgArc = describeArc(center, center, radius, startAngle, endAngle);

  // Active colored arc up to current angle
  const activeArc = currentAngle > startAngle + 1 ? describeArc(center, center, radius, startAngle, currentAngle) : "";

  // Segment markers
  const usThresholds = [0, 50, 100, 150, 200, 300, 500];
  const euThresholds = [0, 20, 40, 60, 80, 100, 120];
  const thresholds = standard === "us" ? usThresholds : euThresholds;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size * 0.9 }}>
      <svg
        viewBox="0 0 260 235"
        className="w-full h-full overflow-visible transition-all duration-500"
      >
        <defs>
          {/* Subtle drop shadow for needle */}
          <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>

          {/* Color Gradient along current category */}
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor={category.color} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <path
          d={bgArc}
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-800"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Arc */}
        {activeArc && (
          <path
            d={activeArc}
            fill="none"
            stroke={category.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Scale Tick Marks */}
        {thresholds.map((val, idx) => {
          const tPct = val / maxVal;
          const tAngle = startAngle + tPct * totalAngle;
          const innerP = polarToCartesian(center, center, radius - strokeWidth / 2 - 4, tAngle);
          const outerP = polarToCartesian(center, center, radius + strokeWidth / 2 + 4, tAngle);

          return (
            <line
              key={idx}
              x1={innerP.x}
              y1={innerP.y}
              x2={outerP.x}
              y2={outerP.y}
              stroke="currentColor"
              strokeWidth="2"
              className="text-zinc-400 dark:text-zinc-600 opacity-60"
            />
          );
        })}

        {/* Center Pivot Point */}
        <circle cx={center} cy={center} r="9" fill={category.color} className="shadow-md" />
        <circle cx={center} cy={center} r="4" fill="white" />

        {/* Needle Line */}
        <line
          x1={center}
          y1={center}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={category.color}
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#needleGlow)"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Numerical Display in Center */}
      <div className="absolute top-[88px] flex flex-col items-center text-center pointer-events-none">
        <span
          className="text-5xl font-black tracking-tight font-mono transition-colors duration-500 leading-none"
          style={{ color: category.color }}
        >
          {aqi}
        </span>
        <span className="text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 mt-1">
          {standard === "us" ? "US AQI" : "EAQI"}
        </span>
      </div>

      {/* Category Pill Under Gauge */}
      <div className="mt-[-28px] z-10 flex flex-col items-center">
        <div
          className="px-3.5 py-1 rounded-full text-xs font-bold border transition-all duration-300 shadow-sm"
          style={{
            backgroundColor: `${category.color}15`,
            borderColor: `${category.color}50`,
            color: category.color,
          }}
        >
          {category.label}
        </div>
      </div>
    </div>
  );
}
