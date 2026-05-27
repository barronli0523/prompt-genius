import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
    let creditsRemaining = 4;

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
      }

      return NextResponse.json({
        prompt: finalPrompt,
        credits_used: 1,
        credits_remaining: creditsRemaining,
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

      // Get remaining credits
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("credits_remaining")
        .eq("clerk_id", userId)
        .single();

      creditsRemaining = profileData?.credits_remaining || 4;
    }

    return NextResponse.json({
      prompt: enhancedPrompt,
      credits_used: 1,
      credits_remaining: creditsRemaining,
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
