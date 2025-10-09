"use client";

import { useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, sendMessage, loading, loadHistory } = useChat();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="flex flex-col h-[85vh] bg-white shadow rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-10">
            👋 Hello! I&apos;m your MOSDAC AI assistant. Ask me anything about
            datasets.
          </p>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role === "user" ? "user" : "assistant"}
            content={msg.content}
          />
        ))}

        {loading && (
          <div className="text-gray-400 text-center animate-pulse">
            Thinking...
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
