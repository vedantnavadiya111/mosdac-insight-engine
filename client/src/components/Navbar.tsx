"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import LogoMark from "@/components/LogoMark";
import {
  MessageCircle,
  Download,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <LogoMark className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900">
                MOSDAC Insight Engine
              </h1>
              <p className="text-xs text-zinc-500">by Vedant Navadiya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard/chat"
                  className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </Link>
                <Link
                  href="/dashboard/downloads"
                  className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Downloads</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden rounded-xl mt-2 p-2 border border-zinc-200 bg-white shadow-sm">
            <div className="space-y-2">
              {loggedIn ? (
                <>
                  <Link
                    href="/dashboard/chat"
                    className="flex items-center space-x-2 text-zinc-800 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </Link>
                  <Link
                    href="/dashboard/downloads"
                    className="flex items-center space-x-2 text-zinc-800 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Download className="w-4 h-4" />
                    <span>Downloads</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-zinc-800 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-zinc-800 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 text-zinc-800 hover:bg-zinc-50 px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
