"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.clerk_id?.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <input
          type="text"
          placeholder="搜索邮箱/昵称/ID..."
          className="px-4 py-2 border rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">用户</th>
              <th className="text-left p-4 font-medium">邮箱</th>
              <th className="text-left p-4 font-medium">套餐</th>
              <th className="text-left p-4 font-medium">剩余积分</th>
              <th className="text-left p-4 font-medium">今日使用</th>
              <th className="text-left p-4 font-medium">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">加载中...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">暂无用户</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{u.display_name || "-"}</td>
                  <td className="p-4 text-slate-500">{u.email || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.subscription_tier === "pro" ? "bg-green-100 text-green-700" :
                      u.subscription_tier === "annual" ? "bg-purple-100 text-purple-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {u.subscription_tier === "pro" ? "Pro" : u.subscription_tier === "annual" ? "年度" : "免费"}
                    </span>
                  </td>
                  <td className="p-4">{u.credits_remaining}</td>
                  <td className="p-4">{u.daily_usage_count || 0}</td>
                  <td className="p-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-4">共 {filtered.length} 位用户</p>
    </div>
  );
}
