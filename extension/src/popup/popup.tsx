import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ChatBox from "./ChatBox";
import "./popup.css";

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
    <div className="min-h-96 w-full h-full bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      {/* Logo/Brand Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            MOSDAC
          </h1>
        </div>
        <p className="text-gray-600 text-sm">Space Data AI Assistant</p>
      </div>

      {/* Auth Forms */}
      <div className="space-y-4">
        {mode === "login" ? (
          <>
            <LoginForm onLogin={() => setLoggedIn(true)} />
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Create one here
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <RegisterForm onRegistered={() => setMode("login")} />
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Powered by ISRO • Secure & Private
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Popup />);
