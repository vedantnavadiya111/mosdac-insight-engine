import React from "react";
import { User, Bot, Download } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start space-x-3 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-zinc-900 text-white"
            : "bg-white text-zinc-900 border border-zinc-200"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border ${
          isUser
            ? "bg-zinc-900 text-white border-zinc-900 rounded-br-none"
            : "bg-white text-zinc-800 border-zinc-200 rounded-bl-none"
        }`}
      >
        {/* Assistant Message Header */}
        {!isUser && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold text-zinc-600">
              MOSDAC Insight Engine
            </span>
          </div>
        )}

        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* Download Button for Assistant Messages with Download Links */}
        {!isUser && content.toLowerCase().includes("download") && (
          <button className="mt-3 flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200">
            <Download className="w-3 h-3" />
            <span>Download Dataset</span>
          </button>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${
            isUser ? "text-white/70" : "text-zinc-500"
          }`}
        >
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
