import type { ToolConfig } from "../../types/tool";

export const faqGeneratorConfig: ToolConfig = {
  id: "ai-faq-generator",
  name: "AI FAQ Generator",
  description: "Transform your content into clear, helpful, and professional Frequently Asked Questions.",
  icon: "HelpCircle",
  inputs: [
    {
      id: "content",
      label: "Content",
      type: "textarea",
      placeholder: "Paste the content or documentation you want to generate FAQs from...",
      required: true,
    },
    {
      id: "count",
      label: "Number of FAQs to generate",
      type: "number",
      placeholder: "e.g. 5",
      defaultValue: "5",
      required: true,
    },
    {
      id: "language",
      label: "Language",
      type: "select",
      options: [
        { label: "English", value: "English" },
        { label: "Spanish", value: "Spanish" },
        { label: "French", value: "French" },
        { label: "German", value: "German" },
        { label: "Portuguese", value: "Portuguese" },
        { label: "Italian", value: "Italian" },
      ],
      defaultValue: "English",
      required: true,
      halfWidth: true,
    },
    {
      id: "tone",
      label: "Tone",
      type: "select",
      options: [
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" },
        { label: "Direct", value: "direct" },
        { label: "Empathetic", value: "empathetic" },
      ],
      defaultValue: "professional",
      required: true,
      halfWidth: true,
    },
  ],
  systemPrompt:
    "You are a professional technical writer and customer success expert. You specialize in extracting the most important information from content and presenting it as clear, concise, and helpful FAQs.",
  userPromptTemplate: (inputs) => {
    return `Generate ${inputs.count} Frequently Asked Questions (FAQs) in ${inputs.language} based on the following content:
    
Content:
"${inputs.content}"

Tone: ${inputs.tone}

Please provide both the questions and the answers. Ensure they are clear, accurate, and easy to understand.`;
  },
  usageSteps: [
    "Paste the content or text you want to turn into FAQs",
    "Select how many FAQs you need",
    "Choose the preferred language and tone",
    "Click generate FAQs",
    "Review and copy the generated questions and answers!",
  ],
};
