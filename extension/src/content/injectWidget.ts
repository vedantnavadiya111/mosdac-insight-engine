import React from "react";
import ReactDOM from "react-dom/client";
import ChatBox from "../popup/ChatBox";
import LoginForm from "../popup/LoginForm";
import RegisterForm from "../popup/RegisterForm";

const widgetId = "mosdac-extension-widget";

const InjectedApp: React.FC = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<"login" | "register">("login");

  React.useEffect(() => {
    chrome.storage.local.get("token", ({ token }: { token?: string }) => {
      if (token) setLoggedIn(true);
    });
  }, []);

  if (loggedIn) {
    return React.createElement(ChatBox, { onLogout: () => setLoggedIn(false) });
  }

  if (mode === "login") {
    return React.createElement(
      "div",
      null,
      React.createElement(LoginForm, { onLogin: () => setLoggedIn(true) }),
      React.createElement("p", {
        style: {
          color: "#1d4ed8",
          cursor: "pointer",
          textAlign: "center",
          marginTop: "8px",
        },
        onClick: () => setMode("register"),
        children: "Don’t have an account? Register",
      })
    );
  }

  return React.createElement(
    "div",
    null,
    React.createElement(RegisterForm, { onRegistered: () => setMode("login") }),
    React.createElement("p", {
      style: {
        color: "#1d4ed8",
        cursor: "pointer",
        textAlign: "center",
        marginTop: "8px",
      },
      onClick: () => setMode("login"),
      children: "Already have an account? Login",
    })
  );
};

const initializeWidget = (): void => {
  console.log("[MOSDAC Extension] Initializing widget...");

  if (document.getElementById(widgetId)) {
    console.warn("[MOSDAC Extension] Widget already exists");
    return;
  }

  // --- Floating Button ---
  const button = document.createElement("button");
  button.innerText = "💬";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "#1d4ed8",
    color: "#fff",
    cursor: "pointer",
    zIndex: "999999",
    fontSize: "26px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  });
  document.body.appendChild(button);

  // --- Chat Container ---
  const container = document.createElement("div");
  container.id = widgetId;
  Object.assign(container.style, {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "400px",
    height: "550px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    overflow: "hidden",
    zIndex: "999998",
    display: "none",
  });
  document.body.appendChild(container);

  // --- Toggle Logic ---
  const root = ReactDOM.createRoot(container);
  let open = false;

  const toggleWidget = () => {
    open = !open;
    if (open) {
      container.style.display = "block";
      root.render(React.createElement(InjectedApp));
    } else {
      container.style.display = "none";
    }
  };

  button.addEventListener("click", toggleWidget);
};

initializeWidget();
