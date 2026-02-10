import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEO Scanner - Birmingham AI",
  description:
    "Check how your website performs in AI search results. Get actionable recommendations to improve your Answer Engine Optimization.",
  openGraph: {
    title: "AEO Scanner - Birmingham AI",
    description:
      "Is your website ready for AI search? Scan your site and get a free AEO score with actionable recommendations.",
    type: "website",
    siteName: "Birmingham AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO Scanner - Birmingham AI",
    description:
      "Is your website ready for AI search? Scan your site and get a free AEO score.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Header */}
        <header className="bg-bai-navy text-white">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-bai-blue flex items-center justify-center text-sm font-bold">
                AI
              </div>
              <span className="font-semibold text-lg">Birmingham AI</span>
            </a>
            <span className="text-sm text-gray-400 hidden sm:block">
              AEO Scanner
            </span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-bai-navy text-gray-400 mt-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm space-y-2">
            <p>
              Powered by{" "}
              <a
                href="https://birminghamai.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-bai-blue-light transition-colors"
              >
                Birmingham AI
              </a>
            </p>
            <p className="text-gray-500">
              Answer Engine Optimization for the AI search era
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
