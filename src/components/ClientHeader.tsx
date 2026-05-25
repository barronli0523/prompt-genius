"use client";

import Link from "next/link";

export default function ClientHeader() {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span>PromptGenius</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/generate" className="text-foreground hover:text-primary transition">
            生成提示词
          </Link>
          <Link href="/templates" className="text-foreground hover:text-primary transition">
            模板库
          </Link>
          <Link href="/optimize" className="text-foreground hover:text-primary transition">
            优化提示词
          </Link>
          <Link href="/pricing" className="text-foreground hover:text-primary transition">
            价格
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/generate"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
          >
            免费开始
          </Link>
        </div>
      </div>
    </header>
  );
}
