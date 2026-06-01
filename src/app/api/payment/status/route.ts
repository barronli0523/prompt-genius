export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const session = await client.sessions.getSession(authHeader.replace("Bearer ", ""));
    const clerkId = session?.userId;

    if (!clerkId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check for any paid order for this user
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("user_id", clerkId)
      .eq("pay_status", "paid")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (order) {
      return NextResponse.json({
        success: true,
        paid: true,
        planType: order.plan_type,
        orderNo: order.order_no,
      });
    }

    return NextResponse.json({
      success: true,
      paid: false,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
