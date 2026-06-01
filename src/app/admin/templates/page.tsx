"use client";

import { useState } from "react";
import { templates } from "@/data/templates";
import { Eye } from "lucide-react";

export default function AdminTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const categoryMap: Record<string, string> = {
    "1": "文章写作",
    "2": "AI绘图",
    "3": "代码生成",
    "4": "营销文案",
    "5": "视频脚本",
    "6": "商业分析",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">模板管理</h1>
        <p className="text-sm text-slate-500">共 {templates.length} 个模板</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">名称</th>
              <th className="text-left p-4 font-medium">分类</th>
              <th className="text-left p-4 font-medium">热门</th>
              <th className="text-left p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-mono text-xs">{t.id}</td>
                <td className="p-4">{t.name}</td>
                <td className="p-4">{categoryMap[t.category_id] || t.category_id}</td>
                <td className="p-4">{t.is_premium ? "⭐" : "-"}</td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline text-xs flex items-center gap-1" onClick={() => setSelectedTemplate(t)}>
                    <Eye className="w-3 h-3" /> 查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTemplate(null)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{selectedTemplate.name}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">描述</p>
                <p className="text-sm">{selectedTemplate.description}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">表单字段</p>
                <pre className="bg-slate-50 p-3 rounded text-xs">{JSON.stringify(selectedTemplate.form_fields, null, 2)}</pre>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">系统提示词</p>
                <pre className="bg-slate-50 p-3 rounded text-xs whitespace-pre-wrap">{selectedTemplate.system_prompt}</pre>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">用户提示词模板</p>
                <pre className="bg-slate-50 p-3 rounded text-xs whitespace-pre-wrap">{selectedTemplate.user_prompt_template}</pre>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm" onClick={() => setSelectedTemplate(null)}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
