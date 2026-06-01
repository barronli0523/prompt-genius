import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">隐私政策</h1>
          <p className="text-muted-foreground mb-8">更新日期：2026 年 6 月 1 日</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. 信息收集</h2>
              <p className="text-muted-foreground mb-3">
                我们仅收集提供服务所必需的信息：
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>通过 Clerk 认证收集的基础账户信息（邮箱、用户名）</li>
                <li>生成的提示词记录（存储在 Supabase 数据库中）</li>
                <li>使用日志（生成次数、时间戳）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. 信息使用</h2>
              <p className="text-muted-foreground">
                收集的信息仅用于：提供和改进服务、管理用户订阅、生成历史记录、统计分析。我们不会将你的个人信息出售给第三方。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. 数据安全</h2>
              <p className="text-muted-foreground">
                我们采用行业标准的安全措施保护你的数据，包括加密传输、安全存储和访问控制。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. 数据删除</h2>
              <p className="text-muted-foreground">
                你可以随时通过联系我们要求删除你的所有个人数据和生成的提示词。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. 联系方式</h2>
              <p className="text-muted-foreground">
                如对本隐私政策有任何疑问，请通过 /contact 页面联系我们。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
