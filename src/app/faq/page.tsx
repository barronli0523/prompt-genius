import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "PromptGenius 是什么？",
    a: "PromptGenius 是一个 AI 提示词自动生成工具，提供多种专业模板，帮助你快速生成高质量的 ChatGPT、Midjourney 等 AI 提示词。",
  },
  {
    q: "免费版有什么限制？",
    a: "免费版每天可生成 3 次，可以使用基础模板。升级到 Pro 版后可享受无限生成次数和全部 100+ 模板。",
  },
  {
    q: "支持哪些 AI 平台？",
    a: "目前支持 ChatGPT、Midjourney、Claude、Stable Diffusion 等主流 AI 平台。更多平台即将上线。",
  },
  {
    q: "如何升级订阅？",
    a: "在定价页面选择 Pro 或年度版，选择微信支付或支付宝完成支付后即可自动升级。",
  },
  {
    q: "订阅可以取消吗？",
    a: "可以随时取消订阅。取消后当前付费周期内仍可使用 Pro 功能，到期后自动恢复免费版。",
  },
  {
    q: "生成的提示词可以用于商业用途吗？",
    a: "可以。生成的提示词完全归你所有，可用于任何用途。",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">常见问题</h1>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-border rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
