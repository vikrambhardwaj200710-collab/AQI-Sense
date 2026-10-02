# 🛡️ AQI Guardian

> **Real-Time Environmental Intelligence & Air Defense Web Application**

AQI Guardian is a modern, production-grade web application engineered to deliver actionable atmospheric data and personalized health intelligence. Powered by the **Open-Meteo Regional Atmospheric & Weather APIs** and **Google Gemini AI**, AQI Guardian translates complex chemical and aerosol concentrations into intuitive, diurnal narratives and preventive guidance.

Built cleanly with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and **Tailwind CSS**, this repository is self-contained, easily editable in VS Code, and ready for instant deployment to Vercel.

---

## 🌟 Key Features

1. **Original Brand & Visual Architecture**:
   - Original custom SVG vector logo representing atmospheric protection and clean airflow.
   - Clean, rounded environmental technology UI with dark/light/system theme persistence.
   - Fully responsive on mobile, tablet, and ultra-wide displays.

2. **Accurate Atmospheric Standards**:
   - **U.S. EPA AQI (0–500 Scale)**: Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous.
   - **European EAQI (0–100+ Scale)**: Very Good, Fair, Moderate, Poor, Very Poor, Extremely Poor.
   - Official mathematical breakpoint evaluation—clearly distinguished from national physical monitoring grids.
   - Transparent disclaimer noting that data represents regional numerical atmospheric modeling from Open-Meteo.

3. **Intelligent Location Search & Geolocation**:
   - Powered by Open-Meteo Geocoding API with 300ms debounce.
   - Full keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
   - "Use My Location" instant browser GPS detection.
   - LocalStorage-backed recent searches with one-click re-selection and deletion.

4. **Interactive Visual AQI Gauge**:
   - Custom SVG semi-circular radial meter with smooth animated needle tracking.
   - Color-coded severity tiers with matching ambient drop-glow.

5. **Deep Pollutant Breakdown**:
   - Live concentrations and units (`μg/m³`): **PM2.5**, **PM10**, **O₃ (Ozone)**, **NO₂**, **SO₂**, and **CO**.
   - 24-hour directional trend indicators (Rising, Falling, Stable) with micro SVG sparklines.
   - Expandable scientific reference explaining particulate diameters, sources, health impacts, and WHO guidelines.

6. **Meteorology & Air Quality Correlation**:
   - Temperature (°C / °F toggle), Feels-like, Humidity (%), Wind Speed & Direction compass, Precipitation, and Solar Sunrise/Sunset.
   - Dedicated analytical section explaining boundary-layer dynamics, thermal inversions, and rain washout.

7. **AI Air Insight (Google Gemini 2.5 / 1.5)**:
   - **Zero Frontend API Key Exposure**: Secure Next.js server-side Route Handler (`/api/ai-insight`) reading `GEMINI_API_KEY`.
   - Structured multi-point synthesis: Current Situation, Main Pollution Concern, Atmospheric Trend, What You Can Do, Outdoor Activity Guidance, and Executive Summary.
   - **Graceful Fallback**: If no API key is provided or if rate-limited, an intelligent deterministic synthesizer runs locally so the app never breaks.

8. **Visual Air Quality Story**:
   - Unique diurnal cycle breakdown: **Morning (06:00–11:00)** → **Afternoon (12:00–17:00)** → **Evening (18:00–21:00)** → **Night (22:00–05:00)**.
   - Highlights cleanest period, peak smog window, dominant peak pollutant, and trajectory narrative based on actual API data.

9. **Best Modeled Window Finder**:
   - Algorithmic scanner analyzing the next 48 hours to pinpoint the optimal 3-hour outdoor window for exercise, children's play, or opening windows.

10. **Interactive Historical Timeline & Future Forecast**:
    - **AQI Timeline**: Interactive Recharts area chart with 24 Hours, 3 Days, and 7 Days filters with pollutant toggles.
    - **AQI Forecast**: 72-hour future bar chart with tier color-coding and peak stagnation alerts.

11. **Bilingual Localization (English & हिन्दी)**:
    - Complete dual-language switch in top navigation.
    - All metrics, descriptions, guidance, stories, and Gemini AI prompts adapt seamlessly.

12. **City-to-City Comparison**:
    - Side-by-side comparison modal fetching live Open-Meteo metrics for any two cities globally.

13. **Downloadable & Printable AQI Report**:
    - Clean `@media print` layout optimized for browser PDF export.
    - Direct JSON export option for data logging.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Data APIs**: [Open-Meteo](https://open-meteo.com/) (Geocoding, Air Quality, and Weather)
- **AI Engine**: [Google Gemini API](https://aistudio.google.com/)

---

## 📁 Project Architecture

```
aqi-guardian/
├── app/
│   ├── api/
│   │   └── ai-insight/
│   │       └── route.ts         # Secure server-side Gemini API route & fallback
│   ├── globals.css              # Tailwind base, dark mode, print styles
│   ├── layout.tsx               # SEO Metadata, font, theme script
│   └── page.tsx                 # Main application dashboard orchestrator
├── components/
│   ├── AIInsightCard.tsx        # Gemini AI insight synthesis
│   ├── AQIForecast.tsx          # 72h future bar chart & daily averages
│   ├── AQIGauge.tsx             # Custom SVG radial gauge with animated needle
│   ├── AQIScaleLegend.tsx       # Standard threshold scale bar
│   ├── AQIStoryCard.tsx         # Diurnal 4-phase air story card
│   ├── BestWindowCard.tsx       # Optimal outdoor window recommendation
│   ├── CompareLocationsModal.tsx# Live city comparison modal
│   ├── EducationSection.tsx     # Educational FAQs on AQI & pollutants
│   ├── Footer.tsx               # Attribution & disclaimer footer
│   ├── Header.tsx               # Sticky nav, search, standard, lang, theme
│   ├── HeroDashboard.tsx        # Hero card with city, AQI, and guidance
│   ├── LocationSearch.tsx       # Debounced autocomplete search & GPS
│   ├── Logo.tsx                 # Original SVG vector logo
│   ├── PollutantCard.tsx        # Single pollutant card with sparkline
│   ├── PollutantsGrid.tsx       # 6-pollutant grid & expandable guide
│   ├── PreventiveMeasures.tsx   # Tiered health precautions
│   ├── ReportModal.tsx          # Printable report & JSON export
│   └── WeatherSection.tsx       # Meteorology grid & correlation card
├── lib/
│   ├── api.ts                   # Open-Meteo Geocoding, Air Quality, Weather
│   ├── aqi-standards.ts         # US EPA & European EAQI math & breakpoints
│   ├── i18n.ts                  # Bilingual dictionary (English & Hindi)
│   ├── storage.ts               # LocalStorage manager (recents, theme, lang)
│   ├── story-engine.ts          # Diurnal cycle & best window calculations
│   └── types.ts                 # TypeScript interfaces
├── .env.example                 # Environment variables template
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration with AQI colors
└── tsconfig.json                # TypeScript compiler configuration
```

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

### 3. Setup Environment Variables (Optional)
To enable live Google Gemini AI insights:
1. Obtain a free API key at [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
3. Add your API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Note*: If no key is provided, the application automatically uses its built-in rule-based atmospheric synthesizer without breaking.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🚢 Deploying to Vercel

1. Push this repository to your **GitHub** account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AQI Guardian"
   git branch -M main
   git remote add origin https://github.com/your-username/aqi-guardian.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `aqi-guardian` repository.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio key)*
5. Click **Deploy**. Vercel will automatically build and deploy your application to a global edge CDN.

---

## 📜 Legal & Scientific Disclaimer

AQI Guardian displays atmospheric simulation data provided by the Open-Meteo European and global chemical transport models (ECMWF / CAMS). It is intended for informational and personal planning purposes only. It does not replace regulatory ground monitoring or professional medical advice.
