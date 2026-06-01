import Link from "next/link";
import { Category } from "@/types";
import { templates } from "@/data/templates";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const count = templates.filter((t) => t.category_id === category.id).length;

  return (
    <Link
      href={`/generate?category=${category.id}`}
      className="block p-6 bg-white border border-border rounded-xl hover:shadow-lg hover:border-primary transition group"
    >
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="font-bold text-lg group-hover:text-primary transition">{category.name}</h3>
      <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
      <div className="text-xs text-muted-foreground mt-3">
        {count} 个模板
      </div>
    </Link>
  );
}
