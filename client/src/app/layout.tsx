import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import { AnalysisProvider } from "@/lib/analysis-context";

import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | CropWise AI",
    default: "CropWise AI — Farms Today. A Safer Tomorrow.",
  },
  description:
    "CropWise AI turns NASA Earth observation data into simple, practical climate insights so farmers can adapt, plan, and grow with confidence.",
  keywords: [
    "climate smart farming",
    "NASA earth data",
    "crop planning",
    "farm climate analysis",
    "agriculture insights",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-white text-slate-900 antialiased" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <LanguageProvider>
              <AnalysisProvider>{children}</AnalysisProvider>
            </LanguageProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

