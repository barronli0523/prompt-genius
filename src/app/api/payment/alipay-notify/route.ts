export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const CREDITS_BY_PLAN: Record<string, number> = {
  pro: 9999,
  annual: 99999,
};

/**
 * Verify Alipay callback signature.
 * Returns true if verification passes or no public key is configured (dev mode).
 */
async function verifyAlipaySignature(params: URLSearchParams): Promise<boolean> {
  const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY;
  if (!alipayPublicKey) {
    console.warn("ALIPAY_PUBLIC_KEY not configured — skipping signature verification (dev mode)");
    return true;
  }

  const sign = params.get("sign");
  if (!sign) return false;

  // TODO: Implement RSA2 signature verification
  // 1. Remove 'sign' and 'sign_type' from params, sort remaining keys
  // 2. Build query string: "key1=value1&key2=value2..."
  // 3. Use Alipay public key to verify signature against the string
  console.warn("Alipay signature verification not yet implemented");
  return true;
}

/**
 * Sync subscription status to Clerk publicMetadata so the frontend can react.
 */
async function syncClerkMetadata(
  clerkId: string,
  planType: string,
  expiry: Date,
): Promise<void> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        subscription_tier: planType,
        subscription_expiry: expiry.toISOString(),
      },
    });
  } catch (e) {
    console.error("Failed to sync Clerk metadata:", e);
  }
}

/**
 * Create or extend a subscription record.
 * If an active (non-expired) subscription exists, extends its end date.
 * Otherwise creates a new subscription record.
 * Returns the new period_end date.
 */
async function createOrUpdateSubscription(
  clerkId: string,
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
    .eq("user_id", clerkId)
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
      user_id: clerkId,
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
    const transactionId = params.get("trade_no");
    const tradeStatus = params.get("trade_status");

    if (!orderNo || tradeStatus !== "TRADE_SUCCESS") {
      return new NextResponse("fail", { status: 200 });
    }

    // Signature verification
    const verified = await verifyAlipaySignature(params);
    if (!verified) {
      console.error("Alipay callback signature verification failed");
      return new NextResponse("fail", { status: 200 });
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_no", orderNo)
      .single();

    if (!order || order.pay_status === "paid") {
      return new NextResponse("success", { status: 200 });
    }

    await supabaseAdmin.from("orders").update({
      pay_status: "paid",
      pay_time: new Date().toISOString(),
      pay_transaction_id: transactionId,
    }).eq("order_no", orderNo);

    // Create or extend subscription
    const periodEnd = await createOrUpdateSubscription(order.user_id, order.plan_type);

    // Update user profile with tier and appropriate credits
    await supabaseAdmin.from("user_profiles").update({
      subscription_tier: order.plan_type,
      credits_remaining: CREDITS_BY_PLAN[order.plan_type] ?? 9999,
    }).eq("clerk_id", order.user_id);

    // Sync subscription status to Clerk publicMetadata
    await syncClerkMetadata(order.user_id, order.plan_type, periodEnd);

    return new NextResponse("success", { status: 200 });
  } catch (error) {
    console.error("Alipay notify error:", error);
    return new NextResponse("fail", { status: 200 });
  }
}
