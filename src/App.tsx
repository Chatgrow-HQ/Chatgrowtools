import { useEffect, useState } from "react";
import { ToolLayout } from "./components/ToolLayout";
import { getToolById } from "./tools";
import type { ToolConfig } from "./types/tool";

function App() {
  const [toolConfig, setToolConfig] = useState<ToolConfig | null>(null);

  useEffect(() => {
    // Get tool ID from URL parameter e.g. ?tool=ai-reply-generator
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get("tool");
    const config = getToolById(toolId);
    setToolConfig(config);
  }, []);

  if (!toolConfig) return null;

  return (
    <main className="min-h-screen bg-transparent">
      <ToolLayout config={toolConfig} />
    </main>
  );
}

export default App;
