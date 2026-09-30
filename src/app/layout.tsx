import type { Metadata } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "60 Day Data Scientist",
    template: "%s · 60 Day Data Scientist",
  },
  description:
    "An A-Z data science journey in 60 days: a day-by-day roadmap, mathematics with resources, a research paper library and a blog.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-ink-700 py-6 text-center text-xs text-zinc-600">
          <p>
            60 Day Data Scientist · built with Next.js · progress lives in your browser ·{" "}
            <Link href="/roadmap" className="text-accent-300 hover:underline">
              start the challenge
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
