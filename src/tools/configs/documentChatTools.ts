import type { ToolConfig } from "../../types/tool";

const answerSystemPrompt =
  "You are a careful document analysis assistant. Answer only from the provided content unless the user asks for a general writing task. If the answer is not available in the content, say so clearly. Keep answers concise, accurate, and useful.";

const buildChatPrompt = (
  contentLabel: string,
  inputs: Record<string, string>,
) => `Analyze the following ${contentLabel} and answer the user's request.

User request:
"${inputs.question || "Summarize the key points and extract the most useful insights."}"

${contentLabel}:
"${inputs.content || inputs.documentText || ""}"

Return a direct answer. Include a short summary first when helpful.`;

export const aiDocumentChatConfig: ToolConfig = {
  id: "ai-chat-document-data",
  name: "AI Chat with your Document and Data",
  description:
    "Upload any document and chat with our AI to extract insights, summarize content, query your data and get instant, accurate answers.",
  icon: "FileSearch",
  inputs: [
    {
      id: "documentText",
      label: "Document or data file",
      type: "file",
      accept:
        ".pdf,.docx,.txt,.csv,.md,.json,.xml,text/plain,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      required: true,
    },
    {
      id: "question",
      label: "What would you like to know?",
      type: "textarea",
      placeholder:
        "Ask a question, request a short summary, or tell the AI what insights to extract...",
      required: true,
    },
  ],
  systemPrompt: answerSystemPrompt,
  userPromptTemplate: (inputs) => buildChatPrompt("document or data", inputs),
  usageSteps: [
    "Upload your document or data file",
    "Ask a question or request a summary",
    "Click generate answer",
    "Review the answer and copy the insights you need",
  ],
};

export const aiTextDataChatConfig: ToolConfig = {
  id: "ai-chat-text-data",
  name: "AI Chat with Your Text Data",
  description:
    "Paste any plain text (report, article, transcript, or policy doc) and chat with our AI to ask questions, get short summaries, or extract insights and get instant, accurate answers.",
  icon: "TextSearch",
  inputs: [
    {
      id: "content",
      label: "Plain text data",
      type: "textarea",
      placeholder:
        "Paste your report, article, transcript, policy document, or other plain text...",
      required: true,
    },
    {
      id: "question",
      label: "What would you like to know?",
      type: "textarea",
      placeholder:
        "Ask a question, request a short summary, or tell the AI what insights to extract...",
      required: true,
    },
  ],
  systemPrompt: answerSystemPrompt,
  userPromptTemplate: (inputs) => buildChatPrompt("text data", inputs),
  usageSteps: [
    "Paste your text data",
    "Ask a question or request a summary",
    "Click generate answer",
    "Review the answer and copy the insights you need",
  ],
};

export const aiPdfChatConfig: ToolConfig = {
  id: "ai-chat-pdf-document-data",
  name: "AI Chat with Your PDF Document & Data",
  description:
    "Upload any PDF document and chat with our AI to ask questions, get short summaries, or extract insights and get instant, accurate answers.",
  icon: "FileText",
  inputs: [
    {
      id: "documentText",
      label: "PDF document",
      type: "file",
      accept: ".pdf,application/pdf",
      required: true,
    },
    {
      id: "question",
      label: "What would you like to know?",
      type: "textarea",
      placeholder:
        "Ask a question, request a short summary, or tell the AI what insights to extract...",
      required: true,
    },
  ],
  systemPrompt: answerSystemPrompt,
  userPromptTemplate: (inputs) => buildChatPrompt("PDF document", inputs),
  usageSteps: [
    "Upload your PDF document",
    "Ask a question or request a summary",
    "Click generate answer",
    "Review the answer and copy the insights you need",
  ],
};

export const aiWordChatConfig: ToolConfig = {
  id: "ai-chat-word-document-data",
  name: "AI Chat with Your Word Document & Data",
  description:
    "Upload any Word document and chat with our AI to extract insights, summarize content, query your data and get instant, accurate answers.",
  icon: "FileType2",
  inputs: [
    {
      id: "documentText",
      label: "Word document",
      type: "file",
      accept:
        ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      required: true,
    },
    {
      id: "question",
      label: "What would you like to know?",
      type: "textarea",
      placeholder:
        "Ask a question, request a short summary, or tell the AI what insights to extract...",
      required: true,
    },
  ],
  systemPrompt: answerSystemPrompt,
  userPromptTemplate: (inputs) => buildChatPrompt("Word document", inputs),
  usageSteps: [
    "Upload your Word document",
    "Ask a question or request a summary",
    "Click generate answer",
    "Review the answer and copy the insights you need",
  ],
};
