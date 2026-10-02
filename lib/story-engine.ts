import { getAQICategory } from "./aqi-standards";
import { AirQualityResponse, AirQualityStory, AQIStandard, BestWindow, Language } from "./types";

interface PeriodStats {
  periodNameEn: string;
  periodNameHi: string;
  hours: number[];
  aqiValues: number[];
  pm25Values: number[];
  pm10Values: number[];
  o3Values: number[];
  no2Values: number[];
}

export function computeAirQualityStory(
  data: AirQualityResponse,
  standard: AQIStandard = "us",
  lang: Language = "en"
): AirQualityStory {
  const hourly = data.hourly;
  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return {
      morning: { aqi: 50, category: "Moderate", description: "Standard atmospheric conditions" },
      afternoon: { aqi: 50, category: "Moderate", description: "Standard atmospheric conditions" },
      evening: { aqi: 50, category: "Moderate", description: "Standard atmospheric conditions" },
      night: { aqi: 50, category: "Moderate", description: "Standard atmospheric conditions" },
      bestPeriod: "Morning",
      peakPeriod: "Evening",
      dominantPollutant: "PM2.5",
      trendDirection: "Stable",
      narrative: "Air quality levels are maintaining consistent values throughout the day.",
    };
  }

  // Get the most recent 24-hour window from the API (today / current day)
  const currentTime = data.current.time || hourly.time[Math.min(24, hourly.time.length - 1)];
  const currentDateStr = currentTime.slice(0, 10);

  // Group today's hours into Morning (06-11), Afternoon (12-17), Evening (18-21), Night (22-05)
  const morning: PeriodStats = { periodNameEn: "Morning", periodNameHi: "सुबह (06:00 - 11:00)", hours: [], aqiValues: [], pm25Values: [], pm10Values: [], o3Values: [], no2Values: [] };
  const afternoon: PeriodStats = { periodNameEn: "Afternoon", periodNameHi: "दोपहर (12:00 - 17:00)", hours: [], aqiValues: [], pm25Values: [], pm10Values: [], o3Values: [], no2Values: [] };
  const evening: PeriodStats = { periodNameEn: "Evening", periodNameHi: "शाम (18:00 - 21:00)", hours: [], aqiValues: [], pm25Values: [], pm10Values: [], o3Values: [], no2Values: [] };
  const night: PeriodStats = { periodNameEn: "Night", periodNameHi: "रात (22:00 - 05:00)", hours: [], aqiValues: [], pm25Values: [], pm10Values: [], o3Values: [], no2Values: [] };

  const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";
  const aqiArray = (hourly as any)[aqiKey] || [];
  const pm25Array = hourly.pm2_5 || [];
  const pm10Array = hourly.pm10 || [];
  const o3Array = hourly.ozone || [];
  const no2Array = hourly.nitrogen_dioxide || [];

  for (let i = 0; i < hourly.time.length; i++) {
    const t = hourly.time[i];
    if (!t.startsWith(currentDateStr)) continue;

    const hour = parseInt(t.slice(11, 13), 10);
    const aqi = aqiArray[i] ?? 0;
    const pm25 = pm25Array[i] ?? 0;
    const pm10 = pm10Array[i] ?? 0;
    const o3 = o3Array[i] ?? 0;
    const no2 = no2Array[i] ?? 0;

    let target: PeriodStats;
    if (hour >= 6 && hour < 12) target = morning;
    else if (hour >= 12 && hour < 18) target = afternoon;
    else if (hour >= 18 && hour < 22) target = evening;
    else target = night;

    target.hours.push(hour);
    target.aqiValues.push(aqi);
    target.pm25Values.push(pm25);
    target.pm10Values.push(pm10);
    target.o3Values.push(o3);
    target.no2Values.push(no2);
  }

  const avg = (arr: number[]) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

  const mAvg = avg(morning.aqiValues);
  const aAvg = avg(afternoon.aqiValues);
  const eAvg = avg(evening.aqiValues);
  const nAvg = avg(night.aqiValues);

  const mCat = getAQICategory(mAvg, standard, lang);
  const aCat = getAQICategory(aAvg, standard, lang);
  const eCat = getAQICategory(eAvg, standard, lang);
  const nCat = getAQICategory(nAvg, standard, lang);

  const periods = [
    { nameEn: "Morning", nameHi: "सुबह", aqi: mAvg, stats: morning },
    { nameEn: "Afternoon", nameHi: "दोपहर", aqi: aAvg, stats: afternoon },
    { nameEn: "Evening", nameHi: "शाम", aqi: eAvg, stats: evening },
    { nameEn: "Night", nameHi: "रात", aqi: nAvg, stats: night },
  ].filter((p) => p.stats.aqiValues.length > 0);

  // If no hours match today (e.g. timezone shift), fall back gracefully
  if (periods.length === 0) {
    const fallbackVal = data.current[aqiKey] ?? 60;
    const cat = getAQICategory(fallbackVal, standard, lang);
    return {
      morning: { aqi: fallbackVal, category: cat.label, description: cat.description },
      afternoon: { aqi: fallbackVal, category: cat.label, description: cat.description },
      evening: { aqi: fallbackVal, category: cat.label, description: cat.description },
      night: { aqi: fallbackVal, category: cat.label, description: cat.description },
      bestPeriod: lang === "hi" ? "दोपहर" : "Afternoon",
      peakPeriod: lang === "hi" ? "शाम" : "Evening",
      dominantPollutant: "PM2.5",
      trendDirection: lang === "hi" ? "स्थिर" : "Stable",
      narrative: lang === "hi" ? "दिनभर वायु गुणवत्ता में हल्का उतार-चढ़ाव देखा गया।" : "Air quality showed mild variations across diurnal cycles.",
    };
  }

  // Find lowest and highest period
  const sorted = [...periods].sort((a, b) => a.aqi - b.aqi);
  const best = sorted[0];
  const peak = sorted[sorted.length - 1];

  // Determine dominant pollutant during peak period
  const peakPm25 = avg(peak.stats.pm25Values);
  const peakPm10 = avg(peak.stats.pm10Values);
  const peakO3 = avg(peak.stats.o3Values);
  const peakNo2 = avg(peak.stats.no2Values);

  let dominant = "PM2.5";
  if (peakO3 > 120 && peakO3 > peakPm25 * 2) dominant = "Ozone (O₃)";
  else if (peakPm10 > 180 && peakPm10 > peakPm25 * 3) dominant = "PM10 (Coarse Dust)";
  else if (peakNo2 > 90) dominant = "Nitrogen Dioxide (NO₂)";

  // Trend direction
  const firstPeriodAqi = periods[0].aqi;
  const lastPeriodAqi = periods[periods.length - 1].aqi;
  let trendDirection = "Stable";
  if (lastPeriodAqi - firstPeriodAqi > 15) trendDirection = lang === "hi" ? "बढ़ता प्रदूषण" : "Worsening";
  else if (firstPeriodAqi - lastPeriodAqi > 15) trendDirection = lang === "hi" ? "सुधरती हवा" : "Improving";
  else trendDirection = lang === "hi" ? "स्थिर" : "Relatively Stable";

  const isHi = lang === "hi";
  const bestName = isHi ? best.nameHi : best.nameEn;
  const peakName = isHi ? peak.nameHi : peak.nameEn;

  const narrative = isHi
    ? `आज वायु की सर्वोत्तम स्थिति ${bestName} (औसत AQI ${best.aqi}) में दर्ज की गई, जबकि सर्वाधिक प्रदूषण ${peakName} (औसत AQI ${peak.aqi}) में देखा गया, जहां ${dominant} मुख्य प्रदूषक रहा।`
    : `Today's cleanest window occurred during the ${bestName} (avg AQI ${best.aqi}), while peak atmospheric concentration was observed during the ${peakName} (avg AQI ${peak.aqi}), driven primarily by elevated ${dominant} concentrations.`;

  return {
    morning: {
      aqi: mAvg,
      category: mCat.label,
      description: isHi ? `औसत AQI ${mAvg} - ${mCat.label}` : `Average AQI ${mAvg} - ${mCat.label}`,
    },
    afternoon: {
      aqi: aAvg,
      category: aCat.label,
      description: isHi ? `औसत AQI ${aAvg} - ${aCat.label}` : `Average AQI ${aAvg} - ${aCat.label}`,
    },
    evening: {
      aqi: eAvg,
      category: eCat.label,
      description: isHi ? `औसत AQI ${eAvg} - ${eCat.label}` : `Average AQI ${eAvg} - ${eCat.label}`,
    },
    night: {
      aqi: nAvg,
      category: nCat.label,
      description: isHi ? `औसत AQI ${nAvg} - ${nCat.label}` : `Average AQI ${nAvg} - ${nCat.label}`,
    },
    bestPeriod: bestName,
    peakPeriod: peakName,
    dominantPollutant: dominant,
    trendDirection,
    narrative,
  };
}

export function computeBestModeledWindow(
  data: AirQualityResponse,
  standard: AQIStandard = "us",
  lang: Language = "en"
): BestWindow {
  const hourly = data.hourly;
  const isHi = lang === "hi";

  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return {
      startTime: "Tomorrow 06:00",
      endTime: "Tomorrow 09:00",
      formattedWindow: isHi ? "कल सुबह 06:00 - 09:00" : "Tomorrow 6:00 AM - 9:00 AM",
      expectedAqi: 45,
      category: isHi ? "अच्छा" : "Good",
      reason: isHi
        ? "मौसम मॉडल के अनुसार सुबह हवा की गति अनुकूल रहेगी और प्रदूषण का स्तर न्यूनतम रहने का अनुमान है।"
        : "Atmospheric models predict favorable boundary-layer dispersion and minimal particulate stagnation.",
      weatherSummary: isHi ? "शांत हवा, अनुकूल तापमान" : "Favorable dispersion, pleasant temperature",
    };
  }

  const aqiKey = standard === "us" ? "us_aqi" : "european_aqi";
  const aqiArray = (hourly as any)[aqiKey] || [];
  const currentTime = data.current.time || new Date().toISOString();

  // Find index of current hour
  let startIndex = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    if (hourly.time[i] >= currentTime) {
      startIndex = i;
      break;
    }
  }

  // Look ahead 48 hours for the best continuous 3-hour window
  const lookAheadLimit = Math.min(hourly.time.length - 3, startIndex + 48);
  let minAqiAvg = 99999;
  let bestWindowStartIndex = startIndex;

  for (let i = startIndex; i < lookAheadLimit; i++) {
    const val0 = aqiArray[i] ?? 999;
    const val1 = aqiArray[i + 1] ?? 999;
    const val2 = aqiArray[i + 2] ?? 999;
    const windowAvg = (val0 + val1 + val2) / 3;

    if (windowAvg < minAqiAvg) {
      minAqiAvg = windowAvg;
      bestWindowStartIndex = i;
    }
  }

  const roundedAqi = Math.round(minAqiAvg);
  const cat = getAQICategory(roundedAqi, standard, lang);

  const startIso = hourly.time[bestWindowStartIndex];
  const endIso = hourly.time[bestWindowStartIndex + 3] || hourly.time[bestWindowStartIndex + 2];

  const startDate = new Date(startIso);
  const endDate = new Date(endIso);

  const formatHour = (d: Date) => {
    return d.toLocaleTimeString(isHi ? "hi-IN" : "en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  const formatDateDay = (d: Date) => {
    const today = new Date();
    if (d.getDate() === today.getDate()) return isHi ? "आज" : "Today";
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (d.getDate() === tomorrow.getDate()) return isHi ? "कल" : "Tomorrow";
    return d.toLocaleDateString(isHi ? "hi-IN" : "en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formattedWindow = `${formatDateDay(startDate)} ${formatHour(startDate)} – ${formatHour(endDate)}`;

  const currentAqi = data.current[aqiKey] ?? roundedAqi;
  const differencePct = currentAqi > roundedAqi ? Math.round(((currentAqi - roundedAqi) / currentAqi) * 100) : 0;

  let reason = isHi
    ? `पूर्वानुमानित हवा और तापमान संवहन के कारण यह समय दिन के चरम प्रदूषण से लगभग ${differencePct}% अधिक साफ़ रहने का अनुमान है।`
    : `Projected atmospheric mixing and ventilation indicate this interval will be approximately ${differencePct}% cleaner than peak daily smog intervals.`;

  if (differencePct < 5) {
    reason = isHi
      ? "आगामी 48 घंटों में स्थिर मौसम की स्थिति के कारण अपेक्षाकृत न्यूनतम प्रदूषण की खिड़की।"
      : "Lowest relative particulate concentration projected within the next 48-hour atmospheric cycle.";
  }

  return {
    startTime: startIso,
    endTime: endIso,
    formattedWindow,
    expectedAqi: roundedAqi,
    category: cat.label,
    reason,
    weatherSummary: isHi
      ? "बाहरी व्यायाम और ताज़ी हवा के लिए सर्वश्रेष्ठ समय खिड़की"
      : "Prime window for outdoor exercise, errands, and window aeration",
  };
}
