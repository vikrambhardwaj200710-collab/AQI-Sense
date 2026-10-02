"use client";

import React, { useState } from "react";
import { Language } from "@/lib/types";
import { getTranslation } from "@/lib/i18n";
import { BookOpen, ChevronDown, ChevronUp, HelpCircle, Layers, Cpu, Wind } from "lucide-react";

interface EducationSectionProps {
  lang: Language;
}

export function EducationSection({ lang }: EducationSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isHi = lang === "hi";

  const faqs = [
    {
      qEn: "What is the Air Quality Index (AQI)?",
      qHi: "AQI (वायु गुणवत्ता सूचकांक) क्या है और यह कैसे काम करता है?",
      aEn: "The Air Quality Index is a standardized environmental metric that translates complex chemical and physical pollutant concentrations (in μg/m³) into an easy-to-understand numerical scale. By categorizing atmospheric pollution into color-coded bands—ranging from Good to Hazardous—it alerts individuals and public health bodies about real-time exposure risks.",
      aHi: "वायु गुणवत्ता सूचकांक एक मानकीकृत पैमाना है जो हवा में मौजूद विभिन्न रासायनिक और सूक्ष्म प्रदूषकों (μg/m³ में) को एक सरल संख्या में बदलता है। इसे रंग-कोडित श्रेणियों (अच्छा, मध्यम, अस्वस्थ, खतरनाक) में बांटा गया है ताकि आम लोग आसानी से अपने स्वास्थ्य जोखिम को समझ सकें।",
      icon: BookOpen,
    },
    {
      qEn: "How does U.S. EPA AQI differ from European EAQI?",
      qHi: "यू.एस. AQI और यूरोपीय EAQI में क्या अंतर है?",
      aEn: "The U.S. EPA AQI uses a 0 to 500 scale based on Clean Air Act standards, where 100 represents the national air quality safety standard. The European Air Quality Index (EAQI) operates on a 0 to 100+ scale divided into 5 or 6 bands (Very Good, Fair, Moderate, Poor, Very Poor, Extremely Poor), evaluating hourly concentrations according to European Union environmental directives. Neither should be confused with national standards like CPCB's Indian AQI.",
      aHi: "अमेरिकी EPA AQI 0 से 500 के पैमाने का उपयोग करता है, जहां 100 सुरक्षित वायु गुणवत्ता की सीमा है। वहीं यूरोपीय EAQI 0 से 100+ के पैमाने पर आधारित है जिसे 'बहुत अच्छा' से 'अत्यधिक खराब' के 6 स्तरों में विभाजित किया गया है। दोनों के गणना सूत्र और श्रेणियां अलग-अलग हैं।",
      icon: Layers,
    },
    {
      qEn: "Why is PM2.5 more dangerous to human health than PM10?",
      qHi: "PM2.5 कण PM10 की तुलना में मानव स्वास्थ्य के लिए अधिक खतरनाक क्यों हैं?",
      aEn: "PM10 particles (diameter up to 10 micrometers, like coarse road dust and pollen) are largely intercepted by the nasal passages and upper throat. In contrast, PM2.5 particles are microscopic (under 2.5 micrometers, roughly 1/30th the width of human hair). When inhaled, they bypass the upper respiratory defenses, travel deep into the lung alveoli, and penetrate directly into the capillary bloodstream, increasing systemic inflammation, stroke risk, and pulmonary disease.",
      aHi: "PM10 कण (10 माइक्रोमीटर तक, जैसे धूल और पराग) नाक और गले में ही रुक जाते हैं। इसके विपरीत, PM2.5 कण बाल के 30वें हिस्से जितने छोटे होते हैं। सांस लेने पर वे फेफड़ों की अंतिम कोशिकाओं (Alveoli) तक पहुंच जाते हैं और वहां से सीधे खून में मिलकर दिल का दौरा, स्ट्रोक और फेफड़ों के गंभीर रोगों का खतरा बढ़ाते हैं।",
      icon: Wind,
    },
    {
      qEn: "What is the difference between modeled atmospheric data and physical ground sensors?",
      qHi: "मॉडल किए गए वायुमंडलीय डेटा और ज़मीनी भौतिक सेंसर में क्या अंतर है?",
      aEn: "Physical street-level sensors (optical counters or beta-attenuation monitors) measure air at a single physical point. While precise at that exact spot, they are highly sensitive to micro-local interference (such as someone smoking or a truck idling nearby). Modeled data (like Open-Meteo's CAMS/ECMWF integration) synthesizes satellite observations, high-altitude meteorological soundings, emission inventories, and fluid atmospheric dynamics into a cohesive regional grid representation.",
      aHi: "ज़मीनी सेंसर केवल उसी खंभे या इमारत की हवा नापते हैं जहां वे लगे होते हैं, जो पास के ट्रैफिक या धुएं से अचानक बदल सकते हैं। जबकि ओपन-मेटियो का मॉडल डेटा उपग्रहों, मौसम के पूर्वानुमान, हवा के बहाव और क्षेत्रीय उत्सर्जन के आधार पर पूरे क्षेत्र की वायुमंडलीय स्थिति का व्यापक और सुसंगत सिमुलेशन प्रस्तुत करता है।",
      icon: Cpu,
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span>{getTranslation(lang, "educationTitle")}</span>
          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            Air Knowledge
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {getTranslation(lang, "educationSubtitle")}
        </p>
      </div>

      {/* Accordions */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;

          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                    {isHi ? faq.qHi : faq.qEn}
                  </span>
                </div>

                <div className="text-zinc-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium pl-14">
                  {isHi ? faq.aHi : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
