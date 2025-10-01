// lib/session.ts
export class SessionManager {
  private static readonly SESSION_KEY = "mosdac_session_id";
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static getSessionId(): string {
    if (typeof window === "undefined") return "";

    const stored = localStorage.getItem(this.SESSION_KEY);

    if (stored) {
      try {
        const { sessionId, timestamp } = JSON.parse(stored);

        // Check if session is expired
        if (Date.now() - timestamp < this.SESSION_TIMEOUT) {
          return sessionId;
        }
      } catch (e) {
        // Invalid storage, create new session
      }
    }

    // Create new session
    return this.createNewSession();
  }

  static createNewSession(): string {
    const sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    const sessionData = {
      sessionId,
      timestamp: Date.now(),
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    return sessionId;
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  static getSessionAge(): number {
    const stored = localStorage.getItem(this.SESSION_KEY);
    if (!stored) return 0;

    try {
      const { timestamp } = JSON.parse(stored);
      return Date.now() - timestamp;
    } catch {
      return 0;
    }
  }

  static isSessionExpired(): boolean {
    return this.getSessionAge() > this.SESSION_TIMEOUT;
  }
}
