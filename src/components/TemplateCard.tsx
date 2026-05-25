import Link from "next/link";
import { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const aiColors: Record<string, string> = {
    chatgpt: "bg-green-100 text-green-700",
    midjourney: "bg-purple-100 text-purple-700",
    claude: "bg-orange-100 text-orange-700",
    "stable-diffusion": "bg-blue-100 text-blue-700",
  };

  const aiLabels: Record<string, string> = {
    chatgpt: "ChatGPT",
    midjourney: "AI绘图",
    claude: "Claude",
    "stable-diffusion": "SD",
  };

  return (
    <Link
      href={`/generate/${template.id}`}
      className="block p-5 bg-white border border-border rounded-xl hover:shadow-lg hover:border-primary transition group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold group-hover:text-primary transition">{template.name}</h3>
        {template.is_premium && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">PRO</span>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-3">{template.description}</p>
      <div className="flex items-center gap-2 text-xs">
        <span className={`px-2 py-1 rounded ${aiColors[template.target_ai]}`}>
          {aiLabels[template.target_ai] || template.target_ai}
        </span>
        <span className="text-muted-foreground">{template.usage_count} 次使用</span>
        <span className="text-muted-foreground">❤️ {template.like_count}</span>
      </div>
    </Link>
  );
}
