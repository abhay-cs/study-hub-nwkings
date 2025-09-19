"use client";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askChatbot } from "@/lib/api";
import { getMessages, saveMessage } from "@/lib/messages";
import { handleSession } from "@/lib/sessions";
import { ensureUser, getCurrentUser } from "@/lib/user";

type Message = { from: "user" | "bot"; text: string; created_at?: string };
type ChatBotProps = { course: any };

export function ChatBot({ course }: ChatBotProps) {
	const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const user = await getCurrentUser();
			if (!user) return;
			setUserId(user.id);
			await ensureUser();
		})();
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!userId) return;
		(async () => {
			const session = await handleSession(userId, course.id);
			setSessionId(session.id);
			const db_messages = await getMessages(session.id);
			setMessages(
				db_messages.map((m: any) => ({
					from: m.role === "user" ? "user" : "bot",
					text: m.message,
					created_at: m.created_at,
				}))
			);
		})();
	}, [userId]);

	const sendMessage = async () => {
		if (!input.trim()) return;
		const userMsg = { from: "user" as const, text: input };
		setMessages((msgs) => [...msgs, userMsg]);
		if (!sessionId) return;
		await saveMessage(sessionId, "user", input);
		setInput("");
		setLoading(true);
		setMessages((msgs) => [...msgs, { from: "bot", text: "" }]);

		try {
			let botReply = "";
			await askChatbot(input, (token) => {
				botReply += token;
				setMessages((msgs) => {
					const updated = [...msgs];
					updated[updated.length - 1] = { from: "bot", text: botReply };
					return updated;
				});
			});
			if (sessionId) await saveMessage(sessionId, "bot", botReply);
		} catch (err) {
			console.error(err);
			setMessages((msgs) => [
				...msgs,
				{ from: "bot", text: "Sorry, I had trouble answering that." },
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col flex-1 h-screen bg-[#FAF9F7]">
			
			{/* Header */}
			<header className="px-8 py-4 border-b bg-white backdrop-blur-md border-gray-200 shadow-sm">
				<h2 className="text-xl font-semibold text-gray-800">
					{course?.name || "Course Chat"}
				</h2>
			</header>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-6 space-y-3">
				{messages.length === 0 && (
					<p className="text-gray-400 text-center">Start the conversation!</p>
				)}
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"
							}`}
					>
						<div
							className={`rounded-2xl px-4 py-2 shadow-sm max-w-[70%] ${msg.from === "user"
								? "bg-gray-100 text-gray-800"
								: "bg-white border border-gray-200 text-gray-800"
								}`}
						>
							{msg.text === "" && msg.from === "bot" ? (
								<div className="flex gap-1">
									<span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.2s]" />
									<span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.1s]" />
									<span className="w-2 h-2 bg-black rounded-full animate-bounce" />
								</div>
							) : (
								<>
									<div className="prose prose-sm max-w-none break-words whitespace-pre-wrap">
										<ReactMarkdown>{msg.text}</ReactMarkdown>
									</div>
									<div className="text-xs text-gray-400 mt-1 text-right">
										{msg.created_at &&
											new Date(msg.created_at).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
									</div>
								</>
							)}
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="px-8 py-4 border-t bg-white flex gap-3 shadow-inner">
				<Input
					placeholder="Type a message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					className="rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all"
				/>
				<Button
					onClick={sendMessage}
					disabled={loading}
					className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md"
				>
					Send
				</Button>
			</div>
		</div>
	);
}