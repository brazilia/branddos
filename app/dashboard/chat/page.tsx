// app/dashboard/chat/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SendHorizonal, Bot, User, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils"; 

// A self-contained typing indicator component for cleanliness
const TypingIndicator = () => (
    <div className="flex items-start gap-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
            <Bot className="w-6 h-6"/>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
        </div>
    </div>
);


export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! How can I help with your social media today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // This logic works with your standard JSON API
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const session = await supabase.auth.getSession();
            const accessToken = session.data.session?.access_token;
            if (!accessToken) throw new Error("You must be logged in to generate content.");
        
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch response from API.");
            }

            const data = await res.json();
            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch(error: any) {
            console.error("Chat Error:", error);
            setMessages([...newMessages, { role: "assistant", content: `Sorry, an error occurred: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };
    
    // Auto-scroll to the bottom of the chat when new messages arrive or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Handle Enter key to send, Shift+Enter for new line
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {messages.map((msg, i) => (
                    <div key={i} className={cn("flex items-start gap-4", msg.role === "user" && "justify-end")}>
                        {msg.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                <Bot className="w-6 h-6"/>
                            </div>
                        )}
                        <div className={cn(
                            "p-4 rounded-xl max-w-lg whitespace-pre-wrap animate-fade-in-up",
                            msg.role === "user" 
                                ? "bg-blue-600 text-white rounded-br-none shadow-md"
                                : "bg-white text-gray-800 rounded-bl-none border border-slate-200 shadow-sm"
                        )}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                                <User className="w-6 h-6"/>
                            </div>
                        )}
                    </div>
                ))}
                
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
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            aria-label="Send message"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <SendHorizonal className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-2 flex items-center justify-center gap-2">
                        <CornerDownLeft className="w-3 h-3"/>
                        <strong>Enter</strong> to send
                        <span className="text-slate-300">|</span>
                        <strong>Shift + Enter</strong> for new line
                    </p>
                </div>
            </div>
        </div>
    );
}