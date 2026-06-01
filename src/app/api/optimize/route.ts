import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { checkAndIncrementDailyUsage, deductCredits, DAILY_LIMITS } from "@/services/supabase-service";

export const runtime = "edge";

const QWEN_API_KEY = process.env.OPENAI_API_KEY || "";
const QWEN_API_URL = "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_MODEL = "qwen3.6-plus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // target_ai is reserved for future AI platform routing
    const { prompt, original_prompt_id } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
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
    }

    // If no API key, return basic enhancement
    if (!QWEN_API_KEY) {
      const optimizedPrompt = `[SYSTEM] You are an expert AI assistant.\n\n[CONTEXT] ${prompt}\n\n[INSTRUCTIONS]\n1. Analyze the request carefully\n2. Provide comprehensive and accurate information\n3. Structure your response clearly`;

      if (userId && original_prompt_id) {
        await supabase
          .from("generated_prompts")
          .update({ optimized_prompt: optimizedPrompt })
          .eq("id", original_prompt_id)
          .eq("user_id", userId);
      }

      if (userId) {
        await supabase
          .from("usage_logs")
          .insert({
            user_id: userId,
            action_type: "optimize",
            credits_used: 1,
          });

        try {
          creditsRemaining = await deductCredits(userId, 1);
        } catch {
          creditsRemaining = 0;
        }
      }

      return NextResponse.json({
        optimized: optimizedPrompt,
        credits_used: 1,
        credits_remaining: creditsRemaining,
        daily_usage_count: dailyCount,
        daily_limit: dailyLimit,
        source: "template",
      });
    }

    const systemPrompt = `You are an expert Prompt Engineer. Your task is to transform rough, vague, or poorly-structured prompts into highly effective, professional-grade prompts.

Rules:
1. Preserve the original intent
2. Add necessary context and constraints
3. Structure with clear sections (SYSTEM, CONTEXT, INSTRUCTIONS, OUTPUT FORMAT)
4. Make it actionable and specific
5. Return ONLY the optimized prompt, no explanations`;

    const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Optimize this prompt: ${prompt}` },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Qwen API error");
    }

    const data = await response.json();
    const optimizedPrompt = data.choices[0]?.message?.content || prompt;

    if (userId && original_prompt_id) {
      await supabase
        .from("generated_prompts")
        .update({ optimized_prompt: optimizedPrompt })
        .eq("id", original_prompt_id)
        .eq("user_id", userId);
    }

    if (userId) {
      await supabase
        .from("usage_logs")
        .insert({
          user_id: userId,
          action_type: "optimize",
          credits_used: 1,
        });

      try {
        creditsRemaining = await deductCredits(userId, 1);
      } catch {
        creditsRemaining = 0;
      }
    }

    return NextResponse.json({
      optimized: optimizedPrompt,
      credits_used: 1,
      credits_remaining: creditsRemaining,
      daily_usage_count: dailyCount,
      daily_limit: dailyLimit,
      source: "qwen",
    });
  } catch (error) {
    console.error("Optimize error:", error);
    return NextResponse.json(
      { error: "Failed to optimize prompt" },
      { status: 500 }
    );
  }
}
