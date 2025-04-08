// src/app/dashboard/layout.tsx
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-[#1e2a4a] text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl text-white font-bold mb-8">🧠 Dos AI</h1>
          <nav className="space-y-4">
            <Link href="/dashboard" className="text-white hover:underline block">Generate</Link>
            <Link href="/dashboard/history" className="text-white hover:underline block">History</Link>
            <Link href="/dashboard/settings" className="text-white hover:underline block">Settings</Link>
            <Link href="/dashboard/chat" className="text-white hover:underline block">Chatbot</Link>
          </nav>
        </div>
        <Link href="/" className="hover:underline block">Home Page</Link>
        <form action="/logout" method="post">
          <button className="text-white hover:underline">Log Out</button>
        </form>
      </aside>
      <main className="flex-1 bg-white text-black overflow-y-auto p-10">
        {children}
      </main>
    </div>
  )
}
