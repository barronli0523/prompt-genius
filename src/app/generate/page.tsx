"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";
import PromptGenerator from "@/components/PromptGenerator";
import { templates, categories } from "@/data/templates";
import { Lock } from "lucide-react";

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const categoryId = searchParams.get("category");
  const [filterCategory, setFilterCategory] = useState(categoryId || "all");
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (user) {
      const tier = (user.user_metadata as Record<string, unknown>)?.subscription_tier as string;
      setIsPro(tier === "pro" || tier === "annual");
    } else {
      setIsPro(false);
    }
  }, [user]);

  const filteredTemplates =
    filterCategory === "all"
      ? templates
      : templates.filter((t) => t.category_id === filterCategory);

  const [selectedTemplate, setSelectedTemplate] = useState(
    filteredTemplates.length > 0 ? filteredTemplates[0] : null
  );

  useEffect(() => {
    setSelectedTemplate(filteredTemplates[0] || null);
  }, [filterCategory]);

  const handleTemplateClick = (template: typeof templates[0]) => {
    if (template.is_premium && !isPro) {
      router.push("/pricing");
      return;
    }
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span>/</span>
            <span className="text-foreground">生成提示词</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-border">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                filterCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white border border-border hover:border-primary hover:text-primary"
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  filterCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-white border border-border hover:border-primary hover:text-primary"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <h2 className="font-bold text-lg mb-4">选择模板</h2>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredTemplates.map((template) => {
                  const isLocked = template.is_premium && !isPro;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                      className={`w-full text-left p-3 rounded-lg border transition relative ${
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/5"
                          : isLocked
                          ? "border-border bg-slate-50 opacity-60"
                          : "border-border bg-white hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm">{template.name}</div>
                        {isLocked && <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />}
                        {template.is_premium && !isLocked && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">PRO</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {template.target_ai === "midjourney" ? "AI绘图" : template.target_ai === "chatgpt" ? "ChatGPT" : template.target_ai} · {template.usage_count} 次使用
                      </div>
                    </button>
                  );
                })}
                {filteredTemplates.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">该分类下暂无模板</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              {selectedTemplate ? (
                <PromptGenerator template={selectedTemplate} />
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-white border border-border rounded-xl">
                  <p className="text-muted-foreground">请选择一个模板开始生成</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
