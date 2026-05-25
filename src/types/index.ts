export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  prompt_count: number;
}

export interface Template {
  id: string;
  category_id: string;
  name: string;
  description: string;
  form_fields: FormField[];
  system_prompt: string;
  user_prompt_template: string;
  example_output: string;
  is_premium: boolean;
  usage_count: number;
  like_count: number;
  target_ai: 'chatgpt' | 'midjourney' | 'claude' | 'stable-diffusion';
  created_at: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'select' | 'textarea' | 'number';
  label: string;
  placeholder?: string;
  options?: string[];
  default?: string;
  required: boolean;
}

export interface GenerationResult {
  prompt: string;
  credits_used: number;
  credits_remaining: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  credits: number;
  subscription_tier: 'free' | 'pro' | 'team';
}
