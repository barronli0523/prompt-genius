import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptGenerator from "@/components/PromptGenerator";
import { templates } from "@/data/templates";

interface Props {
  params: Promise<{ templateId: string }>;
}

export default async function TemplateDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const template = templates.find((t) => t.id === resolvedParams.templateId);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary">首页</Link>
            <span>/</span>
            <Link href="/templates" className="hover:text-primary">模板库</Link>
            <span>/</span>
            <span className="text-foreground">{template.name}</span>
          </div>

          <PromptGenerator template={template} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
