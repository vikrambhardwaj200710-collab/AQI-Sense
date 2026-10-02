import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AQI Sense — Real-Time Environmental Intelligence & Air Defense",
  description:
    "Accurate global air quality monitoring and atmospheric intelligence powered by Open-Meteo regional modeling and Advanced Atmospheric AI. Track PM2.5, PM10, Ozone, weather correlations, and personalized health guidance.",
  keywords: [
    "AQI",
    "Air Quality Index",
    "AQI Sense",
    "NAQI",
    "India AQI",
    "PM2.5",
    "PM10",
    "Ozone",
    "Open-Meteo",
    "Weather",
    "Air Pollution",
  ],
  authors: [{ name: "AQI Sense Team" }],
  openGraph: {
    title: "AQI Sense — Real-Time Environmental Intelligence",
    description:
      "Interactive air quality monitoring, diurnal air stories, optimal outdoor window finder, and AI atmospheric health insights.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24' stroke='%2310b981' stroke-width='4' fill='none'/><circle cx='24' cy='24' r='4' fill='%2310b981'/></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('aqi_guardian_theme');
                  var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDark) || (theme === 'system' && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
