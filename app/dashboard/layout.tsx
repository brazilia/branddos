"use client";

// src/app/dashboard/layout.tsx
import Link from "next/link";
import { Zap, Home, Image, History, Library, Settings, MessageCircle, Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/dashboard", icon: Sparkles, label: "Generate" },
    { href: "/dashboard/generate", icon: Image, label: "Generate Image" },
    { href: "/dashboard/history", icon: History, label: "History" },
    { href: "/dashboard/library", icon: Library, label: "Image Library" },
    { href: "/dashboard/chat", icon: MessageCircle, label: "Chatbot" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/", icon: Home, label: "Home" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50">
      <aside className="w-64 flex flex-col px-6 py-8 bg-stone-50/90 backdrop-blur-sm border-r border-stone-200">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-stone-800">
              BRAND<span className="text-emerald-600">DOS</span>
            </span>
            <div className="text-xs font-medium text-stone-500 -mt-1">
              Dashboard
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-stone-700 hover:text-emerald-600 hover:bg-emerald-50"
              >
                <IconComponent className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Spacer */}
        <div className="flex-1"></div>

        {/* User Section */}
        <div className="pt-6 border-t border-stone-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-stone-100">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-medium text-sm"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
              U
            </div>
            <div>
              <div className="font-medium text-sm text-stone-800">User</div>
              <div className="text-xs text-stone-500">Active</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}