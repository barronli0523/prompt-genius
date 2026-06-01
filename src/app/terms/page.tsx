import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-2">服务条款</h1>
          <p className="text-muted-foreground mb-8">更新日期：2026 年 6 月 1 日</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. 服务说明</h2>
              <p className="text-muted-foreground">
                PromptGenius 提供 AI 提示词生成和优化服务。用户可以通过模板快速生成高质量的提示词，或直接优化已有的提示词。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. 账户</h2>
              <p className="text-muted-foreground">
                使用本服务需要注册账户。你应确保账户信息真实、准确，并对账户下的所有行为负责。禁止共享账户或将服务用于任何非法用途。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. 订阅与付费</h2>
              <p className="text-muted-foreground mb-3">
                本服务提供免费和付费两种模式：
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>免费版：每日 3 次生成，基础模板</li>
                <li>Pro 版（¥30/月）：无限生成，全部模板，优先队列</li>
                <li>年度版（¥300/年）：Pro 版所有功能，全年无限使用</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                付费订阅可随时取消，取消后当前付费周期内仍可正常使用，到期后恢复免费版。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. 使用限制</h2>
              <p className="text-muted-foreground">
                禁止将本服务用于生成违法、侵权、有害内容。我们保留对违规账户暂停或终止服务的权利。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. 知识产权</h2>
              <p className="text-muted-foreground">
                通过本服务生成的提示词归用户所有，可用于任何用途。模板内容归 PromptGenius 所有，未经授权不得转载或商业化使用。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. 免责条款</h2>
              <p className="text-muted-foreground">
                本服务按「现状」提供，不保证服务不会中断或完全无误。我们不对因使用本服务而产生的任何间接损失承担责任。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
