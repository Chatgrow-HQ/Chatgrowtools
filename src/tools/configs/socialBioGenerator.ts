import type { ToolConfig } from '../../types/tool';

export const socialBioGeneratorConfig: ToolConfig = {
  id: 'social-bio-generator',
  name: 'Social Bio Generator',
  description: 'Create catchy and impactful bios for Instagram, X (Twitter), and TikTok that turn viewers into followers.',
  icon: 'User',
  inputs: [
    {
      id: 'about',
      label: 'What do you do? (Describe yourself or your brand)',
      type: 'textarea',
      placeholder: 'e.g. A digital artist specializing in neon-cyberpunk aesthetics...',
      required: true
    },
    {
      id: 'style',
      label: 'Style / Vibe',
      type: 'select',
      defaultValue: 'creative',
      required: true,
      halfWidth: true
    },
    {
      id: 'keyword',
      label: 'One Must-Include Keyword',
      type: 'text',
      placeholder: 'e.g. Coffee, Crypto, Web3, Fitness',
      required: false,
      halfWidth: true
    }
  ],
  systemPrompt: 'You are an expert social media manager specializing in copywriting. You create bios that are engaging, use relevant emojis, and fits the platform limitations perfectly.',
  userPromptTemplate: (inputs) => {
    return `Create 3 different social media bios based on this info:
    
About: "${inputs.about}"
Style: "${inputs.style}"
Keyword to include: "${inputs.keyword || 'None specified'}"

Please provide options for Instagram (with emojis) and X/Twitter (shorter, more punchy).`;
  },
  usageSteps: [
    "Describe yourself or your business in a few words",
    "Select whether this is for a person or business",
    "Choose the tone for your bio",
    "Click generate bios",
    "Copy + paste your favourite into your profile!",
  ],
};
