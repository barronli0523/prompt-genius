import Link from "next/link";
import HeaderAuth from "./HeaderAuth";

export default function Header() {
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
        <HeaderAuth />
      </div>
    </header>
  );
}
