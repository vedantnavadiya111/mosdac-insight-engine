"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-t border-zinc-200 p-4"
    >
      <div className="flex items-end space-x-3">
        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full border border-zinc-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ask about datasets, docs, downloads…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-zinc-900 hover:bg-zinc-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Tips */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {[
          "Weather data",
          "Ocean state",
          "Dataset download",
          "Satellite info",
        ].map((tip, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSend(tip)}
            disabled={disabled}
            className="text-xs bg-zinc-100 text-zinc-700 hover:bg-zinc-200 px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50"
          >
            {tip}
          </button>
        ))}
      </div>
    </form>
  );
};

export default ChatInput;
