import { useState, useCallback } from "react";
import axios from "@/lib/axios";

export function useChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const res = await axios.get("/chat/history");
      setMessages(res.data.history || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);
    try {
      const res = await axios.post("/chat", { query: text });
      const botMsg = { role: "assistant", content: res.data.answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, loadHistory };
}
