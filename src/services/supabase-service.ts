import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  clerk_id: string
  email?: string
  display_name?: string
  subscription_tier: 'free' | 'pro' | 'annual'
  credits_remaining: number
  role: string
  daily_usage_count: number
  last_usage_date: string
  created_at: string
  updated_at: string
}

export interface ActiveSubscription {
  tier: 'free' | 'pro' | 'annual'
  expiry: string | null
}

export const DAILY_LIMITS: Record<string, number> = {
  free: 3,
  pro: 9999,
  annual: 9999,
}

export interface GeneratedPrompt {
  id: string
  user_id: string
  template_id: string
  template_name?: string
  input_params: Record<string, any>
  generated_prompt: string
  optimized_prompt?: string
  is_favorite: boolean
  created_at: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  if (error) return null
  return data
}

export async function createOrUpdateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      clerk_id: userId,
      ...profile,
    })
    .eq('clerk_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function saveGeneratedPrompt(
  userId: string,
  promptData: Omit<GeneratedPrompt, 'id' | 'created_at' | 'user_id'>
): Promise<GeneratedPrompt> {
  const { data, error } = await supabase
    .from('generated_prompts')
    .insert({
      user_id: userId,
      ...promptData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserGeneratedPrompts(
  userId: string,
  limit = 50,
  offset = 0
): Promise<GeneratedPrompt[]> {
  const { data, error } = await supabase
    .from('generated_prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data || []
}

export async function toggleFavoritePrompt(
  promptId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('generated_prompts')
    .update({ is_favorite: true })
    .eq('id', promptId)
    .eq('user_id', userId)
    .select('is_favorite')
    .single()

  if (error) throw error
  return data.is_favorite
}

export async function getFavoritePrompts(userId: string): Promise<GeneratedPrompt[]> {
  const { data, error } = await supabase
    .from('generated_prompts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deductCredits(userId: string, amount = 1): Promise<number> {
  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('credits_remaining')
    .eq('clerk_id', userId)
    .single()

  if (fetchError || !profile) throw fetchError || new Error('Profile not found')

  const newCredits = Math.max(0, profile.credits_remaining - amount)

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ credits_remaining: newCredits })
    .eq('clerk_id', userId)
    .select('credits_remaining')
    .single()

  if (error) throw error
  return data.credits_remaining
}

/**
 * Check daily usage limit and increment counter atomically.
 * Returns { allowed: true, count, limit } or { allowed: false, count, limit }.
 */
export async function checkAndIncrementDailyUsage(userId: string): Promise<{
  allowed: boolean
  count: number
  limit: number
}> {
  // Fetch profile with usage info
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('daily_usage_count, last_usage_date, subscription_tier')
    .eq('clerk_id', userId)
    .single()

  if (error || !profile) {
    // No profile yet — allow (treat as free)
    return { allowed: true, count: 0, limit: DAILY_LIMITS.free }
  }

  const today = new Date().toISOString().slice(0, 10)
  let count = profile.daily_usage_count ?? 0
  const tier = profile.subscription_tier || 'free'
  const limit = DAILY_LIMITS[tier] ?? DAILY_LIMITS.free

  // Reset if it's a new day
  if (profile.last_usage_date !== today) {
    count = 0
  }

  if (count >= limit) {
    return { allowed: false, count, limit }
  }

  // Increment
  const newCount = count + 1
  await supabase
    .from('user_profiles')
    .update({
      daily_usage_count: newCount,
      last_usage_date: today,
    })
    .eq('clerk_id', userId)

  return { allowed: true, count: newCount, limit }
}

/**
 * Check if user has an active (non-expired) subscription.
 * Returns the tier and expiry date, or 'free' if none.
 * Auto-expires any past-due subscription records.
 */
export async function getActiveSubscription(userId: string): Promise<ActiveSubscription> {
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('current_period_end', { ascending: false })
    .limit(1)

  if (error || !subs || subs.length === 0) {
    return { tier: 'free', expiry: null }
  }

  const sub = subs[0]
  const now = new Date()
  const expiry = new Date(sub.current_period_end)

  if (now > expiry) {
    // Mark as expired
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('id', sub.id)
    await supabase
      .from('user_profiles')
      .update({ subscription_tier: 'free' })
      .eq('clerk_id', userId)
    return { tier: 'free', expiry: null }
  }

  return { tier: sub.plan_type, expiry: sub.current_period_end }
}