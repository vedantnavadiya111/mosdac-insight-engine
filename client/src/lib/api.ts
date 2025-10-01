// lib/api.ts - Enhanced version
import { SessionManager } from "./session";

export interface SourceDocument {
  url: string;
  title: string;
  content: string;
  score: number;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  sources?: SourceDocument[]; // Add this for future enhancement
}

export class MOSDACApi {
  private baseUrl = "http://localhost:8000";

  async sendMessage(message: string): Promise<ChatResponse> {
    const sessionId = SessionManager.getSessionId();

    const response = await fetch(`${this.baseUrl}/chat/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data: ChatResponse = await response.json();

    // Update session ID if returned
    if (data.session_id && data.session_id !== "no-session") {
      // The backend might return a new session ID, but we'll keep using our managed one
    }

    return data;
  }

  async clearHistory(): Promise<void> {
    const sessionId = SessionManager.getSessionId();

    if (sessionId && sessionId !== "no-session") {
      await fetch(`${this.baseUrl}/chat/clear-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });
    }

    SessionManager.clearSession();
  }

  // For testing connection
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
