import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  location: {
    name: string;
    country?: string;
    admin1?: string;
    latitude: number;
    longitude: number;
  };
  aqi: number;
  standard: "us" | "european" | "india";
  categoryLabel: string;
  pollutants: {
    pm2_5?: number | null;
    pm10?: number | null;
    o3?: number | null;
    no2?: number | null;
    so2?: number | null;
    co?: number | null;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    condition: string;
  };
  trend24h: string;
  language: "en" | "hi";
}

function generateFallbackInsight(body: RequestBody) {
  const isHi = body.language === "hi";
  const standardName =
    body.standard === "india"
      ? "India National AQI (CPCB)"
      : body.standard === "us"
      ? "U.S. EPA AQI"
      : "European EAQI";
  const { aqi, categoryLabel, location, pollutants, weather, trend24h } = body;

  let concernTextEn = "Fine particulate matter (PM2.5) is the primary driver of ambient air pollution.";
  let concernTextHi = "अति सूक्ष्म कण (PM2.5) वर्तमान में वायु प्रदूषण का मुख्य कारण हैं।";

  if ((pollutants.o3 ?? 0) > 100 && (pollutants.o3 ?? 0) > (pollutants.pm2_5 ?? 0) * 1.5) {
    concernTextEn = "Photochemical ozone (O₃) concentrations are elevated, likely accentuated by strong sunlight.";
    concernTextHi = "ज़मीनी ओजोन (O₃) का स्तर बढ़ा हुआ है, जो धूप और रासायनिक प्रतिक्रियाओं से बढ़ सकता है।";
  } else if ((pollutants.pm10 ?? 0) > 150 && (pollutants.pm10 ?? 0) > (pollutants.pm2_5 ?? 0) * 2.5) {
    concernTextEn = "Coarse airborne dust (PM10) is elevated, reflecting surface wind agitation or regional dust transport.";
    concernTextHi = "धूल और मोटे कण (PM10) बढ़े हुए हैं, जो सतह की हवाओं या धूल भरी परिस्थितियों का संकेत देते हैं।";
  } else if ((pollutants.no2 ?? 0) > 80) {
    concernTextEn = "Combustion byproduct NO₂ is notable, indicating heavy traffic density or local industrial activity.";
    concernTextHi = "नाइट्रोजन डाइऑक्साइड (NO₂) की मात्रा अधिक है, जो वाहनों के धुएं या औद्योगिक गतिविधियों से जुड़ी है।";
  }

  let actionEn = "";
  let actionHi = "";
  let activityEn = "";
  let activityHi = "";

  if (aqi <= 50) {
    actionEn = "Ventilate indoor spaces freely and take full advantage of clean outdoor conditions.";
    actionHi = "घर के अंदर ताज़ी हवा आने दें और स्वच्छ बाहरी वातावरण का पूरा लाभ उठाएं।";
    activityEn = "Ideal for all outdoor activities, endurance sports, children's play, and cycling.";
    activityHi = "सभी बाहरी गतिविधियों, दौड़ने, बच्चों के खेल और साइकिल चलाने के लिए आदर्श समय।";
  } else if (aqi <= 100) {
    actionEn = "Conditions are acceptable for the vast majority. Sensitive individuals should monitor respiratory comfort.";
    actionHi = "अधिकांश लोगों के लिए स्थिति सुरक्षित है। सांस के अति संवेदनशील मरीज अपने आराम का ध्यान रखें।";
    activityEn = "Suitable for outdoor exercise. Sensitive groups may consider taking intermittent rests during strenuous activities.";
    activityHi = "बाहरी कसरत के लिए उपयुक्त। संवेदनशील लोग भारी व्यायाम के दौरान बीच-बीच में विराम लें।";
  } else if (aqi <= 150) {
    actionEn = "Sensitive groups should reduce prolonged outdoor exertion. Consider closing windows during peak traffic hours.";
    actionHi = "संवेदनशील वर्ग बाहर अधिक समय बिताने से बचें। पीक ट्रैफिक के समय खिड़कियां बंद रखें।";
    activityEn = "Healthy adults can exercise outdoors but consider moderating duration. Children and elderly should limit intense outdoor games.";
    activityHi = "स्वस्थ वयस्क बाहर जा सकते हैं पर समय सीमित करें। बच्चों और बुजुर्गों को भारी खेलकूद से बचना चाहिए।";
  } else if (aqi <= 200) {
    actionEn = "Wear a well-fitted N95 mask when stepping outside. Run indoor HEPA air purifiers and seal gaps in windows.";
    actionHi = "बाहर जाते समय N95 मास्क अवश्य पहनें। इनडोर एयर प्यूरीफायर चलाएं और खिड़कियां बंद रखें।";
    activityEn = "Avoid prolonged or strenuous outdoor activities. Shift workouts indoors to clean, filtered environments.";
    activityHi = "बाहरी व्यायाम से बचें। अपने वर्कआउट को घर के अंदर स्वच्छ हवा में स्थानांतरित करें।";
  } else {
    actionEn = "Strict health warning: Minimize all outdoor exposure. Keep indoor air sealed with active mechanical filtration. Stay hydrated.";
    actionHi = "गंभीर चेतावनी: बाहर निकलने से बचें। घर के अंदर हवा को फ़िल्टर रखें और पर्याप्त पानी पिएं।";
    activityEn = "All outdoor physical exercise should be suspended. Sensitive groups should strictly remain indoors.";
    activityHi = "सभी बाहरी खेल और व्यायाम तत्काल स्थगित करें। संवेदनशील लोग पूरी तरह घर में रहें।";
  }

  const currentSituation = isHi
    ? `${location.name} में वर्तमान वायु गुणवत्ता ${categoryLabel} श्रेणी में है (दर्ज सूचकांक: ${aqi}, ${standardName})। तापमान ${weather.temperature}°C और आर्द्रता ${weather.humidity}% के साथ हवा ${weather.windSpeed} किमी/घंटा की गति से बह रही है।`
    : `In ${location.name}, current modeled air quality is classified as ${categoryLabel} with an index of ${aqi} under the ${standardName}. Current meteorological conditions register ${weather.temperature}°C with ${weather.humidity}% humidity and wind speeds of ${weather.windSpeed} km/h (${weather.windDirection}).`;

  const trend = isHi
    ? `पिछले 24 घंटों का रुझान ${trend24h} दर्शाता है। स्थानीय हवा की गति (${weather.windSpeed} किमी/घंटा) प्रदूषण कणों के फैलाव में महत्वपूर्ण भूमिका निभा रही है।`
    : `The 24-hour atmospheric trend is currently ${trend24h}. Current wind patterns (${weather.windSpeed} km/h) are actively moderating boundary-layer particle dispersion.`;

  const summary = isHi
    ? `${location.name} में वायु गुणवत्ता पर निरंतर नज़र रखें। विशेष रूप से संवेदनशील समूह आवश्यक सावधानियां बरतें।`
    : `Overall atmospheric conditions in ${location.name} require contextual awareness. Maintain recommended precautions suited to the ${categoryLabel} tier.`;

  return {
    currentSituation,
    mainPollutionConcern: isHi ? concernTextHi : concernTextEn,
    trend,
    whatYouCanDo: isHi ? actionHi : actionEn,
    outdoorActivityGuidance: isHi ? activityHi : activityEn,
    summary,
    isFallback: true,
  };
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_actual_gemini_api_key_here") {
    return NextResponse.json(generateFallbackInsight(body));
  }

  const { location, aqi, standard, categoryLabel, pollutants, weather, trend24h, language } = body;
  const isHi = language === "hi";

  const standardFormatted =
    standard === "india"
      ? "India National AQI - CPCB (0-500 scale)"
      : standard === "us"
      ? "U.S. EPA AQI (0-500 scale)"
      : "European EAQI (0-100+ scale)";

  const promptText = `
You are the atmospheric analysis intelligence for AQI Sense, an advanced environmental intelligence platform.
Analyze the following real modeled air-quality and meteorological data for:
Location: ${location.name}, ${location.admin1 || ""} ${location.country || ""} (Lat: ${location.latitude}, Lon: ${location.longitude})
AQI Value: ${aqi}
AQI Standard: ${standardFormatted}
Current Category: ${categoryLabel}
Pollutant Concentrations:
- PM2.5: ${pollutants.pm2_5 ?? "N/A"} μg/m³
- PM10: ${pollutants.pm10 ?? "N/A"} μg/m³
- Ozone (O3): ${pollutants.o3 ?? "N/A"} μg/m³
- Nitrogen Dioxide (NO2): ${pollutants.no2 ?? "N/A"} μg/m³
- Sulphur Dioxide (SO2): ${pollutants.so2 ?? "N/A"} μg/m³
- Carbon Monoxide (CO): ${pollutants.co ?? "N/A"} μg/m³
Weather Conditions:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} km/h
- Wind Direction: ${weather.windDirection}
- Condition: ${weather.condition}
24-Hour Trend: ${trend24h}

CRITICAL RULES:
1. Language requirement: Respond entirely in ${isHi ? "Hindi (हिन्दी) in formal, clear Devanagari" : "English"}. Keep numbers, chemical formulas (PM2.5, NO2, etc.), and units (μg/m³, °C, km/h) legible.
2. DO NOT diagnose diseases or prescribe medical treatments or prescription drugs.
3. DO NOT claim the data is from an exact physical street sensor; explicitly recognize it is regional modeled atmospheric data.
4. DO NOT invent or contradict the supplied values.
5. Provide a valid JSON response with EXACTLY the following six keys:
   - "currentSituation": A 2-3 sentence overview explaining what the current AQI value and category mean in this location with weather context.
   - "mainPollutionConcern": Identify the most concerning pollutant from the numbers provided and explain why based on the data.
   - "trend": Analysis of whether conditions appear to be improving, worsening, or stable based on the trend and wind/weather.
   - "whatYouCanDo": 2-3 practical, non-diagnostic protective actions (e.g. masks, air purifiers, ventilation, closing windows).
   - "outdoorActivityGuidance": Clear recommendations for outdoor exercise, running, sensitive groups, and children.
   - "summary": A crisp 1-2 sentence executive takeaway.

Return ONLY the raw JSON object, without markdown backticks or commentary.
`;

  // Robust model waterfall: try available flash models
  const candidateModels = ["gemini-flash-lite-latest", "gemini-3.5-flash", "gemini-3.8-flash"];

  for (const model of candidateModels) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const apiRes = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      });

      if (apiRes.ok) {
        const apiData = await apiRes.json();
        const rawCandidate = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawCandidate) {
          const cleanJson = rawCandidate.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          return NextResponse.json({
            currentSituation: parsed.currentSituation || "",
            mainPollutionConcern: parsed.mainPollutionConcern || "",
            trend: parsed.trend || "",
            whatYouCanDo: parsed.whatYouCanDo || "",
            outdoorActivityGuidance: parsed.outdoorActivityGuidance || "",
            summary: parsed.summary || "",
            isFallback: false,
          });
        }
      } else {
        console.warn(`Model ${model} returned HTTP ${apiRes.status}`);
      }
    } catch (e: any) {
      console.warn(`Model ${model} execution error:`, e.message);
    }
  }

  // Graceful fallback if all models are busy/rate-limited
  return NextResponse.json(generateFallbackInsight(body));
}
