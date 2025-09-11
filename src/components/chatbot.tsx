"use client";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askChatbot } from "@/lib/api";
import { getMessages, saveMessage } from "@/lib/messages";
import { handleSession } from "@/lib/sessions";
import { getUserId, ensureUser } from "@/lib/user";

type Message = { from: "user" | "bot"; text: string; created_at?: string };

export function ChatBot() {
	const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);

	useEffect(() => {
		setUserId(getUserId());
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!userId) return;

		(async () => {
			await ensureUser(userId);

			const session = await handleSession(
				userId,
				"1098e2ba-bfa2-4d52-a157-61c4bca9b851"
			);
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

			if (sessionId) {
				await saveMessage(sessionId, "bot", botReply);
			}
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
		<div className="flex flex-col flex-1 h-screen bg-gradient-to-b from-[#FFFFFF] to-[#FAF9F7]">
			{/* Header */}
			<header className="	p-4 shrink-0 border-b 
    							bg-white/40 backdrop-blur-lg 
    							border-gray-200 shadow-sm">
				<h2 className="text-lg font-semibold text-[#F67E4A]">
					Week 1: HTML Basics
				</h2>
				<p className="text-sm text-gray-600">
					Session 1.2: Discussing Semantic HTML
				</p>
			</header>
			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-6 space-y-2 bg-gray-50">
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
							className={`rounded-xl px-4 py-2 max-w-[70%] ${msg.from === "user"
								? "bg-[#514540] text-gray-200"
								// 👈 user bubble
								: "bg-white border border-gray-200 text-gray-900"
								}`}
						>
							{msg.text === "" && msg.from === "bot" ? (
								<div className="flex gap-1">
									<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
									<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
									<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
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
			<div className="p-4 border-t bg-white flex gap-2 shrink-0">
				<Input
					placeholder="Type a message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					className=" rounded-l
								border border-gray-200 
								shadow-sm 
								focus:outline-none 
								focus:ring-2 focus:ring-[#F67E4A]/50 
								focus:border-[#F67E4A] 
								transition-all"
				/>
				<Button
					onClick={sendMessage}
					disabled={loading}
					className="bg-[#F67E4A] hover:bg-[#e26f3c] text-white"
				>
					Send
				</Button>
			</div>
		</div>
	);
}