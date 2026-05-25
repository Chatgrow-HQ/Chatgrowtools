import { aiReplyGeneratorConfig } from './configs/aiReplyGenerator';
import { socialBioGeneratorConfig } from './configs/socialBioGenerator';
import { blogTitleGeneratorConfig } from './configs/blogTitleGenerator';
import { aiPromptGeneratorConfig } from './configs/aiPromptGenerator';
import { faqGeneratorConfig } from './configs/faqGenerator';
import {
  aiDocumentChatConfig,
  aiPdfChatConfig,
  aiTextDataChatConfig,
  aiWordChatConfig,
} from './configs/documentChatTools';
import type { ToolConfig } from '../types/tool';

export const tools: Record<string, ToolConfig> = {
  'ai-reply-generator': aiReplyGeneratorConfig,
  'social-bio-generator': socialBioGeneratorConfig,
  'blog-title-generator': blogTitleGeneratorConfig,
  'ai-prompt-generator': aiPromptGeneratorConfig,
  'ai-faq-generator': faqGeneratorConfig,
  'ai-chat-document-data': aiDocumentChatConfig,
  'ai-chat-text-data': aiTextDataChatConfig,
  'ai-chat-pdf-document-data': aiPdfChatConfig,
  'ai-chat-word-document-data': aiWordChatConfig,
};

export const getToolById = (id: string | null): ToolConfig => {
  if (!id || !tools[id]) {
    // Default to the first tool if not found or no ID provided
    return tools['ai-reply-generator'];
  }
  return tools[id];
};
