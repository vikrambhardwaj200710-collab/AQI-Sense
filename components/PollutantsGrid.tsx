"use client";

import React, { useState } from "react";
import { AirQualityResponse, Language, PollutantInfo } from "@/lib/types";
import { PollutantCard } from "./PollutantCard";
import { getPollutantCategory } from "@/lib/aqi-standards";
import { getTranslation } from "@/lib/i18n";
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle, Factory, ShieldCheck } from "lucide-react";

interface PollutantsGridProps {
  data: AirQualityResponse;
  lang: Language;
}

export function PollutantsGrid({ data, lang }: PollutantsGridProps) {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const isHi = lang === "hi";

  const { current, hourly, current_units } = data;

  // Helper to extract trend and array
  const getPollutantData = (
    key: "pm2_5" | "pm10" | "ozone" | "nitrogen_dioxide" | "sulphur_dioxide" | "carbon_monoxide",
    code: "pm2_5" | "pm10" | "o3" | "no2" | "so2" | "co",
    nameEn: string,
    nameHi: string,
    formula: string,
    descEn: string,
    descHi: string,
    sourcesEn: string,
    sourcesHi: string,
    healthEn: string,
    healthHi: string,
    whoLimit: string
  ): PollutantInfo => {
    const rawVal = current[key as keyof typeof current] as number | undefined | null;
    const value = typeof rawVal === "number" ? rawVal : 0;
    const cat = getPollutantCategory(code, value);
    const hourlyVals = ((hourly?.[key as keyof typeof hourly] as number[]) || []).slice(-24);

    let trend24h: "rising" | "falling" | "stable" = "stable";
    if (hourlyVals.length >= 6) {
      const recent = hourlyVals.slice(-3).reduce((a, b) => a + (b || 0), 0) / 3;
      const earlier = hourlyVals.slice(-6, -3).reduce((a, b) => a + (b || 0), 0) / 3;
      if (recent - earlier > 2) trend24h = "rising";
      else if (earlier - recent > 2) trend24h = "falling";
    }

    return {
      code,
      name: isHi ? nameHi : nameEn,
      chemicalFormula: formula,
      value,
      unit: current_units?.[key] || "μg/m³",
      category: cat.status,
      categoryLabel: isHi ? cat.labelHi : cat.labelEn,
      categoryColor: cat.color,
      description: isHi ? descHi : descEn,
      sources: isHi ? sourcesHi : sourcesEn,
      healthEffects: isHi ? healthHi : healthEn,
      whoGuideline: whoLimit,
      trend24h,
      hourlyValues: hourlyVals.map((v) => v || 0),
    };
  };

  const pollutants: PollutantInfo[] = [
    getPollutantData(
      "pm2_5",
      "pm2_5",
      "Fine Particulate Matter",
      "बारीक सूक्ष्म कण",
      "PM2.5",
      "Microscopic particles < 2.5 micrometers that penetrate deep into alveolar lung tissues and bloodstream.",
      "2.5 माइक्रोमीटर से छोटे कण जो फेफड़ों की गहराई तक पहुंचकर रक्त प्रवाह में प्रवेश कर सकते हैं।",
      "Vehicle exhaust, coal combustion, agricultural burning, construction dust.",
      "वाहनों का धुआं, कोयले का दहन, पराली जलाना और निर्माण कार्य।",
      "Aggravates asthma, decreases lung function, triggers cardiovascular events.",
      "दमा, सांस की तकलीफ और हृदय संबंधी रोगों का खतरा बढ़ाता है।",
      "15 μg/m³ (24h mean)"
    ),
    getPollutantData(
      "pm10",
      "pm10",
      "Coarse Particulate Matter",
      "मोटे धूल कण",
      "PM10",
      "Inhalable particles < 10 micrometers including road dust, pollen, and industrial emissions.",
      "10 माइक्रोमीटर से छोटे सांस लेने योग्य कण, जिनमें सड़क की धूल और औद्योगिक धुआं शामिल है।",
      "Road dust resuspension, construction sites, unpaved surfaces, windblown soil.",
      "सड़क की धूल, निर्माण स्थल, खुली मिट्टी और खनन गतिविधियां।",
      "Irritates eyes, throat, and upper airways; exacerbates bronchitis.",
      "आंखों और गले में जलन, खांसी और ब्रोंकाइटिस को बढ़ाता है।",
      "45 μg/m³ (24h mean)"
    ),
    getPollutantData(
      "ozone",
      "o3",
      "Ground-Level Ozone",
      "ज़मीनी ओजोन गैस",
      "O₃",
      "Secondary photochemical gas created when sunlight reacts with vehicular and industrial emissions.",
      "धूप में वाहनों और कारखानों से निकलने वाले धुएं की रासायनिक क्रिया से बनने वाली गैस।",
      "Photochemical reactions between nitrogen oxides (NOx) and volatile organic compounds (VOCs).",
      "तेज धूप में नाइट्रोजन ऑक्साइड और वाष्पशील कार्बनिक यौगिकों की प्रतिक्रिया।",
      "Triggers chest pain, coughing, throat inflammation; reduces lung capacity.",
      "छाती में दर्द, खांसी, गले में खराश और फेफड़ों की कार्यक्षमता में कमी।",
      "100 μg/m³ (8h mean)"
    ),
    getPollutantData(
      "nitrogen_dioxide",
      "no2",
      "Nitrogen Dioxide",
      "नाइट्रोजन डाइऑक्साइड",
      "NO₂",
      "Pungent reddish-brown gas primarily emitted from internal combustion engines and power plants.",
      "तीखी गंध वाली गैस, जो मुख्यतः वाहनों के इंजन और बिजली संयंत्रों से निकलती है।",
      "Diesel and petrol motor vehicles, thermal power plants, industrial boilers.",
      "डीजल और पेट्रोल वाहन, थर्मल पावर प्लांट और औद्योगिक भट्टियां।",
      "Inflames airway lining, increases susceptibility to respiratory infections.",
      "सांस की नली में सूजन और फेफड़ों के संक्रमण की संभावना बढ़ाता है।",
      "25 μg/m³ (24h mean)"
    ),
    getPollutantData(
      "sulphur_dioxide",
      "so2",
      "Sulphur Dioxide",
      "सल्फर डाइऑक्साइड",
      "SO₂",
      "Corrosive gas produced from burning sulfur-rich fossil fuels and mineral ores.",
      "सल्फर युक्त कोयला, कच्चा तेल और धातु अयस्क जलाने से उत्पन्न होने वाली गैस।",
      "Coal-fired power generation, metal smelting, chemical manufacturing.",
      "कोयला आधारित बिजली संयंत्र, धातु गलाने के कारखाने और रिफाइनरी।",
      "Causes bronchoconstriction, severe eye burning, and respiratory tract irritation.",
      "सांस लेने में गंभीर कठिनाई, आंखों में जलन और फेफड़ों में तनाव।",
      "40 μg/m³ (24h mean)"
    ),
    getPollutantData(
      "carbon_monoxide",
      "co",
      "Carbon Monoxide",
      "कार्बन मोनोऑक्साइड",
      "CO",
      "Colorless, odorless gas produced by incomplete combustion of carbon-based fuels.",
      "रंगहीन और गंधहीन जहरीली गैस, जो ईंधनों के अधूरे जलने से पैदा होती है।",
      "Vehicular exhaust, poorly ventilated stoves, biomass heating, industrial furnaces.",
      "वाहनों का धुआं, बंद कमरों में जलने वाले चूल्हे, हीटर और भट्टियां।",
      "Reduces oxygen delivery to body organs; causes headaches, fatigue, dizziness.",
      "रक्त में ऑक्सीजन ले जाने की क्षमता घटाती है; सिरदर्द और चक्कर का कारण बनती है।",
      "4000 μg/m³ (24h mean)"
    ),
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {getTranslation(lang, "pollutantsTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {getTranslation(lang, "pollutantsSubtitle")}
          </p>
        </div>

        {/* Collapsible Educational Toggle */}
        <button
          type="button"
          onClick={() => setIsEducationOpen(!isEducationOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors self-start sm:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{getTranslation(lang, "whatArePollutants")}</span>
          {isEducationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 6 Pollutant Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => (
          <PollutantCard key={pollutant.code} info={pollutant} lang={lang} />
        ))}
      </div>

      {/* Expandable "What are these pollutants?" Educational Guide */}
      {isEducationOpen && (
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 transition-all animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {getTranslation(lang, "whatArePollutants")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pollutants.map((p) => (
              <div
                key={`edu-${p.code}`}
                className="p-4 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm font-mono text-zinc-900 dark:text-zinc-100">
                    {p.chemicalFormula} — {p.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                    WHO: {p.whoGuideline}
                  </span>
                </div>

                <div className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-1.5">
                  <Factory className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {isHi ? "स्रोत: " : "Sources: "}
                    </strong>
                    {p.sources}
                  </span>
                </div>

                <div className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {isHi ? "स्वास्थ्य प्रभाव: " : "Health Impact: "}
                    </strong>
                    {p.healthEffects}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
