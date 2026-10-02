"use client";

import React from "react";
import { AQIStandard, Language, LocationData, Theme } from "@/lib/types";
import { Logo } from "./Logo";
import { LocationSearch } from "./LocationSearch";
import { getTranslation } from "@/lib/i18n";
import {
  Sun,
  Moon,
  Laptop,
  RefreshCw,
} from "lucide-react";

interface HeaderProps {
  currentLocation: LocationData;
  onSelectLocation: (loc: LocationData) => void;
  standard: AQIStandard;
  onSelectStandard: (std: AQIStandard) => void;
  lang: Language;
  onSelectLanguage: (lang: Language) => void;
  theme: Theme;
  onSelectTheme: (theme: Theme) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({
  currentLocation,
  onSelectLocation,
  standard,
  onSelectStandard,
  lang,
  onSelectLanguage,
  theme,
  onSelectTheme,
  onRefresh,
  isRefreshing,
}: HeaderProps) {
  const isHi = lang === "hi";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: AQI Sense Brand Identity */}
        <div className="flex-shrink-0">
          <Logo isHindi={isHi} />
        </div>

        {/* Center: Location Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <LocationSearch
            currentLocation={currentLocation}
            onSelectLocation={onSelectLocation}
            lang={lang}
          />
        </div>

        {/* Right Controls: Standard (US / India / EAQI), Language, Theme, Refresh */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AQI Standard Selector (US, India NAQI, European EAQI) */}
          <div className="relative inline-flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => onSelectStandard("us")}
              title="US EPA AQI Standard (0-500 scale)"
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                standard === "us"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              US AQI
            </button>
            <button
              type="button"
              onClick={() => onSelectStandard("india")}
              title="India National AQI - CPCB Standard (0-500 scale)"
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                standard === "india"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {isHi ? "भारतीय NAQI" : "India NAQI"}
            </button>
            <button
              type="button"
              onClick={() => onSelectStandard("european")}
              title="European EAQI Standard (0-100+ scale)"
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                standard === "european"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              EAQI
            </button>
          </div>

          {/* Language Switcher: English | हिन्दी */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => onSelectLanguage("en")}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === "en"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onSelectLanguage("hi")}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                lang === "hi"
                  ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Theme Selector (Light, Dark, System) */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => onSelectTheme("light")}
              title={getTranslation(lang, "themeLight")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "light"
                  ? "bg-white dark:bg-zinc-700 text-amber-500 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTheme("dark")}
              title={getTranslation(lang, "themeDark")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-white dark:bg-zinc-700 text-purple-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTheme("system")}
              title={getTranslation(lang, "themeSystem")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "system"
                  ? "bg-white dark:bg-zinc-700 text-emerald-500 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title={getTranslation(lang, "refreshTooltip")}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="px-4 pb-3 md:hidden">
        <LocationSearch
          currentLocation={currentLocation}
          onSelectLocation={onSelectLocation}
          lang={lang}
        />
      </div>
    </header>
  );
}
