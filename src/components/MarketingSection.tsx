import React from "react";
import { Button } from "./ui-components";
import { Sparkles } from "lucide-react";

export const MarketingSection: React.FC = () => {
  return (
    <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
      <div className="bg-linear-to-br from-brand/5 to-transparent rounded-2xl p-6 border border-brand/10 text-center">
        <h4 className="text-lg font-bold text-gray-900 mb-2">
          Loved this answer?
        </h4>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Create your own AI chatbot to generate similar answers for free.
        </p>
        <Button
          className="w-full sm:w-auto px-8 py-3 bg-brand hover:scale-105 transition-transform"
          onClick={() => window.open("https://app.chatgrow.co", "_blank")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Start your free trial now!
        </Button>
      </div>
    </div>
  );
};
