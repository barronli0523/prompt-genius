import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const QWEN_API_KEY = process.env.OPENAI_API_KEY || "";
const QWEN_API_URL = "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_MODEL = "qwen3.6-plus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, target_ai, original_prompt_id } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    // Get user ID if logged in
    const { userId } = await auth();
    let creditsRemaining = 4;

    // If no API key, return basic enhancement
    if (!QWEN_API_KEY) {
      const optimizedPrompt = `[SYSTEM] You are an expert AI assistant.\n\n[CONTEXT] ${prompt}\n\n[INSTRUCTIONS]\n1. Analyze the request carefully\n2. Provide comprehensive and accurate information\n3. Structure your response clearly`;

      // Update original record if user is logged in
      if (userId && original_prompt_id) {
        await supabase
          .from("generated_prompts")
          .update({ optimized_prompt: optimizedPrompt })
          .eq("id", original_prompt_id)
          .eq("user_id", userId);
      }

      // Log usage if logged in
      if (userId) {
        await supabase
          .from("usage_logs")
          .insert({
            user_id: userId,
            action_type: "optimize",
            credits_used: 1,
          });
      }

      return NextResponse.json({
        optimized: optimizedPrompt,
        credits_used: 1,
        credits_remaining: creditsRemaining,
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
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Qwen API error");
    }

    const data = await response.json();
    const optimizedPrompt = data.choices[0]?.message?.content || prompt;

    // Update original record if user is logged in
    if (userId && original_prompt_id) {
      await supabase
        .from("generated_prompts")
        .update({ optimized_prompt: optimizedPrompt })
        .eq("id", original_prompt_id)
        .eq("user_id", userId);
    }

    // Log usage if logged in
    if (userId) {
      await supabase
        .from("usage_logs")
        .insert({
          user_id: userId,
          action_type: "optimize",
          credits_used: 1,
        });

      // Get remaining credits
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("credits_remaining")
        .eq("clerk_id", userId)
        .single();

      creditsRemaining = profileData?.credits_remaining || 4;
    }

    return NextResponse.json({
      optimized: optimizedPrompt,
      credits_used: 1,
      credits_remaining: creditsRemaining,
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
