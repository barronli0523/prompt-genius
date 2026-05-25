"use client";

import Link from "next/link";
import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function HeaderAuth() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center gap-3">
      {isSignedIn ? (
        <>
          <Link
            href="/history"
            className="text-foreground hover:text-primary transition text-sm"
          >
            历史记录
          </Link>
          <UserButton />
        </>
      ) : (
        <>
          <SignInButton mode="modal">
            <button className="text-foreground hover:text-primary transition text-sm font-medium">
              登录
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium">
              免费开始
            </button>
          </SignUpButton>
        </>
      )}
    </div>
  );
}
