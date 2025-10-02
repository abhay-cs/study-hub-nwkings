"use client";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askChatbot } from "@/lib/api";
import { getMessages, saveMessage } from "@/lib/messages";
import { handleSession, updateSession } from "@/lib/sessions";
import { supabase } from "@/lib/supabase/client";
import { Send, MessageCircle, User, Bot } from "lucide-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // 👈 add this import at the top

type Message = { from: "user" | "bot"; text: string; created_at?: string };

type ChatBotProps = {
	course: any;
	sessionId: string | null;
	userId: string;
	onSessionTitleUpdate?: (sessionId: string, newTitle: string) => void; // 👈 sidebar sync
};

export function ChatBot({
	course,
	sessionId: externalSessionId,
	userId,
	onSessionTitleUpdate,
}: ChatBotProps) {
	const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
	const [messagesBySession, setMessagesBySession] = useState<Record<string, Message[]>>({});
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [sessionId, setSessionId] = useState<string | null>(externalSessionId);
	const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
	const [autoScroll, setAutoScroll] = useState(true);

	// keep local sessionId in sync with external
	useEffect(() => {
		setSessionId(externalSessionId);
	}, [externalSessionId]);

	// Load messages from DB if not already cached
	useEffect(() => {
		if (!sessionId || !userId) return;
		if (messagesBySession[sessionId]) return; // already loaded

		(async () => {
			const db_messages = await getMessages(supabase, sessionId);
			setMessagesBySession((prev) => ({
				...prev,
				[sessionId]: db_messages.map((m: any) => ({
					from: m.role === "user" ? "user" : "bot",
					text: m.message,
					created_at: m.created_at,
				})),
			}));
		})();
	}, [sessionId, userId]);

	const messages = sessionId ? messagesBySession[sessionId] || [] : [];

	// Auto-scroll
	useEffect(() => {
		if (autoScroll) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Scroll tracking
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;
		const handleScroll = () => {
			const isAtBottom =
				container.scrollHeight - container.scrollTop <= container.clientHeight + 20;
			setAutoScroll(isAtBottom);
		};
		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	const sendMessage = async () => {
		if (!input.trim()) return;
		let activeSessionId = sessionId;

		// if no session, create one
		if (!activeSessionId) {
			const session = await handleSession(supabase, userId, course.id);
			activeSessionId = session.id;
			setSessionId(session.id);
		}
		if (!activeSessionId) return;

		// snapshot for this request
		const targetSessionId = activeSessionId;

		// optimistic user message
		const userMsg = { from: "user" as const, text: input };
		setMessagesBySession((prev) => ({
			...prev,
			[targetSessionId]: [...(prev[targetSessionId] || []), userMsg],
		}));
		await saveMessage(supabase, targetSessionId, "user", input);

		// 🚀 auto-rename if session title is still "New Chat"
		if (input.trim() && onSessionTitleUpdate) {
			const snippet = input.slice(0, 30) + (input.length > 30 ? "..." : "");
			await updateSession(supabase, targetSessionId, { title: snippet });
			onSessionTitleUpdate(targetSessionId, snippet); // notify sidebar instantly
		}

		setInput("");
		setLoading(true);

		// placeholder bot message
		setMessagesBySession((prev) => ({
			...prev,
			[targetSessionId]: [...(prev[targetSessionId] || []), { from: "bot", text: "" }],
		}));

		try {
			let botReply = "";
			await askChatbot(input, (token) => {
				botReply += token;

				// ✅ only update if this is still the correct session
				if (targetSessionId !== sessionId) return;

				setMessagesBySession((prev) => {
					const updated = [...(prev[targetSessionId] || [])];
					updated[updated.length - 1] = { from: "bot", text: botReply };
					return { ...prev, [targetSessionId]: updated };
				});
			});

			await saveMessage(supabase, targetSessionId, "bot", botReply);
		} catch (err) {
			console.error(err);
			setMessagesBySession((prev) => ({
				...prev,
				[targetSessionId]: [
					...(prev[targetSessionId] || []),
					{ from: "bot", text: "Sorry, I had trouble answering that." },
				],
			}));
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Messages */}
			<div className="flex-1 overflow-hidden">
				<div className="h-full max-w-4xl mx-auto flex flex-col">
					{messages.length === 0 && (
						<div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
							<div className="max-w-md space-y-6">
								<div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
									<MessageCircle className="w-8 h-8 text-primary" />
								</div>
								<h2 className="text-2xl font-semibold">Welcome to {course?.name}</h2>
								<p className="text-muted-foreground">
									Ask me anything about the course content, assignments, or concepts.
								</p>
							</div>
						</div>
					)}

					{messages.length > 0 && (
						<div
							className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
							ref={scrollContainerRef}
						>
							{messages.map((msg, i) => (
								<div key={i} className="flex gap-4 max-w-full">
									<div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
										{msg.from === "user" ? (
											<User className="w-4 h-4" />
										) : (
											<Bot className="w-4 h-4" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<span className="text-sm font-medium">
												{msg.from === "user" ? "You" : "Assistant"}
											</span>
											{msg.created_at && (
												<span className="text-xs text-muted-foreground">
													{new Date(msg.created_at).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											)}
										</div>
										<div className="prose prose-sm max-w-none dark:prose-invert">
											{msg.text === "" && msg.from === "bot" ? (
												<div className="flex items-center gap-1 py-2">
													<div className="flex gap-1">
														<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.2s]"></div>
														<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.1s]"></div>
														<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
													</div>
													<span className="text-sm text-muted-foreground ml-2">
														Thinking...
													</span>
												</div>
											) : (
												// <div className="prose prose-sm max-w-none dark:prose-invert">
												// 	<ReactMarkdown
												// 		remarkPlugins={[remarkGfm, remarkMath]}
												// 		rehypePlugins={[rehypeKatex]}
												// 	>
												// 		{msg.text}
												// 	</ReactMarkdown>
												// </div>
												<div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 
  prose-headings:font-bold prose-headings:tracking-tight
  prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4 
  prose-h2:text-xl prose-h2:mt-5 prose-h2:mb-3
  prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
  prose-p:text-slate-700 prose-p:leading-7 prose-p:my-4
  prose-strong:text-slate-900 prose-strong:font-semibold
  prose-em:text-slate-700
  prose-code:text-sky-600 prose-code:bg-sky-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:border prose-pre:border-slate-200
  prose-ul:my-4 prose-ul:space-y-2 prose-ul:list-disc prose-ul:pl-6
  prose-ol:my-4 prose-ol:space-y-2 prose-ol:list-decimal prose-ol:pl-6
  prose-li:text-slate-700 prose-li:leading-7 prose-li:my-1.5
  prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:text-slate-700
  prose-a:text-sky-600 prose-a:no-underline hover:prose-a:text-sky-700 hover:prose-a:underline prose-a:font-medium
  prose-img:rounded-xl prose-img:shadow-md prose-img:my-6
  prose-hr:border-slate-200 prose-hr:my-8
  prose-table:w-full prose-table:my-6 prose-table:border-collapse
  prose-thead:bg-gradient-to-r prose-thead:from-slate-50 prose-thead:to-slate-100 prose-thead:border-b-2 prose-thead:border-slate-300
  prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-800 prose-th:text-sm prose-th:uppercase prose-th:tracking-wider
  prose-tbody:divide-y prose-tbody:divide-slate-200
  prose-td:px-4 prose-td:py-3 prose-td:text-slate-700 prose-td:text-sm prose-td:leading-6
  prose-tr:transition-colors hover:prose-tr:bg-slate-50"
												>
													<ReactMarkdown
														remarkPlugins={[remarkGfm, remarkMath]}
														rehypePlugins={[rehypeKatex]}
														components={{
															// Custom table rendering for better styling
															table: ({ node, ...props }) => (
																<div className="overflow-x-auto my-6 rounded-xl border border-slate-200 shadow-sm">
																	<table className="w-full border-collapse" {...props} />
																</div>
															),
															thead: ({ node, ...props }) => (
																<thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-300" {...props} />
															),
															th: ({ node, ...props }) => (
																<th className="px-6 py-4 text-left font-semibold text-slate-800 text-sm uppercase tracking-wider border-r border-slate-200 last:border-r-0" {...props} />
															),
															tbody: ({ node, ...props }) => (
																<tbody className="bg-white divide-y divide-slate-200" {...props} />
															),
															tr: ({ node, ...props }) => (
																<tr className="transition-colors hover:bg-slate-50" {...props} />
															),
															td: ({ node, ...props }) => (
																<td className="px-6 py-4 text-slate-700 text-sm leading-relaxed border-r border-slate-100 last:border-r-0" {...props} />
															),
															// Custom code block rendering
															code: ({ node, inline, className, children, ...props }: any) => {
																if (inline) {
																	return (
																		<code className="text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
																			{children}
																		</code>
																	);
																}
																return (
																	<code className={className} {...props}>
																		{children}
																	</code>
																);
															},
															// Custom heading rendering with better spacing
															h1: ({ node, ...props }) => (
																<h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4 pb-2 border-b border-slate-200" {...props} />
															),
															h2: ({ node, ...props }) => (
																<h2 className="text-xl font-bold text-slate-900 mt-5 mb-3" {...props} />
															),
															h3: ({ node, ...props }) => (
																<h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2" {...props} />
															),
															// Custom paragraph with better spacing
															p: ({ node, ...props }) => (
																<p className="text-slate-700 leading-7 my-4" {...props} />
															),
															// Custom list rendering
															ul: ({ node, ...props }) => (
																<ul className="my-4 space-y-2 list-disc pl-6 text-slate-700" {...props} />
															),
															ol: ({ node, ...props }) => (
																<ol className="my-4 space-y-2 list-decimal pl-6 text-slate-700" {...props} />
															),
															li: ({ node, ...props }) => (
																<li className="leading-7 my-1.5" {...props} />
															),
															// Custom blockquote
															blockquote: ({ node, ...props }) => (
																<blockquote className="border-l-4 border-sky-500 bg-sky-50 py-3 px-4 rounded-r-lg my-4 italic text-slate-700" {...props} />
															),
															// Custom link styling
															a: ({ node, ...props }) => (
																<a className="text-sky-600 font-medium hover:text-sky-700 hover:underline transition-colors" {...props} />
															),
														}}
													>
														{msg.text}
													</ReactMarkdown>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>
			</div>

			{/* Input */}
			<div className="border-t bg-background/95">
				<div className="max-w-4xl mx-auto p-4 flex gap-3">
					<Input
						placeholder="Ask about the course..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={loading}
					/>
					<Button onClick={sendMessage} disabled={loading || !input.trim()}>
						<Send className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}