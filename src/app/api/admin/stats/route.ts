export const runtime = "edge";

import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      { count: totalUsers },
      { count: proUsers },
      { count: totalGenerations },
      { data: revenueData },
      { data: recentUsers },
      { data: recentOrders },
    ] = await Promise.all([
      supabaseAdmin.from("user_profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("user_profiles").select("*", { count: "exact", head: true }).eq("subscription_tier", "pro").or("subscription_tier.eq.annual"),
      supabaseAdmin.from("generated_prompts").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("amount, pay_status, created_at").eq("pay_status", "paid"),
      supabaseAdmin.from("user_profiles").select("clerk_id, email, display_name, subscription_tier, created_at").order("created_at", { ascending: false }).limit(7),
      supabaseAdmin.from("orders").select("amount, pay_status, created_at").order("created_at", { ascending: false }).limit(30),
    ]);

    const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const userTrend = last7Days.map((date) => {
      const count = recentUsers?.filter((u) => u.created_at?.startsWith(date)).length || 0;
      return { date, users: count };
    });

    const revenueTrend = last7Days.map((date) => {
      const amount = revenueData?.filter((o) => o.created_at?.startsWith(date)).reduce((sum, o) => sum + (o.amount || 0), 0) || 0;
      return { date, revenue: amount };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        proUsers: proUsers || 0,
        totalGenerations: totalGenerations || 0,
        totalRevenue,
        userTrend,
        revenueTrend,
        recentOrders: recentOrders || [],
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
