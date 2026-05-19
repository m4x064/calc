import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { MainNav } from "@/components/MainNav";

export const metadata: Metadata = {
  title: "計算の眼 Web：First Move Trainer",
  description: "数学問題の最初の一手から、計算前の視界を診断するWebアプリ"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body>
        <MainNav />
        {children}
      </body>
    </html>
  );
}
