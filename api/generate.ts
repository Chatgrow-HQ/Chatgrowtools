import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { systemPrompt, userPrompt } = request.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return response
      .status(500)
      .json({ error: "OPENAI_API_KEY not configured" });
  }

  try {
    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5.4",
          messages: [
            {
              role: "system",
              content: `${systemPrompt} Return plain text only, no markdown formatting.`,
            },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      },
    );

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      return response
        .status(aiResponse.status)
        .json({ error: errorData.error?.message || "AI Failed" });
    }

    const data = await aiResponse.json();
    const result = data.choices[0].message.content.replace(/[#*]/g, "");

    return response.status(200).json({ result });
  } catch (error) {
    console.error("Serverless Error:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
