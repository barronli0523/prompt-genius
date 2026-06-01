"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { createBrowserClient } from "@/lib/auth"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const supabase = createBrowserClient()

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url") || "/generate"

  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirectUrl)
      }
    })

    // Listen for sign in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push(redirectUrl)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, redirectUrl])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-white border border-border rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6">登录 / 注册</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="default"
            providers={[]}
            redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}${redirectUrl}`}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
