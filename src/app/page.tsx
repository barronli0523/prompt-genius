import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryCard from "@/components/CategoryCard";
import TemplateCard from "@/components/TemplateCard";
import { categories, templates } from "@/data/templates";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              一键生成完美
              <span className="text-primary"> AI提示词</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              不用学复杂的提示词工程，填写表单即可生成高质量提示词
              <br />
              支持 ChatGPT、Midjourney、Claude 等主流AI工具
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generate"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition text-lg"
              >
                免费开始生成
              </Link>
              <Link
                href="/templates"
                className="bg-white border border-border px-8 py-3 rounded-lg font-medium hover:border-primary transition text-lg"
              >
                浏览模板库
              </Link>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              ✅ 每日免费3次 &nbsp; ✅ 无需信用卡 &nbsp; ✅ 100+ 专业模板
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">选择场景</h2>
            <p className="text-muted-foreground text-center mb-10">找到适合你的Prompt类型</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Templates */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">热门模板</h2>
            <p className="text-muted-foreground text-center mb-10">最受欢迎的Prompt模板</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/templates"
                className="inline-block border border-border px-6 py-2.5 rounded-lg hover:border-primary hover:text-primary transition"
              >
                查看全部模板 →
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">三步搞定</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg mb-2">选择模板</h3>
                <p className="text-muted-foreground">从100+专业模板中选择合适的场景</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg mb-2">填写参数</h3>
                <p className="text-muted-foreground">根据表单提示填写关键信息</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg mb-2">一键生成</h3>
                <p className="text-muted-foreground">复制生成的Prompt到你的AI工具</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-lg opacity-90 mb-8">
              加入10,000+用户，每天用PromptGenius提升效率
            </p>
            <Link
              href="/generate"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition text-lg"
            >
              免费开始生成 →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
