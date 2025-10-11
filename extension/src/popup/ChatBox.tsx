import { useEffect, useState } from "react";
import api from "../lib/api";
import { LogOut, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBoxProps {
  onLogout: () => void;
}

export default function ChatBox({ onLogout }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chat/history/");
        setMessages(res.data.history);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchHistory();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat/", { query: input });
      const reply: Message = {
        role: "assistant",
        content: res.data.answer || "No response",
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to MOSDAC AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    chrome.storage.local.remove("token", () => onLogout());
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-xl shadow-2xl border border-gray-200/70 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-3 text-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">MOSDAC AI</h2>
              <p className="text-blue-100 text-xs opacity-90">
                Space Data Assistant
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1 text-xs"
            title="Logout"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-br from-blue-50/30 to-orange-50/20">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Welcome to MOSDAC AI
            </h3>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs mx-auto">
              Ask me anything about satellite datasets, weather data, or ocean
              monitoring.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 max-w-xs mx-auto">
              {[
                "Weather data",
                "Ocean state",
                "Satellites",
                "Download help",
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => {
                      const form = document.querySelector("form");
                      if (form) form.requestSubmit();
                    }, 0);
                  }}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-2 text-xs text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-150 text-left leading-tight"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${
              msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-orange-500 text-white shadow-sm"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-3 h-3" />
              ) : (
                <Bot className="w-3 h-3" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none shadow-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-3 h-3" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none px-3 py-2 shadow-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="border-t border-gray-200/50 p-3 bg-white flex-shrink-0"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
            placeholder="Ask about satellite data..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white p-2 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm flex items-center justify-center"
            title="Send message"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
