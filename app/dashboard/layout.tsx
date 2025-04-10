// src/app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg flex flex-col px-6 py-8">
        <div className="text-2xl font-bold text-blue-600 mb-10">Brand Dos</div>

        <nav className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7m-9 12V7"
              ></path>
            </svg>
            Generate
          </Link>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 17v-6h13M9 12V6h13"
              ></path>
            </svg>
            History
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Settings
          </Link>
          <Link
            href="/dashboard/chat"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              ></path>
            </svg>
            Chatbot
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Home
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>

    // <div className="flex h-screen">
    //   <aside className="w-64 bg-[#1e2a4a] text-white p-6 flex flex-col justify-between">
    //     <div>
    //       <h1 className="text-2xl text-white font-bold mb-8">🧠 Dos AI</h1>
    //       <nav className="space-y-4">

    //         <Link href="/dashboard/settings" className="text-white hover:underline block">Settings</Link>
    //         <Link href="/dashboard/chat" className="text-white hover:underline block">Chatbot</Link>
    //       </nav>
    //     </div>
    //     <Link href="/" className="hover:underline block">Home Page</Link>
    //     <form action="/logout" method="post">
    //       <button className="text-white hover:underline">Log Out</button>
    //     </form>
    //   </aside>
    //   <main className="flex-1 bg-white text-black overflow-y-auto p-10">
    //     {children}
    //   </main>
    // </div>
  );
}
