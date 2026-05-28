"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const { data } = await supabase.from("generated_prompts").select("*").order("created_at", { ascending: false }).limit(500);
    if (data) setPrompts(data);
    setLoading(false);
  };

  const filtered = prompts.filter(
    (p) =>
      p.template_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.generated_prompt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">内容管理</h1>
        <input
          type="text"
          placeholder="搜索模板名称/内容..."
          className="px-4 py-2 border rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">模板</th>
              <th className="text-left p-4 font-medium">生成内容预览</th>
              <th className="text-left p-4 font-medium">收藏</th>
              <th className="text-left p-4 font-medium">生成时间</th>
              <th className="text-left p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">加载中...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">暂无内容</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{p.template_name || p.template_id}</td>
                  <td className="p-4 max-w-md truncate text-slate-500">{p.generated_prompt?.substring(0, 80)}...</td>
                  <td className="p-4">{p.is_favorite ? "⭐" : "-"}</td>
                  <td className="p-4 text-slate-400">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline text-xs" onClick={() => setSelectedPrompt(p)}>
                      查看
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-4">共 {filtered.length} 条生成记录</p>

      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedPrompt(null)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{selectedPrompt.template_name}</h3>
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">输入参数</p>
              <pre className="bg-slate-50 p-3 rounded text-xs">{JSON.stringify(selectedPrompt.input_params, null, 2)}</pre>
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">生成的提示词</p>
              <pre className="bg-slate-50 p-3 rounded text-xs whitespace-pre-wrap">{selectedPrompt.generated_prompt}</pre>
            </div>
            {selectedPrompt.optimized_prompt && (
              <div>
                <p className="text-sm text-slate-500 mb-2">优化后的提示词</p>
                <pre className="bg-slate-50 p-3 rounded text-xs whitespace-pre-wrap">{selectedPrompt.optimized_prompt}</pre>
              </div>
            )}
            <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm" onClick={() => setSelectedPrompt(null)}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
