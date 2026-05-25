import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  clerk_id: string
  email?: string
  display_name?: string
  subscription_tier: 'free' | 'pro' | 'team'
  credits_remaining: number
  credits_reset_at: string
  created_at: string
  updated_at: string
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

export async function getUserProfile(clerkId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single()

  if (error) return null
  return data
}

export async function createOrUpdateUserProfile(clerkId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      clerk_id: clerkId,
      ...profile,
    })
    .eq('clerk_id', clerkId)
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
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      credits_remaining: supabase.rpc('decrement_credits', { amount }),
    })
    .eq('id', userId)
    .select('credits_remaining')
    .single()

  if (error) throw error
  return data.credits_remaining
}