"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/chat", label: "💬 Chat" },
    { href: "/dashboard/downloads", label: "⬇️ Downloads" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5 space-y-4">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block p-2 rounded hover:bg-gray-700 ${
              pathname === link.href ? "bg-gray-700" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
