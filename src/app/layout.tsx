import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B Essential — 창업 서류, 이제 쉽게",
  description: "초기 창업자에게 필요한 서류를 한 곳에서 쉽고 빠르게 정리하세요. B Essential이 창업의 첫 걸음을 함께합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-screen overflow-hidden antialiased"
    >
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
