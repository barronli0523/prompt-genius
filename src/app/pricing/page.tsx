"use client";

import { useState, useEffect } from "react";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const plans = [
  {
    id: "free",
    name: "免费版",
    price: "¥0",
    period: "",
    description: "适合偶尔使用",
    cta: "开始使用",
    features: ["每日3次生成", "基础模板", "复制功能", "历史记录（7天）"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro版",
    price: "¥30",
    period: "/月",
    description: "适合专业用户",
    cta: "订阅Pro",
    features: ["无限次生成", "全部模板（100+）", "高级模板", "提示词优化器", "无限历史记录", "优先队列"],
    highlighted: true,
  },
  {
    id: "annual",
    name: "年度版",
    price: "¥300",
    period: "/年",
    description: "比月付省120元",
    cta: "订阅年度版",
    features: ["Pro版所有功能", "全年无限使用", "专属客服", "优先新功能体验", "团队共享（最多3人）", "API访问"],
    highlighted: false,
  },
];

export default function PricingPage() {
  const { session } = useSession();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"wechat" | "alipay" | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubscribe = (planId: string) => {
    if (planId === "free") {
      window.location.href = "/generate";
      return;
    }
    setSelectedPlan(planId);
    setPayMethod(null);
    setQrUrl(null);
  };

  const handlePay = async () => {
    if (!selectedPlan || !payMethod) return;
    setLoading(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.id) {
        headers["Authorization"] = `Bearer ${session.id}`;
      }
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ planType: selectedPlan, payMethod }),
      });
      const data = await res.json();
      if (data.success && data.qrUrl) {
        setQrUrl(data.qrUrl);
        setOrderNo(data.data?.orderNo || null);
      }
    } catch (e) {
      console.error("Payment error:", e);
    }
    setLoading(false);
  };

  // Poll for payment completion
  useEffect(() => {
    if (!qrUrl || !orderNo || !session?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/payment/status", {
          headers: { Authorization: `Bearer ${session.id}` },
        });
        const data = await res.json();
        if (data.success && data.paid) {
          setPaymentSuccess(true);
          clearInterval(pollInterval);
          setTimeout(() => {
            router.push("/generate");
          }, 2000);
        }
      } catch (e) {
        console.error("Poll error:", e);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [qrUrl, orderNo, session, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">简单透明的定价</h1>
            <p className="text-lg text-muted-foreground">选择最适合你的方案，随时可取消</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
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
                <p className={`text-sm mt-1 ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                </div>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`block w-full text-center py-3 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? "bg-white text-primary hover:bg-slate-100"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {plan.cta}
                </button>
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

          {selectedPlan && selectedPlan !== "free" && (
            <div className="max-w-md mx-auto mt-12 bg-white rounded-xl border border-border p-6">
              <h3 className="font-bold mb-4">选择支付方式</h3>
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                    payMethod === "wechat" ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setPayMethod("wechat")}
                >
                  微信支付
                </button>
                <button
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                    payMethod === "alipay" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setPayMethod("alipay")}
                >
                  支付宝
                </button>
              </div>
              {qrUrl ? paymentSuccess ? (
                <div className="text-center">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-medium text-green-600">支付成功！</p>
                  <p className="text-sm text-slate-500 mt-2">正在跳转...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">扫码完成支付</p>
                  <img src={qrUrl} alt="Payment QR" className="w-48 h-48 mx-auto mb-4" />
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    等待支付完成，自动跳转...
                  </div>
                </div>
              ) : (
                <button
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                  disabled={!payMethod || loading}
                  onClick={handlePay}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                  {loading ? "生成中..." : `支付 ${selectedPlan === "pro" ? "¥30" : "¥300"}`}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
