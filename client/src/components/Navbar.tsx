"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white">
      <Link href="/" className="text-lg font-semibold">
        ISRO SagarMegh AI
      </Link>

      <div className="flex gap-4">
        {loggedIn ? (
          <>
            <Link href="/dashboard/chat">Chat</Link>
            <Link href="/dashboard/downloads">Downloads</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
