export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const PRICING = { pro: 3000, annual: 30000 };

export async function POST(req: Request) {
  try {
    const { planType, payMethod } = await req.json();
    if (!planType || !payMethod) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }
    if (!PRICING[planType as keyof typeof PRICING]) {
      return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    let clerkId = null;
    if (authHeader) {
      try {
        const client = await clerkClient();
        const session = await client.sessions.getSession(authHeader.replace("Bearer ", ""));
        clerkId = session?.userId;
      } catch {}
    }

    if (!clerkId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orderNo = `PG${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: clerkId,
        order_no: orderNo,
        plan_type: planType,
        amount: PRICING[planType as keyof typeof PRICING],
        pay_method: payMethod,
        pay_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Order creation error:", error);
      return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
    }

    const qrUrl = `https://api.example.com/pay/qr?order_no=${orderNo}&method=${payMethod}`;

    return NextResponse.json({
      success: true,
      data: {
        orderNo: order.order_no,
        orderId: order.id,
        qrUrl,
        amount: order.amount,
      },
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
