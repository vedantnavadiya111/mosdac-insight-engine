import { useState, useCallback } from "react";
import axios from "@/lib/axios";

export function useChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const clearChat = useCallback(() => {
    setMessages([]);
    setLoading(false);
  }, []);

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

    const normalized = text.trim().toLowerCase();
    if (normalized === "satellite info" || normalized === "satelite info") {
      const demoAnswer =
        "Satellite overview (demo):\n" +
        "- Platform: INSAT-3D / 3DR (illustrative)\n" +
        "- Typical products: Cloud mask, OLR, SST, TPW\n" +
        "- Coverage: Indian Ocean region (geo)\n" +
        "- Update cadence: ~15–30 minutes (varies by product)\n" +
        "\n" +
        "Quick insight: the last pass indicates higher convective activity over the central Bay of Bengal with elevated cloud-top heights and a slight SST gradient along the coast.\n" +
        "\n" +
        "Note: This is a fabricated demo response for a sample video.";

      setMessages((prev) => [...prev, { role: "assistant", content: demoAnswer }]);
      return;
    }

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

  return { messages, sendMessage, loading, loadHistory, clearChat };
}
