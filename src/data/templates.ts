import { Category, Template } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "文章写作",
    slug: "writing",
    icon: "✍️",
    description: "文章、故事、文案生成",
  },
  {
    id: "2",
    name: "AI绘图",
    slug: "ai-drawing",
    icon: "🎨",
    description: "AI图像生成提示词",
  },
  {
    id: "3",
    name: "代码生成",
    slug: "code-generation",
    icon: "💻",
    description: "编程辅助提示词",
  },
  {
    id: "4",
    name: "营销文案",
    slug: "marketing",
    icon: "📢",
    description: "广告、社交媒体文案",
  },
  {
    id: "5",
    name: "视频脚本",
    slug: "video-script",
    icon: "🎬",
    description: "短视频、YouTube脚本",
  },
  {
    id: "6",
    name: "商业分析",
    slug: "business",
    icon: "📊",
    description: "行业分析、竞品研究",
  },
];

export const templates: Template[] = [
  {
    id: "t1",
    category_id: "2",
    name: "AI人像摄影",
    description: "生成专业人像摄影提示词",
    target_ai: "midjourney",
    form_fields: [
      {
        name: "subject",
        type: "text",
        label: "主体描述",
        placeholder: "一个年轻女孩，长发飘飘",
        required: true,
      },
      {
        name: "style",
        type: "select",
        label: "风格",
        options: ["写实", "动漫", "油画", "赛博朋克", "复古"],
        default: "写实",
        required: true,
      },
      {
        name: "lighting",
        type: "select",
        label: "光线",
        options: ["自然光", "影棚光", "戏剧光", "黄金时刻"],
        default: "自然光",
        required: true,
      },
      {
        name: "aspect_ratio",
        type: "select",
        label: "比例",
        options: ["1:1", "16:9", "9:16", "4:3"],
        default: "1:1",
        required: true,
      },
      {
        name: "mood",
        type: "text",
        label: "氛围/情绪",
        placeholder: "温暖、忧郁、神秘...",
        required: false,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating highly effective Midjourney image generation prompts. Your task is to craft precise, professional prompts that users can directly use in Midjourney.",
    user_prompt_template:
      "请根据以下要求创建一个专业的 Midjourney 提示词：主体：{subject}，风格：{style}，光线：{lighting}，氛围：{mood}，比例：{aspect_ratio}。输出格式：完整的英文提示词，包含风格、光线、构图、质量参数等，以 --ar {aspect_ratio} --v 6 结尾。",
    example_output:
      "一个年轻女孩长发飘飘, 写实风格, 黄金时刻光线, 梦幻而空灵, 高细节, 8k分辨率, 专业摄影 --ar 1:1 --v 6",
    is_premium: false,
    usage_count: 1240,
    like_count: 89,
    created_at: "2025-01-01",
  },
  {
    id: "t2",
    category_id: "1",
    name: "文章写作",
    description: "生成高质量SEO文章",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "topic",
        type: "text",
        label: "文章主题",
        placeholder: "AI如何改变未来教育",
        required: true,
      },
      {
        name: "tone",
        type: "select",
        label: "语气风格",
        options: ["专业", "轻松", "幽默", "学术", "说服"],
        default: "专业",
        required: true,
      },
      {
        name: "length",
        type: "select",
        label: "文章长度",
        options: ["短 (约500字)", "中 (约1000字)", "长 (约2000字)"],
        default: "中 (约1000字)",
        required: true,
      },
      {
        name: "keywords",
        type: "text",
        label: "SEO关键词（逗号分隔）",
        placeholder: "AI, 教育, 未来科技",
        required: false,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating effective ChatGPT prompts for content writing. Your task is to craft precise, ready-to-use prompts that users can paste into ChatGPT to get high-quality articles.",
    user_prompt_template:
      "请创建一个用于生成文章的 ChatGPT 提示词。要求：语气风格：{tone}，文章主题：{topic}，长度约：{length}，包含SEO关键词：{keywords}。输出：一个完整的、可直接复制使用的 ChatGPT 提示词，包含角色设定、写作要求和格式规范。",
    example_output:
      "写一篇专业风格的文章，主题：AI如何改变未来教育，长度：约1000字，包含关键词：AI、教育、未来科技。",
    is_premium: false,
    usage_count: 2150,
    like_count: 156,
    created_at: "2025-01-01",
  },
  {
    id: "t3",
    category_id: "3",
    name: "Python代码生成",
    description: "生成Python代码片段",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "task",
        type: "text",
        label: "功能描述",
        placeholder: "读取CSV文件并生成数据可视化图表",
        required: true,
      },
      {
        name: "library",
        type: "select",
        label: "偏好库",
        options: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "FastAPI"],
        default: "Pandas",
        required: false,
      },
      {
        name: "experience",
        type: "select",
        label: "你的经验水平",
        options: ["入门", "中级", "高级"],
        default: "中级",
        required: true,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating effective coding prompts for AI assistants. Your task is to craft precise, ready-to-use prompts that users can paste into ChatGPT/Claude to get clean, professional code.",
    user_prompt_template:
      "请创建一个用于生成 Python 代码的 ChatGPT 提示词。功能需求：{task}，优先使用库：{library}，用户经验水平：{experience}。输出：一个完整的、可直接复制使用的提示词，包含角色设定、代码规范要求和输出格式说明。",
    example_output:
      "编写Python代码读取CSV文件并创建数据可视化图表，使用Pandas和Matplotlib，适合中级开发者，附详细注释。",
    is_premium: false,
    usage_count: 1890,
    like_count: 134,
    created_at: "2025-01-01",
  },
  {
    id: "t4",
    category_id: "4",
    name: "社交媒体文案",
    description: "生成小红书/Twitter文案",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "product",
        type: "text",
        label: "产品/服务名称",
        placeholder: "AI写作助手",
        required: true,
      },
      {
        name: "platform",
        type: "select",
        label: "社交平台",
        options: ["小红书", "Twitter/X", "LinkedIn", "Instagram", "Facebook"],
        default: "小红书",
        required: true,
      },
      {
        name: "angle",
        type: "select",
        label: "切入角度",
        options: ["种草推荐", "痛点解决", "测评对比", "教程分享", "情感共鸣"],
        default: "种草推荐",
        required: true,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating social media content prompts. Your task is to craft precise prompts that users can paste into ChatGPT to generate viral social media copy.",
    user_prompt_template:
      "请创建一个用于生成社交平台文案的 ChatGPT 提示词。产品/服务：{product}，发布平台：{platform}，切入角度：{angle}。输出：一个完整的提示词，包含角色设定、平台调性要求、文案结构和标签规范。",
    example_output:
      "Create a Xiaohongshu post about AI Writing Assistant with a recommendation angle, including emojis and hashtags.",
    is_premium: false,
    usage_count: 3200,
    like_count: 210,
    created_at: "2025-01-01",
  },
  // 视频脚本模板 (category_id: "5")
  {
    id: "t5",
    category_id: "5",
    name: "抖音短视频脚本",
    description: "生成15-60秒短视频脚本",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "topic",
        type: "text",
        label: "视频主题",
        placeholder: "职场新人避坑指南",
        required: true,
      },
      {
        name: "duration",
        type: "select",
        label: "视频时长",
        options: ["15秒", "30秒", "60秒"],
        default: "30秒",
        required: true,
      },
      {
        name: "style",
        type: "select",
        label: "视频风格",
        options: ["口播", "剧情", "教程", "种草", "搞笑"],
        default: "口播",
        required: true,
      },
      {
        name: "hook",
        type: "text",
        label: "开头钩子（可选）",
        placeholder: "90%的人都不知道...",
        required: false,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating video script prompts for AI assistants. Your task is to craft precise prompts users can paste into ChatGPT to generate engaging short video scripts.",
    user_prompt_template:
      "请创建一个用于生成短视频脚本的 ChatGPT 提示词。视频时长：{duration}，风格：{style}，主题：{topic}，开头钩子：{hook}。输出：一个完整的提示词，包含角色设定、脚本结构要求和输出格式规范。",
    example_output:
      "写一个30秒的口播风格短视频脚本，主题：职场新人避坑指南。开头钩子：90%的人都不知道这3个职场潜规则。包含画面描述、台词、字幕建议。",
    is_premium: true,
    usage_count: 2800,
    like_count: 178,
    created_at: "2025-01-15",
  },
  {
    id: "t6",
    category_id: "5",
    name: "YouTube长视频脚本",
    description: "生成5-15分钟YouTube视频脚本",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "topic",
        type: "text",
        label: "视频主题",
        placeholder: "如何用AI提升10倍工作效率",
        required: true,
      },
      {
        name: "length",
        type: "select",
        label: "视频长度",
        options: ["5分钟", "10分钟", "15分钟"],
        default: "10分钟",
        required: true,
      },
      {
        name: "tone",
        type: "select",
        label: "语气风格",
        options: ["专业教学", "轻松闲聊", "深度分析", "娱乐搞笑"],
        default: "专业教学",
        required: true,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating YouTube video script prompts. Your task is to craft precise prompts users can paste into ChatGPT to generate professional long-form video scripts.",
    user_prompt_template:
      "请创建一个用于生成 YouTube 视频脚本的 ChatGPT 提示词。视频时长：{length}，主题：{topic}，语气风格：{tone}。输出：一个完整的提示词，包含角色设定、脚本结构（开头钩子/内容主体/结尾CTA）和输出格式要求。",
    example_output:
      "写一个10分钟的YouTube视频脚本，主题：如何用AI提升10倍工作效率，风格：专业教学。包含开头钩子、内容主体、结尾CTA。",
    is_premium: true,
    usage_count: 1950,
    like_count: 142,
    created_at: "2025-01-15",
  },
  // 商业分析模板 (category_id: "6")
  {
    id: "t7",
    category_id: "6",
    name: "行业分析报告",
    description: "生成行业趋势分析报告",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "industry",
        type: "text",
        label: "行业名称",
        placeholder: "新能源汽车行业",
        required: true,
      },
      {
        name: "region",
        type: "select",
        label: "地域范围",
        options: ["中国市场", "全球市场", "东南亚市场", "欧美市场"],
        default: "中国市场",
        required: true,
      },
      {
        name: "depth",
        type: "select",
        label: "分析深度",
        options: ["概览（约1000字）", "详细（约3000字）", "深度（约5000字）"],
        default: "详细（约3000字）",
        required: true,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating business analysis prompts. Your task is to craft precise prompts users can paste into ChatGPT to generate professional industry reports.",
    user_prompt_template:
      "请创建一个用于生成行业分析报告的 ChatGPT 提示词。行业：{industry}，地域范围：{region}，分析深度：{depth}。输出：一个完整的提示词，包含角色设定、报告结构（概况/规模/竞争/趋势/机遇挑战）和输出格式规范。",
    example_output:
      "写一份中国市场新能源汽车行业的行业分析报告，深度：约3000字。包含行业概况、市场规模、竞争格局、发展趋势、关键机遇与挑战。",
    is_premium: true,
    usage_count: 1680,
    like_count: 95,
    created_at: "2025-01-20",
  },
  {
    id: "t8",
    category_id: "6",
    name: "竞品分析",
    description: "生成竞争对手对比分析",
    target_ai: "chatgpt",
    form_fields: [
      {
        name: "my_product",
        type: "text",
        label: "我的产品/服务",
        placeholder: "AI写作助手App",
        required: true,
      },
      {
        name: "competitors",
        type: "text",
        label: "竞品名称（逗号分隔）",
        placeholder: "Jasper, Copy.ai, Writesonic",
        required: true,
      },
      {
        name: "dimensions",
        type: "select",
        label: "分析维度",
        options: ["功能对比", "价格对比", "用户体验", "市场定位", "综合分析"],
        default: "综合分析",
        required: true,
      },
    ],
    system_prompt:
      "You are an expert prompt engineer specializing in creating competitive analysis prompts. Your task is to craft precise prompts users can paste into ChatGPT to generate professional competitor comparisons.",
    user_prompt_template:
      "请创建一个用于生成竞品分析的 ChatGPT 提示词。我的产品：{my_product}，竞品列表：{competitors}，分析维度：{dimensions}。输出：一个完整的提示词，包含角色设定、分析框架和对比表格输出格式要求。",
    example_output:
      "分析AI写作助手App与Jasper, Copy.ai, Writesonic的对比。分析维度：综合分析。输出包含功能、定价、优劣势、差异化建议的对比表格。",
    is_premium: true,
    usage_count: 1420,
    like_count: 87,
    created_at: "2025-01-20",
  },
];
