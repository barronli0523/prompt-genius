-- 迁移：添加订阅和订单管理支持
-- 执行时间：2026-05-27

-- 1. user_profiles 增加字段
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS daily_usage_count INT DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_usage_date DATE DEFAULT CURRENT_DATE;

-- 更新 subscription_tier 允许 'annual'
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_subscription_tier_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_subscription_tier_check CHECK (subscription_tier IN ('free', 'pro', 'annual'));

-- 2. generated_prompts 改为直接存 clerk_id
ALTER TABLE generated_prompts DROP CONSTRAINT IF EXISTS generated_prompts_user_id_fkey;
ALTER TABLE generated_prompts ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE generated_prompts ALTER COLUMN user_id SET NOT NULL;

-- 3. 创建订阅表
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('pro', 'annual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  order_no TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('pro', 'annual')),
  amount INTEGER NOT NULL,
  pay_method TEXT CHECK (pay_method IN ('wechat', 'alipay')),
  pay_status TEXT NOT NULL DEFAULT 'pending' CHECK (pay_status IN ('pending', 'paid', 'failed', 'refunded')),
  pay_time TIMESTAMPTZ,
  pay_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. usage_logs 改为直接存 clerk_id
ALTER TABLE usage_logs DROP CONSTRAINT IF EXISTS usage_logs_user_id_fkey;
ALTER TABLE usage_logs ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE usage_logs ALTER COLUMN user_id SET NOT NULL;

-- 6. favorite_templates 改为直接存 clerk_id
ALTER TABLE favorite_templates DROP CONSTRAINT IF EXISTS favorite_templates_user_id_fkey;
ALTER TABLE favorite_templates ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE favorite_templates ALTER COLUMN user_id SET NOT NULL;

-- 7. 创建索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_pay_status ON orders(pay_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 8. 自动更新 trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
