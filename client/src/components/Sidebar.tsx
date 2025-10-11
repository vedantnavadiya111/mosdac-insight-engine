"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Download, Satellite, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/chat",
      label: "AI Chat",
      icon: MessageCircle,
      description: "Chat with MOSDAC AI",
    },
    {
      href: "/dashboard/downloads",
      label: "Downloads",
      icon: Download,
      description: "Your downloaded datasets",
    },
  ];

  return (
    <aside className="w-80 bg-gradient-to-b from-blue-600 to-blue-700 text-white min-h-screen shadow-xl border-r border-blue-500/30">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-blue-500/30">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Satellite className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MOSDAC AI</h1>
            <p className="text-blue-100 text-sm opacity-90">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-white/20 backdrop-blur-sm shadow-lg border border-white/20"
                  : "hover:bg-white/10 hover:backdrop-blur-sm border border-transparent"
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white/10 text-blue-100 group-hover:bg-white/20"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-blue-100 group-hover:text-white"
                  }`}
                >
                  {link.label}
                </p>
                <p
                  className={`text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-blue-200"
                      : "text-blue-300 group-hover:text-blue-200"
                  }`}
                >
                  {link.description}
                </p>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-500/30">
        <div className="flex items-center space-x-3 text-blue-200">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">MOSDAC AI Assistant</p>
            <p className="text-xs opacity-75">Powered by ISRO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
