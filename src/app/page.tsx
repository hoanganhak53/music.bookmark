"use client";
import { useEffect, useState, useMemo } from "react";
import { Song } from "@/types";
import { Plus, Search, Music, BookmarkCheck, HelpCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import AddSongModal from "@/components/AddSongModal";
import EditSongModal from "@/components/EditSongModal";
import DeleteSongModal from "@/components/DeleteSongModal";
import RatingModal from "@/components/RatingModal";
import SongDetailModal from "@/components/SongDetailModal";
import { 
  getBookmarkedSongs, 
  addBookmark, 
  removeBookmark, 
  isBookmarked,
  getCachedCategories,
  getCachedTags
} from "@/utils/localStorage";
import Footer from "@/components/Footer";
import SongList from "@/components/SongList";
import SongCard from "@/components/SongCard";
import GuideModal from "@/components/GuideModal";

// Helper functions
function getAverageScore(scores: number[] | undefined): string {
  if (!scores || scores.length === 0) return "0.0";
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
}

function isNewSong(createdAt: string) {
  if (typeof window === "undefined") return false;
  const now = new Date();
  const created = new Date(createdAt);
  const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 7;
}

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("singCount"); // singCount, averageScore, lastSung
  const [activeTab, setActiveTab] = useState("all"); // all, bookmark
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [bookmarkedSongs, setBookmarkedSongs] = useState<string[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    fetch("/api/song")
      .then((res) => res.json())
      .then((data) => {
        console.log('🔍 Raw API response:', data);
        
        // Đảm bảo tất cả songs đều có scores array
        const normalizedSongs = data.map((song: Song) => ({
          ...song,
          scores: song.scores || []
        }));
        

        
        setSongs(normalizedSongs);
      })
      .catch((error) => {
        console.error('❌ Error fetching songs:', error);
      });
    
    // Load bookmarked songs from localStorage
    setBookmarkedSongs(getBookmarkedSongs());
  }, []);

  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => { setIsClient(true); }, []);

  const filtered = useMemo(() => {
    let result = songs;
    
    // Filter by tab
    if (activeTab === "bookmark") {
      result = result.filter(song => bookmarkedSongs.includes(song.id));
    }
    
    // Filter by search
    if (search)
      result = result.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.author.toLowerCase().includes(search.toLowerCase()) ||
        s.performers.some((p) => p.toLowerCase().includes(search.toLowerCase()))
      );
    
    // Filter by tag
    if (tag) result = result.filter((s) => s.tags.includes(tag));
    
    // Filter by category
    if (category) result = result.filter((s) => s.categories.includes(category));
    
    // Sort
    result = result.slice().sort((a, b) => {
      switch (sortBy) {
        case "averageScore":
          const scoreA = getAverageScore(a.scores);
          const scoreB = getAverageScore(b.scores);
          return parseFloat(scoreB) - parseFloat(scoreA);
        case "singCount":
          if (b.sing_count !== a.sing_count) return b.sing_count - a.sing_count;
          break;
        case "lastSung":
          if (b.last_sung_at && a.last_sung_at)
            return new Date(b.last_sung_at).getTime() - new Date(a.last_sung_at).getTime();
          break;
      }
      return 0;
    });
    
    return result;
  }, [songs, search, tag, category, sortBy, activeTab, bookmarkedSongs]);

  // Lấy tất cả tag/category duy nhất và kết hợp với cached
  const allTags = useMemo(() => {
    const songTags = Array.from(new Set(songs.flatMap((s) => s.tags)));
    if (!isClient) return songTags.sort();
    const cachedTags = getCachedTags();
    return Array.from(new Set([...songTags, ...cachedTags])).sort();
  }, [songs, isClient]);
  
  const allCategories = useMemo(() => {
    const songCategories = Array.from(new Set(songs.flatMap((s) => s.categories)));
    if (!isClient) return songCategories.sort();
    const cachedCategories = getCachedCategories();
    return Array.from(new Set([...songCategories, ...cachedCategories])).sort();
  }, [songs, isClient]);

  const handleSing = (song: Song) => {
    setSelectedSong(song);
    setShowRating(true);
  };

  const handleRate = (updatedSong: Song) => {
    setSongs(songs.map(s => s.id === updatedSong.id ? updatedSong : s));
  };

  const handleEdit = (song: Song) => {
    setSelectedSong(song);
    setShowEdit(true);
  };

  const handleEditComplete = (updatedSong: Song) => {
    setSongs(songs.map(s => s.id === updatedSong.id ? updatedSong : s));
  };

  const handleDelete = (song: Song) => {
    setSelectedSong(song);
    setShowDelete(true);
  };

  const handleDeleteComplete = (songId: string) => {
    setSongs(songs.filter(s => s.id !== songId));
  };

  const handleBookmark = (songId: string) => {
    if (bookmarkedSongs.includes(songId)) {
      removeBookmark(songId);
      setBookmarkedSongs(bookmarkedSongs.filter(id => id !== songId));
    } else {
      addBookmark(songId);
      setBookmarkedSongs([...bookmarkedSongs, songId]);
    }
  };

  // Thêm hàm mở modal detail
  const handleShowDetail = (song: Song) => {
    setSelectedSong(song);
    setShowDetail(true);
  };

  // Thêm hàm mở modal hát từ detail
  const handleSingFromDetail = (song: Song) => {
    setShowDetail(false);
    setTimeout(() => handleSing(song), 200); // Đợi modal detail đóng hẳn rồi mới mở modal hát
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-4xl mx-auto p-3 sm:p-6 flex-1">
        <div className="mb-6 sm:mb-8">
          <div className="rounded-2xl sm:rounded-3xl shadow-xl bg-gradient-to-br from-[#e0e7ffcc] via-[#f0abfcbb] to-[#f8fafcdd] p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="text-3xl sm:text-4xl">🎵</span>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800 drop-shadow">Music Bookmark</h1>
                <p className="text-sm sm:text-lg text-gray-600 mt-1">Lưu trữ & tìm kiếm bài hát karaoke yêu thích của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(true)}
              className="bg-white/80 hover:bg-white text-gray-700 px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Hướng dẫn</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 rounded-2xl shadow p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm">
          <div className="flex gap-2 justify-start sm:justify-start">
            <button
              className={`flex-1 sm:flex-none sm:min-w-[100px] px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base text-center ${
                activeTab === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Tất cả ({songs.length})
            </button>
            <button
              className={`flex-1 sm:flex-none sm:min-w-[120px] px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base justify-center ${
                activeTab === "bookmark"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("bookmark")}
            >
              <BookmarkCheck className="w-4 h-4" />
              Bookmark ({bookmarkedSongs.length})
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 rounded-2xl shadow p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="relative flex-[2] min-w-0">
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                placeholder="Tìm kiếm tên, tác giả, người trình bày..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500 text-sm sm:text-base"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="">Tất cả Tag</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500 text-sm sm:text-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Tất cả thể loại</option>
                {allCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500 text-sm sm:text-base"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="singCount">Sort theo số lần hát</option>
                <option value="averageScore">Sort theo điểm</option>
                <option value="lastSung">Sort theo thời gian</option>
              </select>
              <button
                className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm text-sm sm:text-base justify-center"
                onClick={() => setShowAdd(true)}
              >
                <Plus className="w-4 h-4" /> Thêm bài hát
              </button>
            </div>
          </div>
        </div>

        {/* Song List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white/80 rounded-2xl shadow-sm">
              <Music className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>
                {activeTab === "bookmark" 
                  ? "Không có bài hát nào được bookmark." 
                  : "Không có bài hát nào."
                }
              </p>
            </div>
          )}
          {filtered.map((song) => {
            const averageScore = getAverageScore(song.scores);
            const showNew = isNewSong(song.created_at);
            return (
              <SongCard
                key={song.id}
                song={song}
                showNew={showNew}
                averageScore={averageScore}
                bookmarkedSongs={bookmarkedSongs}
                handleShowDetail={handleShowDetail}
                handleBookmark={handleBookmark}
                handleSing={handleSing}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            );
          })}
        </div>

        {/* Modals */}
        <AddSongModal 
          open={showAdd} 
          onOpenChange={setShowAdd} 
          onAdd={(song)=>setSongs(s=>[song,...s])} 
        />
        <EditSongModal
          open={showEdit}
          onOpenChange={setShowEdit}
          song={selectedSong}
          onEdit={handleEditComplete}
        />
        <DeleteSongModal
          open={showDelete}
          onOpenChange={setShowDelete}
          song={selectedSong}
          onDelete={handleDeleteComplete}
        />
        <RatingModal
          open={showRating}
          onOpenChange={setShowRating}
          song={selectedSong}
          onRate={handleRate}
        />
        <SongDetailModal
          open={showDetail}
          onOpenChange={setShowDetail}
          song={selectedSong}
          onSing={handleSingFromDetail}
          onBookmark={(song) => handleBookmark(song.id)}
          isBookmarked={selectedSong ? bookmarkedSongs.includes(selectedSong.id) : false}
        />

        {/* Guide Modal */}
        <GuideModal
          open={showGuide}
          onOpenChange={setShowGuide}
        />
      </main>

      <Footer />
    </div>
  );
}
