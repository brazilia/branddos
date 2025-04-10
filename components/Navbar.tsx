import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-gray-800">Brand Dos</div>

      <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
        <li>
          <a href="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-600 transition">
            Projects
          </a>
        </li>
        <li>
          <a href="/profile" className="hover:text-blue-600 transition">
            Profile
          </a>
        </li>
        <li>
          <a href="/login" className="hover:text-blue-600 transition">
            Log in
          </a>
        </li>
      </ul>
      {/* <ul className="md:flex gap-6 text-sm font-medium text-gray-600">
        <li>
          <a href="/login" className="hover:text-gray-900 transition">
            Login
          </a>
        </li>
        <li>
          <a href="/signup" className="hover:text-gray-900 transition">
            Try for Free
          </a>
        </li>
        <li>
          <Link href="/profile" className="hover:text-gray-900 transition">
            Profile
          </Link>
        </li>
      </ul> */}
    </nav>
  );
}
