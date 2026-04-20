export type ToolInputType = "textarea" | "text" | "select" | "number";

export interface ToolInput {
  id: string;
  label: string;
  type: ToolInputType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: string;
  halfWidth?: boolean;
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  inputs: ToolInput[];
  systemPrompt: string;
  userPromptTemplate: (inputs: Record<string, string>) => string;
  usageSteps?: string[];
}
