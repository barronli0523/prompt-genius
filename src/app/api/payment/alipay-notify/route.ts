export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

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

    const now = new Date();
    const periodEnd = new Date(now);
    if (order.plan_type === "pro") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    await supabaseAdmin.from("subscriptions").insert({
      user_id: order.user_id,
      plan_type: order.plan_type,
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    });

    await supabaseAdmin.from("user_profiles").update({
      subscription_tier: order.plan_type,
      credits_remaining: 999999,
    }).eq("clerk_id", order.user_id);

    return new NextResponse("success", { status: 200 });
  } catch (error) {
    console.error("Alipay notify error:", error);
    return new NextResponse("fail", { status: 200 });
  }
}
