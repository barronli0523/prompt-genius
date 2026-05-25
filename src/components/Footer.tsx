import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              PromptGenius
            </h3>
            <p className="text-muted-foreground text-sm">
              让每个人都能写出完美的AI提示词
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">产品</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/generate" className="text-muted-foreground hover:text-foreground">生成提示词</Link></li>
              <li><Link href="/templates" className="text-muted-foreground hover:text-foreground">模板库</Link></li>
              <li><Link href="/optimize" className="text-muted-foreground hover:text-foreground">优化提示词</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">支持</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">文档</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">常见问题</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">法律</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">隐私政策</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">服务条款</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © 2026 PromptGenius. 保留所有权利。
        </div>
      </div>
    </footer>
  );
}
