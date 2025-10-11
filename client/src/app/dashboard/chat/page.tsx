"use client";

import { useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { Bot, Satellite, Sparkles } from "lucide-react";

export default function ChatPage() {
  const { messages, sendMessage, loading, loadHistory } = useChat();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="flex flex-col h-[85vh] bg-gradient-to-br from-blue-50/50 to-orange-50/30 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold">MOSDAC AI Assistant</h1>
            <p className="text-blue-100 text-sm">Your space data companion</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Satellite className="w-4 h-4" />
            <span className="text-sm font-medium">ISRO</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/30 backdrop-blur-sm">
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to MOSDAC AI
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Hello! I'm your MOSDAC AI assistant. Ask me anything about
              satellite datasets, weather data, ocean monitoring, or space
              research.
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
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 text-sm text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 text-left"
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
          <div className="flex items-center justify-center space-x-2 text-gray-500 py-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-sm font-medium">
              MOSDAC AI is thinking...
            </span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
