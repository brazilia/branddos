import Link from "next/link";
import "@/styles/globals.css";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-[#9DB2BF] text-white sticky top-0 z-50">
      <div className="text-2xl font-bold">Brand Dos</div>
      <div className="space-x-4">
        <a href="/login" className="bg-[#9DB2BF] hover:text-[#9DB2BF] transition">Login</a>
        <a href="/signup" className="px-4 py-2 text-white bg-[#9DB2BF] rounded transition">
          Try for Free
        </a>
        <Link href="/profile" className="hover:text-[#213555] transition">Profile</Link>
      </div>
    </nav>
  );
}
