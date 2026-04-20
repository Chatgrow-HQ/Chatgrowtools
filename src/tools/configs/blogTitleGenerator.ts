import type { ToolConfig } from "../../types/tool";

export const blogTitleGeneratorConfig: ToolConfig = {
  id: "blog-title-generator",
  name: "AI Blog Title Generator",
  description: "Generate catchy, SEO-optimized blog titles that grab attention and drive clicks.",
  icon: "FileText",
  inputs: [
    {
      id: "keywords",
      label: "Keywords",
      type: "text",
      placeholder: "e.g. digital marketing, remote work, healthy eating",
      required: true,
    },
    {
      id: "summary",
      label: "Blog Summary",
      type: "textarea",
      placeholder: "Briefly describe what your blog post is about...",
      required: true,
    },
    {
      id: "audience",
      label: "Target Audience",
      type: "text",
      placeholder: "e.g. small business owners, tech enthusiasts",
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
        { label: "Informative", value: "informative" },
        { label: "Provocative", value: "provocative" },
        { label: "Witty", value: "witty" },
      ],
      defaultValue: "informative",
      required: true,
      halfWidth: true,
    },
  ],
  systemPrompt:
    "You are a professional content strategist and SEO expert. You specialize in creating high-converting blog titles that balance SEO requirements with human curiosity.",
  userPromptTemplate: (inputs) => {
    return `Generate 10 catchy and SEO-optimized blog titles in ${inputs.language} based on the following:
    
Keywords: ${inputs.keywords}
Summary: ${inputs.summary}
Target Audience: ${inputs.audience}
Desired Tone: ${inputs.tone}

Please provide a mix of different types of titles (e.g. How-to, Listicle, Question-based, Bold Statement).`;
  },
  usageSteps: [
    "Enter your target keywords",
    "Provide a brief summary of your blog content",
    "Specify your target audience",
    "Select the language and tone",
    "Click generate titles and choose your favorite!",
  ],
};
