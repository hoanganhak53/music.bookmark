import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border-t border-gray-200 py-3 sm:py-4 px-2 sm:px-4 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center text-center text-xs sm:text-sm text-gray-600 gap-1 sm:gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span>
            Powered by <span className="font-semibold text-blue-700">Johan Nguyen (Hoang Anh)</span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <span className="hidden sm:inline">|</span>
        <a href="mailto:johan.nguyen.dev@gmail.com" className="flex items-center gap-1 underline hover:text-blue-600 transition-colors text-xs sm:text-sm">
          <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">johan.nguyen.dev@gmail.com</span>
          <span className="sm:hidden">Contact</span>
        </a>
      </div>
      <div className="text-center text-[10px] sm:text-xs text-gray-400 mt-1">
        Music Bookmark - Personal Karaoke Song Manager
      </div>
    </footer>
  );
} 