import type { ToolConfig } from "../../types/tool";

export const aiPromptGeneratorConfig: ToolConfig = {
  id: "ai-prompt-generator",
  name: "AI Prompt Generator",
  description: "Create high-quality, structured prompts for AI models using proven frameworks.",
  icon: "Terminal",
  inputs: [
    {
      id: "framework",
      label: "Prompt Framework",
      type: "select",
      options: [
        { label: "PARE (Purpose, Audience, Role, Expectation)", value: "PARE" },
        { label: "RTF (Role, Task, Format)", value: "RTF" },
        { label: "CREATE (Context, Role, Task, Example)", value: "CREATE" },
        { label: "Basic (No framework)", value: "basic" },
      ],
      defaultValue: "PARE",
      required: true,
    },
    {
      id: "action",
      label: "Action",
      type: "text",
      placeholder: "What should the AI do? (e.g. Write a sales email)",
      required: true,
    },
    {
      id: "purpose",
      label: "Purpose",
      type: "text",
      placeholder: "Why are you asking for this? (e.g. To increase signup rates)",
      required: true,
    },
    {
      id: "expectation",
      label: "Expectation",
      type: "textarea",
      placeholder: "What does success look like? (e.g. Tone should be witty, under 200 words)",
      required: true,
    },
  ],
  systemPrompt:
    "You are an expert Prompt Engineer. Your goal is to take user requirements and turn them into highly effective, structured prompts that get the best possible results from Large Language Models.",
  userPromptTemplate: (inputs) => {
    return `Generate a high-quality AI prompt using the ${inputs.framework} framework based on these requirements:
    
Action: ${inputs.action}
Purpose: ${inputs.purpose}
Expectations: ${inputs.expectation}

The output should be the final prompt that I can copy and paste directly into an AI like ChatGPT or Claude. Include clear instructions, constraints, and formatting if applicable.`;
  },
  usageSteps: [
    "Choose a prompt framework (PARE is recommended for beginners)",
    "Define the action you want the AI to perform",
    "Explain the purpose or goal of the task",
    "Describe your expectations for the result",
    "Click generate and copy your professional prompt!",
  ],
};
