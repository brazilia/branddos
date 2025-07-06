// app/dashboard/layout.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Zap, Home, Image, History, Library, Settings, MessageCircle, Sparkles, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import LanguageSelector from "@/components/LanguageSelector";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const navItems = [
    { href: "/dashboard", icon: Sparkles, label: t('dashboard.generate') },
    { href: "/dashboard/generate", icon: Image, label: t('dashboard.generateImage') },
    { href: "/dashboard/history", icon: History, label: t('dashboard.history') },
    { href: "/dashboard/library", icon: Library, label: t('dashboard.imageLibrary') },
    { href: "/dashboard/chat", icon: MessageCircle, label: t('dashboard.chatbot') },
  ];

  const bottomNavItems = [
    { href: "/dashboard/settings", icon: Settings, label: t('dashboard.settings') },
    { href: "/", icon: Home, label: t('nav.home') },
  ];
  
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="flex items-center space-x-3 mb-10 px-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500 to-blue-600">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-stone-800">
            BRAND<span className="text-emerald-600">DOS</span>
          </span>
          <div className="text-xs font-medium text-stone-500 -mt-1">
            {t('nav.dashboard')}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                isActive
                  ? "bg-emerald-100 text-emerald-600 shadow-sm"
                  : "text-stone-700 hover:text-emerald-600 hover:bg-emerald-50"
              )}
            >
              <IconComponent className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav Items & User Section */}
      <div className="px-4">
        {/* Language Selector - moved to bottom */}
        <div className="mb-4">
          <LanguageSelector variant="sidebar" />
        </div>
        
        <nav className="flex flex-col gap-2 pt-4 border-t border-stone-200">
           {bottomNavItems.map((item) => {
             const isActive = pathname === item.href;
             const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300",
                    isActive ? "bg-emerald-100 text-emerald-600" : "text-stone-700 hover:bg-stone-100")}
                >
                   <IconComponent className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Log Out Button */}
            <button
                onClick={handleSignOut}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-stone-500 hover:text-red-600 hover:bg-red-100 w-full"
            >
                <LogOut className="w-5 h-5"/>
                <span>{t('dashboard.logOut')}</span>
            </button>
        </nav>
        <div className="pt-4 mt-2 border-t border-stone-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-stone-100">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-500 to-purple-600">
              U
            </div>
            <div>
              <div className="font-semibold text-sm text-stone-800">User</div>
              <div className="text-xs text-stone-500">Active Plan</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-stone-100">
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 flex flex-col py-8 bg-white border-r border-stone-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between lg:hidden h-16 px-4 bg-white/70 backdrop-blur-sm border-b border-stone-200">
            <Link href="/dashboard" className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-600">
                    <Sparkles className="w-4 h-4 text-white" />
                 </div>
                 <span className="text-lg font-black text-stone-800">BRANDDOS</span>
            </Link>
            
            <div className="flex items-center gap-2">
              {/* Mobile Language Selector */}
              <LanguageSelector variant="mobile" />
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-stone-600 hover:bg-stone-100 hover:text-stone-800"
                aria-label="Toggle Menu"
              >
                 {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}