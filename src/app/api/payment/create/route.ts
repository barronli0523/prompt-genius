export const runtime = "edge";

import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const PRICING = { pro: 3000, annual: 30000 };
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    const { planType, payMethod } = await req.json();
    if (!planType || !payMethod) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }
    if (!PRICING[planType as keyof typeof PRICING]) {
      return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 });
    }

    // Get user from Supabase auth cookies
    const supabaseClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.headers.get("cookie")?.split(";").map(c => {
            const [name, value] = c.trim().split("=");
            return { name, value };
          }) || [];
        },
        setAll() {},
      },
    });
    const { data: { user } } = await supabaseClient.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orderNo = `PG${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
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
