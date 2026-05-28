"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filterStatus !== "all") query = query.eq("pay_status", filterStatus);
    const { data } = await query;
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const statusMap: Record<string, string> = {
    pending: "待支付",
    paid: "已支付",
    failed: "已失败",
    refunded: "已退款",
  };

  const payMethodMap: Record<string, string> = {
    wechat: "微信",
    alipay: "支付宝",
  };

  const planMap: Record<string, string> = {
    pro: "Pro 月度",
    annual: "年度版",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">全部状态</option>
          <option value="paid">已支付</option>
          <option value="pending">待支付</option>
          <option value="failed">已失败</option>
          <option value="refunded">已退款</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">订单号</th>
              <th className="text-left p-4 font-medium">套餐</th>
              <th className="text-left p-4 font-medium">金额</th>
              <th className="text-left p-4 font-medium">支付方式</th>
              <th className="text-left p-4 font-medium">状态</th>
              <th className="text-left p-4 font-medium">创建时间</th>
              <th className="text-left p-4 font-medium">支付时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">加载中...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">暂无订单</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs">{o.order_no}</td>
                  <td className="p-4">{planMap[o.plan_type] || o.plan_type}</td>
                  <td className="p-4">¥{(o.amount || 0) / 100}</td>
                  <td className="p-4">{payMethodMap[o.pay_method] || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      o.pay_status === "paid" ? "bg-green-100 text-green-700" :
                      o.pay_status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      o.pay_status === "refunded" ? "bg-red-100 text-red-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {statusMap[o.pay_status] || o.pay_status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-4 text-slate-400">{o.pay_time ? new Date(o.pay_time).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-4">共 {orders.length} 条订单</p>
    </div>
  );
}
