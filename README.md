# 🛡️ AQI Sense

> **Real-Time Environmental Intelligence & Atmospheric Sensing Platform**

AQI Sense is a modern, production-grade web application engineered to deliver actionable atmospheric data and personalized health intelligence. Powered by the **Open-Meteo Regional Atmospheric & Weather APIs** and **Advanced Atmospheric AI**, AQI Sense translates complex chemical and aerosol concentrations into intuitive, diurnal narratives and preventive guidance.

Built cleanly with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and **Tailwind CSS**, this repository is self-contained, easily editable in VS Code, and ready for instant deployment to Vercel.

---

## 🌟 Key Features

1. **Original Brand & Visual Architecture**:
   - Original custom SVG vector logo representing atmospheric sensing waves and real-time environmental radar.
   - Clean, rounded environmental technology UI with dark/light/system theme persistence.
   - Fully responsive across mobile, tablet, and desktop viewports.

2. **Accurate Atmospheric Standards**:
   - **U.S. EPA AQI (0–500 Scale)**: Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous.
   - **India National AQI - CPCB (0–500 Scale)**: Good (0-50), Satisfactory (51-100), Moderate (101-200), Poor (201-300), Very Poor (301-400), Severe (401-500) computed using official Central Pollution Control Board sub-index algorithms.
   - **European EAQI (0–100+ Scale)**: Very Good, Fair, Moderate, Poor, Very Poor, Extremely Poor.
   - Transparent disclaimer noting that data represents regional numerical atmospheric modeling from Open-Meteo.

3. **Horizontal Car Speedometer Gauge**:
   - Authentic automotive-style horizontal speedometer dial cluster.
   - Left-to-right sweep across a wide horizontal arc with major and minor speed tick marks.
   - Dynamic illuminated sports-car needle and central digital readout with the active standard indicator (`US EPA AQI`, `INDIA NAQI (CPCB)`, `EUROPEAN EAQI`) clearly shown in the center.

4. **Structured Application Layout**:
   1. **Current Air Quality & Car Speedometer Dial** with active severity scale legend.
   2. **AI Air Insight**: Multi-point atmospheric intelligence synthesis.
   3. **Pollutants in the Air**: Real-time concentrations of PM2.5, PM10, O₃, NO₂, SO₂, and CO with sparkline trends and expandable scientific guide.
   4. **Weather & Meteorology**: Temperature, feels-like, humidity, wind compass, and atmospheric correlation analysis.
   5. **Air Quality Story**: Diurnal cycle tracking (Morning → Afternoon → Evening → Night) based on actual hourly API data.
   6. **Best Modeled Window Finder**: 48-hour forward scanner identifying the optimal 3-hour outdoor exercise/walking window.
   7. **AQI Timeline**: Interactive Recharts historical area chart with 24h, 3d, and 7d filters.
   8. **AQI Forecast**: 72-hour future bar chart with tier color-coding and peak stagnation alerts.
   9. **Preventive Measures & Health Guidelines**: Tailored precautions for sensitive groups and general public.
   10. **AQI and Air Quality Guidance**: Educational guide on particulate metrics, standards comparison, and atmospheric modeling.

5. **Intelligent Location Search & Geolocation**:
   - Powered by Open-Meteo Geocoding API with 300ms debounce.
   - Full keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
   - "Use My Location" instant browser GPS detection.
   - LocalStorage-backed recent searches chips with one-click re-selection and deletion.

6. **Bilingual Localization (English & हिन्दी)**:
   - Complete dual-language switch in top navigation.
   - All metrics, descriptions, guidance, stories, and AI prompts adapt seamlessly.

7. **City-to-City Comparison**:
   - Side-by-side comparison modal querying live API data for any two cities globally with an automatic percentage comparison verdict.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Data APIs**: [Open-Meteo](https://open-meteo.com/) (Geocoding, Air Quality, and Weather)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.17.0 or newer
- **npm** or **yarn** or **pnpm**

### 2. Installation
```bash
# Clone or navigate to the project directory
cd aqi-guardian

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 📜 Legal & Scientific Disclaimer

AQI Sense displays atmospheric simulation data provided by Open-Meteo regional grids and chemical transport models. It is intended for informational and personal planning purposes only. It does not replace regulatory ground monitoring or professional medical advice.
