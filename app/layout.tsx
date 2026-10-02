import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AQI Guardian — Real-Time Environmental Intelligence & Air Defense",
  description:
    "Accurate global air quality monitoring and atmospheric intelligence powered by Open-Meteo regional modeling and Google Gemini AI. Track PM2.5, PM10, Ozone, weather correlations, and personalized health guidance.",
  keywords: [
    "AQI",
    "Air Quality Index",
    "AQI Guardian",
    "PM2.5",
    "PM10",
    "Ozone",
    "Open-Meteo",
    "Gemini AI",
    "Weather",
    "Air Pollution",
  ],
  authors: [{ name: "AQI Guardian Team" }],
  openGraph: {
    title: "AQI Guardian — Real-Time Environmental Intelligence",
    description:
      "Interactive air quality monitoring, diurnal air stories, optimal outdoor window finder, and Gemini AI health insights.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'><path d='M24 4L39 9.5V21C39 31.5 32.5 39.8 24 44C15.5 39.8 9 31.5 9 21V9.5L24 4Z' fill='%2310b981'/><path d='M16 19C19 16.5 24 16.5 27 19C30 21.5 33 21 35 19.5' stroke='white' stroke-width='3'/></svg>",
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
