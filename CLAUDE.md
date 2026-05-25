# PromptGenius - AI提示词自动生成网站

## 项目信息
- 技术栈：Next.js 16 + TypeScript + Tailwind CSS
- 数据库：Supabase (PostgreSQL)
- AI：OpenAI API
- 认证：Clerk
- 部署：Vercel

## 开发命令
- 开发：`npm run dev`
- 构建：`npm run build`
- 类型检查：`npx tsc --noEmit`

## 目录约定
- `src/app/` - 页面路由
- `src/components/` - UI组件
- `src/lib/` - 工具函数
- `src/services/` - 业务逻辑
- `src/types/` - TypeScript类型定义
- `.env.local` - 环境变量

## 代码规范
- ESLint + Prettier
- TypeScript strict mode
- 变量/函数名用camelCase，组件名用PascalCase
