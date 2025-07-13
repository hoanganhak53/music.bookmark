import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Song } from "@/types";
import { Star } from "lucide-react";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  song: Song | null;
  onRate: (song: Song) => void;
}

export default function RatingModal({ open, onOpenChange, song, onRate }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!song) return null;

  const handleRate = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/song", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: song.id, rating }),
      });
      
      if (res.ok) {
        const updatedSong = await res.json();
        onRate(updatedSong);
        onOpenChange(false);
        setRating(0);
        setHoverRating(0);
      }
    } catch (error) {
      console.error("Error rating song:", error);
    } finally {
      setLoading(false);
    }
  };

  const averageScore = (song.scores && song.scores.length > 0) 
    ? (song.scores.reduce((a, b) => a + b, 0) / song.scores.length).toFixed(1)
    : "0.0";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overlay tối */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 transition-opacity" aria-hidden="true"></div>
      )}
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="max-w-md w-full max-h-[95vh] sm:max-h-[90vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 p-3 sm:p-4 w-full">
            <h2 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow text-center">Đánh giá bài hát</h2>
          </div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Song Info */}
            <div className="text-center">
              <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{song.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Tác giả: {song.author}</p>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Trình bày: {song.performers.join(", ")}</p>
              
              {/* Current average rating */}
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Điểm trung bình hiện tại:</p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= Number(averageScore)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">({averageScore}/5)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Từ {song.scores?.length || 0} lượt đánh giá</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="text-center">
              <p className="text-sm sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Bạn đánh giá bài hát này thế nào?</p>
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-colors duration-200"
                  >
                    <Star
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {rating === 0 && "Chọn số sao để đánh giá"}
                {rating === 1 && "Rất không thích"}
                {rating === 2 && "Không thích"}
                {rating === 3 && "Bình thường"}
                {rating === 4 && "Thích"}
                {rating === 5 && "Rất thích"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 rounded-b-xl border-t border-gray-200">
            <button 
              type="button" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold border border-gray-300 text-sm sm:text-base" 
              onClick={() => onOpenChange(false)} 
              disabled={loading}
            >
              Huỷ
            </button>
            <button 
              type="button" 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-green-500 text-white hover:bg-green-600 font-semibold disabled:opacity-50 text-sm sm:text-base" 
              onClick={handleRate}
              disabled={loading || rating === 0}
            >
              {loading ? "Đang lưu..." : "Lưu đánh giá"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 