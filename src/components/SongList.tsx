import SongCard from "./SongCard";
import { Song } from "@/types";

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

interface SongListProps {
  songs: Song[];
  bookmarkedSongs: string[];
  handleShowDetail: (song: Song) => void;
  handleBookmark: (songId: string) => void;
  handleSing: (song: Song) => void;
  handleEdit: (song: Song) => void;
  handleDelete: (song: Song) => void;
}

export default function SongList({
  songs,
  bookmarkedSongs,
  handleShowDetail,
  handleBookmark,
  handleSing,
  handleEdit,
  handleDelete,
}: SongListProps) {
  return (
    <div className="space-y-4">
      {songs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white/80 rounded-2xl shadow-sm">
          <span>Không có bài hát nào.</span>
        </div>
      ) : (
        songs.map((song: Song) => (
          <SongCard
            key={song.id}
            song={song}
            showNew={isNewSong(song.created_at)}
            averageScore={getAverageScore(song.scores)}
            bookmarkedSongs={bookmarkedSongs}
            handleShowDetail={handleShowDetail}
            handleBookmark={handleBookmark}
            handleSing={handleSing}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
} 