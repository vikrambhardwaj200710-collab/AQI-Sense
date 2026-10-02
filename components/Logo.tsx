"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  isHindi?: boolean;
}

export function Logo({ className = "", size = 36, showText = true, isHindi = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original AQI Sense Sensor Icon */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 shadow-md shadow-emerald-500/20 text-white overflow-hidden p-1.5"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Sensory Wave Pulse */}
          <path
            d="M8 24C8 15.1634 15.1634 8 24 8C32.8366 8 40 15.1634 40 24"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 3"
            className="opacity-70"
          />
          {/* Middle Responsive Sensing Arc */}
          <path
            d="M13 24C13 17.9249 17.9249 13 24 13C30.0751 13 35 17.9249 35 24"
            stroke="#a7f3d0"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Dynamic Waveform Flow */}
          <path
            d="M10 32C14 28 18 36 24 32C30 28 34 36 38 32"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Center Sensory Core Node */}
          <circle cx="24" cy="24" r="3.5" fill="#34d399" />
          <circle cx="24" cy="24" r="1.5" fill="white" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              {isHindi ? "AQI सेंस" : "AQI Sense"}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
              Live
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium -mt-0.5 hidden sm:inline-block">
            {isHindi ? "पर्यावरणीय वायु संवेदी तंत्र" : "Atmospheric Intelligence"}
          </span>
        </div>
      )}
    </div>
  );
}
