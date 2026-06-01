export const runtime = "edge";

import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  try {
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

    // Check for any paid order for this user
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("user_id", userId)
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
