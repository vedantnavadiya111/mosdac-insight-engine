import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import ChatBox from "./ChatBox";
import api from "../lib/api";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { token } = await chrome.storage.local.get("token");
        if (!token) throw new Error("No token");
        const res = await api.get("/auth/me");
        if (res.status === 200) {
          setLoggedIn(true);
        }
      } catch (err) {
        console.warn("User not logged in:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="p-3 w-80">
      {loggedIn ? (
        <ChatBox onLogout={() => setLoggedIn(false)} />
      ) : (
        <LoginForm onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
}
