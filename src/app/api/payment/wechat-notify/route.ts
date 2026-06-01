export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const successXml = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
const failXml = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[Error]]></return_msg></xml>";

const CREDITS_BY_PLAN: Record<string, number> = {
  pro: 9999,
  annual: 99999,
};

async function verifyWechatSignature(params: URLSearchParams): Promise<boolean> {
  const merchantKey = process.env.WECHAT_MERCHANT_KEY;
  if (!merchantKey) {
    console.warn("WECHAT_MERCHANT_KEY not configured — skipping signature verification (dev mode)");
    return true;
  }

  const sign = params.get("sign");
  if (!sign) return false;

  console.warn("WeChat signature verification not yet implemented");
  return true;
}

async function createOrUpdateSubscription(
  userId: string,
  planType: string,
): Promise<Date> {
  const now = new Date();
  const periodEnd = new Date(now);
  if (planType === "pro") {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("id, current_period_end, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("current_period_end", { ascending: false })
    .limit(1)
    .single();

  if (existing && new Date(existing.current_period_end) > now) {
    const newEnd = new Date(existing.current_period_end);
    if (planType === "pro") {
      newEnd.setMonth(newEnd.getMonth() + 1);
    } else {
      newEnd.setFullYear(newEnd.getFullYear() + 1);
    }
    await supabaseAdmin
      .from("subscriptions")
      .update({ current_period_end: newEnd.toISOString() })
      .eq("id", existing.id);
    return newEnd;
  } else {
    await supabaseAdmin.from("subscriptions").insert({
      user_id: userId,
      plan_type: planType,
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    });
    return periodEnd;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const orderNo = params.get("out_trade_no");
    const transactionId = params.get("transaction_id");
    const status = params.get("result_code");

    if (!orderNo || status !== "SUCCESS") {
      return new NextResponse(failXml, { headers: { "Content-Type": "application/xml" } });
    }

    const verified = await verifyWechatSignature(params);
    if (!verified) {
      console.error("WeChat callback signature verification failed");
      return new NextResponse(failXml, { headers: { "Content-Type": "application/xml" } });
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_no", orderNo)
      .single();

    if (!order || order.pay_status === "paid") {
      return new NextResponse(successXml, { headers: { "Content-Type": "application/xml" } });
    }

    await supabaseAdmin.from("orders").update({
      pay_status: "paid",
      pay_time: new Date().toISOString(),
      pay_transaction_id: transactionId,
    }).eq("order_no", orderNo);

    await createOrUpdateSubscription(order.user_id, order.plan_type);

    await supabaseAdmin.from("user_profiles").update({
      subscription_tier: order.plan_type,
      credits_remaining: CREDITS_BY_PLAN[order.plan_type] ?? 9999,
    }).eq("clerk_id", order.user_id);

    return new NextResponse(successXml, { headers: { "Content-Type": "application/xml" } });
  } catch (error) {
    console.error("WeChat notify error:", error);
    return new NextResponse(failXml, { headers: { "Content-Type": "application/xml" } });
  }
}
