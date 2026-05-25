"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import { templates, categories } from "@/data/templates";

export default function TemplatesPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(categoryId || "all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (categoryId) {
      setActiveCategory(categoryId);
    }
  }, [categoryId]);

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category_id === activeCategory);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span>/</span>
            <span className="text-foreground">模板库</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">模板库</h1>
          <p className="text-muted-foreground mb-6">
            共 {filteredTemplates.length} 个专业模板
          </p>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-border">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white border border-border hover:border-primary hover:text-primary"
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-white border border-border hover:border-primary hover:text-primary"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              该分类下暂无模板
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
