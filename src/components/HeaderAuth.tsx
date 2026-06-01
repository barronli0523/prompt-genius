"use client";

import Link from "next/link";
import { LogOut, History } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function HeaderAuth() {
  const { user, isSignedIn, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <div className="w-20 h-8 rounded-lg bg-slate-200 animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/history"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <History className="w-4 h-4" />
          历史
        </Link>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user?.email?.split("@")[0]}
        </span>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-sm text-muted-foreground hover:text-foreground transition"
      >
        登录
      </Link>
      <Link
        href="/login"
        className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
      >
        免费开始
      </Link>
    </div>
  );
}
