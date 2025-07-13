import { Star, Bookmark, BookmarkCheck, Music } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Song } from "@/types";

interface SongCardProps {
  song: Song;
  showNew: boolean;
  averageScore: string;
  bookmarkedSongs: string[];
  handleShowDetail: (song: Song) => void;
  handleBookmark: (songId: string) => void;
  handleSing: (song: Song) => void;
  handleEdit: (song: Song) => void;
  handleDelete: (song: Song) => void;
}

export default function SongCard({
  song,
  showNew,
  averageScore,
  bookmarkedSongs,
  handleShowDetail,
  handleBookmark,
  handleSing,
  handleEdit,
  handleDelete,
}: SongCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  console.log('SongCard render - isMobile:', isMobile, 'isClient:', isClient);

  useEffect(() => {
    console.log('SongCard useEffect running');
    setIsClient(true);
    
    const checkScreenSize = () => {
      // Chỉ chạy ở client side
      if (typeof window === 'undefined') {
        console.log('window is undefined');
        return;
      }
      
      const width = window.innerWidth;
      console.log('Screen width:', width, 'isMobile:', width < 640);
      setIsMobile(width < 640);
    };

    // Chỉ chạy sau khi component mount
    if (typeof window !== 'undefined') {
      console.log('window is defined, checking screen size');
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  // Chỉ render khi đã client-side
  if (!isClient) {
    console.log('Not client yet, rendering loading state');
    return (
      <div className="relative bg-white/90 rounded-2xl shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering with isMobile:', isMobile);

  return (
    <div className="relative bg-white/90 rounded-2xl shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow">
      {isMobile ? (
        // Mobile Layout: Ảnh bên trái, info bên phải
        <div className="flex flex-col gap-3">
          {/* Header: Ảnh + Thông tin chính */}
          <div className="flex gap-3 items-start">
            {/* Song Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
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
                <Music className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            {/* Main Info bên phải ảnh */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap font-semibold text-base text-gray-800">
                <span className="hover:underline hover:text-blue-600 cursor-pointer transition-colors" onClick={() => handleShowDetail(song)}>{song.name}</span>
                {showNew && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600">Tác giả: {song.author}</div>
              <div className="text-xs text-gray-600">Trình bày: {song.performers.join(", ")}</div>
            </div>
          </div>

          {/* Thông tin phụ */}
          <div className="flex flex-col gap-1">
            {/* Mobile: rating & singCount cùng dòng */}
            <div className="flex items-center gap-4 text-xs text-gray-700 font-medium">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {averageScore}/5
              </span>
              <span className="flex items-center gap-1">
                <Music className="w-4 h-4 text-green-400" />
                {song.sing_count} lần hát
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {song.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {song.categories.map((cat) => (
                <span key={cat} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {cat}
                </span>
              ))}
              {bookmarkedSongs.includes(song.id) && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3" />
                  bookmark
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-2 w-full justify-center">
            <button 
              className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 justify-center flex-1 ${
                bookmarkedSongs.includes(song.id)
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
              onClick={() => handleBookmark(song.id)}
            >
              {bookmarkedSongs.includes(song.id) ? (
                <>
                  <BookmarkCheck className="w-3 h-3" />
                  <span>Đã</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3 h-3" />
                  <span>BM</span>
                </>
              )}
            </button>
            <button 
              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors flex-1"
              onClick={() => handleSing(song)}
            >
              Hát
            </button>
            <button 
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex-1"
              onClick={() => handleEdit(song)}
            >
              Sửa
            </button>
            <button 
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors flex-1"
              onClick={() => handleDelete(song)}
            >
              Xóa
            </button>
          </div>
        </div>
      ) : (
        // Desktop Layout: Ảnh - Info - Action (3 phần rõ ràng)
        <div className="flex flex-row gap-4 items-start">
          {/* Phần 1: Ảnh */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
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
              <Music className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          {/* Phần 2: Info (bao gồm thông tin chính và phụ) */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Thông tin chính */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap font-semibold text-lg text-gray-800">
                <span className="hover:underline hover:text-blue-600 cursor-pointer transition-colors" onClick={() => handleShowDetail(song)}>{song.name}</span>
                {showNew && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">Tác giả: {song.author}</div>
              <div className="text-sm text-gray-600">Trình bày: {song.performers.join(", ")}</div>
            </div>

            {/* Thông tin phụ */}
            <div className="flex flex-row items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Số lần hát: {song.sing_count}
              </span>
              <span>Lần hát gần nhất: {song.last_sung_at ? new Date(song.last_sung_at).toLocaleDateString() : "-"}</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                {averageScore}/5 ({song.scores?.length || 0} lượt)
              </span>
            </div>

            {/* Tags và Categories */}
            <div className="flex flex-wrap gap-1">
              {song.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {song.categories.map((cat) => (
                <span key={cat} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {cat}
                </span>
              ))}
              {bookmarkedSongs.includes(song.id) && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                  <BookmarkCheck className="w-3 h-3" />
                  bookmark
                </span>
              )}
            </div>
          </div>

          {/* Phần 3: Action Buttons */}
          <div className="flex flex-col gap-2 w-auto justify-start flex-shrink-0">
            <button 
              className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 justify-center ${
                bookmarkedSongs.includes(song.id)
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
              onClick={() => handleBookmark(song.id)}
            >
              {bookmarkedSongs.includes(song.id) ? (
                <>
                  <BookmarkCheck className="w-3 h-3" />
                  <span>Đã bookmark</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3 h-3" />
                  <span>Bookmark</span>
                </>
              )}
            </button>
            <button 
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              onClick={() => handleSing(song)}
            >
              Hát
            </button>
            <button 
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              onClick={() => handleEdit(song)}
            >
              Sửa
            </button>
            <button 
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              onClick={() => handleDelete(song)}
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 