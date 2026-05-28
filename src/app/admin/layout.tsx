import Link from "next/link";
import { Users, ShoppingCart, FileText, LayoutTemplate, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/admin", label: "数据总览", icon: BarChart3 },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingCart },
  { href: "/admin/prompts", label: "内容管理", icon: FileText },
  { href: "/admin/templates", label: "模板管理", icon: LayoutTemplate },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">PromptGenius</h1>
          <p className="text-xs text-slate-400 mt-1">管理后台</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-800 transition"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
