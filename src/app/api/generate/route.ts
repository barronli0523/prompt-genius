import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { templates } from "@/data/templates";
import { checkAndIncrementDailyUsage, getActiveSubscription, deductCredits, DAILY_LIMITS } from "@/services/supabase-service";

export const runtime = "edge";

const QWEN_API_KEY = process.env.OPENAI_API_KEY || "";
const QWEN_API_URL = "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_MODEL = "qwen3.6-plus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { system_prompt, user_prompt_template, form_values, target_ai, template_id, template_name } = body;

    if (!system_prompt || !user_prompt_template) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Build the final user prompt by replacing placeholders
    let finalPrompt = user_prompt_template;
    if (form_values) {
      Object.entries(form_values).forEach(([key, value]) => {
        finalPrompt = finalPrompt.replace(
          new RegExp(`{${key}}`, "g"),
          String(value || "")
        );
      });
    }

    // Get user ID if logged in
    const { userId } = await auth();
    let creditsRemaining = 0;
    let dailyCount = 0;
    let dailyLimit = DAILY_LIMITS.free;

    // If logged in, check daily usage limit
    if (userId) {
      const usage = await checkAndIncrementDailyUsage(userId);
      dailyCount = usage.count;
      dailyLimit = usage.limit;
      if (!usage.allowed) {
        return NextResponse.json({
          error: "今日免费次数已用完，请升级 Pro",
          credits_remaining: 0,
          daily_usage_count: usage.count,
          daily_limit: usage.limit,
        }, { status: 429 });
      }

      // Check premium template access
      if (template_id && template_id !== "unknown") {
        const tmpl = templates.find((t) => t.id === template_id);
        if (tmpl?.is_premium) {
          const sub = await getActiveSubscription(userId);
          if (sub.tier === "free") {
            return NextResponse.json({
              error: "该模板需要 Pro 或年度订阅",
              credits_remaining: 0,
            }, { status: 403 });
          }
        }
      }
    }

    // If no API key, return template-based result
    if (!QWEN_API_KEY) {
      // Save to database if user is logged in
      if (userId) {
        await supabase
          .from("generated_prompts")
          .insert({
            user_id: userId,
            template_id: template_id || "unknown",
            template_name: template_name || null,
            input_params: form_values || {},
            generated_prompt: finalPrompt,
          });

        // Log usage
        await supabase
          .from("usage_logs")
          .insert({
            user_id: userId,
            action_type: "generate",
            credits_used: 1,
          });

        // Deduct credits
        try {
          creditsRemaining = await deductCredits(userId, 1);
        } catch {
          creditsRemaining = 0;
        }
      }

      return NextResponse.json({
        prompt: finalPrompt,
        credits_used: 1,
        credits_remaining: creditsRemaining,
        daily_usage_count: dailyCount,
        daily_limit: dailyLimit,
        source: "template",
      });
    }

    // Call Qwen API to enhance the prompt
    const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: finalPrompt },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Qwen API error");
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0]?.message?.content || finalPrompt;

    // Save to database if user is logged in
    if (userId) {
      await supabase
        .from("generated_prompts")
        .insert({
          user_id: userId,
          template_id: template_id || "unknown",
          template_name: template_name || null,
          input_params: form_values || {},
          generated_prompt: enhancedPrompt,
        });

      // Log usage
      await supabase
        .from("usage_logs")
        .insert({
          user_id: userId,
          action_type: "generate",
          credits_used: 1,
        });

      // Deduct credits
      try {
        creditsRemaining = await deductCredits(userId, 1);
      } catch {
        creditsRemaining = 0;
      }
    }

    return NextResponse.json({
      prompt: enhancedPrompt,
      credits_used: 1,
      credits_remaining: creditsRemaining,
      daily_usage_count: dailyCount,
      daily_limit: dailyLimit,
      source: "qwen",
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
