"use client";

import { useState } from "react";
import Link from "next/link";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";
import { Loader2, Copy, Check, Sparkles, AlertCircle } from "lucide-react";

export default function OptimizePage() {
  const [inputPrompt, setInputPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const optimizePrompt = async () => {
    if (!inputPrompt.trim()) return;

    setIsOptimizing(true);
    setError("");

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "优化失败");
      }

      setOptimizedPrompt(data.optimized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败，请重试");
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <span className="text-foreground">优化提示词</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">提示词优化器</h1>
          <p className="text-muted-foreground mb-8">
            粘贴你的粗糙提示词，AI帮你优化成专业版本
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="font-bold mb-4">输入你的Prompt</h2>
              <textarea
                value={inputPrompt}
                onChange={(e) => {
                  setInputPrompt(e.target.value);
                  setError("");
                }}
                placeholder="例如：帮我写一篇关于AI的文章..."
                className="w-full h-64 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {inputPrompt.length} 字符
                </span>
                <button
                  onClick={optimizePrompt}
                  disabled={!inputPrompt.trim() || isOptimizing}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI优化中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI一键优化
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Output */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">优化结果</h2>
                {optimizedPrompt && (
                  <button
                    onClick={copyToClipboard}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        复制
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-auto">
                {optimizedPrompt ? (
                  <p className="whitespace-pre-wrap">{optimizedPrompt}</p>
                ) : (
                  <p className="text-slate-500">
                    输入你的Prompt，点击优化按钮...
                  </p>
                )}
              </div>

              {optimizedPrompt && (
                <div className="mt-4">
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-white text-slate-900 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    复制到剪贴板
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-12 bg-secondary rounded-xl p-8">
            <h2 className="text-xl font-bold mb-4">优化示例</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-medium text-red-600 mb-2">优化前 ❌</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  "帮我写个小红书文案，卖咖啡的"
                </p>
              </div>
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-medium text-green-600 mb-2">优化后 ✅</h3>
                <p className="text-sm font-mono">
                  "Write a Xiaohongshu (RED) social media post for a specialty coffee brand. Include: ☕ engaging hook about morning routine, 📝 product highlights (origin, flavor notes, brewing method), ✨ lifestyle appeal, relevant emojis, and 5-8 trending hashtags. Tone: casual, enthusiastic, authentic recommendation."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
