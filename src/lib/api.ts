export async function askChatbot(
  question: string,
  
  onToken: (token: string) => void // callback for streaming
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ question}),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    onToken(chunk); // send partial text to UI
  }
}