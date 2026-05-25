import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "",
    description: "适合偶尔使用",
    cta: "开始使用",
    features: [
      "每日3次生成",
      "基础模板",
      "复制功能",
      "历史记录（7天）",
    ],
    highlighted: false,
  },
  {
    name: "Pro版",
    price: "¥30",
    period: "/月",
    description: "适合专业用户",
    cta: "订阅Pro",
    features: [
      "无限次生成",
      "全部模板（100+）",
      "高级模板",
      "提示词优化器",
      "无限历史记录",
      "优先队列",
    ],
    highlighted: true,
  },
  {
    name: "年度版",
    price: "¥300",
    period: "/年",
    description: "比月付省120元",
    cta: "订阅年度版",
    features: [
      "Pro版所有功能",
      "全年无限使用",
      "专属客服",
      "优先新功能体验",
      "团队共享（最多3人）",
      "API访问",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">简单透明的定价</h1>
            <p className="text-lg text-muted-foreground">
              选择最适合你的方案，随时可取消
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 ${
                  plan.highlighted
                    ? "bg-primary text-white ring-4 ring-primary ring-offset-2"
                    : "bg-white border border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-bold bg-white text-primary px-3 py-1 rounded-full inline-block mb-4">
                    最受欢迎
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p
                  className={`text-sm mt-1 ${
                    plan.highlighted ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <Link
                  href="/generate"
                  className={`block text-center py-3 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? "bg-white text-primary hover:bg-slate-100"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
