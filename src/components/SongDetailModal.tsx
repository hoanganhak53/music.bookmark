import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Star, Bookmark, BookmarkCheck, Mic, X, Link as LinkIcon, Music } from "lucide-react";
import { Song } from "@/types";

interface SongDetailModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  song: Song | null;
  onSing: (song: Song) => void;
  onBookmark?: (song: Song) => void;
  isBookmarked?: boolean;
}

export default function SongDetailModal({ open, onOpenChange, song, onSing, onBookmark, isBookmarked }: SongDetailModalProps) {
  if (!song) return null;
  const averageScore = song.scores && song.scores.length > 0 ? (song.scores.reduce((a, b) => a + b, 0) / song.scores.length).toFixed(1) : "-";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overlay tối */}
      {open && <div className="fixed inset-0 z-40 bg-black/70 transition-opacity" aria-hidden="true"></div>}
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0abfc] rounded-3xl shadow-2xl p-4 sm:p-8 overflow-y-auto animate-fadeIn border border-white/40">
          {/* Close button */}
          <button className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {/* Song image and info */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto sm:mx-0">
              {song.image ? (
                <img 
                  src={song.image} 
                  alt="cover" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100" style={{ display: song.image ? 'none' : 'flex' }}>
                <Music className="w-8 h-8 sm:w-16 sm:h-16 text-gray-300" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle asChild>
                <h2 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 drop-shadow mb-2 cursor-pointer select-text text-center sm:text-left">
                  {song.name}
                </h2>
              </DialogTitle>
              {/* Author & Performers */}
              <div className="mb-3 sm:mb-4">
                <span className="block text-sm sm:text-base font-semibold text-gray-700 leading-tight mb-1">
                  Tác giả: <span className="font-bold text-gray-900">{song.author}</span>
                </span>
                <span className="block text-sm sm:text-base font-semibold text-gray-700 leading-tight">
                  Trình bày: <span className="font-bold text-gray-900">{song.performers.join(", ")}</span>
                </span>
              </div>
              {/* Rating & SingCount */}
              <div className="flex gap-2 sm:gap-4 items-center mb-3 mt-1">
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-yellow-50 border border-yellow-100 shadow-sm text-yellow-700 font-semibold text-sm sm:text-base">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span>{averageScore}/5</span>
                </div>
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-green-50 border border-green-100 shadow-sm text-green-700 font-semibold text-sm sm:text-base">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span>{song.sing_count} lần hát</span>
                </div>
              </div>
              {/* Last sung & Bookmark status */}
              <div className="flex gap-2 sm:gap-4 items-center mb-3">
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50 border border-blue-100 shadow-sm text-blue-700 font-semibold text-sm sm:text-base">
                  <span>Lần cuối: {song.last_sung_at ? new Date(song.last_sung_at).toLocaleDateString() : "Chưa hát"}</span>
                </div>
                {isBookmarked !== undefined && (
                  <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gray-50 border border-gray-100 shadow-sm font-semibold text-sm sm:text-base">
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" /> : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                    <span className={isBookmarked ? 'text-yellow-600' : 'text-gray-600'}>{isBookmarked ? "Đã bookmark" : "Chưa bookmark"}</span>
                  </div>
                )}
              </div>
              {/* Tags & Categories */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {song.tags.map((tag) => (
                  <span key={tag} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold shadow-sm">
                    {tag}
                  </span>
                ))}
                {song.categories.map((cat) => (
                  <span key={cat} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold shadow-sm">
                    {cat}
                  </span>
                ))}
              </div>
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-lg font-bold shadow-lg flex items-center gap-2 hover:scale-105 hover:shadow-2xl transition-all justify-center"
                  onClick={() => onSing(song)}
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> Hát ngay
                </button>
                {onBookmark && (
                  <button
                    className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 border transition-colors shadow-sm justify-center text-sm sm:text-base ${isBookmarked ? 'bg-yellow-400 text-white border-yellow-400 hover:bg-yellow-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    onClick={() => onBookmark(song)}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {isBookmarked ? "Đã bookmark" : "Bookmark"}
                  </button>
                )}
              </div>
              {/* Links - moved below actions */}
              {song.ref_urls && song.ref_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 mb-2 items-center">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  {song.ref_urls.map((url, idx) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-xs hover:text-blue-700 transition-colors">
                      Link {idx + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Lyric */}
          <div className="mt-6 sm:mt-8">
            <div className="font-bold text-base sm:text-lg text-gray-700 mb-2 flex items-center gap-2">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              Lyric
            </div>
            <div className="text-sm sm:text-base text-gray-700 whitespace-pre-line font-mono leading-relaxed bg-white/70 rounded-xl p-3 sm:p-4 border border-gray-100 shadow-inner max-h-48 sm:max-h-64 overflow-y-auto">
              {song.lyric || <span className="italic text-gray-400">(Chưa có lời bài hát)</span>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 