import Link from "next/link";
import {
  Satellite,
  MessageCircle,
  Download,
  Database,
  Globe,
  Shield,
  Rocket,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Assistant",
      description:
        "Chat with MOSDAC AI to get insights about space data and satellite information",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Download,
      title: "Dataset Downloads",
      description:
        "Download meteorological and oceanographic satellite datasets",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Database,
      title: "Data Catalog",
      description: "Access comprehensive satellite data archives and galleries",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Globe,
      title: "Real-time Monitoring",
      description:
        "Live weather and ocean state monitoring with satellite data",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const stats = [
    { number: "50+", label: "Satellite Products" },
    { number: "24/7", label: "Data Availability" },
    { number: "10+", label: "Years Archive" },
    { number: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Satellite className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  ISRO SagarMegh AI
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Meteorological & Oceanographic Satellite Data Archive
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Advanced AI-powered platform for accessing, analyzing, and
              downloading ISRO&apos;s satellite data
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/dashboard/chat"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-3"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Chatting with AI</span>
                <Rocket className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-3"
              >
                <Shield className="w-5 h-5" />
                <span>Access Dashboard</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Space Data Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Leverage advanced AI and satellite technology for comprehensive
              meteorological and oceanographic insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">
              About ISRO SagarMegh
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-6">
              SagarMegh is ISRO&apos;s comprehensive platform for meteorological
              and oceanographic satellite data services, providing real-time
              monitoring, data archives, and AI-powered insights for
              researchers, scientists, and weather professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-white font-semibold">
                  Space Applications Centre
                </div>
                <div className="text-blue-200 text-sm">
                  Indian Space Research Organisation
                </div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-white font-semibold">Real-time Data</div>
                <div className="text-blue-200 text-sm">
                  24/7 Satellite Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">ISRO SagarMegh</div>
                  <div className="text-gray-400 text-sm">
                    MOSDAC AI Assistant
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced AI platform for meteorological and oceanographic
                satellite data analysis and insights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/chat"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  AI Chat Assistant
                </Link>
                <Link
                  href="/dashboard/downloads"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Data Downloads
                </Link>
                <Link
                  href="/login"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  User Login
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Powered by</h3>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-center">
                  <div className="font-bold text-blue-300">ISRO</div>
                  <div className="text-gray-400 text-sm mt-1">
                    Indian Space Research Organisation
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    Space Applications Centre
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 ISRO SagarMegh AI. All rights reserved. | Secure &
              Protected
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
