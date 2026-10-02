"use client";

import React from "react";
import { AQICategory, AQIStandard, Language } from "@/lib/types";
import { getTranslation } from "@/lib/i18n";
import {
  ShieldCheck,
  AlertTriangle,
  Wind,
  Home,
  Activity,
  HeartPulse,
  Sparkles,
  Smile,
  Shield,
  GlassWater,
} from "lucide-react";

interface PreventiveMeasuresProps {
  category: AQICategory;
  standard: AQIStandard;
  lang: Language;
}

export function PreventiveMeasures({ category, standard, lang }: PreventiveMeasuresProps) {
  const isHi = lang === "hi";
  const index = category.index; // 0 (best) to 5 (hazardous)

  // Contextual guidance tailored to the exact level
  const guidanceCards = [
    {
      title: getTranslation(lang, "sensitiveGroupsGuidance"),
      icon: HeartPulse,
      iconColor: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-200 dark:border-rose-900/50",
      content:
        index === 0
          ? isHi
            ? "दमा और सांस के मरीजों के लिए पूरी तरह सुरक्षित स्थिति। बिना किसी चिंता के बाहर घूमें।"
            : "Completely safe conditions for asthma and pulmonary patients. Freely enjoy open spaces."
          : index === 1
          ? isHi
            ? "अति संवेदनशील व्यक्ति असामान्य सांस फूलने या खांसी जैसे लक्षणों पर नजर रखें।"
            : "Unusually sensitive individuals should monitor for any subtle respiratory symptoms or fatigue."
          : index === 2
          ? isHi
            ? "बुजुर्गों, गर्भवती महिलाओं और बच्चों को बाहर भारी परिश्रम वाली गतिविधियां कम करनी चाहिए।"
            : "Elderly, pregnant women, and children should limit prolonged outdoor physical exertion."
          : index >= 3
          ? isHi
            ? "संवेदनशील लोग पूरी तरह घर के अंदर रहें। आपातकालीन इनहेलर या दवाइयां पास रखें और बाहर न जाएं।"
            : "Sensitive groups must remain strictly indoors. Keep rescue inhalers and prescribed meds readily accessible."
          : "",
    },
    {
      title: getTranslation(lang, "generalPublicGuidance"),
      icon: Activity,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200 dark:border-emerald-900/50",
      content:
        index <= 1
          ? isHi
            ? "हवा सामान्य और अनुकूल है। सभी बाहरी गतिविधियों और खेलकूद के लिए उत्तम दिन।"
            : "Air conditions are favorable. Ideal day for outdoor sports, cycling, and running."
          : index === 2
          ? isHi
            ? "सामान्य लोग बाहरी गतिविधियां जारी रख सकते हैं, पर थका देने वाले व्यायाम सीमित करें।"
            : "Healthy adults can engage in normal outdoor activities; consider moderating intense cardio."
          : index === 3
          ? isHi
            ? "बाहर भारी व्यायाम से बचें। जॉगिंग या कसरत को घर के अंदर स्वच्छ कमरे में स्थानांतरित करें।"
            : "Avoid heavy outdoor workouts. Relocate endurance training indoors to a filtered room."
          : isHi
          ? "सभी बाहरी खेल और कसरत तत्काल बंद करें। गैर-जरूरी बाहरी आवागमन से बचें।"
          : "Avoid all non-essential outdoor travel and suspend outdoor workouts entirely.",
    },
    {
      title: getTranslation(lang, "maskRecommendation"),
      icon: Shield,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      content:
        index <= 1
          ? isHi
            ? "किसी सुरक्षात्मक मास्क की आवश्यकता नहीं है। प्राकृतिक हवा स्वच्छ है।"
            : "No protective mask required. Natural atmospheric concentrations are safe."
          : index === 2
          ? isHi
            ? "सड़क या ट्रैफिक वाले इलाकों में संवेदनशील लोग सर्जिकल या कपड़े का मास्क पहन सकते हैं।"
            : "Optional for sensitive individuals traveling through heavy traffic corridors."
          : isHi
          ? "बाहर निकलते समय N95 / FFP2 प्रमाणित मास्क का उपयोग अनिवार्य रूप से करें। सामान्य कपड़े का मास्क PM2.5 को नहीं रोकता।"
          : "Wear a certified N95 or FFP2 particulate respirator outdoors. Standard cloth masks do not filter PM2.5.",
    },
    {
      title: getTranslation(lang, "indoorVentilation"),
      icon: Home,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-200 dark:border-purple-900/50",
      content:
        index <= 1
          ? isHi
            ? "घर की खिड़कियां और बालकनी खोलें ताकि ताज़ी हवा का संचलन हो सके।"
            : "Open windows and doors to allow fresh atmospheric cross-ventilation."
          : index === 2
          ? isHi
            ? "दोपहर के समय खिड़कियां खोलें जब धूप से प्रदूषण का स्तर न्यूनतम हो।"
            : "Ventilate during the cleanest afternoon window; close windows during morning commute smog."
          : isHi
          ? "खिड़की-दरवाजे बंद रखें। घर में HEPA फ़िल्टर एयर प्यूरीफायर चालू रखें और अगरबत्ती/धुआं न करें।"
          : "Seal windows and doors. Run HEPA air purifiers continuously; avoid burning incense or candles.",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>{getTranslation(lang, "preventionTitle")}</span>
          <span
            className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: `${category.color}15`,
              borderColor: `${category.color}40`,
              color: category.color,
            }}
          >
            Tier {index + 1}: {category.label}
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {getTranslation(lang, "preventionSubtitle")}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guidanceCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white dark:bg-zinc-900 border ${card.borderColor} shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`p-2 rounded-xl ${card.bgColor} ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {card.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  {card.content}
                </p>
              </div>

              {/* Hydration tip on severe tiers */}
              {index >= 3 && idx === 3 && (
                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400">
                  <GlassWater className="w-3.5 h-3.5" />
                  <span>{isHi ? "हाइड्रेटेड रहें: पर्याप्त पानी पिएं" : "Stay hydrated to support respiratory mucosa"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
