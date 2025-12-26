"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/LogoMark";
import { MessageCircle, Download, Settings } from "lucide-react";

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
    <aside className="w-80 bg-white text-zinc-900 min-h-screen border-r border-zinc-200">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-zinc-200">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <LogoMark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">
              MOSDAC Insight Engine
            </h1>
            <p className="text-sm text-zinc-500">Dashboard</p>
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
              className={`flex items-center space-x-4 p-4 rounded-2xl transition-colors duration-200 group border ${
                isActive
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-700"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {link.label}
                </p>
                <p
                  className={`text-sm transition-colors duration-200 ${
                    isActive ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {link.description}
                </p>
              </div>
              {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-zinc-200">
        <div className="flex items-center space-x-3 text-zinc-600">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900">
              Built by Vedant Navadiya
            </p>
            <p className="text-xs text-zinc-500">Data: MOSDAC (ISRO)</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
