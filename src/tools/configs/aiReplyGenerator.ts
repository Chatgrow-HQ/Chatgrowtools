import type { ToolConfig } from "../../types/tool";

export const aiReplyGeneratorConfig: ToolConfig = {
  id: "ai-reply-generator",
  name: "AI Reply Generator",
  description:
    "Generate thoughtful and professional replies for emails, social media, and professional communication.",
  icon: "Sparkles",
  inputs: [
    {
      id: "message",
      label: "Message to reply to",
      type: "textarea",
      placeholder: "Paste the message or content you want to respond to...",
      required: true,
    },
    {
      id: "tone",
      label: "Tone of Voice",
      type: "select",
      options: [
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" },
        { label: "Humorous", value: "humorous" },
        { label: "Empathetic", value: "empathetic" },
        { label: "Direct", value: "direct" },
      ],
      defaultValue: "professional",
      required: true,
    },
    {
      id: "platform",
      label: "Platform (Optional)",
      type: "text",
      placeholder: "e.g. LinkedIn, Gmail, Twitter",
      required: false,
    },
  ],
  systemPrompt:
    "You are a professional assistant that creates high-quality, context-aware replies. Your replies are concise, helpful, and match the specified tone perfectly.",
  userPromptTemplate: (inputs) => {
    return `Generate a ${inputs.tone || "professional"} reply for ${inputs.platform || "a general platform"}.
    
Message to reply to:
"${inputs.message}"

Please provide 3 variations of the reply.`;
  },
  usageSteps: [
    "Paste the message or content you want to respond to",
    "Choose the tone of voice for your reply",
    "Optionally specify the platform",
    "Click generate reply",
    "Copy + paste your favourite variation!",
  ],
};
