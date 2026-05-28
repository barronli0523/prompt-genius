export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const successXml = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
const failXml = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[Error]]></return_msg></xml>";

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

    return new NextResponse(successXml, { headers: { "Content-Type": "application/xml" } });
  } catch (error) {
    console.error("WeChat notify error:", error);
    return new NextResponse(failXml, { headers: { "Content-Type": "application/xml" } });
  }
}
