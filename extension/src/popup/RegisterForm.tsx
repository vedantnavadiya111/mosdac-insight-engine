import { useState } from "react";
import api from "../lib/api";
import {
  Mail,
  Lock,
  UserPlus,
  Loader2,
  CheckCircle,
  Satellite,
} from "lucide-react";

export default function RegisterForm({
  onRegistered,
}: {
  onRegistered: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { email, password });
      setSuccess("Registration successful! Please log in.");
      setTimeout(onRegistered, 1500); // go back to login
    } catch (err: any) {
      console.error(err);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[350px] bg-white rounded-xl shadow-xl border border-gray-200/70 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-4 text-white text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Satellite className="w-5 h-5" />
          <h2 className="text-lg font-bold">MOSDAC AI</h2>
        </div>
        <p className="text-orange-100 text-xs opacity-90">
          Create Your Account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="p-4 space-y-3">
        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>Email Address</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-xs"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>Password</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-xs"
              required
            />
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>Confirm Password</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-xs"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs flex items-center space-x-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs flex items-center space-x-2">
            <CheckCircle className="w-3 h-3" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3 h-3" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Your data is securely protected by ISRO
        </p>
      </div>
    </div>
  );
}
