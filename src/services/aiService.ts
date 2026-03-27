export const generateText = async (
  systemPrompt: string,
  userPrompt: string,
): Promise<string> => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate response");
    }

    const data = await response.json();
    return data.result || "No response from AI.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
