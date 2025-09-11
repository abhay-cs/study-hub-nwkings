import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// This function just prepares and runs the AI call
export async function streamChatResponse(question: string) {
  return client.chat.completions.create({
    model: "deepseek-chat",
    stream: true,
    messages: [
      {
        role: "system",
        content: `
          You are "Network Kings Assistant", a friendly AI tutor for networking students.
          - Always explain clearly and avoid jargon unless asked.
          - Use real-world analogies (like routers as post offices).
          - Break complex answers into steps.
          - If the question is about a specific video topic, assume CCNA-level.
          - Answer in Markdown with sections: **Summary**, **Detailed Explanation**, **Quick Tip**.
        `,
      },
      { role: "user", content: `Question: ${question}` },
    ],
  });
}