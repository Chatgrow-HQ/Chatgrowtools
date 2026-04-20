import React, { useState } from "react";
import type { ToolConfig } from "../types/tool";
import { Button, Input, Textarea, Label, Card } from "./ui-components";
import { generateText } from "../services/aiService";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react";
import { MarketingSection } from "./MarketingSection";
import { cn } from "../lib/utils";

interface ToolLayoutProps {
  config: ToolConfig;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ config }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
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
    setResult("");
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
              {loading ? "Generating..." : "Generate Reply"}
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
