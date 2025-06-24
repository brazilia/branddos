import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const Logo = () => (
  <Link href="/" className="group cursor-pointer">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl rotate-12 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
      </div>
      <div>
        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          BRAND<span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">DOS</span>
        </span>
        <div className="text-xs font-semibold text-emerald-600 -mt-1 tracking-wide">
          SOCIAL STUDIO
        </div>
      </div>
    </div>
  </Link>
);