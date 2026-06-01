import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">文档</h1>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">快速开始</h2>
              <p className="text-muted-foreground">
                PromptGenius 帮助你快速生成高质量的 AI 提示词。选择一个模板，填写必要的信息，点击「AI生成提示词」按钮即可。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">生成提示词</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>在首页或模板库中选择一个模板</li>
                <li>填写表单中的必要字段</li>
                <li>点击「AI生成提示词」按钮</li>
                <li>等待 AI 处理，生成的提示词将显示在右侧</li>
                <li>点击「复制」按钮即可使用</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">优化提示词</h2>
              <p className="text-muted-foreground">
                在优化页面粘贴你已有的提示词，AI 将自动优化结构、补充细节，生成更专业的版本。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">订阅计划</h2>
              <p className="text-muted-foreground">
                免费版用户每天可生成 3 次。升级到 Pro 或年度版享受无限生成、全部模板和高级功能。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
