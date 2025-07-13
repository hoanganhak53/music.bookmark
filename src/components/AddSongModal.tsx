import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Song } from "@/types";
import { SONG_CATEGORIES, SONG_TAGS } from "@/constants";
import { addCachedCategory, addCachedTag } from "@/utils/localStorage";
import { extractYouTubeInfo, isValidYouTubeUrl, parseSongInfo, extractLyricsFromDescription } from "@/utils/youtube";
import { Youtube, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AddSongModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (song: Song) => void;
}

export default function AddSongModal({ open, onOpenChange, onAdd }: AddSongModalProps) {
  const [form, setForm] = useState<Partial<Song>>({ performers: [], ref_urls: [], categories: [], tags: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeError, setYoutubeError] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Handle image preview
    if (name === 'image') {
      if (value.trim()) {
        setImagePreview(value.trim());
        setImageError(false);
      } else {
        setImagePreview("");
        setImageError(false);
      }
    }
  }

  function handleArrayChange(name: keyof Song, value: string) {
    setForm((f) => ({ ...f, [name]: value.split(",").map((v) => v.trim()).filter(Boolean) }));
  }

  function addCategory(category: string) {
    if (category && !form.categories?.includes(category)) {
      setForm((f) => ({ 
        ...f, 
        categories: [...(f.categories || []), category] 
      }));
      addCachedCategory(category);
    }
  }

  function removeCategory(category: string) {
    setForm((f) => ({ 
      ...f, 
      categories: (f.categories || []).filter(c => c !== category) 
    }));
  }

  function addTag(tag: string) {
    if (tag && !form.tags?.includes(tag)) {
      setForm((f) => ({ 
        ...f, 
        tags: [...(f.tags || []), tag] 
      }));
      addCachedTag(tag);
    }
  }

  function removeTag(tag: string) {
    setForm((f) => ({ 
      ...f, 
      tags: (f.tags || []).filter(t => t !== tag) 
    }));
  }

  // Handle YouTube URL import
  async function handleYouTubeImport() {
    if (!youtubeUrl.trim()) {
      setYoutubeError("Vui lòng nhập URL YouTube");
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      setYoutubeError("URL YouTube không hợp lệ");
      return;
    }

    setYoutubeLoading(true);
    setYoutubeError("");

    try {
      const youtubeInfo = await extractYouTubeInfo(youtubeUrl);
      const songInfo = parseSongInfo(youtubeInfo.title);
      
      // Extract lyrics from description if available
      const extractedLyrics = extractLyricsFromDescription(youtubeInfo.description || "");

      // Update form with YouTube data
      setForm(prev => ({
        ...prev,
        name: youtubeInfo.title, // Giữ nguyên tên bài hát từ YouTube
        author: songInfo.artist || youtubeInfo.author || "",
        performers: songInfo.artist ? [songInfo.artist] : (youtubeInfo.author ? [youtubeInfo.author] : []),
        image: youtubeInfo.thumbnail || "",
        ref_urls: [youtubeUrl],
        lyric: extractedLyrics || youtubeInfo.description || ""
      }));
      
      // Set image preview for YouTube thumbnail
      if (youtubeInfo.thumbnail) {
        setImagePreview(youtubeInfo.thumbnail);
        setImageError(false);
      }

      setYoutubeUrl("");
      setYoutubeError("");
    } catch (error) {
      setYoutubeError("Không thể lấy thông tin từ YouTube. Vui lòng thử lại.");
      console.error("YouTube import error:", error);
    } finally {
      setYoutubeLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) {
      setError("Tên bài hát là bắt buộc");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newSong: Song = {
        id: Date.now().toString(),
        name: form.name.trim(),
        author: form.author?.trim() || "",
        performers: form.performers || [],
        image: form.image?.trim() || "",
        lyric: form.lyric?.trim() || "",
        ref_urls: form.ref_urls || [],
        categories: form.categories || [],
        tags: form.tags || [],
        scores: [],
        sing_count: 0,
        last_sung_at: null,
        priority: 0,
        last_update: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      // Gửi API request để tạo bài hát mới
      const res = await fetch("/api/song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSong),
      });

      if (res.ok) {
        const createdSong = await res.json();
        onAdd(createdSong);
        setForm({ performers: [], ref_urls: [], categories: [], tags: [] });
        setImagePreview("");
        setImageError(false);
        setError("");
        onOpenChange(false);
      } else {
        setError("Có lỗi xảy ra khi thêm bài hát");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi thêm bài hát");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overlay tối */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 transition-opacity" aria-hidden="true"></div>
      )}
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-3 sm:p-4 w-full flex-shrink-0">
            <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow">Thêm bài hát mới</h2>
          </div>
          {/* Form body */}
          <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4 w-full h-full">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-2 sm:space-y-3 p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto">
                  {error && <div className="text-red-500 text-xs sm:text-sm mb-2">{error}</div>}
                  
                  {/* YouTube Import Section */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-semibold text-blue-800">Import từ YouTube</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập URL YouTube..."
                        className="flex-1 border border-blue-300 rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500 bg-white"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        disabled={youtubeLoading}
                      />
                      <button
                        type="button"
                        onClick={handleYouTubeImport}
                        disabled={youtubeLoading || !youtubeUrl.trim()}
                        className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {youtubeLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Import</span>
                      </button>
                    </div>
                    {youtubeError && (
                      <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        {youtubeError}
                      </div>
                    )}
                  </div>

                  {/* Tên bài hát */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Tên bài hát <span className="text-red-500">*</span>
                    </label>
                    <input 
                      name="name" 
                      placeholder="Nhập tên bài hát..." 
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500 font-semibold" 
                      value={form.name||""} 
                      onChange={handleChange} 
                      required 
                      autoFocus 
                    />
                  </div>

                  {/* Tác giả */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Tác giả
                    </label>
                    <input 
                      name="author" 
                      placeholder="Nhập tên tác giả..." 
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500" 
                      value={form.author||""} 
                      onChange={handleChange} 
                    />
                  </div>

                  {/* Người trình bày */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Người trình bày
                    </label>
                    <input 
                      name="performers" 
                      placeholder="Nhập tên người trình bày (cách nhau dấu phẩy)..." 
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500" 
                      value={(form.performers||[]).join(", ")} 
                      onChange={e=>handleArrayChange("performers",e.target.value)} 
                    />
                  </div>

                  {/* Lời bài hát */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Lời bài hát
                    </label>
                    <textarea 
                      name="lyric" 
                      placeholder="Nhập lời bài hát..." 
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500 min-h-[60px] sm:min-h-[80px]" 
                      value={form.lyric||""} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                {/* Side info */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 overflow-y-auto">
                  {/* Image input with preview */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Ảnh bài hát</label>
                    <input 
                      name="image" 
                      placeholder="Link ảnh (nếu có)" 
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500" 
                      value={form.image||""} 
                      onChange={handleChange} 
                    />
                    {/* Image preview */}
                    {imagePreview && (
                      <div className="mt-2">
                        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onLoad={() => setImageError(false)}
                            onError={() => setImageError(true)}
                          />
                          {imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <div className="text-center text-gray-500">
                                <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-xs">?</span>
                                </div>
                                <div className="text-xs">Không thể tải ảnh</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Link tham khảo */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Link tham khảo
                    </label>
                    <input 
                                            name="ref_urls"
                      placeholder="Nhập link tham khảo (cách nhau dấu phẩy)..."
                      className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500"
                      value={(form.ref_urls||[]).join(", ")}
                      onChange={e=>handleArrayChange("ref_urls",e.target.value)} 
                    />
                  </div>
                  
                  {/* Categories */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Thể loại</label>
                    <div className="space-y-1 sm:space-y-2">
                      <select 
                        className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 bg-white"
                        onChange={(e) => addCategory(e.target.value)}
                        value=""
                      >
                        <option value="">Chọn thể loại</option>
                        {SONG_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {/* Selected categories */}
                      <div className="flex flex-wrap gap-1">
                        {(form.categories || []).map((cat) => (
                          <span key={cat} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                            {cat}
                            <button 
                              type="button" 
                              onClick={() => removeCategory(cat)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Tags</label>
                    <div className="space-y-1 sm:space-y-2">
                      <select 
                        className="w-full border rounded px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 bg-white"
                        onChange={(e) => addTag(e.target.value)}
                        value=""
                      >
                        <option value="">Chọn tag</option>
                        {SONG_TAGS.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                      {/* Selected tags */}
                      <div className="flex flex-wrap gap-1">
                        {(form.tags || []).map((tag) => (
                          <span key={tag} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeTag(tag)}
                              className="text-green-500 hover:text-green-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="bg-gray-50 p-3 sm:p-4 border-t border-gray-200 flex gap-2 justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm bài hát"
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 