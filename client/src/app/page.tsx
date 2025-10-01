// app/page.tsx
"use client";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MOSDAC AI Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Ask me anything about MOSDAC satellite data and services
          </p>
        </div>

        <ChatInterface />
      </div>
    </main>
  );
}
