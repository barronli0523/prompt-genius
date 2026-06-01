"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Copy, Trash2, Star, StarOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ClientHeader from "@/components/ClientHeader";

interface GeneratedPrompt {
  id: string;
  template_id: string;
  template_name?: string;
  input_params: Record<string, any>;
  generated_prompt: string;
  optimized_prompt?: string;
  is_favorite: boolean;
  created_at: string;
}

export default function HistoryPage() {
  const { user, isSignedIn, isLoading } = useAuth();
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function fetchHistory() {
      const { data, error } = await supabase
        .from("generated_prompts")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching history:", error);
        return;
      }

      setPrompts(data || []);
      setLoading(false);
    }

    fetchHistory();
  }, [isSignedIn, user?.id]);

  const handleCopy = async (prompt: GeneratedPrompt, id: string) => {
    const textToCopy = prompt.optimized_prompt || prompt.generated_prompt;
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("generated_prompts")
      .update({ is_favorite: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling favorite:", error);
      return;
    }

    setPrompts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条记录吗？")) return;

    const { error } = await supabase
      .from("generated_prompts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting prompt:", error);
      return;
    }

    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">请先登录后查看历史记录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ClientHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        <h1 className="text-3xl font-bold mb-6">生成历史</h1>

      {prompts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">还没有生成过任何Prompt</p>
          <a
            href="/generate"
            className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            去生成第一个Prompt
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border border-border rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {prompt.template_name || prompt.template_id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(prompt.created_at), {
                      locale: zhCN,
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleFavorite(prompt.id, prompt.is_favorite)
                    }
                    className="p-1 hover:text-yellow-500 transition"
                    title={prompt.is_favorite ? "取消收藏" : "收藏"}
                  >
                    {prompt.is_favorite ? (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy(prompt, prompt.id)}
                    className="p-1 hover:text-primary transition"
                    title="复制"
                  >
                    <Copy className="h-5 w-5" />
                    {copiedId === prompt.id && (
                      <span className="text-xs ml-1">已复制!</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className="p-1 hover:text-red-500 transition"
                    title="删除"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {prompt.input_params && Object.keys(prompt.input_params).length > 0 && (
                <div className="mb-3 p-3 bg-gray-50 rounded text-sm">
                  <strong>输入参数：</strong>
                  <span className="ml-2">
                    {Object.entries(prompt.input_params)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" | ")}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                    查看生成的Prompt
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {prompt.generated_prompt}
                  </pre>
                </details>

                {prompt.optimized_prompt && (
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                      查看优化版本
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                      {prompt.optimized_prompt}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
