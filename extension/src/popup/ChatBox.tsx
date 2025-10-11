import { useEffect, useState } from "react";
import api from "../lib/api";

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
    <div className="flex flex-col w-80 h-96 border rounded-lg bg-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-2 bg-blue-600 text-white rounded-t-lg">
        <h2 className="text-sm font-semibold">MOSDAC Chat</h2>
        <button
          onClick={handleLogout}
          className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">
            👋 Hello! Ask MOSDAC AI anything.
          </p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <p className="text-gray-400 text-center text-sm">Thinking...</p>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex border-t p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-1 text-sm"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}
