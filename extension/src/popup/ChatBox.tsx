import { useEffect, useState } from "react";
import api from "../lib/api";
import { LogOut, Send, Bot, User, Loader2 } from "lucide-react";

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
    <div className="flex flex-col w-80 h-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <h2 className="text-lg font-bold">MOSDAC AI Assistant</h2>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Your intelligent space data companion
        </p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              👋 Hello! Ask me anything about space data and MOSDAC resources.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
