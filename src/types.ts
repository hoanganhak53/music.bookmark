export interface Song {
  id: string;
  name: string;
  author: string;
  performers: string[];
  image: string;
  lyric: string;
  refUrls: string[];
  categories: string[];
  tags: string[];
  scores: number[]; // Mảng các điểm vote từ 1-5 sao
  lastSungAt: string | null;
  singCount: number;
  priority: number;
  last_update: string;
  created_at: string;
} 