import { AQICategory, AQIStandard } from "./types";

export interface StandardScaleItem {
  min: number;
  max: number;
  labelEn: string;
  labelHi: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  descriptionEn: string;
  descriptionHi: string;
  generalAdviceEn: string;
  generalAdviceHi: string;
  sensitiveAdviceEn: string;
  sensitiveAdviceHi: string;
}

export const US_AQI_SCALE: StandardScaleItem[] = [
  {
    min: 0,
    max: 50,
    labelEn: "Good",
    labelHi: "अच्छा (Good)",
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    descriptionEn: "Air quality is satisfactory, and air pollution poses little or no risk.",
    descriptionHi: "वायु की गुणवत्ता संतोषजनक है, और प्रदूषण से कोई या बहुत कम जोखिम है।",
    generalAdviceEn: "Great day for outdoor activities, sports, and fresh ventilation.",
    generalAdviceHi: "बाहरी गतिविधियों, खेलों और ताज़ी हवा के लिए बेहतरीन दिन।",
    sensitiveAdviceEn: "No precautions needed. Enjoy your time outdoors.",
    sensitiveAdviceHi: "किसी सावधानी की आवश्यकता नहीं है। बाहर का आनंद लें।",
  },
  {
    min: 51,
    max: 100,
    labelEn: "Moderate",
    labelHi: "मध्यम (Moderate)",
    color: "#f59e0b",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-800",
    descriptionEn: "Air quality is acceptable; however, some pollutants may cause moderate health concern for a very small number of unusually sensitive people.",
    descriptionHi: "वायु गुणवत्ता स्वीकार्य है; हालांकि, असामान्य रूप से संवेदनशील लोगों को हल्की परेशानी हो सकती है।",
    generalAdviceEn: "Overall acceptable conditions for most people outdoors.",
    generalAdviceHi: "अधिकांश लोगों के लिए बाहर जाने हेतु सामान्य स्थिति।",
    sensitiveAdviceEn: "Unusually sensitive people should consider reducing prolonged heavy outdoor exertion.",
    sensitiveAdviceHi: "अति संवेदनशील व्यक्तियों को अत्यधिक शारीरिक परिश्रम सीमित करने पर विचार करना चाहिए।",
  },
  {
    min: 101,
    max: 150,
    labelEn: "Unhealthy for Sensitive Groups",
    labelHi: "संवेदनशील समूहों के लिए अस्वस्थ",
    color: "#f97316",
    bgColor: "bg-orange-50 dark:bg-orange-950/40",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-800",
    descriptionEn: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    descriptionHi: "संवेदनशील समूह (बुजुर्ग, बच्चे, सांस के मरीज) स्वास्थ्य संबंधी असर महसूस कर सकते हैं।",
    generalAdviceEn: "General public can still engage in outdoor activities but take occasional breaks.",
    generalAdviceHi: "सामान्य लोग बाहरी गतिविधियां कर सकते हैं, पर बीच-बीच में विराम लें।",
    sensitiveAdviceEn: "People with respiratory or heart disease, the elderly and children should cut back on prolonged outdoor exertion.",
    sensitiveAdviceHi: "दमा या हृदय रोगियों, बुजुर्गों और बच्चों को बाहर ज्यादा देर तक रहने से बचना चाहिए।",
  },
  {
    min: 151,
    max: 200,
    labelEn: "Unhealthy",
    labelHi: "अस्वस्थ (Unhealthy)",
    color: "#ef4444",
    bgColor: "bg-red-50 dark:bg-red-950/40",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-800",
    descriptionEn: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    descriptionHi: "आम लोगों को भी स्वास्थ्य समस्याएं महसूस हो सकती हैं; संवेदनशील लोगों पर गंभीर प्रभाव पड़ सकता है।",
    generalAdviceEn: "Wear an N95 mask outdoors, avoid high-intensity workouts outside, and keep windows closed.",
    generalAdviceHi: "बाहर जाते समय N95 मास्क पहनें, तेज दौड़ने से बचें और खिड़कियां बंद रखें।",
    sensitiveAdviceEn: "Avoid prolonged outdoor exertion; stay in well-ventilated indoor spaces with air purification.",
    sensitiveAdviceHi: "बाहर जाने से पूरी तरह बचें; एयर प्यूरीफायर वाले कमरों में रहें।",
  },
  {
    min: 201,
    max: 300,
    labelEn: "Very Unhealthy",
    labelHi: "बहुत अस्वस्थ (Very Unhealthy)",
    color: "#8b5cf6",
    bgColor: "bg-purple-50 dark:bg-purple-950/40",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-800",
    descriptionEn: "Health alert: The risk of health effects is increased for everyone.",
    descriptionHi: "स्वास्थ्य चेतावनी: सभी के लिए स्वास्थ्य संबंधी जोखिम काफी बढ़ गया है।",
    generalAdviceEn: "Avoid heavy outdoor activities. Close all windows and run indoor air purifiers.",
    generalAdviceHi: "बाहरी गतिविधियों से बचें। खिड़कियां बंद करें और एयर प्यूरीफायर चालू रखें।",
    sensitiveAdviceEn: "Remain indoors and keep activity levels low. Keep emergency inhalers or medications handy.",
    sensitiveAdviceHi: "पूरी तरह घर के अंदर रहें और शारीरिक गतिविधि कम रखें। दवाइयां पास रखें।",
  },
  {
    min: 301,
    max: 500,
    labelEn: "Hazardous",
    labelHi: "खतरनाक (Hazardous)",
    color: "#881337",
    bgColor: "bg-rose-100 dark:bg-rose-950/50",
    textColor: "text-rose-900 dark:text-rose-200",
    borderColor: "border-rose-400 dark:border-rose-800",
    descriptionEn: "Health warning of emergency conditions: everyone is more likely to be affected.",
    descriptionHi: "आपातकालीन स्वास्थ्य चेतावनी: हर व्यक्ति के स्वास्थ्य पर गंभीर असर पड़ने की प्रबल संभावना है।",
    generalAdviceEn: "Stay indoors. Seal doors and windows. Do not exercise outdoors. Use certified N95/FFP2 masks if stepping out is unavoidable.",
    generalAdviceHi: "घर के अंदर ही रहें। खिड़की-दरवाजे बंद रखें। बाहर व्यायाम न करें। अनिवार्य हो तभी N95 मास्क लगाकर निकलें।",
    sensitiveAdviceEn: "Strictly avoid all physical outdoor activity. Seek medical advice if breathing difficulties arise.",
    sensitiveAdviceHi: "किसी भी बाहरी गतिविधि से पूरी तरह बचें। सांस में दिक्कत होने पर तुरंत डॉक्टर से सलाह लें।",
  },
];

export const EUROPEAN_AQI_SCALE: StandardScaleItem[] = [
  {
    min: 0,
    max: 20,
    labelEn: "Very Good",
    labelHi: "बहुत अच्छा (Very Good)",
    color: "#06b6d4",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
    textColor: "text-cyan-700 dark:text-cyan-300",
    borderColor: "border-cyan-300 dark:border-cyan-800",
    descriptionEn: "Air quality is pristine according to European EAQI standards.",
    descriptionHi: "यूरोपीय EAQI मानकों के अनुसार हवा की गुणवत्ता बहुत उत्कृष्ट है।",
    generalAdviceEn: "Air quality is ideal for all outdoor activities and exercise.",
    generalAdviceHi: "हवा सभी बाहरी गतिविधियों और खेलकूद के लिए उत्तम है।",
    sensitiveAdviceEn: "Enjoy your normal outdoor activities freely.",
    sensitiveAdviceHi: "सामान्य रूप से खुली हवा का आनंद लें।",
  },
  {
    min: 20.1,
    max: 40,
    labelEn: "Fair",
    labelHi: "उचित (Fair)",
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    descriptionEn: "Air quality meets safe European environmental guidelines.",
    descriptionHi: "हवा की गुणवत्ता यूरोपीय पर्यावरण दिशानिर्देशों के सुरक्षित दायरे में है।",
    generalAdviceEn: "Conditions are favorable for outdoor recreation.",
    generalAdviceHi: "बाहरी मनोरंजन और घूमने के लिए अनुकूल परिस्थितियां हैं।",
    sensitiveAdviceEn: "No significant precautions required for most sensitive people.",
    sensitiveAdviceHi: "संवेदनशील लोगों के लिए भी कोई विशेष परहेज आवश्यक नहीं।",
  },
  {
    min: 40.1,
    max: 60,
    labelEn: "Moderate",
    labelHi: "मध्यम (Moderate)",
    color: "#f59e0b",
    bgColor: "bg-amber-50 dark:bg-amber-950/40",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-800",
    descriptionEn: "Moderate pollution levels present under European EAQI metrics.",
    descriptionHi: "यूरोपीय मानकों के तहत मध्यम स्तर का प्रदूषण मौजूद है।",
    generalAdviceEn: "Acceptable for healthy individuals; balance prolonged high-effort activity.",
    generalAdviceHi: "स्वस्थ व्यक्तियों के लिए स्वीकार्य; अत्यधिक मेहनत वाली गतिविधियों में संतुलन रखें।",
    sensitiveAdviceEn: "Individuals with existing respiratory sensitivities should watch for symptoms.",
    sensitiveAdviceHi: "सांस की संवेदनशीलता वाले लोग लक्षणों पर नजर रखें।",
  },
  {
    min: 60.1,
    max: 80,
    labelEn: "Poor",
    labelHi: "खराब (Poor)",
    color: "#f97316",
    bgColor: "bg-orange-50 dark:bg-orange-950/40",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-800",
    descriptionEn: "Air pollution may cause discomfort for vulnerable populations.",
    descriptionHi: "संवेदनशील वर्गों के लिए वायु प्रदूषण असुविधा पैदा कर सकता है।",
    generalAdviceEn: "Consider reducing intensive outdoor workouts, especially during peak traffic.",
    generalAdviceHi: "विशेष रूप से पीक आवर्स के दौरान भारी बाहरी वर्कआउट कम करें।",
    sensitiveAdviceEn: "Sensitive groups should limit extended time spent in busy, polluted outdoor areas.",
    sensitiveAdviceHi: "संवेदनशील लोगों को प्रदूषित बाहरी क्षेत्रों में समय सीमित करना चाहिए।",
  },
  {
    min: 80.1,
    max: 100,
    labelEn: "Very Poor",
    labelHi: "बहुत खराब (Very Poor)",
    color: "#ef4444",
    bgColor: "bg-red-50 dark:bg-red-950/40",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-800",
    descriptionEn: "High pollutant concentrations with widespread potential health effects.",
    descriptionHi: "हवा में उच्च प्रदूषण स्तर, जिससे अधिकांश लोगों के स्वास्थ्य पर असर पड़ सकता है।",
    generalAdviceEn: "Minimize outdoor activity, close windows, and consider wearing protective filtration masks.",
    generalAdviceHi: "बाहरी गतिविधियों को न्यूनतम करें, खिड़कियां बंद करें और मास्क का उपयोग करें।",
    sensitiveAdviceEn: "Avoid outdoor exertion and stay in purified indoor environments.",
    sensitiveAdviceHi: "बाहर जाने से बचें और शुद्ध इनडोर वातावरण में रहें।",
  },
  {
    min: 100.1,
    max: 500,
    labelEn: "Extremely Poor",
    labelHi: "अत्यधिक खराब (Extremely Poor)",
    color: "#7f1d1d",
    bgColor: "bg-rose-100 dark:bg-rose-950/60",
    textColor: "text-rose-950 dark:text-rose-100",
    borderColor: "border-rose-400 dark:border-rose-800",
    descriptionEn: "Severe air quality degradation exceeding European upper safety thresholds.",
    descriptionHi: "यूरोपीय ऊपरी सुरक्षा सीमाओं से कहीं अधिक गंभीर वायु गुणवत्ता गिरावट।",
    generalAdviceEn: "Avoid all non-essential outdoor travel. Keep indoor air filtered and sealed.",
    generalAdviceHi: "गैर-जरूरी बाहरी आवागमन से बचें। इनडोर हवा को फ़िल्टर और बंद रखें।",
    sensitiveAdviceEn: "Strictly avoid any outdoor exposure. Seek medical attention if distress occurs.",
    sensitiveAdviceHi: "बाहर निकलने से पूरी तरह परहेज करें। तकलीफ होने पर तुरंत चिकित्सीय सहायता लें।",
  },
];

export function getAQICategory(
  value: number | null | undefined,
  standard: AQIStandard = "us",
  lang: "en" | "hi" = "en"
): AQICategory {
  const val = typeof value === "number" && !isNaN(value) ? Math.max(0, Math.round(value)) : 0;
  const scale = standard === "us" ? US_AQI_SCALE : EUROPEAN_AQI_SCALE;

  let matched = scale[0];
  for (let i = 0; i < scale.length; i++) {
    const item = scale[i];
    if (val >= item.min && (val <= item.max || i === scale.length - 1)) {
      matched = item;
      break;
    }
  }

  const isHindi = lang === "hi";
  return {
    index: scale.indexOf(matched),
    label: isHindi ? matched.labelHi : matched.labelEn,
    rangeText: `${matched.min} - ${matched.max}`,
    min: matched.min,
    max: matched.max,
    color: matched.color,
    bgColor: matched.bgColor,
    textColor: matched.textColor,
    borderColor: matched.borderColor,
    description: isHindi ? matched.descriptionHi : matched.descriptionEn,
    generalAdvice: isHindi ? matched.generalAdviceHi : matched.generalAdviceEn,
    sensitiveAdvice: isHindi ? matched.sensitiveAdviceHi : matched.sensitiveAdviceEn,
  };
}

export function getPollutantCategory(
  code: string,
  value: number
): {
  status: "good" | "moderate" | "poor" | "unhealthy" | "hazardous";
  labelEn: string;
  labelHi: string;
  color: string;
} {
  const v = Math.max(0, value);

  switch (code) {
    case "pm2_5":
      if (v <= 12) return { status: "good", labelEn: "Good", labelHi: "अच्छा", color: "#10b981" };
      if (v <= 35.4) return { status: "moderate", labelEn: "Moderate", labelHi: "मध्यम", color: "#f59e0b" };
      if (v <= 55.4) return { status: "poor", labelEn: "Sensitive", labelHi: "संवेदनशील", color: "#f97316" };
      if (v <= 150.4) return { status: "unhealthy", labelEn: "Unhealthy", labelHi: "अस्वस्थ", color: "#ef4444" };
      return { status: "hazardous", labelEn: "Hazardous", labelHi: "खतरनाक", color: "#881337" };

    case "pm10":
      if (v <= 54) return { status: "good", labelEn: "Good", labelHi: "अच्छा", color: "#10b981" };
      if (v <= 154) return { status: "moderate", labelEn: "Moderate", labelHi: "मध्यम", color: "#f59e0b" };
      if (v <= 254) return { status: "poor", labelEn: "Sensitive", labelHi: "संवेदनशील", color: "#f97316" };
      if (v <= 354) return { status: "unhealthy", labelEn: "Unhealthy", labelHi: "अस्वस्थ", color: "#ef4444" };
      return { status: "hazardous", labelEn: "Hazardous", labelHi: "खतरनाक", color: "#881337" };

    case "o3":
      if (v <= 100) return { status: "good", labelEn: "Good", labelHi: "अच्छा", color: "#10b981" };
      if (v <= 160) return { status: "moderate", labelEn: "Moderate", labelHi: "मध्यम", color: "#f59e0b" };
      if (v <= 215) return { status: "poor", labelEn: "Sensitive", labelHi: "संवेदनशील", color: "#f97316" };
      return { status: "unhealthy", labelEn: "Unhealthy", labelHi: "अस्वस्थ", color: "#ef4444" };

    case "no2":
      if (v <= 40) return { status: "good", labelEn: "Good", labelHi: "अच्छा", color: "#10b981" };
      if (v <= 90) return { status: "moderate", labelEn: "Moderate", labelHi: "मध्यम", color: "#f59e0b" };
      if (v <= 120) return { status: "poor", labelEn: "Sensitive", labelHi: "संवेदनशील", color: "#f97316" };
      return { status: "unhealthy", labelEn: "Unhealthy", labelHi: "अस्वस्थ", color: "#ef4444" };

    case "so2":
      if (v <= 20) return { status: "good", labelEn: "Good", labelHi: "अच्छा", color: "#10b981" };
      if (v <= 80) return { status: "moderate", labelEn: "Moderate", labelHi: "मध्यम", color: "#f59e0b" };
      if (v <= 250) return { status: "poor", labelEn: "Sensitive", labelHi: "संवेदनशील", color: "#f97316" };
      return { status: "unhealthy", labelEn: "Unhealthy", labelHi: "अस्वस्थ", color: "#ef4444" };

    case "co":
      if (v <= 4400) return { status: "good", labelEn: "Good", labelHi: "अच्छा", color: "#10b981" };
      if (v <= 9400) return { status: "moderate", labelEn: "Moderate", labelHi: "मध्यम", color: "#f59e0b" };
      if (v <= 12400) return { status: "poor", labelEn: "Sensitive", labelHi: "संवेदनशील", color: "#f97316" };
      return { status: "unhealthy", labelEn: "Unhealthy", labelHi: "अस्वस्थ", color: "#ef4444" };

    default:
      return { status: "good", labelEn: "Normal", labelHi: "सामान्य", color: "#10b981" };
  }
}
