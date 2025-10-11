import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ChatBox from "./ChatBox";

function Popup() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("token", ({ token }) => {
      if (token) setLoggedIn(true);
    });
  }, []);

  if (loggedIn) return <ChatBox onLogout={() => setLoggedIn(false)} />;

  return (
    <div className="p-2">
      {mode === "login" ? (
        <>
          <LoginForm onLogin={() => setLoggedIn(true)} />
          <p
            className="text-blue-600 text-center text-sm cursor-pointer mt-2"
            onClick={() => setMode("register")}
          >
            Don&apos;t have an account? Register
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegistered={() => setMode("login")} />
          <p
            className="text-blue-600 text-center text-sm cursor-pointer mt-2"
            onClick={() => setMode("login")}
          >
            Already have an account? Login
          </p>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Popup />);
