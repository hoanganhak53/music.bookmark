import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Song } from "@/types";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteSongModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  song: Song | null;
  onDelete: (songId: string) => void;
}

export default function DeleteSongModal({ open, onOpenChange, song, onDelete }: DeleteSongModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentPassword = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${hours}-${day}-${month}-${year}-delete`;
  };

  const handleDelete = async () => {
    if (!song) return;
    
    const currentPassword = getCurrentPassword();
    if (password !== currentPassword) {
      setError("Mật khẩu không đúng!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/song", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: song.id }),
      });
      
      if (res.ok) {
        onDelete(song.id);
        onOpenChange(false);
        setPassword("");
        setError("");
      } else {
        setError("Lỗi khi xóa bài hát");
      }
    } catch (error) {
      setError("Lỗi khi xóa bài hát");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onOpenChange(false);
  };

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* Overlay tối */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 transition-opacity" aria-hidden="true"></div>
      )}
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="max-w-md w-full max-h-[95vh] sm:max-h-[90vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-3 sm:p-4 w-full">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow">Xóa bài hát</h2>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Cảnh báo!</h3>
                  <p className="text-xs sm:text-sm text-red-700">
                    Bạn sắp xóa bài hát <strong>"{song.name}"</strong>. Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>
            </div>

            {/* Song Info */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{song.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Tác giả: {song.author}</p>
              <p className="text-xs sm:text-sm text-gray-600">Trình bày: {song.performers.join(", ")}</p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Nhập mật khẩu để xác nhận xóa
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-b-xl border-t border-gray-200">
            <button 
              type="button" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold border border-gray-300 text-sm sm:text-base" 
              onClick={handleClose}
              disabled={loading}
            >
              Huỷ
            </button>
            <button 
              type="button" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold flex items-center gap-1 sm:gap-2 disabled:opacity-50 text-sm sm:text-base" 
              onClick={handleDelete}
              disabled={loading || !password}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              {loading ? "Đang xóa..." : "Xóa bài hát"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 