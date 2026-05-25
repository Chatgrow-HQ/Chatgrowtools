import React, { useState } from "react";
import type { ToolConfig } from "../types/tool";
import { Button, Input, Textarea, Label, Card } from "./ui-components";
import { generateText } from "../services/aiService";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Upload,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";
import { MarketingSection } from "./MarketingSection";
import { cn } from "../lib/utils";
import { extractFileText } from "../lib/extractFileText";

interface ToolLayoutProps {
  config: ToolConfig;
}

interface UploadedFileDetails {
  name: string;
  size: number;
  characterCount: number;
  preview: string;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ config }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState<Record<string, boolean>>({});
  const [fileDetails, setFileDetails] = useState<
    Record<string, UploadedFileDetails>
  >({});
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const USAGE_LIMIT = 2;
  const WINDOW_MS = 24 * 60 * 60 * 1000;

  const getUsage = () => {
    try {
      const usage = JSON.parse(
        localStorage.getItem(`usage_${config.id}`) || "[]",
      );
      const now = Date.now();
      return usage.filter((ts: number) => now - ts < WINDOW_MS);
    } catch {
      return [];
    }
  };

  const trackUsage = () => {
    const currentUsage = getUsage();
    const newUsage = [...currentUsage, Date.now()];
    localStorage.setItem(`usage_${config.id}`, JSON.stringify(newUsage));
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const removeFile = (id: string) => {
    setFileDetails((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setFileErrors((prev) => ({ ...prev, [id]: "" }));
    handleInputChange(id, "");
  };

  const handleFileChange = async (id: string, file?: File) => {
    setFileErrors((prev) => ({ ...prev, [id]: "" }));

    if (!file) {
      removeFile(id);
      return;
    }

    setFileLoading((prev) => ({ ...prev, [id]: true }));
    setFileDetails((prev) => ({
      ...prev,
      [id]: {
        name: file.name,
        size: file.size,
        characterCount: 0,
        preview: "",
      },
    }));

    try {
      const text = await extractFileText(file);

      if (!text.trim()) {
        throw new Error(
          "No readable text was found in this file. Try another document or paste the content into the text tool.",
        );
      }

      handleInputChange(id, text);
      setFileDetails((prev) => ({
        ...prev,
        [id]: {
          name: file.name,
          size: file.size,
          characterCount: text.trim().length,
          preview: text.replace(/\s+/g, " ").trim().slice(0, 220),
        },
      }));
    } catch (error) {
      setFileDetails((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      handleInputChange(id, "");
      setFileErrors((prev) => ({
        ...prev,
        [id]:
          error instanceof Error
            ? error.message
            : "Could not read this file. Please try another file.",
      }));
    } finally {
      setFileLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUsage = getUsage();
    if (currentUsage.length >= USAGE_LIMIT) {
      setLimitReached(true);
      return;
    }

    setLimitReached(false);
    setLoading(true);
    setResult("");

    try {
      const userPrompt = config.userPromptTemplate(inputs);
      const response = await generateText(config.systemPrompt, userPrompt);
      setResult(response);
      trackUsage();
    } catch (error) {
      console.error("Generation failed:", error);
      setResult("Failed to generate response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputs({});
    setFileDetails({});
    setFileErrors({});
    setResult("");
  };

  const getActionLabel = () => {
    const name = config.name.toLowerCase();

    if (name.includes("chat")) {
      return "Generate Answer";
    }

    return "Generate Reply";
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <span className="text-brand font-bold text-sm uppercase tracking-widest">
          Free Tools
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
          {config.name}
        </h2>

        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          {config.description}
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {!result && config.usageSteps && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How to generate {config.name.toLowerCase().includes("reply") ? "a reply" : "a bio"}
            </h3>
            <ol className="space-y-3">
              {config.usageSteps.map((step, index) => (
                <li key={index} className="flex gap-3 text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-400">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          {config.inputs.map((input) => (
            <div 
              key={input.id} 
              className={cn(
                "space-y-2",
                input.halfWidth ? "col-span-1" : "sm:col-span-2"
              )}
            >
              <Label htmlFor={input.id}>
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {input.type === "textarea" ? (
                <Textarea
                  id={input.id}
                  placeholder={input.placeholder}
                  required={input.required}
                  value={inputs[input.id] || ""}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              ) : input.type === "select" ? (
                <select
                  id={input.id}
                  required={input.required}
                  value={inputs[input.id] || ""}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                >
                  <option value="" disabled>
                    Select {input.label.toLowerCase()}
                  </option>
                  {input.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : input.type === "file" ? (
                <div className="space-y-2">
                  {inputs[input.id] && fileDetails[input.id] ? (
                    <div className="rounded-lg border border-brand/20 bg-brand-light/40 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {fileDetails[input.id].name}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium text-brand">
                              <CheckCircle2 className="h-3 w-3" />
                              Ready
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatFileSize(fileDetails[input.id].size)} ·{" "}
                            {fileDetails[input.id].characterCount.toLocaleString()}{" "}
                            characters extracted
                          </p>
                          {fileDetails[input.id].preview && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                              {fileDetails[input.id].preview}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <label
                          htmlFor={input.id}
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Replace file
                        </label>
                        <button
                          type="button"
                          onClick={() => removeFile(input.id)}
                          className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-white hover:text-red-600"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor={input.id}
                      className={cn(
                        "flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-brand hover:bg-brand-light/30",
                        fileErrors[input.id] && "border-red-200 bg-red-50",
                      )}
                    >
                      <Upload className="mb-3 h-6 w-6 text-brand" />
                      <span className="text-sm font-semibold text-gray-800">
                        {fileLoading[input.id]
                          ? "Reading file..."
                          : "Choose a file to chat with"}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        PDF, DOCX, TXT, CSV, JSON, XML, or Markdown
                      </span>
                    </label>
                  )}
                  <Input
                    id={input.id}
                    type="file"
                    accept={input.accept}
                    required={input.required && !inputs[input.id]}
                    onClick={(e) => {
                      e.currentTarget.value = "";
                    }}
                    onChange={(e) =>
                      handleFileChange(input.id, e.target.files?.[0])
                    }
                    className="sr-only"
                  />
                  {fileErrors[input.id] && (
                    <p className="text-sm text-red-600">
                      {fileErrors[input.id]}
                    </p>
                  )}
                </div>
              ) : (
                <Input
                  id={input.id}
                  type={input.type}
                  placeholder={input.placeholder}
                  required={input.required}
                  value={inputs[input.id] || ""}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-3 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button type="submit" loading={loading} className="w-full flex-1">
              {!loading && <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Generating..." : getActionLabel()}
            </Button>
          </div>

          {limitReached && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 animate-in fade-in zoom-in-95 duration-300">
              <p className="font-semibold mb-1">Daily Limit Reached</p>
              <p>
                You can only use this tool {USAGE_LIMIT} times every 24 hours.
                Please come back tomorrow.
              </p>
            </div>
          )}
        </form>

        {result && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Chatgrow AI Result
              </h3>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center text-xs font-medium text-brand hover:text-brand-hover transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" /> Copy Result
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl bg-brand-light/40 border border-brand/5 p-5 text-gray-800 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
            <MarketingSection />
          </div>
        )}
      </Card>

      {/* Subtle branding for ChatGrow */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Powered by{" "}
          <a href="https://chatgrow.co" className="font-semibold text-brand/80">ChatGrow</a>
        </p>
      </div>
    </div>
  );
};
