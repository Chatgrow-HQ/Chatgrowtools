import { ToolLayout } from "./components/ToolLayout";
import { getToolById } from "./tools";

function App() {
  // Get tool ID from URL parameter e.g. ?tool=ai-reply-generator
  const params = new URLSearchParams(window.location.search);
  const toolId = params.get("tool");
  const toolConfig = getToolById(toolId);

  return (
    <main className="min-h-screen bg-transparent">
      <ToolLayout config={toolConfig} />
    </main>
  );
}

export default App;
