import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">联系我们</h1>

          <div className="bg-white border border-border rounded-xl p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">邮件</h2>
              <p className="text-muted-foreground">
                如有任何问题或建议，请发送邮件至：
              </p>
              <a href="mailto:support@promptgenius.com" className="text-primary font-medium">
                support@promptgenius.com
              </a>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">工作时间</h2>
              <p className="text-muted-foreground">
                周一至周五 9:00 - 18:00（北京时间）
              </p>
              <p className="text-muted-foreground">
                我们通常在 24 小时内回复。
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-bold mb-2">反馈建议</h2>
              <p className="text-muted-foreground mb-4">
                我们非常重视用户的反馈。如果你有功能建议或发现了 Bug，请通过邮件告诉我们，我们会认真对待每一条反馈。
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
