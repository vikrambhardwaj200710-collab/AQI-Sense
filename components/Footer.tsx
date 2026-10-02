"use client";

import React from "react";
import { Language } from "@/lib/types";
import { Logo } from "./Logo";
import { getTranslation } from "@/lib/i18n";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  const isHi = lang === "hi";

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 max-w-sm">
          <Logo isHindi={isHi} />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">
            {getTranslation(lang, "brandShortDesc")}
          </p>
        </div>

        {/* Attribution & Data Sources */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Powered by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
            >
              Open-Meteo API
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Google Gemini
            </span>
          </div>

          <p className="text-[11px] max-w-md text-zinc-400 leading-snug">
            {getTranslation(lang, "modeledDataNotice")}
          </p>

          <div className="text-[11px] text-zinc-400 mt-1">
            © {new Date().getFullYear()} AQI Guardian. Free, open, and privacy-first environmental intelligence.
          </div>
        </div>
      </div>
    </footer>
  );
}
