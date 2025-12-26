"use client";

import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import LogoMark from "@/components/LogoMark";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(email, password);
      router.push("/dashboard/chat");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { detail?: string } | undefined;
        setError(data?.detail || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
              <LogoMark className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold text-zinc-900 leading-tight">
                MOSDAC Insight Engine
              </div>
              <div className="text-xs text-zinc-500">by Vedant Navadiya</div>
            </div>
          </div>
          <p className="text-sm text-zinc-600">
            Sign in to access chat and downloads
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">Sign in</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Use your account credentials
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                <LogIn className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-800 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-800 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login to Account</span>
                </>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200">
            <p className="text-xs text-zinc-600 text-center">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-zinc-900 hover:underline font-medium"
              >
                Register here
              </a>
            </p>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            Built by Vedant Navadiya • Secure & Private
          </p>
        </div>
      </div>
    </div>
  );
}
