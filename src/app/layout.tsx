import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptGenius - AI提示词自动生成工具",
  description: "一键生成ChatGPT、Midjourney等AI工具的高质量Prompt模板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
