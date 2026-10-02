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
      {/* Original SVG Icon */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-md shadow-emerald-500/20 text-white overflow-hidden p-1.5"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Protective Shield Geometry */}
          <path
            d="M24 4L39 9.5V21C39 31.5 32.5 39.8 24 44C15.5 39.8 9 31.5 9 21V9.5L24 4Z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Atmospheric Air Flow Wave 1 */}
          <path
            d="M16 19C19 16.5 24 16.5 27 19C30 21.5 33 21 35 19.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Atmospheric Air Flow Wave 2 */}
          <path
            d="M13 25C17 22.5 23 23 27 26C31 29 35 28 37 26.5"
            stroke="#a7f3d0"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Microscopic Particle Defense Node */}
          <circle cx="24" cy="33" r="2.5" fill="#6ee7b7" />
          <circle cx="18" cy="30" r="1.5" fill="white" opacity="0.8" />
          <circle cx="30" cy="30" r="1.5" fill="white" opacity="0.8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              {isHindi ? "AQI गार्जियन" : "AQI Guardian"}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
              Live
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium -mt-0.5 hidden sm:inline-block">
            {isHindi ? "वायुमंडलीय सुरक्षा एवं विश्लेषण" : "Atmospheric Intelligence"}
          </span>
        </div>
      )}
    </div>
  );
}
