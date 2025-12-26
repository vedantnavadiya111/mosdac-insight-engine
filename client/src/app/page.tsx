import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import {
  MessageCircle,
  Download,
  Database,
  Globe,
  Shield,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: MessageCircle,
      title: "Chat Interface",
      description:
        "Ask questions about datasets, documentation, and workflows.",
    },
    {
      icon: Download,
      title: "Dataset Downloads",
      description:
        "Queue and track MOSDAC downloads with status history.",
    },
    {
      icon: Database,
      title: "Data Catalog",
      description: "Browse dataset IDs and metadata quickly.",
    },
    {
      icon: Globe,
      title: "Extension Workflow",
      description: "Use the browser extension for inline assistance.",
    },
  ];

  const stats = [
    { number: "50+", label: "Satellite Products" },
    { number: "24/7", label: "Data Availability" },
    { number: "10+", label: "Years Archive" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Hero */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
              <span className="font-medium text-zinc-900">Independent build</span>
              <span>•</span>
              <span>by Vedant Navadiya</span>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
                <LogoMark className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900">
                  MOSDAC Insight Engine
                </h1>
                <p className="mt-2 text-base sm:text-lg text-zinc-600">
                  A technical UI for MOSDAC / SagarMegh dataset workflows.
                </p>
              </div>
            </div>

            <p className="mt-6 text-zinc-600 leading-relaxed">
              Explore documentation, ask targeted questions, and manage dataset downloads
              from a single interface.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Open Chat
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Access Dashboard
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200 bg-white p-4"
                >
                  <div className="text-lg font-semibold text-zinc-900">
                    {stat.number}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-zinc-900">
                What this app does
              </h2>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                This is an independent interface for working with public MOSDAC resources.
                It is not an official ISRO product.
              </p>

              <div className="mt-6 grid gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900">
                          {feature.title}
                        </div>
                        <div className="text-xs text-zinc-600 mt-1">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                  <Database className="w-4 h-4" />
                  Data source
                </div>
                <p className="mt-2 text-xs text-zinc-600">
                  MOSDAC (ISRO) datasets and documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-600">
            © 2025 Vedant Navadiya
          </div>
          <div className="text-xs text-zinc-500">
            Built for MOSDAC/SagarMegh workflows • Not an official ISRO product
          </div>
        </div>
      </footer>
    </div>
  );
}
