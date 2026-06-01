"use client";

import { useState } from "react";
import { Template, FormField } from "@/types";
import { Loader2, Copy, Check, Sparkles, AlertCircle } from "lucide-react";

interface PromptGeneratorProps {
  template: Template;
}

export default function PromptGenerator({ template }: PromptGeneratorProps) {
  const [cache] = useState<Map<string, { formValues: Record<string, string>; generatedPrompt: string; error: string }>>(new Map());
  const [formValues, setFormValues] = useState<Record<string, string>>(
    template.form_fields.reduce((acc, field) => {
      acc[field.name] = field.default || "";
      return acc;
    }, {} as Record<string, string>)
  );
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>("");

  const [prevTemplate, setPrevTemplate] = useState(template.id);
  if (template.id !== prevTemplate) {
    if (prevTemplate) {
      cache.set(prevTemplate, { formValues, generatedPrompt, error });
    }
    const cached = cache.get(template.id);
    if (cached) {
      setFormValues(cached.formValues);
      setGeneratedPrompt(cached.generatedPrompt);
      setError(cached.error);
    } else {
      setGeneratedPrompt("");
      setError("");
      setFormValues(
        template.form_fields.reduce((acc, field) => {
          acc[field.name] = field.default || "";
          return acc;
        }, {} as Record<string, string>)
      );
    }
    setPrevTemplate(template.id);
  }

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.name] || "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />
        );
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        );
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: template.id,
          template_name: template.name,
          system_prompt: template.system_prompt,
          user_prompt_template: template.user_prompt_template,
          form_values: formValues,
          target_ai: template.target_ai,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "生成失败");
      }

      setGeneratedPrompt(data.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFormValid = template.form_fields.every(
    (field) => !field.required || formValues[field.name]
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-1">{template.name}</h2>
        <p className="text-muted-foreground text-sm mb-6">{template.description}</p>

        <div className="space-y-5">
          {template.form_fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <button
          onClick={generatePrompt}
          disabled={!isFormValid || isGenerating}
          className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AI生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              AI生成提示词
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">生成结果</h2>
          {generatedPrompt && (
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

        <div className="flex-1 bg-slate-800 rounded-lg p-4 font-mono text-sm overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e293b' }}>
          {generatedPrompt ? (
            <p className="whitespace-pre-wrap">{generatedPrompt}</p>
          ) : (
            <p className="text-slate-500">
              填写左侧表单，点击AI生成按钮...
            </p>
          )}
        </div>

        {generatedPrompt && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              复制到剪贴板
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
