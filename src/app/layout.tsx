import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Meadow Note · 个人播客 & 博客",
  description: "和山野间的风一样自由。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex-1 w-full layout-container py-10">
          {children}
        </main>
        <footer className="w-full layout-container py-8 text-center text-sm text-stone-400">
          © 2026 · Meadow Note · meadownote.bot.cd
        </footer>
      </body>
    </html>
  );
}