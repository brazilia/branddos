"use client";

import { useState, useEffect, useRef } from "react";
// --- THE FIX: Import the correct client for "use client" components ---
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SendHorizonal, Bot, User, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ... (TypingIndicator and ChatSkeleton components remain the same) ...
const TypingIndicator = () => (
  <div
    className="flex items-start gap-4 animate-fade-in-up"
    style={{ animationDuration: "0.3s" }}
  >
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
      <Bot className="w-6 h-6" />
    </div>
    <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
      <span
        className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
        style={{ animationDelay: "0s" }}
      ></span>
      <span
        className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  </div>
);
const ChatSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4 sm:p-6">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
      <div className="p-4 rounded-xl bg-slate-200 h-16 w-3/5"></div>
    </div>
    <div className="flex items-start gap-4 justify-end">
      <div className="p-4 rounded-xl bg-slate-300 h-10 w-2/5"></div>
      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
    </div>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
      <div className="p-4 rounded-xl bg-slate-200 h-12 w-1/2"></div>
    </div>
  </div>
);

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatPage() {
  // --- THE FIX: Create the client inside the component ---
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This useEffect will now work correctly because it uses the right client
  useEffect(() => {
    const fetchHistory = async () => {
      // This `getSession()` call is now reliable
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        console.error("No active session, redirecting to login.");
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        setMessages([
          {
            role: "assistant",
            content: `Sorry, I couldn't load your history: ${error.message}`,
          },
        ]);
      } else if (data && data.length > 0) {
        setMessages(data as Message[]);
      } else {
        setMessages([
          {
            role: "assistant",
            content: "Hi! How can I help with your social media today?",
          },
        ]);
      }
      setHistoryLoading(false);
    };

    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // We only need to run this once on mount

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // This sendMessage function no longer needs its own getSession() call
      // as the API route will handle auth. The request will automatically
      // include the necessary auth cookie.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401) router.push("/login"); // Redirect on auth error
        throw new Error(
          errorData.error || "Failed to fetch response from API."
        );
      }

      const responseData = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: responseData.reply },
      ]);
    } catch (error: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Sorry, an error occurred: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ... (the rest of the component JSX is identical to my previous answer) ...
  // Auto-scroll, handleKeyDown, and the return() JSX don't need changes.

  useEffect(() => {
    if (!historyLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, historyLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {historyLoading ? (
          <ChatSkeleton />
        ) : (
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4",
                  msg.role === "user" && "justify-end"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <Bot className="w-6 h-6" />
                  </div>
                )}
                <div
                  className={cn(
                    "p-4 rounded-xl max-w-lg whitespace-pre-wrap animate-fade-in-up",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-md"
                      : "bg-white text-gray-800 rounded-bl-none border border-slate-200 shadow-sm"
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about captions, content ideas, or strategy..."
              className="w-full h-12 p-3 pr-20 text-gray-800 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
              rows={1}
              disabled={historyLoading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim() || historyLoading}
              aria-label="Send message"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2 flex items-center justify-center gap-2">
            <CornerDownLeft className="w-3 h-3" />
            <strong>Enter</strong> to send
            <span className="text-slate-300">|</span>
            <strong>Shift + Enter</strong> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
