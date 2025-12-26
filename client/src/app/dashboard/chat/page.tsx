"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import LogoMark from "@/components/LogoMark";
import { Bot, Sparkles } from "lucide-react";

export default function ChatPage() {
  const { messages, sendMessage, loading, loadHistory } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
            <LogoMark className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-zinc-900">
              MOSDAC Insight Engine
            </h1>
            <p className="text-zinc-500 text-sm">
              Chat • datasets • downloads
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-200">
            <Bot className="w-4 h-4 text-zinc-600" />
            <span className="text-sm font-medium text-zinc-700">
              Assistant
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50">
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-200">
              <Sparkles className="w-7 h-7 text-zinc-800" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to MOSDAC Insight Engine
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Hello! I&apos;m your MOSDAC assistant. Ask me anything about satellite
              datasets, weather data, ocean monitoring, or documentation.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
              {[
                "Show me weather datasets",
                "Ocean monitoring data",
                "Satellite archives",
                "Download options",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion)}
                  className="bg-white border border-zinc-200 rounded-2xl p-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role === "user" ? "user" : "assistant"}
            content={msg.content}
          />
        ))}

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-zinc-500 py-4">
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Thinking…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
