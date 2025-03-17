import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GymLogger",
  description: "Track your workouts and progress",
  
};

export const viewport:Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme">
          <div className="min-h-screen bg-white dark:bg-slate-950">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
