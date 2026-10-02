"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, Navigation, Clock, X, AlertCircle } from "lucide-react";
import { searchLocations, reverseGeocode } from "@/lib/api";
import { LocationData, Language } from "@/lib/types";
import { getStoredRecentLocations, saveRecentLocation, removeRecentLocation, clearRecentLocations } from "@/lib/storage";
import { getTranslation } from "@/lib/i18n";

interface LocationSearchProps {
  currentLocation: LocationData;
  onSelectLocation: (location: LocationData) => void;
  lang: Language;
  className?: string;
}

export function LocationSearch({
  currentLocation,
  onSelectLocation,
  lang,
  className = "",
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationData[]>([]);
  const [recentLocations, setRecentLocations] = useState<LocationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef<number>(0);

  // Load recent locations on mount
  useEffect(() => {
    setRecentLocations(getStoredRecentLocations());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle debounced search query
  const performSearch = useCallback(async (searchQuery: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++requestIdRef.current;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await searchLocations(searchQuery, controller.signal);
      // Prevent stale response
      if (currentRequestId === requestIdRef.current) {
        setResults(data);
        setIsLoading(false);
        setHighlightedIndex(-1);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        if (currentRequestId === requestIdRef.current) {
          setErrorMsg(err.message || "Failed to search locations");
          setIsLoading(false);
        }
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setErrorMsg(null);

    if (val.trim().length >= 2) {
      setIsOpen(true);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        performSearch(val);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    }
  };

  const handleSelect = (loc: LocationData) => {
    onSelectLocation(loc);
    const updatedRecents = saveRecentLocation(loc);
    setRecentLocations(updatedRecents);
    setQuery("");
    setIsOpen(false);
    setResults([]);
    inputRef.current?.blur();
  };

  const handleRemoveRecent = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = removeRecentLocation(id);
    setRecentLocations(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentLocations();
    setRecentLocations([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    const availableItemsCount = results.length > 0 ? results.length : recentLocations.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < availableItemsCount - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : availableItemsCount - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        if (results.length > 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        } else if (recentLocations[highlightedIndex]) {
          handleSelect(recentLocations[highlightedIndex]);
        }
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    }
  };

  // "Use My Location" via browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert(getTranslation(lang, "locationError"));
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const detectedLoc = await reverseGeocode(lat, lon);
          handleSelect(detectedLoc);
        } catch (e: any) {
          setErrorMsg(getTranslation(lang, "locationError"));
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setErrorMsg(getTranslation(lang, "locationError"));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-lg ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={getTranslation(lang, "searchPlaceholder")}
          aria-label={getTranslation(lang, "searchPlaceholder")}
          className="w-full pl-10 pr-24 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-150"
        />

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          title={getTranslation(lang, "useMyLocation")}
          className="absolute right-1.5 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800/80 transition-colors disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">GPS</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 max-h-96 overflow-y-auto">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              {results.length > 0 ? (
                <ul role="listbox" className="py-1">
                  {results.map((item, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <li
                        key={`${item.id}-${idx}`}
                        role="option"
                        aria-selected={isHighlighted}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer text-sm transition-colors ${
                          isHighlighted
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold">{item.name}</span>
                            {(item.admin1 || item.country) && (
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5">
                                {[item.admin1, item.country].filter(Boolean).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        {item.country_code && (
                          <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                            {item.country_code}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : !isLoading ? (
                <div className="px-4 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  {getTranslation(lang, "noResults")}
                </div>
              ) : null}
            </div>
          ) : (
            /* Recent Searches */
            recentLocations.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {getTranslation(lang, "recentSearches")}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllRecent}
                    className="hover:text-rose-500 transition-colors text-[11px] normal-case"
                  >
                    {getTranslation(lang, "clearRecent")}
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5 px-1 pb-1">
                  {recentLocations.map((rec, rIdx) => (
                    <div
                      key={rec.id}
                      onClick={() => handleSelect(rec)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-colors border ${
                        rIdx === highlightedIndex
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"
                          : "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{rec.name}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveRecent(e, rec.id)}
                        className="ml-1 text-zinc-400 hover:text-rose-500 transition-colors"
                        aria-label="Remove recent location"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
