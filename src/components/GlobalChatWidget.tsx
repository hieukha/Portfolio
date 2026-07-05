"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is your tech stack?",
  "Tell me about your projects",
  "What skills do you have?",
  "How can I contact you?",
];

export default function GlobalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("portfolio_chat_session");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("portfolio_chat_session", id);
    }
    return id;
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isStreaming]);

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent, msgOverride?: string) => {
      e.preventDefault();
      const msgToSend = (msgOverride ?? message).trim();
      if (!msgToSend || !sessionId) return;

      cancelStream();

      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: msgToSend },
        { role: "assistant", content: "" },
      ]);
      setMessage("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msgToSend, sessionId }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Server error: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          setChatHistory((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
              updated[lastIdx] = { ...updated[lastIdx], content: updated[lastIdx].content + chunk };
            }
            return updated;
          });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setChatHistory((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === "assistant" && !updated[lastIdx].content) {
            updated[lastIdx] = { ...updated[lastIdx], content: "Sorry, something went wrong. Please try again." };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [message, sessionId, cancelStream]
  );

  return (
    <div className={`fixed z-50 flex flex-col items-end gap-2 ${isOpen ? "inset-0 sm:inset-auto sm:bottom-6 sm:right-6" : "bottom-6 right-6"}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-full sm:w-auto sm:h-auto"
          >
            <div className="flex h-full w-full flex-col overflow-hidden rounded-none border-0 bg-white shadow-2xl sm:h-[600px] sm:max-h-[80vh] sm:w-[400px] sm:rounded-2xl sm:border sm:border-zinc-200 dark:bg-zinc-950 dark:sm:border-zinc-800">
              <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                      AI
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Kha&apos;s Assistant</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {isStreaming ? "Typing…" : "Online & ready"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white sm:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                <div className="flex gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-semibold dark:border-zinc-800 dark:bg-zinc-900">
                    AI
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-zinc-200 bg-zinc-50 p-3 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-900">
                    Hello! I&apos;m here to answer questions about Kha&apos;s work, experience, and projects. Ask me anything!
                  </div>
                </div>

                {chatHistory.map((chat, index) => {
                  const isActiveStreamBubble =
                    isStreaming && chat.role === "assistant" && index === chatHistory.length - 1 && chat.content === "";
                  if (isActiveStreamBubble) return null;

                  return (
                    <div key={index} className={`flex gap-3 ${chat.role === "user" ? "justify-end" : ""}`}>
                      {chat.role === "assistant" && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-semibold dark:border-zinc-800 dark:bg-zinc-900">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                          chat.role === "user"
                            ? "rounded-tr-none bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                            : "rounded-tl-none border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                        }`}
                      >
                        {chat.role === "assistant" ? (
                          <div className="space-y-2 [&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400 [&_code]:rounded [&_code]:bg-zinc-200/60 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs dark:[&_code]:bg-zinc-800 [&_li]:ml-4 [&_ol]:list-decimal [&_ul]:list-disc">
                            <ReactMarkdown>{chat.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{chat.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isStreaming &&
                  chatHistory.length > 0 &&
                  chatHistory[chatHistory.length - 1].role === "assistant" &&
                  chatHistory[chatHistory.length - 1].content === "" && (
                    <div className="flex gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-semibold dark:border-zinc-800 dark:bg-zinc-900">
                        AI
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                      </div>
                    </div>
                  )}

                {chatHistory.length === 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Suggested topics
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={(e) => handleSendMessage(e, q)}
                          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="h-11 flex-1 rounded-full border border-zinc-200 bg-transparent px-4 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:focus:border-zinc-600"
                />
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={cancelStream}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Square size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition disabled:opacity-40 dark:bg-white dark:text-zinc-900"
                  >
                    <Send size={16} />
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-2xl transition hover:opacity-90 dark:bg-white dark:text-zinc-900 ${isOpen ? "hidden sm:flex" : "flex"}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
